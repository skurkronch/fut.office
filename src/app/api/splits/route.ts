import { nanoid } from 'nanoid';
import { createSplit } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { matchId, hostName } = await request.json();

    if (matchId !== undefined && typeof matchId !== 'string') {
      return Response.json({ error: 'matchId must be a string' }, { status: 400 });
    }
    if (!hostName || typeof hostName !== 'string') {
      return Response.json({ error: 'hostName required' }, { status: 400 });
    }

    const id = nanoid(10);
    const resolvedMatchId = (matchId ?? 'standalone').trim() || 'standalone';
    const split = await createSplit(id, resolvedMatchId, hostName.trim().slice(0, 60));
    return Response.json({ id: split.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/splits', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
