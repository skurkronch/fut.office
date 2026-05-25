import { notFound } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import HomeClient from '@/components/HomeClient';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return <HomeClient lang={lang} dict={dict} />;
}
