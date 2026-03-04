import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
    Sparkles, Image as ImageIcon, Layout, Settings, Library,
    ChevronRight, ChevronLeft, ChevronDown, CheckCircle2, Sliders, Palette, Type,
    MessageSquare, Upload, Loader2, Heart, MessageCircle,
    Send, Bookmark, MoreHorizontal, Edit3, RotateCcw,
    Download, Plus, Search, Filter, Trash2, Copy,
    Paperclip, Link2, X, FileText,
    Mail, Lock, User, ArrowRight, LogOut,
    Tag, Package, Star, Lightbulb, Check,
    Coffee, Utensils, ShoppingBag, Flower2, Briefcase, Eye,
    Layers, Component, Hexagon, Calendar, Camera, ScanFace, ImagePlus,
    Instagram, CalendarDays, Clock, RefreshCw, MoreVertical, ArrowUp, ArrowDown, List, Video, Film, Play, Music, HelpCircle
} from 'lucide-react';
import SignUpView from './SignUpView';
import OnboardingView from './OnboardingView';
import CanvasEditor from './CanvasEditor';
import DesignSystemView from './DesignSystemView';
import postibleLogo from './assets/postibel-logo.svg';

// Renders children into document.body to guarantee full-viewport overlay
const ModalPortal = ({ children }) => ReactDOM.createPortal(children, document.body);


// --- KONSTANTA GLOBAL ---
const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=600"
];

