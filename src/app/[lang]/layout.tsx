import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  await getDictionary(lang); // Validates locale early
  return <>{children}</>;
}
