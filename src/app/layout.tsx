import type { Metadata } from 'next';
import { Archivo_Black, Space_Mono, Sora } from 'next/font/google';
import './globals.css';

const archivoBlack = Archivo_Black({
  weight: '400',
  variable: '--font-archivo-black',
  subsets: ['latin'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: '--font-space-mono',
  subsets: ['latin'],
  display: 'swap',
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'fut office — Mundial 2026',
  description:
    'Organiza dónde ver los partidos del Mundial 2026 con tu equipo remoto. Crea reuniones, comparte la tarjeta y divide los gastos.',
  openGraph: {
    title: 'fut office — Mundial 2026',
    description: 'Organiza quedadas para ver el Mundial con tu equipo remoto.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivoBlack.variable} ${spaceMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
