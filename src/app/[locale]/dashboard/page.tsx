'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Image, Video, MessageSquare, Share2, Zap,
  CreditCard, Settings, LogOut, User, Bell, Menu,
  CheckCircle, AlertCircle, Loader2, Download, Copy,
  Sparkles, X, Plus, ChevronDown, TrendingUp
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

type Tool = 'bg_remove' | 'enhance' | 'video' | 'caption' | 'publish' | null;

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [credits, setCredits] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ captions?: string[]; image_url?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      setUploadedImageUrl(URL.createObjectURL(file));
      setProcessedImageUrl(null);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1
  });

  const handleProcess = async () => {
    if (!uploadedImage && activeTool !== 'caption') return;
    setLoading(true);
    setError(null);

    try {
      if (activeTool === 'bg_remove') {
        const formData = new FormData();
        formData.append('image', uploadedImage!);

        const res = await fetch('/api/ai/background-remove', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.success) {
          setProcessedImageUrl(data.image_url);
          setCredits(data.credits_remaining);
        } else {
          setError(data.error);
        }
      } else if (activeTool === 'caption') {
        const res = await fetch('/api/ai/generate-caption', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: 'My Product',
            country: locale === 'ar' ? 'eg' : 'us',
            language: locale,
            platform: 'instagram'
          })
        });

        const data = await res.json();
        if (data.success) {
          setResult({ captions: data.captions });
          setCredits(data.credits_remaining);
        } else {
          setError(data.error);
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    { id: 'bg_remove', icon: Image, label: t('tools.bg_remove'), color: 'purple', credits: 2 },
    { id: 'enhance', icon: Sparkles, label: t('tools.enhance'), color: 'pink', credits: 1 },
    { id: 'video', icon: Video, label: t('tools.video'), color: 'blue', credits: 5 },
    { id: 'caption', icon: MessageSquare, label: t('tools.caption'), color: 'green', credits: 1 },
    { id: 'publish', icon: Share2, label: t('tools.publish'), color: 'orange', credits: 0 },
  ];

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-[#111] border-${isRTL ? 'l' : 'r'} border-white/5 flex flex-col z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Markivo
            </span>
          </div>
        </div>

        {/* Credits */}
        <div className="p-4 mx-3 mt-4 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{t('credits')}</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">{credits}</div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, (credits / 500) * 100)}%` }}
            />
          </div>
          <button className="mt-3 w-full text-center text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg py-1.5 transition">
            <Plus className="w-3 h-3 inline mr-1" /> Get More Credits
          </button>
        </div>

        {/* Tools */}
        <nav className="p-3 flex-1 mt-2">
          <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider">AI Tools</p>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as Tool)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all
                ${activeTool === tool.id
                  ? 'bg-purple-500/20 text-white border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <tool.icon className={`w-4 h-4 ${activeTool === tool.id ? 'text-purple-400' : ''}`} />
              <span className="flex-1 text-left">{tool.label}</span>
              {tool.credits > 0 && (
                <span className="text-xs text-gray-600">{tool.credits}cr</span>
              )}
            </button>
          ))}

          <div className="mt-4">
            <p className="text-xs text-gray-600 px-3 mb-2 uppercase tracking-wider">Analytics</p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${isRTL ? 'mr-64' : 'ml-64'} p-8`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {t('welcome')} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {activeTool ? tools.find(t => t.id === activeTool)?.label : 'Select a tool to get started'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
              <Bell className="w-4 h-4 text-gray-400" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${isDragActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/10 hover:border-white/30 bg-white/2'}`}>
              <input {...getInputProps()} />
              {uploadedImageUrl ? (
                <div className="relative">
                  <img src={uploadedImageUrl} alt="Uploaded" className="max-h-64 mx-auto rounded-xl object-contain" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedImage(null); setUploadedImageUrl(null); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-white font-medium mb-1">{t('upload')}</p>
                  <p className="text-gray-500 text-sm">JPG, PNG, WEBP • Max 10MB</p>
                </div>
              )}
            </div>

            {/* Process Button */}
            {(uploadedImage || activeTool === 'caption') && activeTool && (
              <button
                onClick={handleProcess}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing')}</>
                ) : (
                  <><Zap className="w-4 h-4" /> Process Now ({tools.find(t => t.id === activeTool)?.credits || 0} credits)</>
                )}
              </button>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Result Zone */}
          <div className="bg-white/2 border border-white/5 rounded-2xl p-6 min-h-64">
            {processedImageUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Result
                </h3>
                <img src={processedImageUrl} alt="Processed" className="max-h-64 mx-auto rounded-xl object-contain bg-checkered" />
                <div className="flex gap-2 mt-4">
                  <a href={processedImageUrl} download
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-sm transition">
                    <Download className="w-4 h-4" /> Download
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(processedImageUrl)}
                    className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition">
                    <Copy className="w-4 h-4" /> Copy URL
                  </button>
                </div>
              </div>
            )}

            {result?.captions && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Generated Captions
                </h3>
                <div className="space-y-3">
                  {result.captions.map((caption, i) => (
                    <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-4 relative group">
                      <p className="text-sm text-gray-300 whitespace-pre-line">{caption}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(caption)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!processedImageUrl && !result && (
              <div className="h-full flex items-center justify-center text-center py-16">
                <div>
                  <div className="w-16 h-16 bg-white/2 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {activeTool ? 'Upload an image and click Process' : 'Select a tool from the sidebar'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/2 border border-white/5 rounded-xl hover:border-white/20 transition cursor-pointer" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
