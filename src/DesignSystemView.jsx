import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Sparkles, Mail, Lock, Eye, EyeOff, User, Search, Plus, Download, Trash2, Edit3, ChevronRight, Heart, Star, Bell, Settings, Filter, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRIMARY = '#13c8ec';
const PRIMARY_DARK = '#0daecf';
const PRIMARY_DARKER = '#098fae';

const COLORS = [
  { name: 'Primary', value: PRIMARY, usage: 'Tombol utama, aksen, link aktif' },
  { name: 'Primary Dark', value: PRIMARY_DARK, usage: 'Hover state, gradient end' },
  { name: 'Primary Darker', value: PRIMARY_DARKER, usage: 'Active state, badge text' },
  { name: 'Slate 900', value: '#0f172a', usage: 'Heading, teks utama' },
  { name: 'Slate 700', value: '#334155', usage: 'Label, sub-heading' },
  { name: 'Slate 500', value: '#64748b', usage: 'Teks sekunder, deskripsi' },
  { name: 'Slate 400', value: '#94a3b8', usage: 'Placeholder, ikon pasif' },
  { name: 'Slate 200', value: '#e2e8f0', usage: 'Border, divider' },
  { name: 'Slate 100', value: '#f1f5f9', usage: 'Background card, hover' },
  { name: 'Slate 50', value: '#f8fafc', usage: 'Background halaman' },
  { name: 'White', value: '#ffffff', usage: 'Card, surface utama' },
  { name: 'Red 500', value: '#ef4444', usage: 'Error, destructive action' },
  { name: 'Green 500', value: '#22c55e', usage: 'Success, status aktif' },
  { name: 'Amber 500', value: '#f59e0b', usage: 'Warning, perhatian' },
];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded-md hover:bg-slate-100 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
};

const Section = ({ title, children }) => (
  <section className="mb-16">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3">
      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#13c8ec] to-[#098fae]" />
      {title}
    </h2>
    {children}
  </section>
);

