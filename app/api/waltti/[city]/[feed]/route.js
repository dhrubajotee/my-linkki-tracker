// app/api/waltti/[city]/[feed]/route.js
import { NextResponse } from 'next/server';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const ALLOWED_FEEDS = ['tripupdate', 'vehicleposition', 'servicealert'];

export async function GET(request, context) {
  const params = await context.params;
  const { city, feed } = params;

  if (!city) return NextResponse.json({ error: 'City not provided' }, { status: 400 });
  if (!ALLOWED_FEEDS.includes(feed)) return NextResponse.json({ error: 'Invalid feed' }, { status: 400 });

  const clientId = process.env.WALTTI_CLIENT_ID;
  const clientSecret = process.env.WALTTI_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const url = `https://data.waltti.fi/${city}/api/gtfsrealtime/v1.0/feed/${feed}`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Waltti API error ${res.status}` }, { status: res.status });
  }

  const buffer = await res.arrayBuffer();

  const feedMessage = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

  return NextResponse.json(feedMessage);
}
