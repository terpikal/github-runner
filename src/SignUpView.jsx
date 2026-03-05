import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

const SignUpView = ({ setCurrentView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Semua kolom wajib diisi.');
            return;
        }
        if (password.length < 6) {
            setError('Kata sandi minimal 6 karakter.');
            return;
        }
        setError('');
        setIsLoading(true);

        const { data, error: authError } = await signUp(email, password, name);
        setIsLoading(false);

        if (authError) {
            setError(authError.message);
            return;
        }

        // If email confirmation is required
        if (data?.user && !data?.session) {
            setSuccessMessage('Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.');
            return;
        }

        // If auto-confirmed (shouldn't happen but handle gracefully)
        setCurrentView('onboarding');
    };

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
                            Buat Akun Baru
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                            Mulailah revolusi desain UMKM Anda hari ini.
                        </p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 text-center">
                            {successMessage}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                            <div className="relative flex items-center">
                                <User className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Contoh: Budi Gunawan"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* Email Bisnis */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Email Bisnis</label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="nama@bisnis.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* Kata Sandi */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                            <div className="relative flex items-center">
                                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-2xl transition-all shadow-primary disabled:shadow-none flex items-center justify-center gap-2 text-[15px]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Daftar & Lanjutkan
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode switch link */}
                    <p className="text-center text-sm text-slate-500 mt-5">
                        Sudah punya akun?{' '}
                        <button
                            onClick={() => setCurrentView('login')}
                            className="text-primary font-bold hover:underline transition-all"
                        >
                            Masuk di sini
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
