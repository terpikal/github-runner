import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, User } from 'lucide-react';

const SignUpView = ({ setCurrentView }) => {
    const [mode, setMode] = useState('register'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setCurrentView('onboarding');
        }, 1200);
    };

    const isRegister = mode === 'register';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm animation-fade-in">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-slate-100/80 px-8 pt-10 pb-8">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center">
                            <img src="/logo.png" alt="Postibel Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {/* Title + Subtitle */}
                    <div className="text-center mb-7">
                        <h1 className="text-[1.65rem] font-black text-slate-900 leading-tight">
                            {isRegister ? 'Buat Akun Baru' : 'Masuk ke Akun'}
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                            {isRegister
                                ? 'Mulailah revolusi desain UMKM Anda hari ini.'
                                : 'Selamat datang kembali di Postibel.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap — register only */}
                        {isRegister && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Contoh: Budi Gunawan"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Bisnis */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Email Bisnis</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="nama@bisnis.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* Kata Sandi */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-[#13c8ec]/10 focus:border-[#13c8ec]/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#13c8ec] to-[#0daecf] hover:from-[#0daecf] hover:to-[#098fae] disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-2xl transition-all shadow-[0_8px_20px_rgba(19,200,236,0.3)] disabled:shadow-none flex items-center justify-center gap-2 text-[15px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isRegister ? 'Daftar & Lanjutkan' : 'Masuk ke Workspace'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode switch link */}
                    <p className="text-center text-sm text-slate-500 mt-5">
                        {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
                        <button
                            onClick={() => setMode(isRegister ? 'login' : 'register')}
                            className="text-[#13c8ec] font-bold hover:underline transition-all"
                        >
                            {isRegister ? 'Masuk di sini' : 'Daftar sekarang'}
                        </button>
                    </p>

                    {/* Demo access */}
                    <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
                        >
                            Lihat demo tanpa daftar →
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignUpView;