const MOCK_MODELS_DB = [
    {
        id: 1,
        name: "Siti (Barista)",
        role: "Karakter Utama Kedai",
        description: "Wanita Asia, 24 tahun, ramah, memakai apron cokelat",
        mainImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
        angles: [
            { id: 'front', label: 'Senyum Depan', image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" },
            { id: 'side', label: 'Profil Samping', image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300" },
            { id: 'pointing', label: 'Menunjuk', image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300" },
            { id: 'holding', label: 'Pegang Produk', image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" }
        ]
    },
    {
        id: 2,
        name: "Budi (Kasir)",
        role: "Staf Pria",
        description: "Pria Asia, 26 tahun, kacamata, kasual",
        mainImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
        angles: [
            { id: 'front', label: 'Senyum Depan', image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300" },
            { id: 'side', label: 'Profil Samping', image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
            { id: 'thinking', label: 'Berpikir', image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" },
        ]
    }
];

const COLOR_SCHEMAS = [
    { id: 'modern-tech', name: 'Modern Tech', colors: ['#2563EB', '#8B5CF6', '#F8FAFC'] },
    { id: 'forest-vibes', name: 'Forest Vibes', colors: ['#059669', '#22C55E', '#F8FAFC'] },
    { id: 'sunset-glow', name: 'Sunset Glow', colors: ['#F97316', '#F43F5E', '#FEF3C7'] },
    { id: 'royal-purple', name: 'Royal Purple', colors: ['#7C3AED', '#A855F7', '#FAF5FF'] },
    { id: 'ocean-breeze', name: 'Ocean Breeze', colors: ['#0891B2', '#14B8A6', '#ECFEFF'] },
    { id: 'corporate', name: 'Corporate', colors: ['#1E293B', '#64748B', '#F8FAFC'] },
    { id: 'warm-earth', name: 'Warm Earth', colors: ['#B45309', '#EA580C', '#FFEDD5'] },
    { id: 'neon-night', name: 'Neon Night', colors: ['#D946EF', '#06B6D4', '#0F172A'] },
    { id: 'cherry-blossom', name: 'Cherry Blossom', colors: ['#EC4899', '#FB7185', '#FDF2F8'] },
    { id: 'midnight-blue', name: 'Midnight Blue', colors: ['#1E3A8A', '#2563EB', '#E0F2FE'] },
    { id: 'lemon-lime', name: 'Lemon Lime', colors: ['#84CC16', '#4ADE80', '#FEF9C3'] },
    { id: 'monochrome', name: 'Monochrome', colors: ['#000000', '#71717A', '#FFFFFF'] },
];

const TYPOGRAPHY_PRESETS = [
    { id: 'modern-clean', label: 'Modern & Bersih', combo: { judul: 'bold', subJudul: 'modern', deskripsi: 'modern' } },
    { id: 'classic-elegant', label: 'Klasik Elegan', combo: { judul: 'elegant', subJudul: 'elegant', deskripsi: 'modern' } },
    { id: 'bold-impact', label: 'Tegas & Kuat', combo: { judul: 'bold', subJudul: 'bold', deskripsi: 'modern' } },
    { id: 'creative-mono', label: 'Kreatif & Unik', combo: { judul: 'mono', subJudul: 'modern', deskripsi: 'mono' } },
];

const DEFAULT_BRAND_DNA = {
    name: 'Kopi Nusantara',
    category: 'Kedai Kopi',
    colorSchema: 'ocean-breeze',
    primaryColor: '#0891B2',
    secondaryColor: '#14B8A6',
    tertiaryColor: '#ECFEFF',
    fontStyle: ['modern'],
    typography: {
        judul: 'bold',
        subJudul: 'modern',
        deskripsi: 'modern'
    },
    designStyle: ['minimal'],
    tone: 'friendly',
    logo: null
};

// Data Mock Bisnis Lainnya
const SECONDARY_BRAND_DNA = {
    name: 'Gaya Fashion',
    category: 'Pakaian & Fashion',
    colorSchema: 'sunset-glow',
    primaryColor: '#F97316',
    secondaryColor: '#F43F5E',
    tertiaryColor: '#FEF3C7',
    fontStyle: ['elegant'],
    typography: {
        judul: 'elegant',
        subJudul: 'elegant',
        deskripsi: 'modern'
    },
    designStyle: ['luxury'],
    tone: 'formal',
    logo: null
};

const MOCK_LIBRARY = [
    {
        id: 1,
        type: 'single',
        headline: 'Promo Akhir Pekan',
        body: 'Diskon 20% untuk semua produk.',
        image: MOCK_IMAGES[0],
        caption: 'Jangan lewatkan promo spesial akhir pekan ini! Langsung mampir ya. 🎉 #Promo #Diskon',
        designStyle: 'minimal',
        status: 'draft',
        goal: { name: 'Sales', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'Tag' }
    },
    {
        id: 2,
        type: 'single',
        headline: 'Menu Baru Spesial',
        body: 'Rasakan sensasi yang belum pernah ada.',
        image: MOCK_IMAGES[1],
        caption: 'Sudah cobain menu baru kita belum? Perpaduan rasanya dijamin bikin ketagihan! 🤤 #MenuBaru #WajibCoba',
        designStyle: 'bold',
        status: 'draft',
        goal: { name: 'Awareness', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: 'Eye' }
    },
    {
        id: 3,
        type: 'carousel',
        slides: [
            { headline: '3 Tips Penting', body: 'Tetap segar tanpa masalah perut', image: MOCK_IMAGES[2] },
            { headline: '1. Perut Terisi', body: 'Pastikan sarapan ringan sebelumnya', image: MOCK_IMAGES[3] },
            { headline: '2. Tambahkan Susu', body: 'Pilih opsi susu plant-based', image: MOCK_IMAGES[0] }
        ],
        caption: 'Punya masalah perut kembung tapi tetap ingin menikmati sajian kami? Cek tipsnya nih! Geser sampai habis ya 👉 #TipsBermanfaat',
        designStyle: 'soft',
        status: 'draft',
        goal: { name: 'Edukasi', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: 'Lightbulb' }
    },
    {
        id: 4,
        type: 'carousel',
        slides: [
            { headline: 'Koleksi Terlaris', body: 'Pilihan favorit pelanggan kami', image: MOCK_IMAGES[1] },
            { headline: 'Kualitas Premium', body: 'Dibuat dengan standar tertinggi', image: MOCK_IMAGES[2] },
            { headline: 'Pesan Sekarang', body: 'Stok terbatas, jangan sampai kehabisan', image: MOCK_IMAGES[3] }
        ],
        caption: 'Ini dia koleksi yang selalu jadi rebutan. Yuk amankan pesananmu sebelum kehabisan! 😍 #BestSeller #KoleksiPremium',
        designStyle: 'luxury',
        status: 'draft',
        goal: { name: 'Engagement', color: 'bg-pink-50 text-pink-600 border-pink-200', icon: 'MessageCircle' }
    }
];

const getFontClass = (fontId, defaultClass) => {
    const classes = {
        modern: 'font-sans font-medium',
        elegant: 'font-serif',
        bold: 'font-sans font-black tracking-tight',
        mono: 'font-mono'
    };
    return classes[fontId] || defaultClass;
};

// --- KOMPONEN TERPISAH ---

const InstagramPostMock = ({ post, brand, slideOverride = null, onSlideChange = null }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const isCarousel = post.type === 'carousel';
    const slides = isCarousel ? post.slides : [post];
    const currentIdx = slideOverride !== null ? slideOverride : activeSlide;
    const currentData = slides && slides[currentIdx] ? slides[currentIdx] : post;

    const handleNext = (e) => {
        e.stopPropagation();
        const nextIdx = (currentIdx + 1) % slides.length;
        if (onSlideChange) onSlideChange(nextIdx);
        else setActiveSlide(nextIdx);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        const prevIdx = (currentIdx - 1 + slides.length) % slides.length;
        if (onSlideChange) onSlideChange(prevIdx);
        else setActiveSlide(prevIdx);
    };

    const alignClass = {
        'left': 'items-start text-left',
        'center': 'items-center text-center',
        'right': 'items-end text-right'
    }[post.textAlign || 'center'];

    const judulClass = getFontClass(brand.typography?.judul, 'font-sans font-black tracking-tight');
    const subJudulClass = getFontClass(brand.typography?.subJudul, 'font-sans font-medium');
    const deskripsiClass = getFontClass(brand.typography?.deskripsi, 'font-sans font-medium');

    return (
        <div className="w-full max-w-[400px] bg-white flex flex-col shadow-sm rounded-lg overflow-hidden border border-slate-100 mx-auto relative" >
            <div className="flex items-center justify-between p-3 border-b border-slate-50" >
                <div className="flex items-center gap-2" >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-dark p-[2px]" >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-black" >
                            {brand.name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold">{brand.name.toLowerCase().replace(/\s+/g, '_')}</p>
                        <p className="text-[9px] text-slate-400">{brand.category}</p>
                    </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>
            <div className="w-full aspect-square relative overflow-hidden bg-slate-50">
                <img src={currentData.image || post.image} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" alt="Slide Content" />
                <div className="absolute inset-0 z-10" style={{ backgroundColor: brand.primaryColor, opacity: (post.overlayOpacity || 40) / 100 }} />
                <div className={`absolute inset-0 z-20 p-8 flex flex-col justify-center ${alignClass}`}>
                    <div className="mb-auto py-1 px-3 bg-white/20 backdrop-blur-md rounded border border-white/30 text-white text-[10px] font-black tracking-[0.2em] w-max">{brand.name.toUpperCase()}</div>
                    <div className="w-full space-y-2 drop-shadow-md">
                        <h2 className={`text-2xl md:text-3xl leading-tight text-white ${judulClass}`} style={{ color: brand.secondaryColor || '#fff' }}>{currentData.headline}</h2>
                        <p className={`text-sm md:text-base text-white/90 ${subJudulClass}`}>{currentData.body}</p>
                    </div>
                    <div className="mt-auto">
                        <div className={`px-6 py-2 rounded-full text-xs shadow-lg ${deskripsiClass} font-bold w-full max-w-[max-content] mx-auto`} style={{ backgroundColor: brand.secondaryColor || '#fff', color: brand.primaryColor || '#000' }}>
                            {isCarousel && slides && currentIdx === slides.length - 1 ? 'Hubungi Kami' : 'Cek Profil'}
                        </div>
                    </div>
                </div>
                {
                    isCarousel && slides && slides.length > 1 && (
                        <>
                            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all" > <ChevronLeft className="w-4 h-4" /> </button>
                            < button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all" > <ChevronRight className="w-4 h-4" /> </button>
                            < div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5" >
                                {slides.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${currentIdx === i ? 'w-4 bg-primary' : 'w-1.5 bg-white/50'}`} />)
                                }
                            </div>
                            < div className="absolute top-4 right-4 z-30 px-2 py-1 bg-black/40 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm" > {currentIdx + 1}/{slides.length}</div >
                        </>
                    )}
            </div>
            < div className="p-3" >
                <div className="flex items-center justify-between mb-3" >
                    <div className="flex items-center gap-4" > <Heart className="w-5 h-5" /> <MessageCircle className="w-5 h-5 -scale-x-100" /> <Send className="w-5 h-5" /> </div>
                    < Bookmark className="w-5 h-5" />
                </div>
                < p className="text-xs font-black mb-1" > 128 likes </p>
                < div className="text-xs text-slate-800" > <span className="font-black mr-2" > {brand.name.toLowerCase().replace(/\s+/g, '_')} </span><span className="whitespace-pre-wrap">{post.caption}</span > </div>
            </div>
        </div>
    );
};

const DashboardView = ({
    brandDNA,
    prompt, setPrompt,
    postType, setPostType,
    attachments, setAttachments,
    handleSimulateAttach, removeAttachment,
    handleGenerate
}) => {
    const [showImageMenu, setShowImageMenu] = useState(false);
    const [showModelPicker, setShowModelPicker] = useState(false);

    return (
        <div className="w-full animation-fade-in pb-24 md:pb-0" >

            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 md:pt-0" >
                <div className="text-center md:text-left" >
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-darker text-xs font-bold mb-3" >
                        <Sparkles className="w-3.5 h-3.5" /> AI Workspace
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Halo, Budi 👋
                    </h1>
                    <p className="text-slate-500 text-base max-w-lg mx-auto md:mx-0">
                        Mari buat desain luar biasa untuk <span className="font-semibold text-slate-800">{brandDNA.name}</span> hari ini.
                    </p>
                </div>
            </div>

            < div className="space-y-6" >
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50" >
                    <div className="relative bg-slate-50/80 rounded-[1.5rem] p-5 md:p-6 flex flex-col" >
                        <textarea
                            rows="2"
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-lg md:text-xl resize-none outline-none leading-relaxed mb-2 min-h-[60px] max-h-[200px] overflow-y-auto"
                            placeholder="Contoh: Buat postingan promo akhir pekan dengan diskon 20% untuk semua minuman..."
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (prompt.trim()) handleGenerate();
                                }
                            }}
                        />

                        {
                            attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4 pt-2" >
                                    {
                                        attachments.map(item => (
                                            <div key={item.id} className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-xl text-sm" >
                                                {item.type === 'image' && item.source === 'model' && <Camera className="w-4 h-4 text-purple-500" />}
                                                {item.type === 'image' && item.source !== 'model' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                                                {item.type === 'file' && <FileText className="w-4 h-4 text-orange-500" />}
                                                {item.type === 'link' && <Link2 className="w-4 h-4 text-green-500" />}
                                                < span className="text-slate-700 font-medium truncate max-w-[120px]" > {item.name} </span>
                                                < button onClick={() => removeAttachment(item.id)} className="ml-1 text-slate-400 hover:text-red-500 transition-colors" >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}

                        {
                            !prompt && (
                                <div className="flex flex-nowrap overflow-x-auto gap-2 pb-3 pt-1 [&::-webkit-scrollbar]:hidden" >
                                    {
                                        [
                                            { label: 'Promo Spesial', text: 'Buat postingan tentang promo spesial diskon produk', icon: <Tag className="w-3.5 h-3.5" /> },
                                            { label: 'Produk Baru', text: 'Buat postingan tentang peluncuran produk baru', icon: <Package className="w-3.5 h-3.5" /> },
                                            { label: 'Testimoni', text: 'Buat postingan testimoni dari pelanggan yang puas', icon: <Star className="w-3.5 h-3.5" /> },
                                            { label: 'Tips & Trik', text: 'Buat postingan edukasi membagikan tips dan trik', icon: <Lightbulb className="w-3.5 h-3.5" /> }
                                        ].map(idea => (
                                            <button
                                                key={idea.label}
                                                onClick={() => setPrompt(idea.text)}
                                                className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-white border border-slate-200 hover:border-primary hover:text-primary-dark hover:bg-primary/5 text-slate-600 px-3.5 py-2 rounded-full transition-all font-semibold shadow-sm"
                                            >
                                                <span className="text-primary" > {idea.icon} </span>
                                                {idea.label}
                                            </button>
                                        ))
                                    }
                                </div>
                            )}

                        <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-auto" >
                            <div className="flex items-center gap-1" >
                                <div className="relative" >
                                    <button
                                        onClick={() => setShowImageMenu(!showImageMenu)}
                                        className={`p-2 rounded-xl transition-all ${showImageMenu ? 'bg-slate-200/60 text-primary' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/40'}`}
                                        title="Tambahkan Gambar"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </button>

                                    {
                                        showImageMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowImageMenu(false)
                                                }> </div>
                                                < div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 z-50 animation-fade-in" >
                                                    <button
                                                        onClick={
                                                            () => {
                                                                handleSimulateAttach('image');
                                                                setShowImageMenu(false);
                                                            }
                                                        }
                                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left text-sm text-slate-700 font-medium"
                                                    >
                                                        <Upload className="w-4 h-4 text-slate-400" /> Upload Gambar Baru
                                                    </button>
                                                     < button
                                                        onClick={() => {
                                                            setShowImageMenu(false);
                                                            setShowModelPicker(true);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left text-sm text-slate-700 font-medium"
                                                    >
                                                        <Camera className="w-4 h-4 text-slate-400" /> Pilih dari Foto Model
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                </div>

                                < button onClick={() => handleSimulateAttach('file')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/40 rounded-lg transition-all" title="Lampirkan Dokumen" >
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                < button onClick={() => handleSimulateAttach('link')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/40 rounded-lg transition-all" title="Sertakan Tautan" >
                                    <Link2 className="w-5 h-5" />
                                </button>
                            </div>
                            < div className="text-[11px] font-bold text-slate-400 bg-slate-100/50 px-2 py-1 rounded-md" >
                                {prompt.length} / 500
                            </div>
                        </div>
                    </div>
                </div>

                {showModelPicker && (
                    <ModalPortal><div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animation-fade-in" onClick={() => setShowModelPicker(false)}>
                        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-primary" /> Pilih Foto Model
                                </h3>
                                <button onClick={() => setShowModelPicker(false)} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-primary-darker transition-all border border-slate-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
                                <p className="text-xs text-slate-500 font-medium">Pilih model yang ingin digunakan — AI akan menganalisis pose terbaik:</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {MOCK_MODELS_DB.map(model => (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                setAttachments(prev => [...prev, {
                                                    id: Date.now(),
                                                    type: 'image',
                                                    name: `${model.name}.jpg`,
                                                    source: 'model'
                                                }]);
                                                setShowModelPicker(false);
                                            }}
                                            className="group p-3 rounded-2xl border-2 border-slate-100 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                                        >
                                            <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100">
                                                <img src={model.mainImage} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            </div>
                                            <p className="font-bold text-sm text-slate-800">{model.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{model.role}</p>
                                            <p className="text-[10px] text-primary/70 mt-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI pilih pose terbaik</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div></ModalPortal>
                )}

                < div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 md:p-6" >
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2" >
                        <Layout className="w-4 h-4 text-primary" /> Format Konten
                    </h3>
                    < div className="grid grid-cols-2 gap-3" >
                        <button onClick={() => setPostType('single')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${postType === 'single' ? 'border-primary bg-primary/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3" >
                                <div className={`p-2 rounded-xl ${postType === 'single' ? 'bg-primary/20 text-primary-dark' : 'bg-slate-100 text-slate-500'}`}> <ImageIcon className="w-5 h-5" /> </div>
                                < div className="text-left" >
                                    <p className={`font-semibold text-sm ${postType === 'single' ? 'text-primary-darker' : 'text-slate-700'}`}> Satu Gambar </p>
                                    < p className="text-xs text-slate-500 mt-0.5" > Feed standar </p>
                                </div>
                            </div>
                            < div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${postType === 'single' ? 'border-primary' : 'border-slate-300'}`}> {postType === 'single' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}</div>
                        </button>
                        < button onClick={() => setPostType('carousel')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${postType === 'carousel' ? 'border-primary bg-primary/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3" >
                                <div className={`p-2 rounded-xl ${postType === 'carousel' ? 'bg-primary/20 text-primary-dark' : 'bg-slate-100 text-slate-500'}`}> <Layout className="w-5 h-5" /> </div>
                                < div className="text-left" >
                                    <p className={`font-semibold text-sm ${postType === 'carousel' ? 'text-primary-darker' : 'text-slate-700'}`}> Karosel </p>
                                    < p className="text-xs text-slate-500 mt-0.5" > Multi-slide </p>
                                </div>
                            </div>
                            < div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${postType === 'carousel' ? 'border-primary' : 'border-slate-300'}`}> {postType === 'carousel' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}</div>
                        </button>
                        < button onClick={() => setPostType('story')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${postType === 'story' ? 'border-primary bg-primary/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3" >
                                <div className={`p-2 rounded-xl ${postType === 'story' ? 'bg-primary/20 text-primary-dark' : 'bg-slate-100 text-slate-500'}`}> <Film className="w-5 h-5" /> </div>
                                < div className="text-left" >
                                    <p className={`font-semibold text-sm ${postType === 'story' ? 'text-primary-darker' : 'text-slate-700'}`}> Story </p>
                                    < p className="text-xs text-slate-500 mt-0.5" > Format 9:16 </p>
                                </div>
                            </div>
                            < div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${postType === 'story' ? 'border-primary' : 'border-slate-300'}`}> {postType === 'story' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}</div>
                        </button>
                        < button onClick={() => setPostType('thumbnail')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${postType === 'thumbnail' ? 'border-primary bg-primary/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                            <div className="flex items-center gap-3" >
                                <div className={`p-2 rounded-xl ${postType === 'thumbnail' ? 'bg-primary/20 text-primary-dark' : 'bg-slate-100 text-slate-500'}`}> <Video className="w-5 h-5" /> </div>
                                < div className="text-left" >
                                    <p className={`font-semibold text-sm ${postType === 'thumbnail' ? 'text-primary-darker' : 'text-slate-700'}`}> Thumbnail Reels </p>
                                    < p className="text-xs text-slate-500 mt-0.5" > Cover video </p>
                                </div>
                            </div>
                            < div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${postType === 'thumbnail' ? 'border-primary' : 'border-slate-300'}`}> {postType === 'thumbnail' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}</div>
                        </button>
                    </div>
                </div>

                < div className="pt-4 sticky bottom-20 md:static z-20" >
                    <button onClick={handleGenerate} disabled={!prompt.trim()} className="w-full bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold py-4 md:py-5 rounded-2xl transition-all shadow-primary disabled:shadow-none flex items-center justify-center gap-2 text-lg active:scale-[0.98]" >
                        <Sparkles className="w-6 h-6" /> Buat Desain Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

const GeneratingView = ({ brandDNA }) => (
    <div className="fixed inset-0 z-[180] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animation-fade-in">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center mb-10">
            <div className="absolute w-48 h-48 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="absolute w-36 h-36 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
            <div className="absolute w-24 h-24 rounded-full border-4 border-primary/30 animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-darker flex items-center justify-center shadow-[0_0_40px_rgba(19,200,236,0.5)]">
                <img src={postibleLogo} alt="Postibel" className="w-11 h-11 animate-bounce" />
            </div>
        </div>
        {/* Text */}
        <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">AI sedang merancang konten...</h2>
        <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-8">
            Menerapkan Brand DNA dari {brandDNA.name}, menganalisa instruksi, dan meracik desain terbaik.
        </p>
        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-darker rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
    </div>
);

const ResultsView = ({ generatedResults, setCurrentView, setPreviewPost, setEditingPost, handleSaveToLibrary, brandDNA }) => {
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    return (
    <div className="max-w-6xl mx-auto animation-fade-in pb-20 md:pb-0">
        {/* Hero Header */}
        <div className="relative mb-10 p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-primary/5 border border-primary/15 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-primary-sm shrink-0">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-2">
                            <Sparkles className="w-3 h-3" /> Berhasil dibuat
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Desain Selesai! 🎉</h1>
                        <p className="text-slate-500 mt-1 text-sm">Berikut {generatedResults.length} variasi desain berdasarkan instruksi Anda</p>
                    </div>
                </div>
                <button onClick={() => setShowConfirmReset(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 hover:border-primary/30 font-bold text-sm transition-all shadow-sm hover:shadow-md group">
                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" /> Buat Instruksi Baru
                </button>
            </div>
        </div>

        {/* Konfirmasi Reset Modal */}
        {showConfirmReset && ReactDOM.createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmReset(false)} />
                <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">Buat Instruksi Baru?</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        Semua hasil desain yang belum disimpan akan terhapus. Pastikan Anda sudah menyimpan desain yang diinginkan.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowConfirmReset(false)}
                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => { setShowConfirmReset(false); setCurrentView('dashboard'); }}
                            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm"
                        >
                            Ya, Hapus & Buat Baru
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {generatedResults.map((post, idx) => (
                <div key={post.id} className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col hover:-translate-y-1">
                    {/* Card Header */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-xs font-black text-primary-darker">{idx + 1}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opsi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPreviewPost(post)} className="p-2 rounded-xl bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary transition-all" title="Pratinjau Penuh">
                                <Eye className="w-4 h-4" />
                            </button>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-darker border border-primary/20 capitalize">
                                {post.type === 'carousel' ? 'Karosel' : post.type === 'video' ? 'Video' : 'Single'}
                            </span>
                        </div>
                    </div>

                    {/* Post Preview */}
                    <div className="px-4 pb-2 flex-1 flex justify-center">
                        <InstagramPostMock post={post} brand={brandDNA} />
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-3 grid grid-cols-2 gap-2">
                        <button onClick={() => { setEditingPost(post); setCurrentView('editor'); }} className="py-2.5 flex items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:border-slate-200 text-sm transition-all">
                            <Edit3 className="w-3.5 h-3.5" /> Edit Teks
                        </button>
                        <button onClick={() => handleSaveToLibrary(post)} className="py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-bold hover:from-primary-dark hover:to-primary-darker text-sm transition-all shadow-primary-sm hover:shadow-primary-lg">
                            <Download className="w-3.5 h-3.5" /> Simpan
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

const EditorView = ({ editingPost, setCurrentView, handleSaveToLibrary, brandDNA }) => {
    const [localPost, setLocalPost] = useState(editingPost || {});
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');

    if (!editingPost) return null;

    const isCarousel = localPost.type === 'carousel';
    const currentSlide = isCarousel && localPost.slides ? localPost.slides[activeSlideIdx] : localPost;

    const updateSlideContent = (key, val) => {
        if (isCarousel && localPost.slides) {
            const newSlides = [...localPost.slides];
            newSlides[activeSlideIdx] = { ...newSlides[activeSlideIdx], [key]: val };
            setLocalPost({ ...localPost, slides: newSlides });
        } else {
            setLocalPost({ ...localPost, [key]: val });
        }
    };

    return (
        <>
            {isScheduleModalOpen && (
                <ModalPortal>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsScheduleModalOpen(false)}></div>
                        <div className="bg-white rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl animation-fade-in-up">
                            <button onClick={() => setIsScheduleModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Jadwalkan Postingan</h3>
                            <p className="text-slate-500 mb-6">Mau di upload tanggal berapa?</p>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Tanggal</label>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setIsScheduleModalOpen(false)} className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</button>
                                <button
                                    onClick={() => {
                                        if (scheduleDate) {
                                            const updated = { ...localPost, scheduledDate: scheduleDate, status: 'scheduled' };
                                            setLocalPost(updated);
                                            setIsScheduleModalOpen(false);
                                            handleSaveToLibrary(updated);
                                        } else {
                                            alert('Pilih tanggal terlebih dahulu');
                                        }
                                    }}
                                    className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary transition-all"
                                >Simpan Jadwal</button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            <div className="max-w-5xl mx-auto animation-fade-in pb-20 md:pb-0 h-[calc(100vh-6rem)] md:h-auto overflow-y-auto">
                {/* ── Playful Header ── */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 px-4 md:px-0 gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentView('library')} className="p-3 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all border border-slate-100 shadow-sm">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-darker text-xs font-bold mb-1">
                                <Edit3 className="w-3 h-3" /> Editor Studio
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Konten ✨</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => alert('Fitur posting langsung ke Instagram sedang dalam pengembangan.')} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 transition-all text-sm shadow-sm hover:shadow-md">
                            <Send className="w-3.5 h-3.5" /> Posting
                        </button>
                        <button onClick={() => setIsScheduleModalOpen(true)} className="px-4 py-2.5 bg-white hover:bg-primary/5 border-2 border-primary/30 hover:border-primary text-primary-darker rounded-xl font-bold flex items-center gap-2 transition-all text-sm">
                            <Calendar className="w-3.5 h-3.5" /> Jadwalkan
                        </button>
                        <button onClick={() => handleSaveToLibrary(localPost)} className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white rounded-xl font-bold transition-all text-sm shadow-primary-sm hover:shadow-primary-lg flex items-center gap-2">
                            <Download className="w-3.5 h-3.5" /> Simpan
                        </button>
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-0 pb-10">

                    {/* Left: Canvas Preview */}
                    <div className="w-full lg:w-[55%] flex flex-col items-center">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                                        <Layers className="w-4 h-4 text-primary-darker" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Pratinjau Desain</span>
                                </div>
                                {localPost.goal && (
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${localPost.goal.color}`}>
                                        {localPost.goal.name}
                                    </span>
                                )}
                            </div>
                            <CanvasEditor post={localPost} brand={brandDNA} slideOverride={activeSlideIdx} />
                        </div>

                        {/* Carousel Slide Selector */}
                        {isCarousel && localPost.slides && (
                            <div className="mt-4 flex items-center gap-2 bg-white rounded-2xl border border-slate-100 p-2 shadow-sm">
                                {localPost.slides.map((slide, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveSlideIdx(i)}
                                        className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                            activeSlideIdx === i
                                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary-sm'
                                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                        }`}
                                    >
                                        {activeSlideIdx === i && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-primary rounded-full" />}
                                        Slide {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Edit Panel */}
                    <div className="w-full lg:w-[45%] space-y-4">
                        {/* Content Editor Card */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                                    <Type className="w-4 h-4 text-primary-darker" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Edit Teks {isCarousel ? `· Slide ${activeSlideIdx + 1}` : ''}</h3>
                                    <p className="text-xs text-slate-400">Ubah headline, body, dan caption</p>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Headline</label>
                                    <input
                                        type="text"
                                        value={currentSlide.headline || ''}
                                        onChange={(e) => updateSlideContent('headline', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 font-semibold placeholder-slate-400"
                                        placeholder="Tulis headline yang menarik..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sub-headline</label>
                                    <input
                                        type="text"
                                        value={currentSlide.body || ''}
                                        onChange={(e) => updateSlideContent('body', e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                        placeholder="Tambahkan sub-headline..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Caption Card */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 pb-4 border-b border-slate-100/80 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500/15 to-pink-500/5 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">Caption</h3>
                                    <p className="text-xs text-slate-400">Teks yang muncul di bawah postingan</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <textarea
                                    rows="5"
                                    value={localPost.caption || ''}
                                    onChange={(e) => setLocalPost({ ...localPost, caption: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 resize-none text-sm outline-none transition-all text-slate-800 placeholder-slate-400 leading-relaxed"
                                    placeholder="Tulis caption yang engaging..."
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-[11px] text-slate-400">{(localPost.caption || '').length} karakter</span>
                                    <button
                                        onClick={() => {
                                            if (localPost.caption) {
                                                navigator.clipboard.writeText(localPost.caption);
                                            }
                                        }}
                                        className="text-[11px] font-bold text-primary-darker hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3" /> Salin
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips Card */}
                        <div className="bg-gradient-to-br from-primary/5 to-primary-dark/5 rounded-[2rem] border border-primary/10 p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Lightbulb className="w-4 h-4 text-primary-darker" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 mb-1">Tips 💡</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Gunakan emoji di headline untuk menarik perhatian. Caption yang panjang 150-300 karakter biasanya mendapatkan engagement terbaik.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- DAY DETAIL MODAL ---
const DayDetailModal = ({ day, year, month, onClose, onEditPost, library, onGoToDashboard, onAddFromLibrary }) => {
    const [addMode, setAddMode] = useState(null); // null | 'choose' | 'bank'
    const [bankSearch, setBankSearch] = useState('');

    if (!day) return null;
    const dateLabel = new Date(year, month, day.dayNumber).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const categoryStyle = (cat) => {
        if (cat === 'Promo') return 'bg-pink-50 border-pink-200 text-pink-700';
        if (cat === 'Edukasi') return 'bg-yellow-50 border-yellow-200 text-yellow-700';
        if (cat === 'Testimoni') return 'bg-purple-50 border-purple-200 text-purple-700';
        return 'bg-blue-50 border-blue-200 text-blue-700';
    };

    const handleGoGenerate = () => {
        onClose();
        onGoToDashboard();
    };

    const handlePickFromBank = (post) => {
        onAddFromLibrary(post, { day: day.dayNumber, month, year });
        setAddMode(null);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

            {/* Modal Panel */}
            <div
                className="relative bg-white rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.2)] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animation-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
                    <div>
                        {addMode === 'bank' ? (
                            <>
                                <button
                                    onClick={() => setAddMode('choose')}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-2 transition-colors"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" /> Kembali
                                </button>
                                <h2 className="text-xl font-extrabold text-slate-900">Pilih dari Bank Konten</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Pilih konten yang ingin dijadwalkan ke {dateLabel}</p>
                            </>
                        ) : addMode === 'choose' ? (
                            <>
                                <button
                                    onClick={() => setAddMode(null)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 mb-2 transition-colors"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" /> Kembali
                                </button>
                                <h2 className="text-xl font-extrabold text-slate-900">Tambah Konten</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Pilih cara menambahkan konten ke {dateLabel}</p>
                            </>
                        ) : (
                            <>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-darker text-xs font-bold mb-2">
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    Jadwal Konten
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900 capitalize">{dateLabel}</h2>
                                <p className="text-sm text-slate-500 mt-0.5">{day.posts.length} konten dijadwalkan hari ini</p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body — switches between 3 panels */}
                <div className="overflow-y-auto flex-1 p-6">

                    {/* === PANEL: Choose mode === */}
                    {addMode === 'choose' && (
                        <div className="space-y-4 animation-fade-in">
                            {/* Option 1 — Generate */}
                            <button
                                onClick={handleGoGenerate}
                                className="w-full group flex items-center gap-5 p-5 bg-gradient-to-r from-primary/5 to-primary-dark/5 hover:from-primary/15 hover:to-primary-dark/15 border-2 border-primary/20 hover:border-primary/50 rounded-2xl transition-all text-left"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-slate-800 text-base">Generate dengan AI</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Buat konten baru dari awal menggunakan AI — Anda akan diarahkan ke halaman utama.</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                            </button>

                            {/* Option 2 — From Bank */}
                            <button
                                onClick={() => setAddMode('bank')}
                                className="w-full group flex items-center gap-5 p-5 bg-slate-50 hover:bg-white border-2 border-slate-100 hover:border-slate-300 rounded-2xl transition-all text-left"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Library className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-slate-800 text-base">Dari Bank Konten</p>
                                    <p className="text-sm text-slate-500 mt-0.5">Pilih konten yang sudah tersimpan di pustaka Anda untuk dijadwalkan ke hari ini.</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors flex-shrink-0" />
                            </button>
                        </div>
                    )}

                    {/* === PANEL: Bank Konten Picker === */}
                    {addMode === 'bank' && (
                        <div className="space-y-3 animation-fade-in">
                            {/* Search */}
                            <div className="relative flex items-center">
                                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={bankSearch}
                                    onChange={(e) => setBankSearch(e.target.value)}
                                    placeholder="Cari konten..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                                />
                            </div>
                            {(!library || library.length === 0) ? (
                                <div className="text-center py-12">
                                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Library className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="font-semibold text-slate-600">Bank konten masih kosong</p>
                                    <p className="text-sm text-slate-400 mt-1">Buat konten baru terlebih dahulu melalui menu Generate.</p>
                                </div>
                            ) : (() => {
                                const q = bankSearch.toLowerCase().trim();
                                const filtered = q ? library.filter(post =>
                                    (post.headline && post.headline.toLowerCase().includes(q)) ||
                                    (post.caption && post.caption.toLowerCase().includes(q)) ||
                                    (post.goal?.name && post.goal.name.toLowerCase().includes(q)) ||
                                    (post.type && post.type.toLowerCase().includes(q))
                                ) : library;
                                return filtered.length === 0 ? (
                                    <div className="text-center py-10">
                                        <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="font-semibold text-slate-600">Tidak ada konten ditemukan</p>
                                        <p className="text-sm text-slate-400 mt-1">Coba kata kunci lain</p>
                                    </div>
                                ) : filtered.map((post) => {
                                    const thumb = post.type === 'carousel' && post.slides ? post.slides[0].image : post.image;
                                    return (
                                        <div
                                            key={post.id}
                                            onClick={() => handlePickFromBank(post)}
                                            className="group flex items-center gap-4 p-3 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            {/* Thumbnail */}
                                            {thumb ? (
                                                <img src={thumb} alt="thumb" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-200" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                                </div>
                                            )}
                                            {/* Meta */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200 bg-slate-100 text-slate-500">
                                                        {post.type === 'carousel' ? 'Karosel' : 'Single'}
                                                    </span>
                                                    {post.goal && (
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${post.goal.color}`}>
                                                            {post.goal.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{post.headline || post.caption}</p>
                                                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.caption}</p>
                                            </div>
                                            {/* CTA */}
                                            <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Plus className="w-3.5 h-3.5" /> Jadwalkan
                                            </span>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    )}

                    {/* === PANEL: Day posts list === */}
                    {addMode === null && (
                        <div className="space-y-4">
                            {day.posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CalendarDays className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="font-semibold text-slate-600">Tidak ada konten di hari ini</p>
                                    <p className="text-sm text-slate-400 mt-1">Tambahkan konten dengan tombol di bawah.</p>
                                </div>
                            ) : (
                                day.posts.map((p) => (
                                    <div
                                        key={p.id}
                                        className="group flex gap-4 p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => { onEditPost(p); onClose(); }}
                                    >
                                        <div className={`w-1.5 flex-shrink-0 rounded-full ${p.category === 'Promo' ? 'bg-pink-400' : p.category === 'Edukasi' ? 'bg-yellow-400' : p.category === 'Testimoni' ? 'bg-purple-400' : 'bg-blue-400'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${categoryStyle(p.category)}`}>
                                                    {p.category}
                                                </span>
                                                {p.isApproved ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" /> Approved
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                                                        <Clock className="w-3 h-3" /> {p.selectedTime || p.recommendedTime}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                                                    {p.format === 'Carousel' ? <Layout className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                                    {p.format || (p.type === 'carousel' ? 'Carousel' : 'Single Image')}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{p.title}</h3>
                                            <p className="text-xs text-slate-500 mt-1 italic line-clamp-2 leading-relaxed">"{p.hook || p.caption}"</p>
                                        </div>
                                        <div className="flex-shrink-0 flex items-center">
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl">
                                                <Edit3 className="w-3.5 h-3.5" /> Edit
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                    >
                        Tutup
                    </button>
                    {addMode === null && (
                        <button
                            onClick={() => setAddMode('choose')}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white font-bold text-sm rounded-xl transition-all shadow-primary-sm hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus className="w-4 h-4" /> Tambah Konten
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const LibraryView = ({ library, setLibrary, setPreviewPost, setEditingPost, setCurrentView, brandDNA }) => {
    const [activeTab, setActiveTab] = useState('grid');
    const [isPlannerAlertVisible, setIsPlannerAlertVisible] = useState(true);
    const [isIgConnected, setIsIgConnected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [autoPostConfig, setAutoPostConfig] = useState({
        times: ['18:00']
    });


    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [selectedGoals, setSelectedGoals] = useState(['sales', 'engagement']);
    const goalDefaults = { sales: 12, entertain: 9, education: 6, branding: 5 };
    const [contentDistribution, setContentDistribution] = useState({ ...goalDefaults });
    const [isConnectWarningOpen, setIsConnectWarningOpen] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);        // dramatic loading overlay
    const [generatedPreviewPosts, setGeneratedPreviewPosts] = useState(null); // { planMonth, weeks }
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [previewDetailPost, setPreviewDetailPost] = useState(null); // for View Detail mini-modal

    // --- New AI Planner States ---
    const [monthPlan, setMonthPlan] = useState(null); // { id, month, weeks: [...] }
    const [plannerViewMode, setPlannerViewMode] = useState('monthly_grid'); // 'monthly_grid' | 'weekly_approval'
    const [activeWeek, setActiveWeek] = useState(1);
    // -----------------------------

    const [openActionMenuId, setOpenActionMenuId] = useState(null);
    const [isDraftingPlan, setIsDraftingPlan] = useState(false);
    const [editingPlannerPost, setEditingPlannerPost] = useState(null);

    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
    const [calendarViewType, setCalendarViewType] = useState('grid'); // 'grid' | 'list'
    const [calendarFilter, setCalendarFilter] = useState('Semua');
    const [selectedDayModal, setSelectedDayModal] = useState(null); // { day, year, month }
    const [isMonthScheduled, setIsMonthScheduled] = useState(false); // toggle jadwal bulan ini
    const [isScheduleConfirmOpen, setIsScheduleConfirmOpen] = useState(false);

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const currentViewMonthLabel = `${monthNames[currentCalendarDate.getMonth()]} ${currentCalendarDate.getFullYear()}`;
    const hasPlanForCurrentMonth = monthPlan && monthPlan.monthLabel === currentViewMonthLabel;

    if (editingPlannerPost) {
        return (
            <EditorView
                editingPost={editingPlannerPost}
                setCurrentView={() => setEditingPlannerPost(null)}
                handleSaveToLibrary={(saved) => {
                    setMonthPlan(prev => {
                        const newPlan = { ...prev };
                        newPlan.weeks = newPlan.weeks.map(w => ({
                            ...w,
                            posts: w.posts.map(p => p.id === saved.id ? saved : p)
                        }));
                        return newPlan;
                    });
                    setEditingPlannerPost(null);
                }}
                brandDNA={brandDNA}
            />
        );
    }


    const handleGenerateMonthPlan = () => {
        setIsGenerateModalOpen(false);
        setIsAILoading(true);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        setCurrentCalendarDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));

        // Simulasi hit API AI Generator (2.5 detik)
        setTimeout(() => {
            const monthNamesArr = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            const planMonth = `${monthNamesArr[startDate.getMonth()]} ${startDate.getFullYear()}`;

            const weeks = [];
            let globalPostId = 1;

            const CATEGORIES = ['Edukasi', 'Promo', 'Testimoni', 'Branding'];
            const CAT_EMOJIS = { 'Edukasi': '📚', 'Promo': '🔥', 'Testimoni': '⭐', 'Branding': '✨' };
            const MOCK_IMAGES = [
                'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=80&w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop'
            ];
            const FORMATS = ['Single Image', 'Carousel'];
            const HOOKS = ['Tahukah Anda...', 'Diskon Spesial!', 'Kata Mereka...', 'Kenali Lebih Dekat'];
            const CTAS = ['Simpan post ini', 'Klik link di bio', 'Baca selengkapnya', 'Bagikan ke teman'];
            const TIMES = ['09:00', '12:00', '15:00', '18:00', '20:00'];

            for (let w = 1; w <= 4; w++) {
                const posts = [];
                const postsThisWeek = 3;

                for (let p = 0; p < postsThisWeek; p++) {
                    const postDate = new Date(startDate);
                    postDate.setDate(startDate.getDate() + ((w - 1) * 7) + (p * 2));

                    const catIdx = (globalPostId - 1) % CATEGORIES.length;
                    const isCarousel = Math.random() > 0.5;

                    const titleText = `${CAT_EMOJIS[CATEGORIES[catIdx]]} ${CATEGORIES[catIdx]} — Minggu ${w}`;
                    const hookText = HOOKS[catIdx % HOOKS.length];
                    const ctaText = CTAS[catIdx % CTAS.length];
                    const newImage = MOCK_IMAGES[p % MOCK_IMAGES.length];

                    posts.push({
                        id: `autopilot_post_${globalPostId++}_${Date.now()}`,
                        date: postDate.toISOString(),
                        title: titleText,
                        category: CATEGORIES[catIdx],
                        format: isCarousel ? 'Carousel' : 'Single Image',
                        hook: hookText,
                        cta: ctaText,
                        status: 'draft',
                        recommendedTime: TIMES[Math.floor(Math.random() * TIMES.length)],
                        selectedTime: null,
                        type: isCarousel ? 'carousel' : 'single',
                        headline: titleText,
                        body: hookText,
                        image: isCarousel ? undefined : newImage,
                        slides: isCarousel ? [
                            { headline: titleText, body: hookText, image: newImage },
                            { headline: ctaText, body: 'Swipe for more', image: MOCK_IMAGES[(p + 1) % MOCK_IMAGES.length] }
                        ] : undefined,
                        caption: `${hookText}\n\n${ctaText}\n\n#${CATEGORIES[catIdx].toLowerCase()} #autopilot`,
                        designStyle: 'minimal'
                    });
                }

                weeks.push({ weekNumber: w, isApproved: false, isGenerating: false, posts });
            }

            // Store preview — don't save to calendar yet
            setGeneratedPreviewPosts({ planMonth, weeks });
            setIsAILoading(false);
            setIsResultsModalOpen(true);
        }, 2500);
    };

    // Called when user confirms 'Simpan' from preview modal
    const handleSaveGeneratedPlan = () => {
        if (!generatedPreviewPosts) return;
        const { planMonth, weeks: newWeeks } = generatedPreviewPosts;
        const newMonthPlan = {
            id: `monthplan_${Date.now()}`,
            monthLabel: planMonth,
            createdAt: new Date().toISOString(),
            weeks: newWeeks
        };
        setMonthPlan(prevPlan => {
            if (prevPlan && prevPlan.monthLabel === planMonth) {
                const mergedWeeks = newMonthPlan.weeks.map(newWeek => {
                    const existingWeek = prevPlan.weeks.find(w => w.weekNumber === newWeek.weekNumber);
                    if (existingWeek) {
                        return { ...newWeek, posts: [...existingWeek.posts, ...newWeek.posts] };
                    }
                    return newWeek;
                });
                const newWeekNumbers = newMonthPlan.weeks.map(w => w.weekNumber);
                const extraWeeks = prevPlan.weeks.filter(w => !newWeekNumbers.includes(w.weekNumber));
                return { ...newMonthPlan, weeks: [...mergedWeeks, ...extraWeeks] };
            }
            return newMonthPlan;
        });
        setIsResultsModalOpen(false);
        setGeneratedPreviewPosts(null);
        setPlannerViewMode('monthly_grid');
        setActiveTab('calendar');
    };

    // Draft = save without affecting calendar view state
    const handleSaveDraftPlan = () => {
        if (!generatedPreviewPosts) return;
        const { planMonth, weeks: newWeeks } = generatedPreviewPosts;
        const newMonthPlan = {
            id: `monthplan_draft_${Date.now()}`,
            monthLabel: planMonth,
            createdAt: new Date().toISOString(),
            weeks: newWeeks
        };
        setMonthPlan(prevPlan => {
            if (prevPlan && prevPlan.monthLabel === planMonth) {
                const mergedWeeks = newMonthPlan.weeks.map(newWeek => {
                    const existingWeek = prevPlan.weeks.find(w => w.weekNumber === newWeek.weekNumber);
                    if (existingWeek) return { ...newWeek, posts: [...existingWeek.posts, ...newWeek.posts] };
                    return newWeek;
                });
                const newWeekNumbers = newMonthPlan.weeks.map(w => w.weekNumber);
                const extraWeeks = prevPlan.weeks.filter(w => !newWeekNumbers.includes(w.weekNumber));
                return { ...newMonthPlan, weeks: [...mergedWeeks, ...extraWeeks] };
            }
            return newMonthPlan;
        });
        setIsResultsModalOpen(false);
        setGeneratedPreviewPosts(null);
    };

    const handleRegenerateSinglePost = (postId) => {
        setOpenActionMenuId(null);

        setTimeout(() => {
            const CATEGORIES = ['Tips', 'Promo', 'Testimoni', 'Branding'];

            // For monthPlan structure
            setMonthPlan(prev => {
                if (!prev) return prev;
                const newPlan = { ...prev };
                newPlan.weeks = newPlan.weeks.map(week => {
                    const postExists = week.posts.some(p => p.id === postId);
                    if (postExists) {
                        return {
                            ...week,
                            posts: week.posts.map(p => {
                                if (p.id === postId) {
                                    return {
                                        ...p,
                                        title: `${CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]} (Regenerated)`,
                                        format: Math.random() > 0.5 ? 'Carousel' : 'Single Image',
                                        hook: '🔥 Versi Baru!',
                                        cta: 'Simpan sekarang'
                                    };
                                }
                                return p;
                            })
                        };
                    }
                    return week;
                });
                return newPlan;
            });

            // For scheduled posts in library structure (if any)
            setLibrary(prev => prev.map(p => {
                if (p.id === postId) {
                    const newImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
                    return {
                        ...p,
                        headline: 'Ide Konten (Re-generate)',
                        body: 'Draf konten baru hasil sinkronisasi ulang dengan preferensi terkini.',
                        image: p.type === 'single' ? newImage : undefined,
                        slides: p.type === 'carousel' ? [
                            { headline: 'Slide 1 Baru', body: 'Teks baru', image: newImage },
                            { headline: 'Slide 2 Baru', body: 'Teks baru', image: MOCK_IMAGES[0] }
                        ] : undefined,
                        caption: '[Baru] Caption diperbarui oleh AI 🤖 #Update'
                    };
                }
                return p;
            }));

        }, 2000);
    };

    const handleApproveWeek = (weekNumber) => {
        // 1. Set week generating state to true
        setMonthPlan(prev => {
            if (!prev) return prev;
            const newPlan = { ...prev };
            newPlan.weeks = newPlan.weeks.map(w =>
                w.weekNumber === weekNumber ? { ...w, isGenerating: true } : w
            );
            return newPlan;
        });

        // 2. Simulate 3s API Generation Delay
        setTimeout(() => {
            // 3. Transform posts and push to library
            let generatedPosts = [];

            setMonthPlan(prev => {
                const newPlan = { ...prev };
                newPlan.weeks = newPlan.weeks.map(w => {
                    if (w.weekNumber === weekNumber) {
                        generatedPosts = w.posts.map((p) => {
                            const finalTime = p.selectedTime || p.recommendedTime;
                            const dateObj = new Date(p.date);
                            const [hours, mins] = finalTime.split(':');
                            if (hours && mins) dateObj.setHours(parseInt(hours), parseInt(mins), 0, 0);

                            return {
                                ...p,
                                id: `lib_${p.id}`,
                                plannerId: prev.id,
                                status: 'scheduled',
                                scheduledDate: dateObj.toISOString()
                            };
                        });

                        return {
                            ...w,
                            isApproved: true,
                            isGenerating: false,
                            posts: w.posts.map(p => ({ ...p, status: 'scheduled' }))
                        };
                    }
                    return w;
                });
                return newPlan;
            });

            // Update main library
            setLibrary(prev => [...generatedPosts, ...prev]);

            // Jump back to grid overview
            setPlannerViewMode('monthly_grid');
        }, 3000);
    };



    const handleUpdatePostTime = (postId, weekNumber, newTime) => {
        setMonthPlan(prev => {
            if (!prev) return prev;
            const newPlan = { ...prev };
            newPlan.weeks = newPlan.weeks.map(w => {
                if (w.weekNumber === weekNumber) {
                    return {
                        ...w,
                        posts: w.posts.map(p => p.id === postId ? { ...p, selectedTime: newTime } : p)
                    };
                }
                return w;
            });
            return newPlan;
        });
    };



    const handleConnectIg = () => setIsIgConnected(!isIgConnected);

    const formatDate = (dateObj) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };



    const renderGoalIcon = (iconName, className) => {
        if (iconName === 'Eye') return <Eye className={className} />;
        if (iconName === 'Tag') return <Tag className={className} />;
        if (iconName === 'MessageCircle') return <MessageCircle className={className} />;
        if (iconName === 'Lightbulb') return <Lightbulb className={className} />;
        return <Star className={className} />;
    };

    if (isDraftingPlan) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] animation-fade-in text-center px-4" >
                <div className="relative w-28 h-28 mb-8" >
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-0 border-4 border-primary/40 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center" >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-primary">
                            <Sparkles className="w-8 h-8 text-white animate-bounce" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Menganalisa & Menyusun Planner...</h2>
                <p className="text-slate-500 max-w-md text-sm">AI sedang merancang strategi konten bulanan terbaik untuk <span className="font-bold text-slate-700">{brandDNA?.name || 'bisnis Anda'}</span> ✨</p>
            </div>
        );
    }

    return (
        <>
            {openActionMenuId && (
                <div className="fixed inset-0 z-40" onClick={() => setOpenActionMenuId(null)}> </div>
            )}

             <div className="max-w-6xl mx-auto animation-fade-in pb-20 md:pb-0 px-4 md:px-0 relative" >
                {/* ── Playful Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Konten Post & Planner
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-darker border border-primary/20">
                                <Sparkles className="w-3 h-3" /> PRO
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 max-w-lg">Kelola semua desain, buat jadwal otomatis, dan posting langsung ke Instagram ✨</p>
                    </div>

                    {/* IG Settings Button */}
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-stretch bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all group h-[52px] self-start md:self-auto"
                    >
                        <div className={`flex items-center gap-2 px-4 py-2 border-r border-slate-100 ${isIgConnected ? 'bg-emerald-50/50' : 'bg-amber-50/80'}`}>
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                                <Instagram className="w-3 h-3 text-white" />
                            </div>
                            {isIgConnected ? (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide hidden lg:block">Terhubung</span>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide hidden lg:block">Belum Terhubung</span>
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                </div>
                            )}
                        </div>
                        <div className="px-5 flex items-center gap-2 font-bold text-sm text-slate-700 group-hover:text-primary transition-colors bg-white">
                            <Settings className="w-4 h-4" /> <span className="hidden sm:inline">Pengaturan</span>
                        </div>
                    </button>
                </div>

                {/* ── Tab Switcher ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex p-1.5 bg-white/80 backdrop-blur-sm rounded-2xl w-fit border border-slate-200/50 shadow-sm">
                        <button
                            onClick={() => { setActiveTab('grid'); }}
                            className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'grid' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                            <Layout className="w-4 h-4" /> <span>Bank Konten</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('calendar'); setIsPlannerAlertVisible(true); }}
                            className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                            <CalendarDays className="w-4 h-4" /> <span>Konten Planner</span>
                        </button>
                    </div>
                </div>

                {
                    activeTab === 'grid' && (
                        library.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm" >
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-3xl flex items-center justify-center mx-auto mb-5 rotate-3">
                                    <Library className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Pustaka Masih Kosong 📭</h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Mulai buat desain atau biarkan AI men-generate jadwal konten Anda secara otomatis.</p>
                                <button onClick={() => setCurrentView('dashboard')} className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold text-sm hover:from-primary-dark hover:to-primary-darker transition-all shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5 flex items-center gap-2 mx-auto">
                                    <Sparkles className="w-4 h-4" /> Buat Desain Baru
                                </button>
                            </div>
                        ) : (() => {
                            const filteredLibrary = library.filter(post => {
                                if (!searchQuery.trim()) return true;
                                const q = searchQuery.toLowerCase();
                                return (
                                    (post.headline && post.headline.toLowerCase().includes(q)) ||
                                    (post.caption && post.caption.toLowerCase().includes(q)) ||
                                    (post.body && post.body.toLowerCase().includes(q)) ||
                                    (post.goal?.name && post.goal.name.toLowerCase().includes(q)) ||
                                    (post.type && post.type.toLowerCase().includes(q))
                                );
                            });
                            return (
                                <div className="space-y-6">
                                    {/* Search Bar */}
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari konten berdasarkan judul, caption, atau tipe..."
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all text-sm text-slate-800 placeholder-slate-400 shadow-sm"
                                        />
                                    </div>


                                    {filteredLibrary.length === 0 ? (
                                        <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                                            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                            <p className="font-bold text-slate-600">Tidak ada konten ditemukan</p>
                                            <p className="text-sm text-slate-400 mt-1">Coba kata kunci lain</p>
                                        </div>
                                    ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" >
                                {
                                    filteredLibrary.map(post => {
                                        const displayImage = post.type === 'carousel' && post.slides ? post.slides[0].image : post.image;
                                        return (
                                            <div key={post.id} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col hover:-translate-y-1" >
                                                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100" >
                                                    <img src={displayImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Post" />

                                                    <div className="absolute top-3 left-3 flex flex-col gap-1.5" >
                                                        {post.status === 'scheduled' && (
                                                            <div className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] rounded-full backdrop-blur-md flex items-center gap-1.5 font-bold shadow-lg">
                                                                <Clock className="w-3 h-3" /> Terjadwal
                                                            </div>
                                                        )}
                                                        {post.goal && (
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${post.goal.color}`}>
                                                                {renderGoalIcon(post.goal.icon, "w-3 h-3")} {post.goal.name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-sm">
                                                            {post.type === 'carousel' ? <Layout className="w-3 h-3" /> : post.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                                            {post.type === 'carousel' ? 'Karosel' : post.type === 'video' ? 'Video' : 'Single'}
                                                        </span>
                                                    </div>

                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5 gap-2">
                                                        <button onClick={() => setPreviewPost(post)} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-transform shadow-lg">
                                                            <Eye className="w-3.5 h-3.5" /> Pratinjau
                                                        </button>
                                                        <button onClick={() => { setEditingPost(post); setCurrentView('editor'); }} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition-transform shadow-lg">
                                                            <Edit3 className="w-3.5 h-3.5" /> Edit
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-5 flex-1 flex flex-col">
                                                    <p className="text-sm text-slate-700 line-clamp-2 mb-4 flex-1 leading-relaxed">{post.caption}</p>
                                                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                                                        <span className="text-[11px] font-bold text-slate-400">{post.status === 'scheduled' ? formatDate(post.scheduledDate) : '💾 Tersimpan'}</span>
                                                        <button className={`p-2 rounded-xl transition-all ${isIgConnected ? 'text-slate-400 hover:text-pink-500 hover:bg-pink-50' : 'text-slate-300 cursor-not-allowed'}`} title={isIgConnected ? "Posting ke IG" : "Hubungkan IG terlebih dahulu"}>
                                                            <Instagram className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                                    )}
                                </div>
                            );
                        })()
                    )}


                {activeTab === 'calendar' && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]" >
                        <div className="animation-fade-in" >
                            {plannerViewMode === 'monthly_grid' ? (
                                // --- MONTHLY GRID VIEW ---
                                <div>
                                    {/* Planner Header */}
                                    <div className="p-6 md:p-8 pb-0">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-2xl p-1 shadow-sm">
                                                    <button
                                                        onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
                                                        className="p-2.5 hover:bg-white hover:text-primary text-slate-400 hover:shadow-sm rounded-xl transition-all"
                                                        title="Bulan Sebelumnya"
                                                    ><ChevronLeft className="w-5 h-5" /></button>
                                                    <h2 className="text-xl font-black text-slate-800 px-5 min-w-[180px] text-center tracking-tight">
                                                        {currentCalendarDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                    </h2>
                                                    <button
                                                        onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
                                                        className="p-2.5 hover:bg-white hover:text-primary text-slate-400 hover:shadow-sm rounded-xl transition-all"
                                                        title="Bulan Berikutnya"
                                                    ><ChevronRight className="w-5 h-5" /></button>
                                                </div>
                                                <button
                                                    onClick={() => setCurrentCalendarDate(new Date())}
                                                    className="px-4 py-2.5 bg-slate-50 border border-slate-200/80 text-slate-600 font-bold text-sm rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all hidden sm:flex items-center gap-1.5"
                                                >
                                                    <CalendarDays className="w-3.5 h-3.5" /> Hari Ini
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {isMonthScheduled ? (
                                                    <button
                                                        onClick={() => setIsMonthScheduled(false)}
                                                        className="px-4 py-2.5 bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Batalkan Jadwal
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setIsGenerateModalOpen(true)} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white shadow-primary-sm rounded-xl font-bold text-xs transition-all flex items-center gap-2 hover:-translate-y-0.5" >
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            {hasPlanForCurrentMonth ? 'Tambahkan Konten AI' : 'Generate Konten Plan'}
                                                        </button>
                                                        {hasPlanForCurrentMonth && (
                                                            <button
                                                                onClick={() => {
                                                                    if (!isIgConnected) {
                                                                        setIsConnectWarningOpen(true);
                                                                    } else {
                                                                        setIsScheduleConfirmOpen(true);
                                                                    }
                                                                }}
                                                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 rounded-xl font-bold text-xs transition-all flex items-center gap-2 hover:-translate-y-0.5"
                                                            >
                                                                <CalendarDays className="w-3.5 h-3.5" /> Jadwalkan
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                                                    <button
                                                        onClick={() => setCalendarViewType('grid')}
                                                        className={`p-2 rounded-lg transition-all ${calendarViewType === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                    ><Layout className="w-4 h-4" /></button>
                                                    <button
                                                        onClick={() => setCalendarViewType('list')}
                                                        className={`p-2 rounded-lg transition-all ${calendarViewType === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                    ><List className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATUS CARD */}
                                    <div className="px-6 md:px-8">
                                    {isPlannerAlertVisible && !hasPlanForCurrentMonth && !isMonthScheduled && (
                                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/[0.06] to-primary-dark/[0.04] border border-primary/15 rounded-2xl w-full mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <CalendarDays className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-700 text-sm block">Belum Ada Rencana Konten</span>
                                                    <span className="text-slate-500 text-xs hidden sm:block">Kalender kosong bulan ini. Gunakan AI untuk generate rencana konten otomatis 🚀</span>
                                                </div>
                                            </div>
                                            <button onClick={() => setIsPlannerAlertVisible(false)} className="p-2 hover:bg-primary/10 rounded-xl text-slate-400 hover:text-primary-darker transition-colors" title="Tutup">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    </div>

                                    <div className="p-6 md:p-8 pt-4">
                                    {(() => {
                                        const allPosts = [];
                                        if (hasPlanForCurrentMonth) {
                                            monthPlan.weeks.forEach(w => {
                                                w.posts.forEach(p => {
                                                    if (calendarFilter === 'Semua' || p.category === calendarFilter) {
                                                        allPosts.push({ ...p, weekNumber: w.weekNumber, isApproved: w.isApproved });
                                                    }
                                                });
                                            });
                                        }

                                        const year = currentCalendarDate.getFullYear();
                                        const month = currentCalendarDate.getMonth();

                                        const firstDayOfMonth = new Date(year, month, 1).getDay();
                                        const daysInMonth = new Date(year, month + 1, 0).getDate();

                                        const calendarDays = [];
                                        for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push({ isEmpty: true });

                                        for (let i = 1; i <= daysInMonth; i++) {
                                            const dayPosts = allPosts.filter(p => {
                                                const pd = new Date(p.date);
                                                return pd.getDate() === i && pd.getMonth() === month && pd.getFullYear() === year;
                                            });

                                            let weekRef = dayPosts.length > 0 ? dayPosts[0].weekNumber : Math.min(4, Math.ceil(i / 7));

                                            calendarDays.push({
                                                isEmpty: false,
                                                dayNumber: i,
                                                posts: dayPosts,
                                                weekNumber: weekRef
                                            });
                                        }

                                        if (calendarViewType === 'list') {
                                            const validListDays = calendarDays.filter(d => !d.isEmpty && d.posts.length > 0);
                                            return (
                                                <div className="space-y-6 mt-4">
                                                    {validListDays.map(day => (
                                                        <div key={`list-d${day.dayNumber}`} className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 hover:border-primary/30 transition-colors shadow-sm">
                                                            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                                                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                                    <CalendarDays className="w-4 h-4 text-slate-400" />
                                                                    {new Date(year, month, day.dayNumber).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveWeek(day.weekNumber);
                                                                        setPlannerViewMode('weekly_approval');
                                                                    }}
                                                                    className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
                                                                >
                                                                    Review Minggu {day.weekNumber}
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                                {day.posts.map(p => (
                                                                    <div
                                                                        key={p.id}
                                                                        onClick={() => setEditingPlannerPost(p)}
                                                                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group
                                                                                    ${p.isApproved ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-primary/30'}
                                                                                `}
                                                                    >
                                                                        <div>
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full
                                                                                            ${p.category === 'Promo' ? 'bg-pink-50 text-pink-600' :
                                                                                        p.category === 'Edukasi' ? 'bg-yellow-50 text-yellow-700' :
                                                                                            'bg-blue-50 text-blue-600'}
                                                                                        `}>
                                                                                    {p.category}
                                                                                </span>
                                                                                {p.isApproved ? (
                                                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                                                        <CheckCircle2 className="w-3 h-3" /> Approved
                                                                                    </span>
                                                                                ) : (
                                                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                                                        <Clock className="w-3 h-3" /> {p.selectedTime || p.recommendedTime}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <h3 className="font-bold text-slate-800 text-base line-clamp-2">{p.title}</h3>
                                                                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 italic leading-relaxed">"{p.hook}"</p>
                                                                        </div>

                                                                        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500">
                                                                            <span className="flex items-center gap-1">{p.format === 'Carousel' ? <Layout className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}{p.format}</span>
                                                                            <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 className="w-3.5 h-3.5" /> Edit</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {validListDays.length === 0 && (
                                                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                                                <Search className="w-5 h-5" />
                                                            </div>
                                                            <h3 className="text-base font-bold text-slate-700 mb-1">Tidak Ada Konten</h3>
                                                            <p className="text-sm text-slate-500">Tidak ada postingan dengan kategori '{calendarFilter}' di bulan ini.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        const now = new Date(); // To check today
                                        return (
                                            <div className="mt-6 animation-fade-in">
                                                {/* Header Hari */}
                                                <div className="grid grid-cols-7 gap-3 mb-3">
                                                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                                        <div key={day} className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Grid Kalender */}
                                                <div className="grid grid-cols-7 gap-3">
                                                    {calendarDays.map((day, idx) => {
                                                        const isToday = !day.isEmpty && day.dayNumber === now.getDate() && month === now.getMonth() && year === now.getFullYear();

                                                        return (
                                                            <div
                                                                key={`cal-${idx}`}
                                                                onClick={() => {
                                                                    if (!day.isEmpty) {
                                                                        setSelectedDayModal({ day, year, month });
                                                                    }
                                                                }}
                                                                className={`min-h-[120px] lg:min-h-[150px] p-3 h-full flex flex-col relative rounded-[1.5rem] transition-all duration-300 ${!day.isEmpty ? 'bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 cursor-pointer group' : 'bg-transparent'}`}
                                                            >
                                                                {!day.isEmpty && (
                                                                    <>
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${isToday ? 'bg-primary text-white shadow-lg shadow-primary' : 'text-slate-600 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                                                                {day.dayNumber}
                                                                            </span>
                                                                            {day.posts.length > 0 && (
                                                                                <div className="flex flex-col gap-1 items-end mt-1.5">
                                                                                    <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-primary/10 text-[9px] font-black uppercase text-slate-500 group-hover:text-primary transition-colors">
                                                                                        {day.posts.length} Post
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="space-y-2 flex-1 w-full flex flex-col justify-end">
                                                                            {day.posts.map(p => (
                                                                                <div
                                                                                    key={p.id}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setSelectedDayModal({ day, year, month });
                                                                                    }}
                                                                                    className={`text-[10px] p-2.5 rounded-xl border text-left leading-tight transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md z-10 relative cursor-pointer
                                                                                                ${p.category === 'Promo' ? 'bg-pink-50/50 border-pink-200 text-pink-700 hover:bg-pink-50' :
                                                                                            p.category === 'Edukasi' ? 'bg-yellow-50/50 border-yellow-200 text-yellow-700 hover:bg-yellow-50' :
                                                                                                'bg-blue-50/50 border-blue-200 text-blue-700 hover:bg-blue-50'}
                                                                                                ${p.isApproved ? 'opacity-80 border-dashed hover:opacity-100' : ''}
                                                                                            `}
                                                                                    title={p.title}
                                                                                >
                                                                                    <div className="font-bold truncate text-slate-800">{p.title}</div>
                                                                                    <div className="truncate opacity-70 mt-1 font-medium">{p.hook}</div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Day Detail Modal */}
                                    {selectedDayModal && (
                                        <ModalPortal>
                                            <DayDetailModal
                                                day={selectedDayModal.day}
                                                year={selectedDayModal.year}
                                                month={selectedDayModal.month}
                                                onClose={() => setSelectedDayModal(null)}
                                                onEditPost={(p) => setEditingPlannerPost(p)}
                                                library={library}
                                                onGoToDashboard={() => { setSelectedDayModal(null); setCurrentView('dashboard'); }}
                                                onAddFromLibrary={(post, dateInfo) => {
                                                    const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
                                                    const targetMonthLabel = `${MONTH_NAMES[dateInfo.month]} ${dateInfo.year}`;
                                                    const scheduledDate = new Date(dateInfo.year, dateInfo.month, dateInfo.day, 12, 0, 0);
                                                    const weekNumber = Math.ceil(dateInfo.day / 7);
                                                    const newEntry = {
                                                        ...post,
                                                        id: `scheduled_${post.id}_${Date.now()}`,
                                                        status: 'scheduled',
                                                        scheduledDate: scheduledDate.toISOString(),
                                                        date: scheduledDate.toISOString(),
                                                        title: post.headline || post.caption || 'Konten Terjadwal',
                                                        category: post.goal?.name || 'Branding',
                                                        format: post.type === 'carousel' ? 'Carousel' : post.type === 'video' ? 'Video' : 'Single Image',
                                                        hook: post.caption || '',
                                                        recommendedTime: '12:00',
                                                        selectedTime: null,
                                                    };
                                                    setMonthPlan(prev => {
                                                        // Jika tidak ada plan atau plan untuk bulan berbeda → buat plan baru
                                                        if (!prev || prev.monthLabel !== targetMonthLabel) {
                                                            return {
                                                                id: `monthplan_manual_${Date.now()}`,
                                                                monthLabel: targetMonthLabel,
                                                                createdAt: new Date().toISOString(),
                                                                weeks: [
                                                                    { weekNumber, isApproved: false, isGenerating: false, posts: [newEntry] }
                                                                ]
                                                            };
                                                        }
                                                        // Plan sudah ada untuk bulan ini → cari minggu yang sesuai
                                                        const newPlan = { ...prev };
                                                        const targetWeekIdx = newPlan.weeks.findIndex(w => w.weekNumber === weekNumber);
                                                        if (targetWeekIdx >= 0) {
                                                            // Masukkan ke minggu yang sudah ada
                                                            newPlan.weeks = newPlan.weeks.map((w, i) =>
                                                                i === targetWeekIdx ? { ...w, posts: [...w.posts, newEntry] } : w
                                                            );
                                                        } else {
                                                            // Buat minggu baru di plan yang ada
                                                            newPlan.weeks = [...newPlan.weeks, { weekNumber, isApproved: false, isGenerating: false, posts: [newEntry] }];
                                                        }
                                                        return newPlan;
                                                    });
                                                    setSelectedDayModal(null);
                                                }}
                                            />
                                        </ModalPortal>
                                    )}
                                    })()}
                                    </div>
                                </div>
                            ) : (
                                // --- WEEKLY APPROVAL VIEW ---
                                <div className="space-y-6">
                                    {(() => {
                                        const weekData = monthPlan.weeks.find(w => w.weekNumber === activeWeek);
                                        if (!weekData) return null;

                                        return (
                                            <>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10 pt-2" >
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => setPlannerViewMode('monthly_grid')} className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors">
                                                            <ChevronLeft className="w-5 h-5" />
                                                        </button>
                                                        <div>
                                                            <h2 className="text-xl font-bold text-slate-800" > Approval Minggu {activeWeek} </h2>
                                                            <p className="text-sm text-slate-500">Periksa topik dan format yang disiapkan AI.</p>
                                                        </div>
                                                    </div>

                                                    {!weekData.isApproved && !weekData.isGenerating && (
                                                        <button
                                                            onClick={() => handleApproveWeek(activeWeek)}
                                                            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-primary shadow-lg flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" /> Setujui Semua
                                                        </button>
                                                    )}
                                                </div>

                                                {weekData.isGenerating && (
                                                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm my-8">
                                                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                                        <div>
                                                            <h4 className="font-bold text-blue-800 text-lg">AI Sedang Bekerja...</h4>
                                                            <p className="text-blue-600/80 text-sm max-w-md mx-auto mt-1">Sistem sedang merancang puluhan grafis, menulis caption persuasif, dan menjadwalkan ke Instagram.</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {!weekData.isGenerating && (
                                                    <div className="space-y-4 border-l-2 border-slate-100 ml-4 md:ml-8 pl-6 md:pl-8 pb-4 relative">
                                                        {weekData.posts.map((post) => {
                                                            const dateObj = new Date(post.date);
                                                            const isDraft = !weekData.isApproved;
                                                            return (
                                                                <div key={`wp-${post.id}`} className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary/50 hover:shadow-md transition-all group">
                                                                    <div className="absolute -left-[35px] md:-left-[43px] top-6 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-sm" ></div>

                                                                    <div className="flex flex-col lg:flex-row gap-5">
                                                                        <div className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-2 lg:gap-0 lg:border-r border-slate-100 pr-4">
                                                                            <div>
                                                                                <div className="text-lg font-black text-slate-800">{dateObj.toLocaleDateString('id-ID', { weekday: 'long' })}</div>
                                                                                <div className="text-sm font-bold text-slate-400">{dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                                                                            </div>

                                                                            <div className="mt-0 lg:mt-4 space-y-2 flex flex-row lg:flex-col gap-2 lg:gap-0">
                                                                                {isDraft ? (
                                                                                    <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center">
                                                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rekomendasi</div>
                                                                                        <input
                                                                                            type="time"
                                                                                            className="bg-transparent text-primary font-bold text-sm outline-none w-full text-center"
                                                                                            defaultValue={post.selectedTime || post.recommendedTime}
                                                                                            onChange={(e) => handleUpdatePostTime(post.id, activeWeek, e.target.value)}
                                                                                        />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-2 rounded-xl text-center">
                                                                                        <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Terjadwal</div>
                                                                                        <div className="font-bold text-sm flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> {post.selectedTime || post.recommendedTime}</div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex-1 space-y-3">
                                                                            <div className="flex flex-wrap items-center gap-2">
                                                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${post.category === 'Promo' ? 'bg-pink-50 text-pink-600 border-pink-200' : post.category === 'Edukasi' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                                                    {post.category}
                                                                                </span>
                                                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                                                                                    {post.format === 'Carousel' ? <Layout className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                                                                                    {post.format}
                                                                                </span>
                                                                            </div>

                                                                            <div>
                                                                                <h3 className="font-bold text-slate-800 text-base">{post.title}</h3>
                                                                                <p className="text-sm text-slate-500 mt-1"><span className="font-semibold text-slate-700">Hook:</span> "{post.hook}"</p>
                                                                                <p className="text-sm border-l-2 border-slate-200 pl-3 mt-2 text-slate-600 italic">CTA: {post.cta}</p>
                                                                            </div>
                                                                        </div>

                                                                        {isDraft && (
                                                                            <div className="lg:pl-4 shrink-0 flex lg:flex-col justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                                                                                <button
                                                                                    onClick={() => setPreviewPost(post)}
                                                                                    className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-dark text-xs font-bold rounded-xl border border-primary/20 transition-colors flex items-center gap-1.5"
                                                                                >
                                                                                    <Eye className="w-3.5 h-3.5" /> Preview
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditingPlannerPost(post)}
                                                                                    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                                                                                >
                                                                                    <Edit3 className="w-3.5 h-3.5" /> Edit Konten
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleRegenerateSinglePost(post.id)}
                                                                                    className="px-3 py-2 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                                                                                >
                                                                                    <RefreshCw className="w-3.5 h-3.5" /> Ganti Topik
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {
                    isSettingsOpen && (
                        <ModalPortal>
                            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animation-fade-in" >
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} > </div>
                                <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" >
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-20" >
                                        <div className="flex items-center gap-3" >
                                            <div className="p-2 bg-primary/10 text-primary-darker rounded-lg" > <Settings className="w-5 h-5" /> </div>
                                            <h3 className="font-bold text-lg text-slate-800">Pengaturan</h3>
                                        </div>
                                        <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors" > <X className="w-5 h-5" /> </button>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 overflow-y-auto space-y-8 bg-slate-50/50 flex-1" >
                                        {/* Koneksi Akun */}
                                        <div className="space-y-3" >
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" > Koneksi Akun </label>
                                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between" >
                                                <div className="flex items-center gap-3" >
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white shadow-sm" >
                                                        <Instagram className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800" > Instagram </p>
                                                        <p className={`text-xs font-semibold ${isIgConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                            {isIgConnected ? 'Terhubung (AkunBisnis)' : 'Belum Terhubung'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleConnectIg}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isIgConnected ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-slate-200 bg-slate-900 text-white hover:bg-slate-800'}`}
                                                >
                                                    {isIgConnected ? 'Putuskan' : 'Hubungkan'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Waktu Posting — Dynamic list */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Posting Standar</label>
                                                {autoPostConfig.times.length < 3 && (
                                                    <button
                                                        onClick={() => setAutoPostConfig(prev => ({ ...prev, times: [...prev.times, '12:00'] }))}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-primary-darker bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Tambah Waktu
                                                    </button>
                                                )}
                                            </div>
                                            <div className="space-y-2.5">
                                                {autoPostConfig.times.map((t, idx) => (
                                                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                                                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                        <input
                                                            type="time"
                                                            value={t}
                                                            onChange={(e) => setAutoPostConfig(prev => {
                                                                const updated = [...prev.times];
                                                                updated[idx] = e.target.value;
                                                                return { ...prev, times: updated };
                                                            })}
                                                            className="flex-1 bg-transparent font-bold text-slate-800 outline-none text-base"
                                                        />
                                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0">WIB</span>
                                                        {autoPostConfig.times.length > 1 && (
                                                            <button
                                                                onClick={() => setAutoPostConfig(prev => ({ ...prev, times: prev.times.filter((_, i) => i !== idx) }))}
                                                                className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-tight">Maksimal 3 waktu posting per hari. Konten akan dijadwalkan di waktu-waktu ini.</p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-6 border-t border-slate-100 bg-white" >
                                        <button
                                            onClick={() => setIsSettingsOpen(false)}
                                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-primary hover:shadow-primary-lg hover:-translate-y-0.5"
                                        >
                                            Simpan Pengaturan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ModalPortal>
                    )
                }

                {
                    isGenerateModalOpen && (
                        <ModalPortal>
                            <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 animation-fade-in" >
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGenerateModalOpen(false)} > </div>
                                <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col" >
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0" >
                                        <div className="flex items-center gap-3" >
                                            <div className="p-2 bg-primary/10 text-primary-darker rounded-xl" > <Sparkles className="w-5 h-5" /> </div>
                                            <h3 className="font-bold text-lg text-slate-800" > Generate Konten bulan {currentCalendarDate.toLocaleDateString('id-ID', { month: 'long' })} </h3>
                                        </div>
                                        <button onClick={() => setIsGenerateModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors" > <X className="w-5 h-5" /> </button>
                                    </div>

                                    <div className="p-6 bg-slate-50/50 space-y-6 overflow-y-auto flex-1" >
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Tujuan Bulan ini (Pilih lebih dari satu)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { key: 'sales', emoji: '🔥', label: 'Jualan lebih banyak' },
                                                    { key: 'growth', emoji: '📈', label: 'Naikkan followers' },
                                                    { key: 'engagement', emoji: '❤️', label: 'Tingkatkan engagement' },
                                                    { key: 'branding', emoji: '🏷', label: 'Bangun branding' },
                                                ].map(g => (
                                                    <label key={g.key} className={`flex items-center gap-3 p-3 bg-white border rounded-xl cursor-pointer transition-all ${selectedGoals.includes(g.key) ? 'border-primary shadow-sm' : 'border-slate-200 hover:border-primary'}`}>
                                                        <input type="checkbox" className="accent-[#13c8ec] w-4 h-4 rounded text-primary focus:ring-primary"
                                                            checked={selectedGoals.includes(g.key)}
                                                            onChange={() => {
                                                                setSelectedGoals(prev => prev.includes(g.key) ? prev.filter(x => x !== g.key) : [...prev, g.key]);
                                                            }}
                                                        />
                                                        <span className="text-sm font-semibold text-slate-700">{g.emoji} {g.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedGoals.length > 0 && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Konten per Bulan (berdasarkan goals)</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {selectedGoals.map(key => {
                                                        const info = { sales: { emoji: '🔥', label: 'Sales' }, growth: { emoji: '📈', label: 'Growth' }, engagement: { emoji: '❤️', label: 'Engagement' }, branding: { emoji: '🏷', label: 'Branding' } }[key];
                                                        return (
                                                            <div key={key} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                                                                <span className="text-lg">{info.emoji}</span>
                                                                <div className="flex-1">
                                                                    <span className="text-xs font-semibold text-slate-500">{info.label}</span>
                                                                </div>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    value={contentDistribution[key] || 0}
                                                                    onChange={e => setContentDistribution(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                                                                    className="w-14 text-center p-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-xs text-slate-400 text-right">Total: <span className="font-bold text-slate-600">{selectedGoals.reduce((sum, k) => sum + (contentDistribution[k] || 0), 0)} konten</span></p>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Intensitas Posting</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <label className="flex flex-col items-center justify-center p-3 text-center bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary transition-colors relative">
                                                    <input type="radio" name="intensity" className="absolute top-2 right-2 accent-[#13c8ec]" />
                                                    <span className="text-sm font-bold text-slate-700 mt-2">3x per minggu</span>
                                                </label>
                                                <label className="flex flex-col items-center justify-center p-3 text-center bg-white border border-primary shadow-sm rounded-xl cursor-pointer transition-colors relative">
                                                    <input type="radio" name="intensity" className="absolute top-2 right-2 accent-[#13c8ec]" defaultChecked />
                                                    <span className="text-sm font-bold text-slate-700 mt-2">4x per minggu</span>
                                                </label>
                                                <label className="flex flex-col items-center justify-center p-3 text-center bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-primary transition-colors relative">
                                                    <input type="radio" name="intensity" className="absolute top-2 right-2 accent-[#13c8ec]" />
                                                    <span className="text-sm font-bold text-slate-700 mt-2">5x per minggu</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Optional: Tambah Tanggal Penting</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 17 Agustus (Promo Kemerdekaan)..."
                                                className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none text-sm text-slate-700"
                                            />
                                        </div>

                                        <button
                                            onClick={() => handleGenerateMonthPlan({})}
                                            className="w-full text-center p-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark hover:shadow-xl hover:shadow-primary hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
                                        >
                                            <CalendarDays className="w-5 h-5" /> Generate Konten Bulan ini
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ModalPortal>
                    )
                }


                {/* === DRAMATIC AI LOADING OVERLAY === */}
                {isAILoading && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[180] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animation-fade-in">
                            {/* Animated rings */}
                            <div className="relative flex items-center justify-center mb-10">
                                <div className="absolute w-48 h-48 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }}></div>
                                <div className="absolute w-36 h-36 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
                                <div className="absolute w-24 h-24 rounded-full border-4 border-primary/30 animate-spin" style={{ animationDuration: '3s' }}></div>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-darker flex items-center justify-center shadow-[0_0_40px_rgba(19,200,236,0.5)]">
                                    <img src={postibleLogo} alt="Postibel" className="w-11 h-11 animate-bounce" />
                                </div>
                            </div>
                            {/* Text */}
                            <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">AI sedang merancang konten...</h2>
                            <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-8">
                                Menganalisa brand DNA, tren pasar, dan merancang strategi konten terbaik untuk bulan ini.
                            </p>
                            {/* Progress bar */}
                            <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-primary-darker rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* === AI RESULTS PREVIEW MODAL === */}
                {isResultsModalOpen && generatedPreviewPosts && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[175] flex flex-col bg-slate-50 animation-fade-in overflow-hidden">
                            {/* Header bar */}
                            <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-primary to-primary-darker rounded-xl shadow-md">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-slate-900 text-lg leading-none">Hasil Generate AI</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {generatedPreviewPosts.weeks.reduce((sum, w) => sum + w.posts.length, 0)} konten untuk {generatedPreviewPosts.planMonth} — Review &amp; hapus yang tidak sesuai
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => { setIsResultsModalOpen(false); setGeneratedPreviewPosts(null); }} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable content area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="max-w-7xl mx-auto space-y-8">
                                    {generatedPreviewPosts.weeks.map((week) => (
                                        <div key={week.weekNumber}>
                                            {/* Week header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-px flex-1 bg-slate-200"></div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-full">
                                                    Minggu {week.weekNumber}
                                                </span>
                                                <div className="h-px flex-1 bg-slate-200"></div>
                                            </div>
                                            {/* Posts grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {week.posts.map((post) => {
                                                    const postDate = new Date(post.date);
                                                    const catColors = {
                                                        'Edukasi': 'bg-blue-50 text-blue-700 border-blue-200',
                                                        'Promo': 'bg-orange-50 text-orange-700 border-orange-200',
                                                        'Testimoni': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                                                        'Branding': 'bg-purple-50 text-purple-700 border-purple-200',
                                                    };
                                                    const catColor = catColors[post.category] || 'bg-slate-50 text-slate-600 border-slate-200';
                                                    return (
                                                        <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                                                            {/* Image / placeholder */}
                                                            <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
                                                                {post.image && (
                                                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                )}
                                                                {!post.image && (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <Layers className="w-8 h-8 text-slate-300" />
                                                                        <span className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-bold">CAROUSEL</span>
                                                                    </div>
                                                                )}
                                                                {/* Format badge */}
                                                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                                    {post.format}
                                                                </div>
                                                                {/* Delete button */}
                                                                <button
                                                                    onClick={() => setGeneratedPreviewPosts(prev => ({
                                                                        ...prev,
                                                                        weeks: prev.weeks.map(w =>
                                                                            w.weekNumber === week.weekNumber
                                                                                ? { ...w, posts: w.posts.filter(p => p.id !== post.id) }
                                                                                : w
                                                                        ).filter(w => w.posts.length > 0)
                                                                    }))}
                                                                    className="absolute top-2 left-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                                                    title="Hapus konten ini"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            {/* Card content */}
                                                            <div className="p-4 flex flex-col flex-1">
                                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                                    <h3 className="font-bold text-slate-800 text-sm leading-snug flex-1">{post.title}</h3>
                                                                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>{post.category}</span>
                                                                </div>
                                                                <p className="text-xs text-slate-500 line-clamp-2 flex-1 mb-3">{post.hook}</p>
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                                        <CalendarDays className="w-3.5 h-3.5" />
                                                                        <span>{postDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                                        <span className="mx-1">•</span>
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                        <span>{post.recommendedTime}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setPreviewDetailPost(post)}
                                                                        className="text-[11px] font-bold text-primary-darker hover:text-primary transition-colors flex items-center gap-1"
                                                                    >
                                                                        Detail <ChevronRight className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer action bar */}
                            <div className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-4">
                                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <p className="text-xs text-slate-400 text-center sm:text-left">
                                        <span className="font-bold text-slate-600">{generatedPreviewPosts.weeks.reduce((sum, w) => sum + w.posts.length, 0)} konten</span> siap disimpan ke kalender.
                                        Hapus konten yang tidak relevan sebelum menyimpan.
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setIsResultsModalOpen(false); setGeneratedPreviewPosts(null); }}
                                            className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSaveDraftPlan}
                                            className="px-5 py-2.5 text-sm font-bold text-primary-darker bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl transition-colors"
                                        >
                                            Simpan Draft
                                        </button>
                                        <button
                                            onClick={handleSaveGeneratedPlan}
                                            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-darker hover:opacity-90 hover:-translate-y-0.5 rounded-xl transition-all shadow-lg shadow-primary flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Simpan ke Kalender
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* View Detail drawer (mini modal inside) */}
                            {previewDetailPost && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm" onClick={() => setPreviewDetailPost(null)}>
                                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                                        {/* Detail image */}
                                        {previewDetailPost.image && (
                                            <div className="h-48 overflow-hidden">
                                                <img src={previewDetailPost.image} alt={previewDetailPost.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{previewDetailPost.title}</h3>
                                                <button onClick={() => setPreviewDetailPost(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-3 text-xs">
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="font-bold text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Hook / Caption</p>
                                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{previewDetailPost.caption}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                                                        <p className="font-bold text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Format</p>
                                                        <p className="text-slate-700 font-semibold">{previewDetailPost.format}</p>
                                                    </div>
                                                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                                                        <p className="font-bold text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Waktu</p>
                                                        <p className="text-slate-700 font-semibold">{previewDetailPost.recommendedTime} WIB</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="font-bold text-slate-500 mb-1 uppercase tracking-wider text-[10px]">CTA</p>
                                                    <p className="text-slate-700">{previewDetailPost.cta}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ModalPortal>
                )}

                {/* === SCHEDULE CONFIRMATION MODAL === */}
                {isScheduleConfirmOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 animation-fade-in" onClick={() => setIsScheduleConfirmOpen(false)}>
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                            <div
                                className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="p-6 pb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                                            <CalendarDays className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Konfirmasi Jadwal</h3>
                                            <p className="text-xs text-slate-400 mt-0.5">Postingan akan dikirim otomatis</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsScheduleConfirmOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Summary card */}
                                <div className="mx-6 mb-5 space-y-3">
                                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Bulan</span>
                                            <span className="font-bold text-slate-800">{currentViewMonthLabel}</span>
                                        </div>
                                        <div className="h-px bg-slate-200" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Total Konten</span>
                                            <span className="font-bold text-slate-800">
                                                {monthPlan ? monthPlan.weeks.reduce((sum, w) => sum + w.posts.length, 0) : 0} postingan
                                            </span>
                                        </div>
                                        <div className="h-px bg-slate-200" />
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Akun Instagram</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                                                    <Instagram className="w-2.5 h-2.5 text-white" />
                                                </div>
                                                <span className="font-bold text-slate-800 text-xs">AkunBisnis</span>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning note */}
                                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                        <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">⚠️</span>
                                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                            Setelah dijadwalkan, konten akan dikirim otomatis ke Instagram sesuai waktu yang telah ditentukan.
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6 flex flex-col gap-2.5">
                                    <button
                                        onClick={() => {
                                            setIsMonthScheduled(true);
                                            setIsScheduleConfirmOpen(false);
                                        }}
                                        className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Ya, Jadwalkan Sekarang
                                    </button>
                                    <button
                                        onClick={() => setIsScheduleConfirmOpen(false)}
                                        className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )}

                {/* === CONNECT IG WARNING MODAL === */}
                {isConnectWarningOpen && (
                    <ModalPortal>
                        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 animation-fade-in" onClick={() => setIsConnectWarningOpen(false)}>
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                            <div
                                className="relative z-10 bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-md">
                                        <Instagram className="w-6 h-6 text-white" />
                                    </div>
                                    <button onClick={() => setIsConnectWarningOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-6 pb-2">
                                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">Hubungkan Instagram Dulu</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Untuk menjadwalkan postingan secara otomatis, kamu perlu menghubungkan akun Instagram bisnis terlebih dahulu melalui Pengaturan AI.
                                    </p>
                                </div>

                                {/* Tip box */}
                                <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚡</span>
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                        Koneksi hanya perlu dilakukan sekali. Setelah terhubung, semua jadwal akan terkirim otomatis.
                                    </p>
                                </div>

                                {/* Footer */}
                                <div className="p-6 flex flex-col gap-3">
                                    <button
                                        onClick={() => { setIsConnectWarningOpen(false); setIsSettingsOpen(true); }}
                                        className="w-full py-3.5 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white font-bold rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Instagram className="w-4 h-4" /> Buka Pengaturan Instagram
                                    </button>
                                    <button
                                        onClick={() => setIsConnectWarningOpen(false)}
                                        className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
                                    >
                                        Nanti saja
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalPortal>
                )
                }
            </div >
        </>
    );
};

const ProfileView = ({ brandDNA, setBrandDNA, businesses, setBusinesses, setCurrentView }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [user, setUser] = useState({ name: 'Budi Gunawan', email: 'budi@example.com', phone: '081234567890' });
    const [saveStatus, setSaveStatus] = useState(null);

    const handleSaveAccount = () => {
        setSaveStatus('saving-account');
        setTimeout(() => {
            setSaveStatus('saved-account');
            setTimeout(() => setSaveStatus(null), 2000);
        }, 800);
    };

    return (
        <div className="w-full max-w-5xl mx-auto animation-fade-in pb-20 md:pb-0" >
            <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-2xl w-fit mb-8 border border-slate-200/50" >
                <button
                    onClick={() => setActiveTab('account')}
                    className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'account'
                        ? 'bg-white text-primary-darker shadow-sm ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`
                    }
                >
                    <User className="w-4 h-4" /> <span>Informasi Akun </span>
                </button>
                < button
                    onClick={() => setActiveTab('business')}
                    className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${activeTab === 'business'
                        ? 'bg-white text-primary-darker shadow-sm ring-1 ring-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                >
                    <Briefcase className="w-4 h-4" /> <span>Profil Bisnis </span>
                </button>
            </div>

            < div className="bg-white rounded-[2.5rem] border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 min-h-[450px] relative overflow-hidden" >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none -z-10" > </div>

                {
                    activeTab === 'account' && (
                        <div className="space-y-10 w-full max-w-3xl animation-fade-in relative z-10" >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-slate-100" >
                                <div className="relative group cursor-pointer" >
                                    <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-400 border-4 border-white shadow-md transition-transform group-hover:scale-105" >
                                        <span className="text-3xl font-black text-slate-300" > BG </span>
                                    </div>
                                    < div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-4 border-white" >
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                < div className="space-y-2" >
                                    <h3 className="text-lg font-bold text-slate-800" > Foto Profil </h3>
                                    < div className="flex gap-3 pt-2" >
                                        <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-primary hover:border-primary/50 hover:bg-slate-50 transition-all shadow-sm" > Ubah Foto </button>
                                        < button className="px-4 py-2 text-slate-400 hover:text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors" > Hapus </button>
                                    </div>
                                </div>
                            </div>

                            < div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6" >
                                <div className="space-y-2" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" > Nama Lengkap </label>
                                    < input type="text" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })
                                    } className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none transition-all font-medium text-slate-800 placeholder-slate-400" />
                                </div>
                                < div className="space-y-2" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" > Nomor Telepon </label>
                                    < input type="tel" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none transition-all font-medium text-slate-800 placeholder-slate-400" />
                                </div>
                                < div className="space-y-2 md:col-span-2" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1" > Email Utama </label>
                                    < input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none transition-all font-medium text-slate-800 placeholder-slate-400" />
                                </div>
                            </div>

                            < div className="pt-8 flex justify-end" >
                                <button
                                    onClick={handleSaveAccount}
                                    disabled={saveStatus === 'saving-account'}
                                    className={`px-8 py-4 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 min-w-[200px] ${saveStatus === 'saved-account'
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                        : 'bg-primary hover:bg-primary-dark text-white shadow-primary hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                >
                                    {saveStatus === 'saving-account' && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {saveStatus === 'saved-account' && <CheckCircle2 className="w-5 h-5" />}
                                    {saveStatus === 'saving-account' ? 'Menyimpan...' : saveStatus === 'saved-account' ? 'Tersimpan!' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    )}

                {
                    activeTab === 'business' && (
                        <div className="space-y-8 w-full animation-fade-in relative z-10" >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100" >
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800" >
                                        Profil Bisnis Tersimpan
                                    </h3>
                                </div>
                                < button
                                    onClick={() => setCurrentView('onboarding')
                                    }
                                    className="shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-primary"
                                >
                                    <Plus className="w-4 h-4" /> Tambah Bisnis
                                </button>
                            </div>

                            < div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                                {
                                    businesses.map((biz, idx) => {
                                        const isActive = brandDNA.name === biz.name;
                                        return (
                                            <div key={idx} className={`relative p-6 rounded-[2rem] border-2 transition-all group flex flex-col h-full ${isActive
                                                ? 'border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-md'
                                                : 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm hover:-translate-y-1'
                                                }`
                                            }>

                                                {isActive && (
                                                    <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-white text-[10px] font-black tracking-widest uppercase rounded-full flex items-center gap-1 shadow-md shadow-primary" >
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                                                    </div>
                                                )
                                                }

                                                < div className="flex items-start gap-4 mb-6" >
                                                    <div className={
                                                        `w-14 h-14 shrink-0 rounded-[1.25rem] flex items-center justify-center font-black text-xl transition-all shadow-sm ${isActive
                                                            ? 'bg-gradient-to-br from-primary to-primary-darker text-white'
                                                            : 'bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                                                        }`
                                                    }>
                                                        {biz.name.charAt(0)}
                                                    </div>
                                                    < div className="flex-1 overflow-hidden pt-1" >
                                                        <p className={`text-lg font-bold truncate leading-tight mb-1 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}> {biz.name} </p>
                                                        < span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md truncate max-w-full" >
                                                            {biz.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                < div className="mt-auto pt-4 flex items-center gap-2 border-t border-slate-100/80" >
                                                    {!isActive && (
                                                        <button
                                                            onClick={() => setBrandDNA(biz)}
                                                            className="flex-1 py-2.5 bg-slate-50 hover:bg-primary text-slate-600 hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-200 hover:border-transparent"
                                                        >
                                                            Pilih Profil
                                                        </button>
                                                    )}

                                                    <button
                                                        className={`p-2.5 rounded-xl transition-colors border flex items-center justify-center ${isActive ? 'flex-1 border-slate-200 bg-white hover:bg-slate-50 hover:text-primary text-slate-600' : 'border-transparent text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                                                        title="Detail Profil"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        {isActive && <span className="ml-2 text-xs font-bold" > Detail </span>}
                                                    </button>

                                                    < button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (businesses.length > 1) {
                                                                const newBiz = businesses.filter(b => b.name !== biz.name);
                                                                setBusinesses(newBiz);
                                                                if (isActive) setBrandDNA(newBiz[0]);
                                                            }
                                                        }}
                                                        disabled={businesses.length <= 1}
                                                        className={`p-2.5 rounded-xl transition-all border border-transparent flex items-center justify-center ${businesses.length > 1
                                                            ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100'
                                                            : 'text-slate-200 cursor-not-allowed'
                                                            }`}
                                                        title={businesses.length > 1 ? "Hapus Profil" : "Minimal harus ada 1 profil"}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

const ModelsView = () => {
    const [viewState, setViewState] = useState('list');
    const [isGenerating, setIsGenerating] = useState(false);
    const [newModel, setNewModel] = useState({ name: '', role: '', description: '', imageRef: null });

    const handleGenerateModel = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setViewState('list');
        }, 3000);
    };

    if (viewState === 'create') {
        return (
            <div className="max-w-4xl mx-auto animation-fade-in pb-20 md:pb-0 px-4 md:px-0" >
                <div className="flex items-center justify-between mb-8" >
                    <div>
                        <button onClick={() => setViewState('list')} className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-2 transition-colors" >
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Buat Model Konsisten</h1>
                            <div className="group relative flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-slate-400 cursor-help hover:text-primary transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-20 pointer-events-none">
                                    Sistem AI akan menganalisa dan menyimpan wajah model untuk digunakan di berbagai sudut.
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                < div className="grid grid-cols-1 lg:grid-cols-5 gap-8" >
                    <div className="lg:col-span-2 space-y-6" >
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100" >
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2" >
                                <ScanFace className="w-4 h-4 text-primary" /> Detail Karakter
                            </h3>
                            < div className="space-y-4" >
                                <div className="space-y-1.5" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" > Nama Model </label>
                                    < input type="text" placeholder="Contoh: Rina" value={newModel.name} onChange={e => setNewModel({ ...newModel, name: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium" />
                                </div>
                                < div className="space-y-1.5" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" > Peran / Profesi </label>
                                    < input type="text" placeholder="Contoh: Barista Wanita" value={newModel.role} onChange={e => setNewModel({ ...newModel, role: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium" />
                                </div>
                                < div className="space-y-1.5" >
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" > Ciri - Ciri Spesifik </label>
                                    < textarea rows="3" placeholder="Contoh: Rambut pendek, berhijab cokelat, atau memakai seragam merah..." value={newModel.description} onChange={e => setNewModel({ ...newModel, description: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none resize-none text-sm font-medium" />
                                </div>
                            </div>
                        </div>

                        < div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100" >
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2" >
                                <Camera className="w-4 h-4 text-primary" /> Referensi Wajah(Opsional)
                            </h3>
                            < div
                                className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${newModel.imageRef ? 'border-primary bg-primary/5' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-primary/50'}`}
                                onClick={() => setNewModel({ ...newModel, imageRef: MOCK_IMAGES[0] })}
                            >
                                {
                                    newModel.imageRef ? (
                                        <div className="flex flex-col items-center" >
                                            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white shadow-sm">
                                                <img src={newModel.imageRef} alt="Ref" className="w-full h-full object-cover" />
                                            </div>
                                            < span className="text-primary font-bold text-xs flex items-center gap-1" > <CheckCircle2 className="w-3.5 h-3.5" /> Referensi Terpasang </span>
                                        </div>
                                    ) : (
                                        <>
                                            <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
                                            <p className="text-xs font-bold text-slate-600 mb-1" > Upload Foto Wajah </p>
                                            < p className="text-[10px] text-slate-400" > Atau kosongkan agar AI men - generate wajah baru.</p>
                                        </>
                                    )}
                            </div>
                        </div>

                        < button
                            onClick={handleGenerateModel}
                            disabled={isGenerating || !newModel.name}
                            className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isGenerating ? 'Memproses Sudut Pandang...' : 'Generate Model 360°'}
                        </button>
                    </div>

                    < div className="lg:col-span-3" >
                        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200/60 h-full min-h-[400px]" >
                            <div className="mb-6" >
                                <h3 className="font-bold text-slate-800" > Preview Variasi Wajah & Sudut </h3>
                                < p className="text-xs text-slate-500" > AI akan menghasilkan 4 variasi sudut standar untuk database Anda.</p>
                            </div>

                            {
                                isGenerating ? (
                                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center" >
                                        <div className="relative w-20 h-20 mb-6" >
                                            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-pulse" > </div>
                                            < div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" > </div>
                                            < ScanFace className="absolute inset-0 m-auto w-8 h-8 text-primary animate-bounce" />
                                        </div>
                                        < h4 className="font-bold text-slate-800 text-lg" > Menganalisa Struktur Wajah...</h4>
                                        < p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto" > Menerapkan konsistensi karakter ke berbagai pose: Senyum, Menunjuk, dan Memegang Produk.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4" >
                                        {
                                            [
                                                { label: 'Senyum Depan', icon: <ScanFace /> },
                                                { label: 'Profil Samping', icon: <User /> },
                                                { label: 'Pose Menunjuk', icon: <ArrowRight /> },
                                                { label: 'Pegang Produk', icon: <Package /> }
                                            ].map((item, i) => (
                                                <div key={i} className="aspect-square bg-white border border-slate-200 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center text-slate-300 p-4 text-center group" >
                                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/5 group-hover:text-primary transition-colors" >
                                                        {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                                                    </div>
                                                    < span className="text-xs font-bold text-slate-500" > {item.label} </span>
                                                    < span className="text-[10px] text-slate-400 mt-1" > Menunggu Generasi </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animation-fade-in pb-20 md:pb-0 px-4 md:px-0" >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10" >
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Database Model <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-darker border border-primary/20">PRO</span>
                    </h1>
                    <div className="group relative flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-slate-400 cursor-help hover:text-primary transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-20 pointer-events-none">
                            Gunakan karakter yang konsisten di setiap desain Anda. AI mengingat wajah model dari berbagai sudut pandang.
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                        </div>
                    </div>
                </div>
                < button
                    onClick={() => setViewState('create')}
                    className="shrink-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-primary hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Tambah Model Baru
                </button>
            </div>

            < div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" >
                {
                    MOCK_MODELS_DB.map(model => (
                        <div key={model.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:border-primary/30 transition-colors flex flex-col" >
                            <div className="p-5 flex items-start gap-4 border-b border-slate-50" >
                                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 overflow-hidden shrink-0 border border-slate-200" >
                                    <img src={model.mainImage} alt={model.name} className="w-full h-full object-cover" />
                                </div>
                                < div >
                                    <h3 className="text-lg font-bold text-slate-800" > {model.name} </h3>
                                    < span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-md mb-1" >
                                        {model.role}
                                    </span>
                                    < p className="text-xs text-slate-500 line-clamp-2 leading-relaxed" > {model.description} </p>
                                </div>
                            </div>

                            < div className="p-5 bg-slate-50/50 flex-1" >
                                <div className="flex items-center justify-between mb-3" >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider" > Sudut Tersedia </span>
                                    < span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full" > {model.angles.length} Pose </span>
                                </div>
                                < div className="grid grid-cols-4 gap-2" >
                                    {
                                        model.angles.map((angle, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-200 group/img cursor-pointer" title={angle.label} >
                                                <img src={angle.image} alt={angle.label} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center" >
                                                    <Eye className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            < div className="p-4 border-t border-slate-50 flex gap-2" >
                                <button className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors" >
                                    Edit Detail
                                </button>
                                < button className="flex-1 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary-darker text-sm font-bold rounded-xl transition-colors" >
                                    Gunakan Model
                                </button>
                            </div>
                        </div>
                    ))}

                <div
                    onClick={() => setViewState('create')}
                    className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[300px] group"
                >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary" >
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">Latih Model Baru</h3>
                    <p className="text-sm text-slate-500 max-w-xs">Buat karakter baru dengan wajah konsisten untuk kebutuhan promosi brand Anda.</p>
                </div>
            </div>
        </div>
    );
};

const VideoEditorView = ({ handleSaveToLibrary }) => {
    const [editorState, setEditorState] = useState('idle'); // 'idle', 'processing', 'result'
    const [uploadedFootages, setUploadedFootages] = useState([]);
    const [videoFormat, setVideoFormat] = useState('reels'); // 'reels', 'feed', 'story', 'tiktok'
    const [videoConfig, setVideoConfig] = useState({ mood: 'Energetic', transition: 'Dynamic' });
    const [processedResult, setProcessedResult] = useState(null);

    // Handle dummy upload
    const handleUploadClick = () => {
        if (uploadedFootages.length >= 10) return;
        const dummyClips = [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520697960359-2eeb2c0b4931?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=200&auto=format&fit=crop'
        ];
        const randomClip = dummyClips[Math.floor(Math.random() * dummyClips.length)];
        setUploadedFootages(prev => [...prev, { id: Date.now().toString(), url: randomClip }]);
    };

    const handleRemoveClip = (id) => {
        setUploadedFootages(prev => prev.filter(clip => clip.id !== id));
    };

    const handleProcessVideo = () => {
        if (uploadedFootages.length === 0) return;
        setEditorState('processing');

        // Simulate processing
        setTimeout(() => {
            setProcessedResult({
                id: `video_${Date.now()}`,
                title: `AI Edit: ${videoFormat.toUpperCase()}`,
                image: uploadedFootages[0].url, // Use first clip as thumbnail
                type: 'video', // New content type!
                format: videoFormat === 'feed' ? 'Square Video' : 'Vertical Video',
                duration: '00:15',
                caption: `Cek video terbaru kami! 🎥 Dibuat otomatis dengan AI Postibel. #${videoFormat} #AIEdit`,
                designStyle: videoConfig.transition.toLowerCase(),
                status: 'draft',
                goal: { name: 'Engagement', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'Video' }
            });
            setEditorState('result');
        }, 3500);
    };

    const handleSave = () => {
        if (processedResult && handleSaveToLibrary) {
            handleSaveToLibrary(processedResult);
            // Reset state or navigate away - handled by parent usually, but we'll just reset here
            setEditorState('idle');
            setUploadedFootages([]);
            setProcessedResult(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animation-fade-in pb-20 md:pb-0 px-4 md:px-0">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        Auto-Edit Video <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary-darker border border-primary/20">PRO</span>
                    </h1>
                    <div className="group relative flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-slate-400 cursor-help hover:text-primary transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-20 pointer-events-none">
                            Unggah raw footage (klip mentah) terbaik Anda. AI akan memotong, menambahkan transisi, dan menyesuaikan musik otomatis untuk dijadikan 1 video menarik.
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                        </div>
                    </div>
                </div>
            </div>

            {(editorState === 'idle' || editorState === 'processing') && (
                <div className="space-y-6">
                    {/* Upload Zone */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Film className="w-5 h-5 text-primary" /> 1. Unggah Raw Footage
                            </h2>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{uploadedFootages.length} / 10 klip</span>
                        </div>

                        {uploadedFootages.length === 0 ? (
                            <div
                                onClick={handleUploadClick}
                                className="w-full border-2 border-dashed border-slate-200 hover:border-primary bg-slate-50 hover:bg-primary/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-7 h-7 text-slate-400 group-hover:text-primary" />
                                </div>
                                <h3 className="font-bold text-slate-700 mb-1">Pilih atau Tarik Video Kesini</h3>
                                <p className="text-xs text-slate-400 max-w-xs">Mendukung MP4, MOV maksimal 50MB per klip. Disarankan menggunakan klip 3-10 detik.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                    {uploadedFootages.map((clip, idx) => (
                                        <div key={clip.id} className="relative w-28 h-28 rounded-2xl border border-slate-200 overflow-hidden group shadow-sm">
                                            <img src={clip.url} alt={`Clip ${idx}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleRemoveClip(clip.id)} className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                                00:0{Math.floor(Math.random() * 5) + 3}
                                            </span>
                                        </div>
                                    ))}
                                    {uploadedFootages.length < 10 && (
                                        <button
                                            onClick={handleUploadClick}
                                            className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary bg-slate-50 hover:bg-primary/5 flex flex-col items-center justify-center text-slate-400 hover:text-primary-darker transition-all group"
                                        >
                                            <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-bold">Tambah Klip</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Format Selection */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Layout className="w-5 h-5 text-primary" /> 2. Format Video
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'reels', label: 'IG Reels', ratio: '9:16', desc: 'Vertikal penuh' },
                                    { id: 'tiktok', label: 'TikTok', ratio: '9:16', desc: 'Vertikal penuh' },
                                    { id: 'story', label: 'IG Story', ratio: '9:16', desc: 'Vertikal, 15s max' },
                                    { id: 'feed', label: 'IG Feed', ratio: '1:1', desc: 'Square klasik' }
                                ].map(fmt => (
                                    <button
                                        key={fmt.id}
                                        onClick={() => setVideoFormat(fmt.id)}
                                        className={`p-3 rounded-2xl border-2 text-left transition-all ${videoFormat === fmt.id ? 'border-primary bg-primary/5 shadow-sm shadow-primary' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`font-bold text-sm ${videoFormat === fmt.id ? 'text-primary-darker' : 'text-slate-700'}`}>{fmt.label}</span>
                                            {videoFormat === fmt.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium block">{fmt.ratio} • {fmt.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Style Config */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Palette className="w-5 h-5 text-primary" /> 3. Gaya Editan AI
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Mood Musik / Audio</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Energetic', 'Chill', 'Cinematic', 'Trending'].map(mood => (
                                                <button
                                                    key={mood}
                                                    onClick={() => setVideoConfig(prev => ({ ...prev, mood }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${videoConfig.mood === mood ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {mood}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Gaya Transisi</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Dynamic', 'Smooth Fade', 'Glitch', 'Minimal Cutt'].map(trans => (
                                                <button
                                                    key={trans}
                                                    onClick={() => setVideoConfig(prev => ({ ...prev, transition: trans }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${videoConfig.transition === trans ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {trans}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleProcessVideo}
                        disabled={uploadedFootages.length === 0}
                        className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${uploadedFootages.length > 0
                            ? 'bg-gradient-to-r from-primary to-primary-darker text-white hover:opacity-90 hover:-translate-y-0.5 shadow-xl shadow-primary'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <Sparkles className="w-5 h-5" /> Proses Video dengan AI
                    </button>
                </div>
            )}

            {/* Processing State - Dramatic AI Overlay */}
            {editorState === 'processing' && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[180] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animation-fade-in">
                        {/* Animated rings */}
                        <div className="relative flex items-center justify-center mb-10">
                            <div className="absolute w-48 h-48 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }}></div>
                            <div className="absolute w-36 h-36 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
                            <div className="absolute w-24 h-24 rounded-full border-4 border-primary/30 animate-spin" style={{ animationDuration: '3s' }}></div>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-darker flex items-center justify-center shadow-[0_0_40px_rgba(19,200,236,0.5)]">
                                <img src={postibleLogo} alt="Postibel" className="w-11 h-11 animate-bounce" />
                            </div>
                        </div>
                        {/* Text */}
                        <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">AI sedang mengedit video...</h2>
                        <p className="text-slate-400 text-sm max-w-sm text-center leading-relaxed mb-8">
                            Menganalisa ketukan musik, mencari bagian terbaik dari raw footage, dan menerapkan gaya transisi {videoConfig.transition}.
                        </p>

                        {/* Progress checklist */}
                        <div className="w-72 max-w-full space-y-4 text-left mb-8">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Menganalisa {uploadedFootages.length} klip
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Sinkronisasi audio '{videoConfig.mood}'
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-primary animate-pulse">
                                <Loader2 className="w-5 h-5 animate-spin" /> Render transisi dan efek
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-72 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-primary-darker rounded-full animate-pulse" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Result State */}
            {editorState === 'result' && processedResult && (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 lg:p-8">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-800">✨ Video Selesai!</h2>
                            <p className="text-slate-500 text-sm">Hasil auto-edit AI siap digunakan.</p>
                        </div>
                        <button onClick={() => { setEditorState('idle'); setUploadedFootages([]) }} className="text-sm font-bold text-slate-400 hover:text-slate-600 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                            Batal & Ulangi
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Video Player Mock */}
                        <div className={`relative bg-slate-900 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 flex items-center justify-center group ${videoFormat === 'feed' ? 'w-full md:w-80 aspect-square' : 'w-full md:w-64 aspect-[9/16]'}`}>
                            <img src={processedResult.image} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                            {/* Play Button overlay */}
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer group-hover:scale-110 group-hover:bg-white/30 transition-all z-10 shadow-lg">
                                <Play className="w-6 h-6 text-white ml-1" />
                            </div>

                            {/* Info overlay */}
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{videoFormat}</span>
                                    <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">00:15</span>
                                </div>
                                <p className="text-white text-xs font-medium line-clamp-2 leading-snug">{processedResult.caption.split('#')[0]}</p>
                            </div>

                            {/* Audio overlay */}
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
                                <Music className="w-3 h-3" />
                                <span className="text-[10px] font-bold truncate max-w-[80px]">Trending Audio - {videoConfig.mood}</span>
                            </div>
                        </div>

                        {/* Details & Actions */}
                        <div className="flex-1 space-y-6 w-full">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Saran Caption AI</h3>
                                <p className="text-sm text-slate-700 font-medium whitespace-pre-line">{processedResult.caption}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gaya Transisi</span>
                                    <span className="text-sm font-bold text-slate-800">{videoConfig.transition}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Resolusi</span>
                                    <span className="text-sm font-bold text-slate-800">{videoFormat === 'feed' ? '1080x1080' : '1080x1920'}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button className="flex-1 py-3.5 bg-white border-2 border-primary text-primary-darker hover:bg-primary/5 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> Unduh Video
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                >
                                    <Library className="w-4 h-4" /> Simpan & Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick, isSidebarExpanded }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3.5 px-4' : 'justify-center px-0'} py-3.5 rounded-[1.25rem] transition-all font-bold text-sm group relative ${active
            ? 'bg-primary/10 text-primary-dark shadow-sm'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        title={!isSidebarExpanded ? label : ""}
    >
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            {React.cloneElement(icon, { className: `w-5 h-5 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}` })}
        </div>
        {isSidebarExpanded && <span className="whitespace-nowrap animation-fade-in" > {label} </span>}
    </button>
);

const MobileNavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${active ? 'text-primary' : 'text-slate-400'}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })} < span className="text-[10px] font-bold" > {label} </span>
    </button>
);

const Sidebar = ({ isSidebarExpanded, setIsSidebarExpanded, brandDNA, setBrandDNA, businesses, currentView, setCurrentView, onLogoutClick }) => {
    const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);

    return (
        <div className={`hidden md:flex flex-col ${isSidebarExpanded ? 'w-72' : 'w-24'} bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-screen fixed top-0 left-0 z-10 transition-all duration-300`
        }>
            <button
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="absolute -right-3.5 top-9 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 hover:text-primary text-slate-500 z-50 transition-transform hover:scale-110"
            >
                {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            < div className={`pt-8 px-8 pb-6 flex items-center ${isSidebarExpanded ? 'gap-3' : 'justify-center px-0'} transition-all`}>
                <div className="w-10 h-10 shrink-0 flex items-center justify-center" >
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                {
                    isSidebarExpanded && (
                        <span className="text-2xl font-black tracking-tight text-primary whitespace-nowrap animation-fade-in" >
                            Postibel
                        </span>
                    )
                }
            </div>

            < div className={`mb-6 transition-all relative ${isSidebarExpanded ? 'px-6' : 'px-4 flex justify-center'}`}>
                <button
                    onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
                    className={`flex items-center ${isSidebarExpanded ? 'w-full gap-3 p-3' : 'justify-center p-2 w-14 h-14'} rounded-[1.25rem] bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all text-left group`}
                    title={!isSidebarExpanded ? brandDNA.name : ""}
                >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-primary-dark font-black group-hover:border-primary/50 transition-colors" >
                        {brandDNA.name.charAt(0)}
                    </div>
                    {
                        isSidebarExpanded && (
                            <>
                                <div className="flex-1 overflow-hidden animation-fade-in" >
                                    <p className="text-sm font-bold text-slate-800 truncate" > {brandDNA.name} </p>
                                    < p className="text-xs font-medium text-slate-500 truncate" > {brandDNA.category} </p>
                                </div>
                                < ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${isBusinessMenuOpen ? 'rotate-180' : ''}`
                                } />
                            </>
                        )}
                </button>

                {
                    isBusinessMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsBusinessMenuOpen(false)
                            }> </div>
                            < div className={`absolute z-50 mt-2 bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl py-2 animation-fade-in ${isSidebarExpanded ? 'left-6 right-6' : 'left-20 w-56'}`}>
                                <div className="px-3 pb-2 mb-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider" > Bisnis Anda </div>
                                < div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent" >
                                    {
                                        businesses.map((biz, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setBrandDNA(biz);
                                                    setIsBusinessMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left group/item"
                                            >
                                                <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover/item:text-primary transition-colors" >
                                                    {biz.name.charAt(0)}
                                                </div>
                                                < div className="flex-1 overflow-hidden" >
                                                    <p className={`text-sm font-bold truncate ${brandDNA.name === biz.name ? 'text-primary' : 'text-slate-700'}`}> {biz.name} </p>
                                                    < p className="text-[10px] text-slate-400 truncate" > {biz.category} </p>
                                                </div>
                                                {brandDNA.name === biz.name && <Check className="w-4 h-4 text-primary shrink-0" />}
                                            </button>
                                        ))}
                                </div>
                                < div className="px-2 pt-2 mt-1 border-t border-slate-50" >
                                    <button
                                        onClick={
                                            () => {
                                                setIsBusinessMenuOpen(false);
                                                setCurrentView('onboarding');
                                            }
                                        }
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Bisnis
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
            </div>

            < nav className={`flex-1 ${isSidebarExpanded ? 'px-6' : 'px-4'} transition-all overflow-y-auto pb-8 pt-2`}>
                <div className="space-y-1.5" >
                    <NavItem isSidebarExpanded={isSidebarExpanded} icon={< Layout />} label="Buat Konten" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
                    < NavItem isSidebarExpanded={isSidebarExpanded} icon={< CalendarDays />} label="Konten Post" active={currentView === 'library'} onClick={() => setCurrentView('library')} />
                    < NavItem isSidebarExpanded={isSidebarExpanded} icon={< Camera />} label="Foto Model" active={currentView === 'foto-model'} onClick={() => setCurrentView('foto-model')} />
                    <NavItem isSidebarExpanded={isSidebarExpanded} icon={<Video />} label="Edit Video" active={currentView === 'video-editor'} onClick={() => setCurrentView('video-editor')} />
                    < NavItem isSidebarExpanded={isSidebarExpanded} icon={< User />} label="Profil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
                </div>
            </nav>

            < div className={`pt-4 pb-6 ${isSidebarExpanded ? 'px-4 flex-row' : 'px-4 flex-col'} flex items-center justify-between gap-2 border-t border-slate-100`}>
                <div
                    onClick={() => setCurrentView('profile')}
                    className={`flex items-center gap-3 cursor-pointer group rounded-[1.25rem] p-2 ${isSidebarExpanded ? 'hover:bg-slate-50 flex-1 overflow-hidden' : 'hover:bg-slate-50 w-full justify-center'}`}
                    title={!isSidebarExpanded ? "Profil Pengguna" : ""}
                >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary-darker transition-all shadow-sm" >
                        BG
                    </div>
                    {
                        isSidebarExpanded && (
                            <div className="flex flex-col text-left overflow-hidden pr-1 animation-fade-in" >
                                <span className="text-sm font-bold text-slate-800 leading-none mb-1 group-hover:text-primary-darker transition-colors truncate" > Budi Gunawan </span>
                                < span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate" > Admin </span>
                            </div>
                        )
                    }
                </div>

                < button
                    onClick={onLogoutClick}
                    className={`p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group shrink-0 ${!isSidebarExpanded ? 'w-full flex justify-center' : ''}`}
                    title="Keluar"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const MobileNav = ({ currentView, setCurrentView }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 pb-safe z-[100] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]" >
            <MobileNavItem icon={
                <Layout />} label="Buat" active={currentView === 'dashboard' || currentView === 'results'} onClick={() => setCurrentView('dashboard')} />
            <MobileNavItem icon={
                <CalendarDays />} label="Konten" active={currentView === 'library'} onClick={() => setCurrentView('library')} />
            <MobileNavItem icon={
                <Camera />} label="Model" active={currentView === 'foto-model'} onClick={() => setCurrentView('foto-model')} />
            <MobileNavItem icon={
                <Video />} label="Video" active={currentView === 'video-editor'} onClick={() => setCurrentView('video-editor')} />
            <MobileNavItem icon={
                <User />} label="Profil" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} />
        </div>
    );
};

const MobileHeader = ({ brandDNA, setBrandDNA, businesses, setCurrentView }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md sticky top-0 z-[90] border-b border-slate-100 shadow-sm" >
            <div className="flex items-center gap-2" >
                <div className="w-8 h-8 flex items-center justify-center" >
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                < span className="text-xl font-black tracking-tight text-primary" >
                    Postibel
                </span>
            </div>

            < div className="relative" >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                    <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary-dark font-black text-xs" >
                        {brandDNA.name.charAt(0)}
                    </div>
                    < ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`
                    } />
                </button>

                {
                    isOpen && (
                        <>
                            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)
                            }> </div>
                            < div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-[110] animation-fade-in" >
                                <div className="px-3 pb-2 mb-2 border-b border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider" > Bisnis Anda </div>
                                < div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-track]:bg-transparent" >
                                    {
                                        businesses.map((biz, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setBrandDNA(biz);
                                                    setIsOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left group/item"
                                            >
                                                <div className="w-8 h-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover/item:text-primary transition-colors" >
                                                    {biz.name.charAt(0)}
                                                </div>
                                                < div className="flex-1 overflow-hidden" >
                                                    <p className={`text-sm font-bold truncate ${brandDNA.name === biz.name ? 'text-primary' : 'text-slate-700'}`}> {biz.name} </p>
                                                    < p className="text-[10px] text-slate-400 truncate" > {biz.category} </p>
                                                </div>
                                                {brandDNA.name === biz.name && <Check className="w-4 h-4 text-primary shrink-0" />}
                                            </button>
                                        ))}
                                </div>
                                < div className="px-2 pt-2 mt-1 border-t border-slate-50" >
                                    <button
                                        onClick={
                                            () => {
                                                setIsOpen(false);
                                                setCurrentView('onboarding');
                                            }
                                        }
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Bisnis
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    );
};

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const VIEW_TO_PATH = {
        'dashboard': '/buat_konten',
        'results': '/results',
        'editor': '/editor',
        'library': '/library',
        'foto-model': '/foto-model',
        'video-editor': '/video-editor',
        'profile': '/profile',
        'signup': '/signup',
        'onboarding': '/onboarding',
        'generating': '/generating',
        'design-system': '/design-system',
        'loading-preview': '/loading-preview',
    };

    const PATH_TO_VIEW = Object.fromEntries(
        Object.entries(VIEW_TO_PATH).map(([v, p]) => [p, v])
    );

    const currentView = PATH_TO_VIEW[location.pathname] || 'dashboard';

    const setCurrentView = useCallback((view) => {
        const path = VIEW_TO_PATH[view] || '/buat_konten';
        navigate(path);
    }, [navigate]);
    const [brandDNA, setBrandDNA] = useState(DEFAULT_BRAND_DNA);
    const [businesses, setBusinesses] = useState([DEFAULT_BRAND_DNA, SECONDARY_BRAND_DNA]);
    const [library, setLibrary] = useState(MOCK_LIBRARY);
    const [planners, setPlanners] = useState([]);

    const [prompt, setPrompt] = useState('');
    const [postType, setPostType] = useState('single');
    const [generatedResults, setGeneratedResults] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [previewPost, setPreviewPost] = useState(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const showNav = currentView !== 'signup' && currentView !== 'onboarding' && currentView !== 'design-system' && currentView !== 'loading-preview';

    const handleConfirmLogout = () => {
        setIsLogoutModalOpen(false);
        setCurrentView('signup');
    };

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setCurrentView('generating');

        setTimeout(() => {
            let results = [];
            if (postType === 'carousel') {
                results = [
                    {
                        id: Date.now() + 1,
                        type: 'carousel',
                        slides: [
                            { headline: '3 Tips Ngopi Sehat', body: 'Tetap segar tanpa perut kembung', image: MOCK_IMAGES[1] },
                            { headline: '1. Perut Terisi', body: 'Pastikan sarapan ringan sebelum ngopi', image: MOCK_IMAGES[2] },
                            { headline: '2. Tambahkan Susu', body: 'Pilih oatmilk untuk opsi lebih ringan', image: MOCK_IMAGES[0] }
                        ],
                        caption: `Ngopi nikmat tanpa drama perut kembung? ☕️ Cek tips simpelnya di slide ya! Jangan lupa mampir ke @${brandDNA.name.toLowerCase().replace(/\s+/g, '_')}.\n\n#TipsKopi #KopiSehat`,
                        designStyle: 'minimal',
                        overlayOpacity: 45,
                        textAlign: 'center',
                        goal: { name: 'Edukasi', color: 'bg-purple-50 text-purple-600 border-purple-200', icon: 'Lightbulb' }
                    },
                    {
                        id: Date.now() + 2,
                        type: 'carousel',
                        slides: [
                            { headline: 'Fakta & Mitos', body: 'Seputar Info Menarik', image: MOCK_IMAGES[3] },
                            { headline: 'Fakta Menarik', body: 'Ketahui kebenarannya', image: MOCK_IMAGES[0] },
                            { headline: 'Solusi Aman', body: 'Pilihan terbaik untukmu', image: MOCK_IMAGES[1] }
                        ],
                        caption: "Sering bingung dengan mitos yang beredar? Yuk simak faktanya! 😎\n\n#FaktaDanMitos #Edukasi",
                        designStyle: 'bold',
                        overlayOpacity: 60,
                        textAlign: 'left',
                        goal: { name: 'Awareness', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: 'Eye' }
                    },
                    {
                        id: Date.now() + 3,
                        type: 'carousel',
                        slides: [
                            { headline: 'Koleksi Terbaru', body: 'Rasakan sensasi berbeda', image: MOCK_IMAGES[2] },
                            { headline: 'Varian Pertama', body: 'Manisnya pas dan bikin nagih', image: MOCK_IMAGES[1] },
                            { headline: 'Varian Kedua', body: 'Kombinasi super lembut', image: MOCK_IMAGES[3] }
                        ],
                        caption: "Ada yang baru nih di tempat kami! Sudah cobain yang mana aja? 🥰\n\n#ProdukBaru #WajibCoba",
                        designStyle: 'soft',
                        overlayOpacity: 30,
                        textAlign: 'right',
                        goal: { name: 'Sales', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'Tag' }
                    },
                    {
                        id: Date.now() + 4,
                        type: 'carousel',
                        slides: [
                            { headline: 'Koleksi Premium', body: 'Bahan pilihan terbaik', image: MOCK_IMAGES[0] },
                            { headline: 'Kualitas Original', body: 'Dari sumber terpercaya', image: MOCK_IMAGES[3] },
                            { headline: 'Proses Sempurna', body: 'Menghasilkan yang khas', image: MOCK_IMAGES[2] }
                        ],
                        caption: "Nikmati kualitas premium dari bahan pilihan terbaik. ✨\n\n#KualitasPremium #Terbaik",
                        designStyle: 'luxury',
                        overlayOpacity: 70,
                        textAlign: 'center',
                        goal: { name: 'Engagement', color: 'bg-pink-50 text-pink-600 border-pink-200', icon: 'MessageCircle' }
                    }
                ];
            } else {
                results = [
                    {
                        id: Date.now() + 1,
                        type: 'single',
                        headline: 'Weekend Spesial!',
                        body: 'Diskon 20% khusus hari ini',
                        image: MOCK_IMAGES[0],
                        caption: `Rayakan akhir pekan dengan ${brandDNA.name}. Diskon 20% menanti Anda! 🧊\n\n#PromoWeekend`,
                        designStyle: 'minimal',
                        overlayOpacity: 40,
                        textAlign: 'center',
                        goal: { name: 'Sales', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'Tag' }
                    },
                    {
                        id: Date.now() + 2,
                        type: 'single',
                        headline: 'Beli 1 Gratis 1',
                        body: 'Promo Flash Sale jam 12-2 siang',
                        image: MOCK_IMAGES[1],
                        caption: `Jangan kelewatan promo flash sale dari ${brandDNA.name}! Ajak temanmu sekarang juga. 🚀\n\n#FlashSale #Beli1Gratis1`,
                        designStyle: 'bold',
                        overlayOpacity: 60,
                        textAlign: 'left',
                        goal: { name: 'Sales', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: 'Tag' }
                    },
                    {
                        id: Date.now() + 3,
                        type: 'single',
                        headline: 'Tempat Favorit',
                        body: 'Nyaman untuk bersantai',
                        image: MOCK_IMAGES[2],
                        caption: `Butuh tempat yang nyaman? ${brandDNA.name} tempatnya. Mampir dan nikmati suasana! 💻\n\n#TempatNongkrong #Nyaman`,
                        designStyle: 'soft',
                        overlayOpacity: 30,
                        textAlign: 'right',
                        goal: { name: 'Awareness', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: 'Eye' }
                    },
                    {
                        id: Date.now() + 4,
                        type: 'single',
                        headline: 'Produk Favorit',
                        body: 'Selalu jadi incaran',
                        image: MOCK_IMAGES[3],
                        caption: `Yang selalu jadi incaran. Perpaduan sempurna. Yuk pesan sekarang! 🤎\n\n#BestSeller #PalingLaku`,
                        designStyle: 'luxury',
                        overlayOpacity: 70,
                        textAlign: 'center',
                        goal: { name: 'Engagement', color: 'bg-pink-50 text-pink-600 border-pink-200', icon: 'MessageCircle' }
                    }
                ];
            }
            setGeneratedResults(results);
            setCurrentView('results');
        }, 2500);
    };

    const handleSaveToLibrary = (post) => {
        setLibrary([post, ...library]);
        setCurrentView('library');
    };

    const handleSimulateAttach = (type) => {
        let name = 'produk.jpg';
        let source = 'upload';
        let attachType = type;

        if (type === 'model') {
            attachType = 'image';
            name = 'Model_Siti_Depan.jpg';
            source = 'model';
        } else if (type === 'file') {
            name = 'brief_campaign.pdf';
        } else if (type === 'link') {
            name = 'Referensi Tautan';
        }

        setAttachments([...attachments, { id: Date.now(), type: attachType, name, source }]);
    };

    const removeAttachment = (id) => setAttachments(attachments.filter(a => a.id !== id));

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900" >
            {showNav && (
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    brandDNA={brandDNA}
                    setBrandDNA={setBrandDNA}
                    businesses={businesses}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    onLogoutClick={() => setIsLogoutModalOpen(true)
                    }
                />
            )}
            {
                showNav && (
                    <MobileHeader
                        brandDNA={brandDNA}
                        setBrandDNA={setBrandDNA}
                        businesses={businesses}
                        setCurrentView={setCurrentView}
                    />
                )
            }
            {showNav && <MobileNav currentView={currentView} setCurrentView={setCurrentView} />}

            {location.pathname === '/' && <Navigate to="/buat_konten" replace />}
            {currentView === 'design-system' && <DesignSystemView />}
            {currentView === 'loading-preview' && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
                    {/* Animated rings */}
                    <div className="relative flex items-center justify-center mb-10">
                        <div className="absolute w-48 h-48 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute w-36 h-36 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                        <div className="absolute w-24 h-24 rounded-full border-4 border-primary/30 animate-spin" style={{ animationDuration: '3s' }} />
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-darker flex items-center justify-center shadow-[0_0_40px_rgba(19,200,236,0.5)]">
                            <img src={postibleLogo} alt="Postibel" className="w-11 h-11 animate-bounce" />
                        </div>
                    </div>
                    {/* Text */}
                    <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">AI sedang merancang konten...</h2>
                    <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-8">
                        Menganalisa brand DNA, tren pasar, dan merancang strategi konten terbaik untuk bulan ini.
                    </p>
                    {/* Progress bar */}
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-darker rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                </div>
            )}
            {currentView !== 'design-system' && currentView !== 'loading-preview' && (
            <main className={`${showNav ? (isSidebarExpanded ? 'md:ml-72' : 'md:ml-24') : ''} p-4 md:p-8 min-h-screen transition-all duration-300`}>
                {currentView === 'signup' && <SignUpView setCurrentView={setCurrentView} />}
                {
                    currentView === 'onboarding' && (
                        <OnboardingView
                            brandDNA={brandDNA}
                            setBrandDNA={setBrandDNA}
                            businesses={businesses}
                            setBusinesses={setBusinesses}
                            setCurrentView={setCurrentView}
                        />
                    )
                }
                {
                    currentView === 'dashboard' && (
                        <DashboardView
                            brandDNA={brandDNA}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            postType={postType}
                            setPostType={setPostType}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            handleSimulateAttach={handleSimulateAttach}
                            removeAttachment={removeAttachment}
                            handleGenerate={handleGenerate}
                            setCurrentView={setCurrentView}
                        />
                    )
                }
                {currentView === 'generating' && <GeneratingView brandDNA={brandDNA} />}
                {
                    currentView === 'results' && (
                        <ResultsView
                            generatedResults={generatedResults}
                            setCurrentView={setCurrentView}
                            setPreviewPost={setPreviewPost}
                            setEditingPost={setEditingPost}
                            handleSaveToLibrary={handleSaveToLibrary}
                            brandDNA={brandDNA}
                        />
                    )
                }
                {
                    currentView === 'editor' && (
                        <EditorView
                            editingPost={editingPost}
                            setCurrentView={setCurrentView}
                            handleSaveToLibrary={handleSaveToLibrary}
                            brandDNA={brandDNA}
                        />
                    )
                }
                {
                    currentView === 'library' && (
                        <LibraryView
                            library={library}
                            setLibrary={setLibrary}
                            planners={planners}
                            setPlanners={setPlanners}
                            setPreviewPost={setPreviewPost}
                            setEditingPost={setEditingPost}
                            setCurrentView={setCurrentView}
                            brandDNA={brandDNA}
                        />
                    )
                }
                {currentView === 'foto-model' && <ModelsView />}
                {currentView === 'video-editor' && <VideoEditorView handleSaveToLibrary={handleSaveToLibrary} />}
                {
                    currentView === 'profile' && (
                        <ProfileView
                            brandDNA={brandDNA}
                            setBrandDNA={setBrandDNA}
                            businesses={businesses}
                            setBusinesses={setBusinesses}
                            setCurrentView={setCurrentView}
                        />
                    )
                }
                
            </main>
            )}

            {/* Full Screen Preview Modal */}
            {
                previewPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animation-fade-in" >
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm cursor-pointer" onClick={() => setPreviewPost(null)
                        }> </div>
                        < div className="relative z-10 flex flex-col items-center w-full max-w-[450px]" >
                            <div className="w-full flex justify-end mb-3" >
                                <button onClick={() => setPreviewPost(null)} className="p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md" >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            < div className="w-full flex justify-center shadow-2xl ring-1 ring-white/20 rounded-lg bg-white overflow-hidden transform sm:scale-105 origin-top" >
                                <InstagramPostMock post={previewPost} brand={brandDNA} />
                            </div>
                        </div>
                    </div>
                )}

            {/* Modal Konfirmasi Keluar */}
            {
                isLogoutModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animation-fade-in" >
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)
                        }> </div>
                        < div className="relative z-10 bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden" >
                            <div className="p-6 text-center" >
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4" >
                                    <LogOut className="w-8 h-8" />
                                </div>
                                < h3 className="text-xl font-bold text-slate-900 mb-2" > Keluar Aplikasi ? </h3>
                                < p className="text-sm text-slate-500 mb-8 px-2" > Anda harus masuk kembali untuk mengakses ruang kerja dan pustaka konten Anda.</p>
                                < div className="flex gap-3" >
                                    <button
                                        onClick={() => setIsLogoutModalOpen(false)}
                                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-[1rem] transition-colors"
                                    >
                                        Batal
                                    </button>
                                    < button
                                        onClick={handleConfirmLogout}
                                        className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-[1rem] transition-colors shadow-sm shadow-red-500/30"
                                    >
                                        Ya, Keluar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            <style dangerouslySetInnerHTML={{
                __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body, .font-sans, * { font-family: 'Inter', sans-serif !important; }
        .animation-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
      `
            }} />
        </div>
    );
}

export default App;