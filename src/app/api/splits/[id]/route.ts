import { getSplit, getExpenses } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [split, expenses] = await Promise.all([getSplit(id), getExpenses(id)]);
    if (!split) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ split, expenses });
  } catch (err) {
    console.error('GET /api/splits/[id]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
