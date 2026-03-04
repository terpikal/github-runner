import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Sparkles, Mail, Lock, Eye, EyeOff, User, Search, Plus, Download, Trash2, Edit3, ChevronRight, Heart, Star, Bell, Settings, Filter, Upload, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = [
  { name: 'Primary', value: '#13c8ec', usage: 'Tombol utama, aksen, link aktif' },
  { name: 'Primary Dark', value: '#0daecf', usage: 'Hover state, gradient end' },
  { name: 'Primary Darker', value: '#098fae', usage: 'Active state, badge text' },
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
      <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-primary-darker" />
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
  const [demoDropdown, setDemoDropdown] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const DEMO_DROPDOWN_OPTIONS = ['Opsi Pertama', 'Opsi Kedua', 'Opsi Ketiga', 'Opsi Keempat'];
  const [demoDropdownIcon, setDemoDropdownIcon] = useState('');
  const [isDropdownIconOpen, setIsDropdownIconOpen] = useState(false);
  const DEMO_DROPDOWN_ICON_OPTIONS = [
    { label: 'Pengguna', icon: <User className="w-4 h-4" /> },
    { label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
    { label: 'Notifikasi', icon: <Bell className="w-4 h-4" /> },
  ];

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary-darker text-xs font-bold">
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
              { name: 'Primary Gradient', css: 'linear-gradient(to right, #13c8ec, #0daecf)', tw: 'from-primary to-primary-dark' },
              { name: 'Primary Hover', css: 'linear-gradient(to right, #0daecf, #098fae)', tw: 'from-primary-dark to-primary-darker' },
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
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all shadow-primary flex items-center gap-2 text-[15px]">
                    <Sparkles className="w-4 h-4" /> Primary Button
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-primary</code>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 bg-primary text-white font-bold rounded-2xl shadow-primary flex items-center gap-2 text-[15px] opacity-50 cursor-not-allowed" disabled>
                    Disabled
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-primary:disabled</code>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-2.5 px-6 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-primary text-sm">
                    Small
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-primary-sm</code>
                </div>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Secondary</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-[15px]">
                    Secondary
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-secondary</code>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 bg-primary/10 hover:bg-primary/20 text-primary-darker font-bold rounded-2xl transition-colors text-[15px]">
                    Tinted
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-tinted</code>
                </div>
              </div>
            </div>

            {/* Outline / Ghost */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Outline & Ghost</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 border-2 border-slate-200 hover:border-primary hover:text-primary-darker text-slate-600 font-bold rounded-2xl transition-all text-[15px]">
                    Outline
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-outline</code>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 text-primary-darker hover:bg-primary/5 font-bold rounded-2xl transition-colors text-[15px]">
                    Ghost
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-ghost</code>
                </div>
              </div>
            </div>

            {/* Destructive */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Destructive</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <button className="py-3 px-8 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors shadow-sm shadow-red-500/30 text-[15px]">
                    <Trash2 className="w-4 h-4 inline mr-2" /> Delete
                  </button>
                  <code className="text-[10px] text-slate-400 font-mono">.btn-destructive</code>
                </div>
              </div>
            </div>

            {/* Icon buttons */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap gap-3 items-center">
                {[
                  { Icon: Plus, name: 'icon-add' },
                  { Icon: Search, name: 'icon-search' },
                  { Icon: Filter, name: 'icon-filter' },
                  { Icon: Download, name: 'icon-download' },
                  { Icon: Upload, name: 'icon-upload' },
                  { Icon: Edit3, name: 'icon-edit' },
                  { Icon: Settings, name: 'icon-settings' },
                  { Icon: Bell, name: 'icon-bell' },
                ].map(({ Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-1.5">
                    <button className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-primary-darker transition-all border border-slate-100">
                      <Icon className="w-5 h-5" />
                    </button>
                    <code className="text-[10px] text-slate-400 font-mono">.{name}</code>
                  </div>
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
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={demoInput}
                  onChange={e => setDemoInput(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Input</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="nama@bisnis.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password Input</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={demoPassword}
                  onChange={e => setDemoPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Search</label>
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari sesuatu..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Textarea</label>
              <textarea
                rows="3"
                placeholder="Tulis deskripsi di sini..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Toggle */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Toggle</label>
              <button onClick={() => setDemoToggle(!demoToggle)} className={`relative w-12 h-7 rounded-full transition-colors ${demoToggle ? 'bg-primary' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${demoToggle ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            {/* Dropdown */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Dropdown</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border transition-all text-left ${demoDropdown ? 'border-primary/50 bg-white' : 'border-slate-200 bg-slate-50'}`}
                >
                  <span className={`text-sm flex-1 ${demoDropdown ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                    {demoDropdown || 'Pilih opsi...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 animation-fade-in">
                      {DEMO_DROPDOWN_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setDemoDropdown(opt); setIsDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${demoDropdown === opt ? 'bg-primary/10 text-primary-darker font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <code className="text-[10px] text-slate-400 font-mono">.dropdown</code>
            </div>

            {/* Dropdown with Icons */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Dropdown with Icon</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownIconOpen(!isDropdownIconOpen)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border transition-all text-left ${demoDropdownIcon ? 'border-primary/50 bg-white' : 'border-slate-200 bg-slate-50'}`}
                >
                  {demoDropdownIcon ? (
                    <>
                      <span className="text-primary-darker">{DEMO_DROPDOWN_ICON_OPTIONS.find(o => o.label === demoDropdownIcon)?.icon}</span>
                      <span className="text-sm font-medium text-slate-800 flex-1">{demoDropdownIcon}</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400 flex-1">Pilih opsi...</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownIconOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownIconOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownIconOpen(false)} />
                    <div className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 animation-fade-in">
                      {DEMO_DROPDOWN_ICON_OPTIONS.map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => { setDemoDropdownIcon(opt.label); setIsDropdownIconOpen(false); }}
                          className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm transition-colors ${demoDropdownIcon === opt.label ? 'bg-primary/10 text-primary-darker font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                        >
                          <span className={demoDropdownIcon === opt.label ? 'text-primary-darker' : 'text-slate-400'}>{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <code className="text-[10px] text-slate-400 font-mono">.dropdown-icon</code>
            </div>
          </div>
        </Section>

        {/* ── BADGES ── */}
        <Section title="Badges & Tags">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'badge-ai', label: 'AI Workspace', icon: <Sparkles className="w-3.5 h-3.5" />, cls: 'bg-primary/10 text-primary-darker' },
                { id: 'badge-sales', label: 'Sales', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
                { id: 'badge-awareness', label: 'Awareness', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
                { id: 'badge-edukasi', label: 'Edukasi', cls: 'bg-purple-50 text-purple-600 border border-purple-200' },
                { id: 'badge-engagement', label: 'Engagement', cls: 'bg-pink-50 text-pink-600 border border-pink-200' },
                { id: 'badge-warning', label: 'Warning', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
                { id: 'badge-error', label: 'Error', cls: 'bg-red-50 text-red-600 border border-red-200' },
                { id: 'badge-default', label: 'Default', cls: 'bg-slate-100 text-slate-600' },
              ].map(b => (
                <div key={b.id} className="flex flex-col items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${b.cls}`}>
                    {b.icon} {b.label}
                  </span>
                  <code className="text-[10px] text-slate-400 font-mono">.{b.id}</code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── CARDS ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-primary-darker" />
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
              <button className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white font-bold rounded-xl transition-all text-sm">
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
                { name: 'primary', cls: 'shadow-primary', code: 'shadow-primary' },
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
                  <div className={`${r.size} ${r.cls} bg-primary/10 border-2 border-primary/30`} />
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
                  <div className="h-4 rounded bg-gradient-to-r from-primary to-primary-dark" style={{ width: `${s * 4}px` }} />
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