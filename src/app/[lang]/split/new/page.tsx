'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function NewSplitPage() {
  const params = useParams();
  const lang = (params?.lang as string) ?? 'es';
  const router = useRouter();

  const [hostName, setHostName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEs = lang === 'es';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/splits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: 'standalone', hostName: hostName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error');
      router.push(`/${lang}/split/${json.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEs
          ? 'Ocurrió un error. Intenta de nuevo.'
          : 'Something went wrong. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="pitch-bg border-b-4 border-signal px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <div className="font-mono text-signal text-xs uppercase tracking-widest mb-1">
              ⚽ fut office
            </div>
            <div className="font-display text-white text-xl lowercase">
              {isEs ? 'Nuevo divisor de gastos' : 'New expense split'}
            </div>
          </div>
          <Link
            href={`/${lang}`}
            className="font-mono text-white/50 hover:text-white text-sm transition-colors px-2 py-1"
          >
            ←
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-chalk border-2 border-ink rounded-2xl p-6 card-shadow">
          <h2 className="font-display text-ink text-xl lowercase mb-1">
            {isEs ? 'Crear divisor' : 'Create split'}
          </h2>
          <p className="font-mono text-ink/50 text-xs mb-6 leading-relaxed">
            {isEs
              ? 'Comparte el link con todos los que fueron al partido para dividir los gastos.'
              : 'Share the link with everyone who attended to split the expenses.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-ink/60 uppercase tracking-wider mb-1.5">
                {isEs ? 'Tu nombre (anfitrión)' : 'Your name (host)'}
              </label>
              <input
                type="text"
                required
                placeholder={isEs ? 'Ej. Carlos' : 'e.g. Carlos'}
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full border-2 border-ink rounded-lg px-3 py-2.5 font-sans text-sm bg-turf text-ink placeholder-ink/30 outline-none focus:border-pitch"
                autoFocus
              />
            </div>

            {error && (
              <p className="font-mono text-whistle text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !hostName.trim()}
              className="w-full bg-pitch text-white font-display lowercase text-lg py-3 rounded-xl hover:bg-pitch-line active:scale-95 transition-all disabled:opacity-50"
            >
              {loading
                ? (isEs ? 'Creando...' : 'Creating...')
                : (isEs ? 'Crear divisor →' : 'Create split →')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
