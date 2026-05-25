import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLocaleFromHeader } from '@/lib/i18n';

const LOCALES = ['es', 'en'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) return NextResponse.next();

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const locale = getLocaleFromHeader(acceptLanguage);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
