import { neon } from '@neondatabase/serverless';

/*
  Required environment variable:
    DATABASE_URL=postgresql://user:password@host/dbname

  Schema (run once on Vercel Postgres or Neon):

  CREATE TABLE IF NOT EXISTS splits (
    id          TEXT PRIMARY KEY,
    match_id    TEXT NOT NULL,
    host_name   TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id          SERIAL PRIMARY KEY,
    split_id    TEXT REFERENCES splits(id) ON DELETE CASCADE,
    person_name TEXT NOT NULL,
    description TEXT NOT NULL,
    amount      NUMERIC(10, 2) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );
*/

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
}

export interface SplitRow {
  id: string;
  match_id: string;
  host_name: string;
  created_at: string;
}

export interface ExpenseRow {
  id: number;
  split_id: string;
  person_name: string;
  description: string;
  amount: string;
  created_at: string;
}

export async function createSplit(id: string, matchId: string, hostName: string): Promise<SplitRow> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO splits (id, match_id, host_name)
    VALUES (${id}, ${matchId}, ${hostName})
    RETURNING *
  `;
  return rows[0] as SplitRow;
}

export async function getSplit(id: string): Promise<SplitRow | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM splits WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as SplitRow) ?? null;
}

export async function getExpenses(splitId: string): Promise<ExpenseRow[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM expenses
    WHERE split_id = ${splitId}
    ORDER BY created_at ASC
  `;
  return rows as ExpenseRow[];
}

export async function addExpense(
  splitId: string,
  personName: string,
  description: string,
  amount: number
): Promise<ExpenseRow> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO expenses (split_id, person_name, description, amount)
    VALUES (${splitId}, ${personName}, ${description}, ${amount})
    RETURNING *
  `;
  return rows[0] as ExpenseRow;
}
