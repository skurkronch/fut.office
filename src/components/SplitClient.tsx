'use client';

import { useState, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Match } from '@/data/matches';
import type { SplitRow, ExpenseRow } from '@/lib/db';
import { calculateSettlement, flagEmoji, formatMatchDate, formatMatchTime } from '@/lib/utils';
import AdSlot from './AdSlot';

interface Props {
  lang: Locale;
  dict: Record<string, unknown>;
  split: SplitRow;
  initialExpenses: ExpenseRow[];
  match: Match | null;
}

export default function SplitClient({ lang, dict, split, initialExpenses, match }: Props) {
  const t = (dict as Record<string, Record<string, string>>).split ?? {};
  const common = (dict as Record<string, Record<string, string>>).common ?? {};
  const [expenses, setExpenses] = useState<ExpenseRow[]>(initialExpenses);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sharecopied, setShareCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !description.trim() || !amount) return;
      const numAmount = parseFloat(amount);
      if (!Number.isFinite(numAmount) || numAmount <= 0) {
        setError(lang === 'es' ? 'Monto inválido' : 'Invalid amount');
        return;
      }

      setSubmitting(true);
      setError('');
      try {
        const res = await fetch(`/api/splits/${split.id}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ personName: name, description, amount: numAmount }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setExpenses((prev) => [...prev, json.expense]);
        setDescription('');
        setAmount('');
        // Keep name for convenience (user likely adds multiple)
      } catch (err) {
        setError(err instanceof Error ? err.message : common.error);
      } finally {
        setSubmitting(false);
      }
    },
    [name, description, amount, split.id, lang, common.error]
  );

  const expenseData = expenses.map((e) => ({
    personName: e.person_name,
    amount: parseFloat(e.amount),
  }));
  const settlement = calculateSettlement(expenseData);
  const total = expenseData.reduce((sum, e) => sum + e.amount, 0);
  const uniquePeople = [...new Set(expenseData.map((e) => e.personName))];

  const matchTime = match ? formatMatchTime(match.datetime, 'UTC', lang) : '';
  const matchDate = match ? formatMatchDate(match.datetime, 'UTC', lang) : '';

  const handleShareCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="pitch-bg border-b-4 border-signal px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="font-mono text-signal text-xs uppercase tracking-widest mb-1">
            ⚽ fut office · {t.title ?? 'Divisor'}
          </div>
          {match && (
            <div className="font-display text-white text-xl lowercase">
              {flagEmoji(match.homeTeam)} {match.homeTeam}
              <span className="text-white/50 font-mono text-base"> vs </span>
              {flagEmoji(match.awayTeam)} {match.awayTeam}
            </div>
          )}
          {match && (
            <div className="font-mono text-white/50 text-xs mt-0.5">
              {matchDate} · {matchTime}
            </div>
          )}
          <div className="font-mono text-white/60 text-sm mt-1">
            {t.host ?? 'Anfitrión'}: <span className="text-white font-bold">{split.host_name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        {/* Share link */}
        <div className="bg-chalk border-2 border-ink rounded-xl p-4 card-shadow">
          <p className="font-mono text-xs text-ink/50 mb-2">{t.shareLink ?? 'Comparte este link:'}</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-turf rounded-lg px-3 py-2 font-mono text-xs text-ink/60 break-all">
              {shareUrl || '...'}
            </div>
            <button
              onClick={handleShareCopy}
              className="shrink-0 bg-signal text-pitch-dark font-mono text-xs px-3 rounded-lg hover:bg-card-yellow active:scale-95 transition-all"
            >
              {sharecopied ? (common.copied ?? '¡Copiado!') : (common.copy ?? 'Copiar')}
            </button>
          </div>
        </div>

        <AdSlot label={(dict as Record<string, Record<string, string>>).ad?.label} />

        {/* Add expense form */}
        <div className="bg-chalk border-2 border-ink rounded-xl p-4 card-shadow">
          <h2 className="font-display text-ink text-xl lowercase mb-4">
            {t.addExpense ?? 'Agregar gasto'}
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              type="text"
              required
              placeholder={t.yourNamePlaceholder ?? 'Tu nombre'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
            />
            <input
              type="text"
              required
              placeholder={t.whatYouPaidPlaceholder ?? '¿En qué gastaste?'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-ink rounded-lg px-3 py-2 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
            />
            <div className="flex gap-2">
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder={t.howMuch ?? '¿Cuánto?'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 border-2 border-ink rounded-lg px-3 py-2 font-mono text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-pitch text-white font-mono text-sm px-4 rounded-lg hover:bg-pitch-line active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? '...' : (t.addButton ?? 'Agregar')}
              </button>
            </div>
            {error && <p className="font-mono text-whistle text-xs">{error}</p>}
          </form>
        </div>

        {/* Expenses list */}
        <div>
          <h2 className="font-display text-ink text-xl lowercase mb-3">
            {t.expenses ?? 'Gastos'}
          </h2>

          {expenses.length === 0 ? (
            <p className="text-center text-ink/40 py-8 font-mono text-sm">
              {t.noExpenses ?? 'Nadie ha agregado gastos aún.'}
            </p>
          ) : (
            <div className="space-y-2">
              {expenses.map((e) => (
                <div
                  key={e.id}
                  className="bg-chalk border-2 border-ink rounded-xl px-4 py-3 card-shadow flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-ink">{e.person_name}</div>
                    <div className="font-mono text-xs text-ink/50">{e.description}</div>
                  </div>
                  <div className="font-display text-pitch text-lg">
                    ${parseFloat(e.amount).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="bg-turf border-2 border-ink/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="font-mono text-xs text-ink/50">
                  {t.total ?? 'Total'} · {uniquePeople.length} {t.people ?? 'personas'}
                </div>
                <div className="font-display text-ink text-lg">${total.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Settlement */}
        {expenses.length > 0 && (
          <div>
            <h2 className="font-display text-ink text-xl lowercase mb-3">
              {t.settlement ?? 'Cómo quedar a mano'}
            </h2>

            {settlement.length === 0 ? (
              <div className="bg-pitch/10 border-2 border-pitch rounded-xl p-4 text-center">
                <p className="text-pitch font-bold">{t.settled ?? '¡Todos en paz! 🎉'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {settlement.map((s, i) => (
                  <div
                    key={i}
                    className="bg-chalk border-2 border-ink rounded-xl px-4 py-3 card-shadow flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-whistle">{s.from}</span>
                      <span className="font-mono text-ink/50 text-sm"> {t.owes ?? 'le debe'} </span>
                      <span className="font-bold text-pitch">{s.to}</span>
                    </div>
                    <div className="font-display text-ink text-lg shrink-0">
                      ${s.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <AdSlot label={(dict as Record<string, Record<string, string>>).ad?.label} className="mt-2" />
      </main>
    </div>
  );
}
