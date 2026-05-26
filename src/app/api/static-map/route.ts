import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy for OpenStreetMap static map images.
 * Serves the image from our own domain so html-to-image can capture it
 * without cross-origin restrictions.
 */
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lng = request.nextUrl.searchParams.get('lng');
  const zoom = request.nextUrl.searchParams.get('zoom') ?? '15';

  if (!lat || !lng) {
    return new NextResponse('Missing lat/lng', { status: 400 });
  }

  // Validate numbers
  if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
    return new NextResponse('Invalid coordinates', { status: 400 });
  }

  const mapUrl =
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${lat},${lng}&zoom=${zoom}&size=400x180` +
    `&markers=${lat},${lng},red-pushpin`;

  try {
    const res = await fetch(mapUrl, {
      signal: AbortSignal.timeout(7000),
      headers: { 'User-Agent': 'fut-office-bot/1.0' },
    });

    if (!res.ok) throw new Error(`OSM responded ${res.status}`);

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('GET /api/static-map', err);
    return new NextResponse('Map unavailable', { status: 502 });
  }
}