const DesignSystemView = () => {
  const navigate = useNavigate();
  const [demoInput, setDemoInput] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [demoToggle, setDemoToggle] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Design System</h1>
              <p className="text-xs text-slate-400">Postibel UI Components & Tokens</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#13c8ec]/10 text-[#098fae] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> v1.0
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* ── COLORS ── */}
        <Section title="Colors">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {COLORS.map(c => (
              <div key={c.name} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-20 w-full" style={{ backgroundColor: c.value }} />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-800">{c.name}</span>
                    <CopyButton text={c.value} />
                  </div>
                  <code className="text-[11px] text-slate-500 font-mono">{c.value}</code>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradients */}
          <h3 className="text-lg font-bold text-slate-800 mt-10 mb-4">Gradients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Primary Gradient', css: `linear-gradient(to right, ${PRIMARY}, ${PRIMARY_DARK})`, tw: 'from-[#13c8ec] to-[#0daecf]' },
              { name: 'Primary Hover', css: `linear-gradient(to right, ${PRIMARY_DARK}, ${PRIMARY_DARKER})`, tw: 'from-[#0daecf] to-[#098fae]' },
              { name: 'Page Background', css: 'linear-gradient(to bottom right, #f8fafc, #ecfeff30, #f1f5f9)', tw: 'from-slate-50 via-cyan-50/30 to-slate-100' },
            ].map(g => (
              <div key={g.name} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-16 w-full rounded-t-2xl" style={{ background: g.css }} />
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{g.name}</span>
                    <CopyButton text={g.tw} />
                  </div>
                  <code className="text-[10px] text-slate-400 font-mono break-all">{g.tw}</code>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="Typography">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6 shadow-sm">
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">H1</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Heading Satu</h1>
            </div>
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">H2</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Heading Dua</h2>
            </div>
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">H3</span>
              <h3 className="text-2xl font-bold text-slate-900">Heading Tiga</h3>
            </div>
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">H4</span>
              <h4 className="text-xl font-bold text-slate-800">Heading Empat</h4>
            </div>
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">Body</span>
              <p className="text-base text-slate-600">Ini adalah teks paragraf utama yang digunakan di seluruh aplikasi Postibel.</p>
            </div>
            <div className="flex items-baseline gap-4 border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">Small</span>
              <p className="text-sm text-slate-500">Teks kecil untuk label, keterangan, dan metadata.</p>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-xs text-slate-400 w-20 shrink-0 font-mono">Caption</span>
              <p className="text-xs text-slate-400">Caption dan helper text untuk form dan informasi tambahan.</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-4">Font: <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">Inter</code> — weight 300–900</p>
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="Buttons">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-8">
            {/* Primary */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Primary</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="py-3 px-8 bg-gradient-to-r from-[#13c8ec] to-[#0daecf] hover:from-[#0daecf] hover:to-[#098fae] text-white font-bold rounded-2xl transition-all shadow-[0_8px_20px_rgba(19,200,236,0.3)] flex items-center gap-2 text-[15px]">
                  <Sparkles className="w-4 h-4" /> Primary Button
                </button>
                <button className="py-3 px-8 bg-gradient-to-r from-[#13c8ec] to-[#0daecf] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(19,200,236,0.3)] flex items-center gap-2 text-[15px] opacity-50 cursor-not-allowed" disabled>
                  Disabled
                </button>
                <button className="py-2.5 px-6 bg-gradient-to-r from-[#13c8ec] to-[#0daecf] hover:from-[#0daecf] hover:to-[#098fae] text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(19,200,236,0.3)] text-sm">
                  Small
                </button>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Secondary</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="py-3 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-[15px]">
                  Secondary
                </button>
                <button className="py-3 px-8 bg-[#13c8ec]/10 hover:bg-[#13c8ec]/20 text-[#098fae] font-bold rounded-2xl transition-colors text-[15px]">
                  Tinted
                </button>
              </div>
            </div>

            {/* Outline / Ghost */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Outline & Ghost</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="py-3 px-8 border-2 border-slate-200 hover:border-[#13c8ec] hover:text-[#098fae] text-slate-600 font-bold rounded-2xl transition-all text-[15px]">
                  Outline
                </button>
                <button className="py-3 px-8 text-[#098fae] hover:bg-[#13c8ec]/5 font-bold rounded-2xl transition-colors text-[15px]">
                  Ghost
                </button>
              </div>
            </div>

            {/* Destructive */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Destructive</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="py-3 px-8 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors shadow-sm shadow-red-500/30 text-[15px]">
                  <Trash2 className="w-4 h-4 inline mr-2" /> Delete
                </button>
              </div>
            </div>

            {/* Icon buttons */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap gap-3 items-center">
                {[Plus, Search, Filter, Download, Upload, Edit3, Settings, Bell].map((Icon, i) => (
                  <button key={i} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-[#098fae] transition-all border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── FORM INPUTS ── */}
        <Section title="Form Inputs">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6 max-w-lg">
            {/* Text Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Text Input</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Input</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="nama@bisnis.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password Input</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={demoPassword}
                  onChange={e => setDemoPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Search</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari sesuatu..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Textarea</label>
              <textarea
                rows="3"
                placeholder="Tulis deskripsi di sini..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Toggle</label>
              <button onClick={() => setDemoToggle(!demoToggle)} className={`relative w-12 h-7 rounded-full transition-colors ${demoToggle ? 'bg-[#13c8ec]' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${demoToggle ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </Section>

        {/* ── BADGES ── */}
        <Section title="Badges & Tags">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13c8ec]/10 text-[#098fae] text-xs font-bold"><Sparkles className="w-3.5 h-3.5" /> AI Workspace</span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">Sales</span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">Awareness</span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 text-xs font-bold">Edukasi</span>
              <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-200 text-xs font-bold">Engagement</span>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold">Warning</span>
              <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold">Error</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">Default</span>
            </div>
          </div>
        </Section>

        {/* ── CARDS ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="w-10 h-10 rounded-xl bg-[#13c8ec]/10 flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-[#098fae]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Basic Card</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Card standar dengan ikon, judul, dan deskripsi singkat.</p>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Action Card</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">Card dengan tombol aksi di bagian bawah.</p>
              <button className="w-full py-2.5 bg-gradient-to-r from-[#13c8ec] to-[#0daecf] hover:from-[#0daecf] hover:to-[#098fae] text-white font-bold rounded-xl transition-all text-sm">
                Lihat Detail
              </button>
            </div>

            {/* Elevated Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-slate-100/80 p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Elevated Card</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Card dengan shadow yang lebih dramatis, digunakan di form dan modal.</p>
            </div>
          </div>
        </Section>

        {/* ── SHADOWS & RADIUS ── */}
        <Section title="Shadows & Radius">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-6">Shadows</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { name: 'sm', cls: 'shadow-sm', code: 'shadow-sm' },
                { name: 'default', cls: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]', code: '0_8px_30px_rgb(0,0,0,0.04)' },
                { name: 'primary', cls: 'shadow-[0_8px_20px_rgba(19,200,236,0.3)]', code: '0_8px_20px_rgba(19,200,236,0.3)' },
                { name: 'elevated', cls: 'shadow-[0_20px_60px_rgba(0,0,0,0.07)]', code: '0_20px_60px_rgba(0,0,0,0.07)' },
              ].map(s => (
                <div key={s.name} className={`h-24 rounded-2xl bg-white border border-slate-100 ${s.cls} flex items-center justify-center`}>
                  <code className="text-[10px] text-slate-500 font-mono text-center px-2">{s.name}</code>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-700 mb-6">Border Radius</h3>
            <div className="flex flex-wrap gap-6 items-end">
              {[
                { name: 'xl', cls: 'rounded-xl', size: 'w-16 h-16' },
                { name: '2xl', cls: 'rounded-2xl', size: 'w-16 h-16' },
                { name: '3xl', cls: 'rounded-3xl', size: 'w-16 h-16' },
                { name: '[2rem]', cls: 'rounded-[2rem]', size: 'w-16 h-16' },
                { name: 'full', cls: 'rounded-full', size: 'w-16 h-16' },
              ].map(r => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div className={`${r.size} ${r.cls} bg-[#13c8ec]/10 border-2 border-[#13c8ec]/30`} />
                  <code className="text-[10px] text-slate-500 font-mono">{r.name}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── SPACING ── */}
        <Section title="Spacing Scale">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="space-y-3">
              {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map(s => (
                <div key={s} className="flex items-center gap-4">
                  <code className="text-xs text-slate-500 font-mono w-10 text-right">{s}</code>
                  <div className="h-4 rounded bg-gradient-to-r from-[#13c8ec] to-[#0daecf]" style={{ width: `${s * 4}px` }} />
                  <span className="text-[10px] text-slate-400 font-mono">{s * 4}px</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

      </main>

      <footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
          Postibel Design System — Built with Tailwind CSS + Inter
        </div>
      </footer>
    </div>
  );
};

export default DesignSystemView;
