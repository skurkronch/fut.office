import { getSplit, addExpense } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const split = await getSplit(id);
    if (!split) return Response.json({ error: 'Split not found' }, { status: 404 });

    const { personName, description, amount } = await request.json();

    if (!personName || typeof personName !== 'string') {
      return Response.json({ error: 'personName required' }, { status: 400 });
    }
    if (!description || typeof description !== 'string') {
      return Response.json({ error: 'description required' }, { status: 400 });
    }
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      return Response.json({ error: 'amount must be a positive number' }, { status: 400 });
    }

    const expense = await addExpense(
      id,
      personName.trim().slice(0, 60),
      description.trim().slice(0, 120),
      Math.round(numAmount * 100) / 100
    );

    return Response.json({ expense }, { status: 201 });
  } catch (err) {
    console.error('POST /api/splits/[id]/expenses', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
