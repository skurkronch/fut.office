import { nanoid } from 'nanoid';
import { createSplit } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { matchId, hostName } = await request.json();

    if (!matchId || typeof matchId !== 'string') {
      return Response.json({ error: 'matchId required' }, { status: 400 });
    }
    if (!hostName || typeof hostName !== 'string') {
      return Response.json({ error: 'hostName required' }, { status: 400 });
    }

    const id = nanoid(10);
    const split = await createSplit(id, matchId.trim(), hostName.trim().slice(0, 60));
    return Response.json({ id: split.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/splits', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
