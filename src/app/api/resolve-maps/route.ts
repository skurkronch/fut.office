import { NextRequest, NextResponse } from 'next/server';

export interface MapsInfo {
  placeName?: string;
  lat?: number;
  lng?: number;
  embedUrl?: string;
  resolvedUrl?: string;
}

function parseMapsUrl(url: string): MapsInfo {
  try {
    // ── Pin coordinates from data=...!3dLAT!4dLNG (most accurate) ──────────
    // These are the actual dropped-pin coords, not the viewport center.
    const pinMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const pinLat = pinMatch ? parseFloat(pinMatch[1]) : undefined;
    const pinLng = pinMatch ? parseFloat(pinMatch[2]) : undefined;

    // ── Viewport center @lat,lng (fallback when no pin data) ─────────────
    const viewportMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const viewportLat = viewportMatch ? parseFloat(viewportMatch[1]) : undefined;
    const viewportLng = viewportMatch ? parseFloat(viewportMatch[2]) : undefined;

    // Also try ?q=lat,lng
    let qLat: number | undefined, qLng: number | undefined;
    try {
      const u = new URL(url);
      const q = u.searchParams.get('q');
      if (q) {
        const qMatch = q.match(/^(-?\d+\.\d+),(-?\d+\.\d+)$/);
        if (qMatch) { qLat = parseFloat(qMatch[1]); qLng = parseFloat(qMatch[2]); }
      }
    } catch { /* ignore */ }

    // Prefer: pin > q coords > viewport center
    const lat = pinLat ?? qLat ?? viewportLat;
    const lng = pinLng ?? qLng ?? viewportLng;

    // ── Place name from /place/NAME ───────────────────────────────────────
    const placeMatch = url.match(/\/place\/([^/@!?]+)/);
    let placeName: string | undefined;
    if (placeMatch) {
      const raw = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
        .replace(/\/$/, '')
        .replace(/_/g, ' ')
        .trim();
      // Discard if it's coordinates or a plus code (e.g. "9WG5+MV4")
      const isCoords = /^[\d°'".\s,NSEW+-]+$/.test(raw);
      const isPlusCode = /^[A-Z0-9]{4,}\+[A-Z0-9]*/.test(raw);
      if (!isCoords && !isPlusCode && raw.length > 1) placeName = raw;
    }

    // Also try ?q= as place name
    if (!placeName) {
      try {
        const u = new URL(url);
        const q = u.searchParams.get('q');
        if (q && !/^-?\d+\.\d+,-?\d+\.\d+$/.test(q)) placeName = q;
      } catch { /* ignore */ }
    }

    // ── Build embed URL ───────────────────────────────────────────────────
    // Use pin/q coordinates when available (most accurate), else place name.
    let embedUrl: string | undefined;
    if (lat !== undefined && lng !== undefined) {
      embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed`;
    } else if (placeName) {
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
    }

    return { placeName, lat, lng, embedUrl, resolvedUrl: url };
  } catch {
    return {};
  }
}

async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      {
        headers: { 'User-Agent': 'fut-office-bot/1.0' },
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    const addr = data.address ?? {};

    // Try to return a meaningful name: named place first, then road + neighborhood
    const name =
      data.name ||
      addr.amenity ||
      addr.building ||
      addr.tourism ||
      addr.leisure;

    const street = addr.road || addr.pedestrian;
    const area = addr.suburb || addr.neighbourhood || addr.city_district;
    const city = addr.city || addr.town || addr.village || addr.municipality;

    if (name && city) return `${name}, ${city}`;
    if (name) return name;
    if (street && city) return `${street}, ${city}`;
    if (area && city) return `${area}, ${city}`;

    // Last resort: first two segments of display_name
    const parts = (data.display_name as string | undefined)?.split(',');
    if (parts && parts.length >= 2) return `${parts[0].trim()}, ${parts[1].trim()}`;
    return undefined;
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

  const isLongUrl = url.includes('google.com/maps') && !url.includes('maps.app.goo.gl');

  let info: MapsInfo;

  if (isLongUrl) {
    info = parseMapsUrl(url);
  } else {
    // Short URL — follow all redirects server-side (avoids CORS)
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(6000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; fut-office-bot/1.0)' },
      });
      const resolvedUrl = res.url || url;
      info = { ...parseMapsUrl(resolvedUrl), resolvedUrl };
    } catch {
      info = {
        embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`,
        resolvedUrl: url,
      };
    }
  }

  // No place name but have coordinates → try Nominatim reverse geocoding
  if (!info.placeName && info.lat !== undefined && info.lng !== undefined) {
    const geocoded = await reverseGeocode(info.lat, info.lng);
    if (geocoded) info = { ...info, placeName: geocoded };
  }

  return NextResponse.json(info);
}
