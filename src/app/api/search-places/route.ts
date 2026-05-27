import { NextRequest, NextResponse } from 'next/server';

export interface PlaceResult {
  placeName: string;
  displayName: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  embedUrl: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  const lang = request.nextUrl.searchParams.get('lang') ?? 'es';

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5&accept-language=${lang}`,
      {
        headers: { 'User-Agent': 'fut-office-bot/1.0 (futoffice.app)' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) return NextResponse.json({ results: [] });

    const data: Array<Record<string, unknown>> = await res.json();

    const results: PlaceResult[] = data.map((item) => {
      const lat = parseFloat(item.lat as string);
      const lng = parseFloat(item.lon as string);
      const addr = (item.address as Record<string, string>) ?? {};

      // Best human-readable name: named place > road > first segment
      const name =
        (item.name as string) ||
        addr.amenity ||
        addr.building ||
        addr.tourism ||
        addr.leisure ||
        addr.road ||
        (item.display_name as string).split(',')[0].trim();

      const city =
        addr.city || addr.town || addr.village || addr.municipality || '';

      const displayParts = (item.display_name as string)
        .split(',')
        .slice(0, 3)
        .join(', ');

      // OSM embed: small bounding box centered on the pin
      const delta = 0.006;
      const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}&layer=mapnik&marker=${lat},${lng}`;

      return {
        placeName: city ? `${name}, ${city}` : name,
        displayName: displayParts,
        lat,
        lng,
        mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
        embedUrl,
      };
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
