'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, Image, Video, MessageSquare, Share2,
  CheckCircle, Star, Globe, ArrowRight, Play
} from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className={`min-h-screen bg-black text-white ${isRTL ? 'rtl font-arabic' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar t={t} locale={locale} />
      <HeroSection t={t} isRTL={isRTL} />
      <StatsSection />
      <FeaturesSection t={t} isRTL={isRTL} />
      <HowItWorksSection isRTL={isRTL} />
      <PricingSection t={t} locale={locale} />
      <CTASection t={t} />
      <Footer t={t} locale={locale} />
    </div>
  );
}

function Navbar({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Markivo
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition text-sm">{t('nav.features')}</a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">{t('nav.pricing')}</a>
          <LanguageSwitcher locale={locale} />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/login`} className="text-gray-400 hover:text-white text-sm transition">
            {t('nav.login')}
          </Link>
          <Link href={`/${locale}/signup`}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
            {t('nav.signup')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LanguageSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const langs = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇪🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];
  const current = langs.find(l => l.code === locale) || langs[0];

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
        <Globe className="w-4 h-4" />
        <span>{current.flag} {current.label}</span>
      </button>
      {open && (
        <div className="absolute top-8 right-0 bg-gray-900 border border-white/10 rounded-xl p-2 min-w-36">
          {langs.map(lang => (
            <a key={lang.code} href={`/${lang.code}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition">
              {lang.flag} {lang.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function HeroSection({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient BG */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">{t('hero.badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {t('hero.title')}
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            {t('hero.title_highlight')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup"
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
            {t('hero.cta_primary')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
            {t('hero.cta_secondary')}
          </button>
        </motion.div>

        {/* Demo Image Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-20 relative">
          <div className="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
              <DashboardPreview />
            </div>
          </div>
          {/* Floating badges */}
          <div className="absolute -top-4 -left-4 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            ✓ Background Removed
          </div>
          <div className="absolute -bottom-4 -right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ✨ AI Enhanced
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full h-full p-6 flex gap-4">
      {/* Sidebar */}
      <div className="w-48 bg-black/50 rounded-xl p-3 flex flex-col gap-2">
        <div className="h-8 bg-purple-500/20 rounded-lg flex items-center px-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <div className="h-2 bg-purple-400/50 rounded flex-1" />
        </div>
        {['bg-white/5', 'bg-white/5', 'bg-white/5', 'bg-white/5'].map((cls, i) => (
          <div key={i} className={`h-8 ${cls} rounded-lg flex items-center px-3 gap-2`}>
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <div className="h-2 bg-gray-600/50 rounded flex-1" />
          </div>
        ))}
      </div>
      {/* Main area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Upload area */}
        <div className="flex-1 bg-black/30 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Image className="w-6 h-6 text-purple-400" />
            </div>
            <div className="h-2 w-24 bg-white/10 rounded mx-auto" />
          </div>
        </div>
        {/* Tools grid */}
        <div className="grid grid-cols-3 gap-2">
          {['purple', 'pink', 'blue', 'green', 'orange', 'cyan'].map((color, i) => (
            <div key={i} className={`h-16 bg-${color}-500/10 border border-${color}-500/20 rounded-lg`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { value: '2M+', label: 'Images Processed' },
    { value: '15K+', label: 'Active Users' },
    { value: '50+', label: 'Countries' },
    { value: '4.9★', label: 'User Rating' },
  ];

  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ t, isRTL }: { t: ReturnType<typeof useTranslations>; isRTL: boolean }) {
  const features = [
    { icon: Image, key: 'bg_removal', color: 'purple', gradient: 'from-purple-500 to-purple-700' },
    { icon: Sparkles, key: 'enhance', color: 'pink', gradient: 'from-pink-500 to-pink-700' },
    { icon: Video, key: 'video', color: 'blue', gradient: 'from-blue-500 to-blue-700' },
    { icon: MessageSquare, key: 'captions', color: 'green', gradient: 'from-green-500 to-green-700' },
    { icon: Share2, key: 'publish', color: 'orange', gradient: 'from-orange-500 to-orange-700' },
    { icon: Zap, key: 'replies', color: 'cyan', gradient: 'from-cyan-500 to-cyan-700' },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
          <p className="text-gray-400 text-lg">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/2 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(`features.${feature.key}.title`)}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t(`features.${feature.key}.desc`)}</p>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection({ isRTL }: { isRTL: boolean }) {
  const steps = [
    { num: '01', title: 'Upload Your Image', title_ar: 'ارفع صورتك', desc: 'Drop any product photo — we accept JPG, PNG, WEBP', desc_ar: 'ارفع أي صورة منتج - JPG، PNG، WEBP' },
    { num: '02', title: 'AI Processes It', title_ar: 'الذكاء الاصطناعي يعالجها', desc: 'Our AI removes backgrounds, enhances quality, creates variations', desc_ar: 'الذكاء الاصطناعي يحذف الخلفية ويحسن الجودة' },
    { num: '03', title: 'Generate Content', title_ar: 'اكتب المحتوى', desc: 'Get trending captions, hashtags for your target market', desc_ar: 'احصل على كابشنات ترند لسوقك المستهدف' },
    { num: '04', title: 'Auto-Publish', title_ar: 'نشر تلقائي', desc: 'Schedule and publish across all your social platforms', desc_ar: 'جدول وانشر على كل المنصات' },
  ];

  return (
    <section className="py-24 px-6 bg-white/2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{isRTL ? 'كيف يعمل Markivo؟' : 'How Markivo Works'}</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{isRTL ? step.title_ar : step.title}</h3>
                <p className="text-gray-500 text-sm">{isRTL ? step.desc_ar : step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('pricing.title')}</h2>
          <p className="text-gray-400">{t('pricing.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/3 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-1">{t('pricing.free.name')}</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
              <span className="text-gray-400 mb-1">{t('pricing.free.period')}</span>
            </div>
            <p className="text-purple-400 text-sm mb-6">{t('pricing.free.credits')}</p>
            <ul className="space-y-3 mb-8">
              {(t.raw('pricing.free.features') as string[]).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href={`/${locale}/signup`}
              className="w-full block text-center border border-white/20 hover:border-white/40 text-white py-3 rounded-xl transition">
              {t('pricing.free.cta')}
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative bg-gradient-to-b from-purple-900/30 to-pink-900/20 border border-purple-500/50 rounded-2xl p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              {t('pricing.pro.badge')}
            </div>
            <h3 className="text-2xl font-bold mb-1">{t('pricing.pro.name')}</h3>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
              <span className="text-gray-400 mb-1">{t('pricing.pro.period')}</span>
            </div>
            <p className="text-purple-400 text-sm mb-6">{t('pricing.pro.credits')}</p>
            <ul className="space-y-3 mb-8">
              {(t.raw('pricing.pro.features') as string[]).map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <PaddleCheckout locale={locale} cta={t('pricing.pro.cta')} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PaddleCheckout({ locale, cta }: { locale: string; cta: string }) {
  const handleCheckout = () => {
    // Paddle checkout will be initialized via script
    if (typeof window !== 'undefined' && (window as Window & { Paddle?: { Checkout: { open: (opts: Record<string, unknown>) => void } } }).Paddle) {
      (window as Window & { Paddle?: { Checkout: { open: (opts: Record<string, unknown>) => void } } }).Paddle!.Checkout.open({
        items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY, quantity: 1 }],
        customData: { locale }
      });
    } else {
      window.location.href = `/${locale}/signup?plan=pro`;
    }
  };

  return (
    <button onClick={handleCheckout}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-medium transition-all">
      {cta}
    </button>
  );
}

function CTASection({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-b from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-3xl p-12">
          <div className="flex justify-center mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Start Creating <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">for Free</span>
          </h2>
          <p className="text-gray-400 mb-8">Join thousands of businesses already using Markivo</p>
          <Link href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-full text-lg font-medium transition-all">
            {t('hero.cta_primary')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Markivo</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 Markivo · getmarkivo.com · All rights reserved</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
