'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2, User, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/${locale}/dashboard`
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isRTL ? 'تم التسجيل!' : 'Check your email!'}
          </h2>
          <p className="text-gray-400">
            {isRTL
              ? `بعتنالك إيميل تأكيد على ${email}. افتحه وكليك على اللينك.`
              : `We sent a confirmation link to ${email}. Click it to activate your account.`}
          </p>
          <p className="text-purple-400 text-sm mt-4">
            {isRTL ? '50 كريدت مجاناً بتنتظرك! 🎁' : '50 free credits are waiting for you! 🎁'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center px-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Markivo
            </span>
          </Link>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {isRTL ? 'ابدأ مجاناً 🎉' : 'Start for Free 🎉'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isRTL ? '50 كريدت مجاناً عند التسجيل' : '50 free credits on signup'}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                {isRTL ? 'الاسم' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={isRTL ? 'اسمك' : 'Your name'} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none transition" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none transition" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  minLength={8} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder:text-gray-600 focus:border-purple-500/50 focus:outline-none transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 space-y-1.5">
              {[
                isRTL ? '✓ 50 كريدت مجاناً عند التسجيل' : '✓ 50 free credits on signup',
                isRTL ? '✓ حذف خلفية احترافي' : '✓ Professional background removal',
                isRTL ? '✓ توليد كابشنات بالذكاء الاصطناعي' : '✓ AI caption generation',
                isRTL ? '✓ مش محتاج كريدت كارد' : '✓ No credit card required'
              ].map((benefit, i) => (
                <p key={i} className="text-xs text-purple-300">{benefit}</p>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isRTL ? 'إنشاء حساب مجاناً' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-4">
            {isRTL ? 'بالتسجيل أنت موافق على' : 'By signing up you agree to our'}{' '}
            <a href="#" className="text-purple-400">Terms</a> &{' '}
            <a href="#" className="text-purple-400">Privacy Policy</a>
          </p>

          <p className="text-center text-gray-600 text-sm mt-4">
            {isRTL ? 'عندك أكونت؟' : 'Already have an account?'}{' '}
            <Link href={`/${locale}/login`} className="text-purple-400 hover:text-purple-300">
              {isRTL ? 'سجل دخولك' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
