import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markivo — AI Marketing Platform',
  description: 'Remove backgrounds, enhance images, create videos & auto-publish to social media with AI.',
  metadataBase: new URL('https://getmarkivo.com'),
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar' | 'fr' | 'es')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        {/* Paddle.js */}
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js" async />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              if (window.Paddle) {
                Paddle.Environment.set('${process.env.NEXT_PUBLIC_PADDLE_ENV || 'sandbox'}');
                Paddle.Initialize({ token: '${process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN}' });
              }
            });
          `
        }} />
        {/* Arabic Font */}
        {locale === 'ar' && (
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        )}
      </head>
      <body style={locale === 'ar' ? { fontFamily: "'Cairo', sans-serif" } : {}}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
