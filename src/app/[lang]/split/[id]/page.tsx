import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import { getSplit, getExpenses } from '@/lib/db';
import { getMatchById } from '@/data/matches';
import SplitClient from '@/components/SplitClient';

export default async function SplitPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isValidLocale(lang)) notFound();

  const [dict, split] = await Promise.all([
    getDictionary(lang),
    getSplit(id).catch(() => null),
  ]);

  if (!split) notFound();

  const [expenses, match] = await Promise.all([
    getExpenses(id),
    Promise.resolve(getMatchById(split.match_id)),
  ]);

  return (
    <SplitClient
      lang={lang}
      dict={dict}
      split={split}
      initialExpenses={expenses}
      match={match ?? null}
    />
  );
}
