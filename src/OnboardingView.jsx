import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import postibleLogo from './assets/postibel-logo.svg';
import { useAuth } from './hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGenerateTemplates } from './hooks/useGenerateTemplates';
import {
    Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2,
    Coffee, Utensils, ShoppingBag, Flower2, Briefcase,
    Palette, Type, Sliders, User, Image as ImageIcon, Upload, X, ChevronDown,
    Heart, Home, Dumbbell, GraduationCap, Stethoscope, Car, Wrench, Laptop, PawPrint, Baby, Globe
} from 'lucide-react';

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

const CATEGORIES = [
    { id: 'food', label: 'Kuliner & F&B', icon: <Coffee className="w-6 h-6" /> },
    { id: 'restaurant', label: 'Restoran', icon: <Utensils className="w-6 h-6" /> },
    { id: 'retail', label: 'Toko & Retail', icon: <ShoppingBag className="w-6 h-6" /> },
    { id: 'beauty', label: 'Kecantikan', icon: <Flower2 className="w-6 h-6" /> },
    { id: 'fashion', label: 'Fashion', icon: <User className="w-6 h-6" /> },
    { id: 'business', label: 'Bisnis & Jasa', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'health', label: 'Kesehatan & Medis', icon: <Stethoscope className="w-6 h-6" /> },
    { id: 'education', label: 'Pendidikan & Kursus', icon: <GraduationCap className="w-6 h-6" /> },
    { id: 'tech', label: 'Teknologi & IT', icon: <Laptop className="w-6 h-6" /> },
    { id: 'fitness', label: 'Fitness & Olahraga', icon: <Dumbbell className="w-6 h-6" /> },
    { id: 'property', label: 'Properti & Interior', icon: <Home className="w-6 h-6" /> },
    { id: 'automotive', label: 'Otomotif', icon: <Car className="w-6 h-6" /> },
    { id: 'pet', label: 'Hewan & Pet Shop', icon: <PawPrint className="w-6 h-6" /> },
    { id: 'baby', label: 'Ibu & Anak', icon: <Baby className="w-6 h-6" /> },
    { id: 'handcraft', label: 'Kerajinan & Handmade', icon: <Heart className="w-6 h-6" /> },
    { id: 'service', label: 'Servis & Reparasi', icon: <Wrench className="w-6 h-6" /> },
];

const PRODUCT_SUGGESTIONS = {
    'Kuliner & F&B': ['Kopi & Minuman', 'Makanan Ringan', 'Kue & Pastry', 'Catering', 'Frozen Food', 'Sambal & Bumbu', 'Jus & Smoothie'],
    'Restoran': ['Makanan Indonesia', 'Makanan Western', 'Makanan Jepang', 'Makanan Korea', 'Seafood', 'Steak House', 'Vegetarian'],
    'Toko & Retail': ['Elektronik', 'Peralatan Rumah', 'Aksesoris HP', 'Mainan Anak', 'Buku & Alat Tulis', 'Oleh-oleh', 'Perlengkapan Bayi'],
    'Kecantikan': ['Skincare', 'Makeup', 'Haircare', 'Parfum', 'Perawatan Tubuh', 'Nail Art', 'Jasa Salon'],
    'Fashion': ['Pakaian Wanita', 'Pakaian Pria', 'Hijab & Muslim Wear', 'Sepatu & Sandal', 'Tas & Dompet', 'Aksesoris', 'Streetwear'],
    'Bisnis & Jasa': ['Konsultan', 'Desain Grafis', 'Digital Marketing', 'Fotografi', 'Wedding Organizer', 'Jasa Cleaning', 'Jasa Pengiriman'],
    'Kesehatan & Medis': ['Klinik', 'Apotek', 'Suplemen', 'Alat Kesehatan', 'Terapi & Pijat', 'Dokter Gigi', 'Laboratorium'],
    'Pendidikan & Kursus': ['Les Privat', 'Kursus Bahasa', 'Bimbel', 'Kursus Musik', 'Pelatihan IT', 'Workshop Seni', 'E-Learning'],
    'Teknologi & IT': ['Software House', 'Web Development', 'Aplikasi Mobile', 'Jasa IT Support', 'Cloud Services', 'Cyber Security', 'Data Analytics'],
    'Fitness & Olahraga': ['Gym & Fitness Center', 'Yoga Studio', 'Personal Trainer', 'Suplemen Fitness', 'Alat Olahraga', 'Martial Arts', 'Renang'],
    'Properti & Interior': ['Agen Properti', 'Desain Interior', 'Kontraktor', 'Furniture', 'Dekorasi Rumah', 'Jasa Renovasi', 'Smart Home'],
    'Otomotif': ['Bengkel Mobil', 'Bengkel Motor', 'Aksesoris Kendaraan', 'Cuci Mobil', 'Rental Mobil', 'Detailing', 'Spare Part'],
    'Hewan & Pet Shop': ['Makanan Hewan', 'Aksesoris Hewan', 'Grooming', 'Pet Hotel', 'Klinik Hewan', 'Adopsi Hewan', 'Pet Training'],
    'Ibu & Anak': ['Perlengkapan Bayi', 'Mainan Edukasi', 'Pakaian Anak', 'Daycare', 'MPASI', 'Ibu Hamil', 'Stroller & Car Seat'],
    'Kerajinan & Handmade': ['Kerajinan Kayu', 'Rajutan & Crochet', 'Lilin & Aromaterapi', 'Keramik', 'Resin Art', 'Bordir & Sulam', 'Custom Gift'],
    'Servis & Reparasi': ['Service Elektronik', 'Service AC', 'Tukang Ledeng', 'Tukang Listrik', 'Service Laptop', 'Reparasi Jam', 'Service Mesin'],
};

const TONES = [
    { id: 'friendly', label: 'Ramah & Hangat', desc: 'Akrab, menyapa, dekat dengan pelanggan' },
    { id: 'professional', label: 'Profesional', desc: 'Formal, terpercaya, dan kompeten' },
    { id: 'fun', label: 'Fun & Energik', desc: 'Ceria, penuh semangat, dan menghibur' },
    { id: 'luxury', label: 'Premium & Eksklusif', desc: 'Mewah, berkelas, dan eksklusif' },
];

const TEMPLATES = [
    {
        id: 'minimalis-elegan',
        name: 'Minimalis Elegan',
        bg: '#F8FAFC',
        content: '#9CA3AF',
        accent: '#13c8ec',
        caption: '#13c8ec',
        dark: false,
    },
    {
        id: 'tegas-berani',
        name: 'Tegas & Berani',
        bg: '#111827',
        content: '#D1D5DB',
        accent: '#374151',
        caption: '#374151',
        dark: true,
    },
    {
        id: 'lembut-estetik',
        name: 'Lembut & Estetik',
        bg: '#FFF0E8',
        content: '#F97316',
        accent: '#F9A8D4',
        caption: '#FDA4AF',
        dark: false,
        leftBar: '#F9A8D4',
    },
    {
        id: 'mewah-eksklusif',
        name: 'Mewah & Eksklusif',
        bg: '#1A1A1A',
        content: '#D4A017',
        accent: '#D4A017',
        caption: '#374151',
        dark: true,
    },
    {
        id: 'ceria-aktif',
        name: 'Ceria & Aktif',
        bg: '#FEFCE8',
        content: '#EC4899',
        accent: '#FDE047',
        caption: '#FDE047',
        dark: false,
        leftBar: '#FDE047',
    },
    {
        id: 'profesional-rapi',
        name: 'Profesional & Rapi',
        bg: '#EFF6FF',
        content: '#3B82F6',
        accent: '#BFDBFE',
        caption: '#BFDBFE',
        dark: false,
        leftBar: '#93C5FD',
    },
];

const TYPOGRAPHY_PRESETS = [
    {
        id: 'modern-bersih',
        name: 'Modern & Bersih',
        heading: { fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' },
        sub: { fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0' },
        body: { fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.78rem', lineHeight: 1.6 },
    },
    {
        id: 'klasik-elegan',
        name: 'Klasik Elegan',
        heading: { fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.01em' },
        sub: { fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '0.9rem', fontStyle: 'italic' },
        body: { fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '0.78rem', lineHeight: 1.7 },
    },
    {
        id: 'tegas-kuat',
        name: 'Tegas & Kuat',
        heading: { fontFamily: 'Arial Black, sans-serif', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.02em', textTransform: 'uppercase' },
        sub: { fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' },
        body: { fontFamily: 'Arial, sans-serif', fontWeight: 400, fontSize: '0.78rem', lineHeight: 1.5 },
    },
    {
        id: 'kreatif-unik',
        name: 'Kreatif & Unik',
        heading: { fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '0.03em', fontStyle: 'italic' },
        sub: { fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 600, fontSize: '0.88rem', letterSpacing: '0.04em' },
        body: { fontFamily: 'Trebuchet MS, sans-serif', fontWeight: 400, fontSize: '0.78rem', lineHeight: 1.65 },
    },
    {
        id: 'hangat-bersahabat',
        name: 'Hangat & Bersahabat',
        heading: { fontFamily: 'Verdana, sans-serif', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '0' },
        sub: { fontFamily: 'Verdana, sans-serif', fontWeight: 400, fontSize: '0.85rem' },
        body: { fontFamily: 'Verdana, sans-serif', fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.7 },
    },
    {
        id: 'minimalis-tipis',
        name: 'Minimalis & Tipis',
        heading: { fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '1.6rem', letterSpacing: '0.08em' },
        sub: { fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '0.88rem', letterSpacing: '0.05em' },
        body: { fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.8, letterSpacing: '0.02em' },
    },
];

const STEPS = [
    { id: 1, title: 'Profil Bisnis', icon: <Briefcase className="w-5 h-5" /> },
    { id: 2, title: 'Warna Brand', icon: <Palette className="w-5 h-5" /> },
    { id: 3, title: 'Tipografi Brand', icon: <Sliders className="w-5 h-5" /> },
    { id: 4, title: 'Template Desain', icon: <Type className="w-5 h-5" /> },
];

// --- Color Harmony Utilities ---
function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generate4Palettes(primaryHex) {
    if (!primaryHex || primaryHex.length < 7) return [];
    const [h, s, l] = hexToHsl(primaryHex);
    return [
        {
            id: 'complementary',
            name: 'Komplementer',
            desc: 'Kontras kuat, penuh energi',
            emoji: '⚡',
            colors: [
                primaryHex,
                hslToHex(h + 180, Math.min(s, 85), Math.max(l - 5, 30)),
                hslToHex(h, Math.max(s - 35, 10), Math.min(l + 42, 95)),
            ],
        },
        {
            id: 'analogous',
            name: 'Analogous',
            desc: 'Harmonis & natural',
            emoji: '🌿',
            colors: [
                primaryHex,
                hslToHex(h + 35, Math.min(s + 5, 90), Math.max(l - 5, 30)),
                hslToHex(h, Math.max(s - 40, 10), Math.min(l + 40, 95)),
            ],
        },
        {
            id: 'triadic',
            name: 'Triadik',
            desc: 'Vibrant & seimbang',
            emoji: '🎨',
            colors: [
                primaryHex,
                hslToHex(h + 120, Math.min(s, 80), Math.max(l - 8, 28)),
                hslToHex(h, Math.max(s - 30, 10), Math.min(l + 38, 94)),
            ],
        },
        {
            id: 'monochromatic',
            name: 'Monokromatik',
            desc: 'Elegan & profesional',
            emoji: '🖤',
            colors: [
                primaryHex,
                hslToHex(h, Math.max(s - 20, 15), Math.max(l - 18, 20)),
                hslToHex(h, Math.max(s - 45, 8), Math.min(l + 38, 96)),
            ],
        },
    ];
}

const OnboardingView = ({ setBrandDNA, businesses, setBusinesses, setCurrentView }) => {
    const { user } = useAuth();
    const { isGenerating: isGeneratingAI, templates: generatedTemplates, error: generateError, generateTemplates } = useGenerateTemplates();
    const [step, setStep] = useState(1);
    const [localBrand, setLocalBrand] = useState({
        name: '',
        category: '',
        product: '',
        colorSchema: 'ocean-breeze',
        primaryColor: '#0891B2',
        secondaryColor: '#14B8A6',
        tertiaryColor: '#ECFEFF',
        designTemplate: [],
        fontStyle: ['modern'],
        typography: { judul: 'bold', subJudul: 'modern', deskripsi: 'modern' },
        designStyle: ['minimal'],
        tone: 'friendly',
        logo: null,
    });
    const [templateTab, setTemplateTab] = useState('upload');
    const [typoTab, setTypoTab] = useState('preset');
    const [customPrimaryInput, setCustomPrimaryInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPalettes, setGeneratedPalettes] = useState([]);
    const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
    const [savedBusinessId, setSavedBusinessId] = useState(null);

    const handleGenerateTemplate = async () => {
        if (!user) return;
        setIsGeneratingTemplate(true);

        try {
            // Save business first to get an ID
            let businessId = savedBusinessId;
            if (!businessId) {
                const businessData = {
                    user_id: user.id,
                    name: localBrand.name,
                    category: localBrand.category,
                    product: localBrand.product || null,
                    website: localBrand.website || null,
                    color_primary: localBrand.primaryColor,
                    color_secondary: localBrand.secondaryColor,
                    color_tertiary: localBrand.tertiaryColor || null,
                    color_schema: localBrand.colorSchema || 'custom',
                    typography_preset: null,
                    typography_custom: localBrand.typography || null,
                    logo_base64: localBrand.logo || null,
                    design_templates: [],
                };
                const { data, error } = await supabase
                    .from('businesses')
                    .insert(businessData)
                    .select()
                    .single();
                if (error) {
                    console.error('Error saving business:', error);
                    setIsGeneratingTemplate(false);
                    return;
                }
                businessId = data.id;
                setSavedBusinessId(businessId);
            }

            // Generate templates via edge function
            const result = await generateTemplates({
                businessId,
                formats: ['ig_post'],
                variationsPerFormat: 6,
            });

            if (result) {
                setShowTemplateModal(true);
            }
        } catch (err) {
            console.error('Generate template error:', err);
        } finally {
            setIsGeneratingTemplate(false);
        }
    };

    const handleNext = () => {
        if (step < STEPS.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else setCurrentView('dashboard');
    };

    const handleSelectColor = (schema) => {
        setLocalBrand({
            ...localBrand,
            colorSchema: schema.id,
            primaryColor: schema.colors[0],
            secondaryColor: schema.colors[1],
            tertiaryColor: schema.colors[2],
        });
    };

    const handleSwitchToManual = () => {
        setCustomPrimaryInput('');
        setGeneratedPalettes([]);
        setSelectedPaletteIdx(null);
        setIsGenerating(false);
        setLocalBrand({ ...localBrand, colorSchema: 'custom' });
    };

    const handleGeneratePalettes = () => {
        if (!customPrimaryInput || customPrimaryInput.length < 7) return;
        setIsGenerating(true);
        setGeneratedPalettes([]);
        setSelectedPaletteIdx(null);
        // Dramatic loading: 2 seconds
        setTimeout(() => {
            const palettes = generate4Palettes(customPrimaryInput);
            setGeneratedPalettes(palettes);
            setIsGenerating(false);
        }, 2000);
    };

    const handleSelectGeneratedPalette = (palette, idx) => {
        setSelectedPaletteIdx(idx);
        setLocalBrand({
            ...localBrand,
            colorSchema: 'custom',
            primaryColor: palette.colors[0],
            secondaryColor: palette.colors[1],
            tertiaryColor: palette.colors[2],
        });
    };

    const handleFinish = async () => {
        setIsSaving(true);
        const newBrand = { ...localBrand };

        if (user) {
            try {
                if (savedBusinessId) {
                    // Business already saved during template generation, just update it
                    const updateData = {
                        name: newBrand.name,
                        category: newBrand.category,
                        product: newBrand.product || null,
                        website: newBrand.website || null,
                        color_primary: newBrand.primaryColor,
                        color_secondary: newBrand.secondaryColor,
                        color_tertiary: newBrand.tertiaryColor || null,
                        color_schema: newBrand.colorSchema || 'custom',
                        typography_preset: null,
                        typography_custom: newBrand.typography || null,
                        logo_base64: newBrand.logo || null,
                        design_templates: newBrand.designTemplate || [],
                    };
                    const { error } = await supabase
                        .from('businesses')
                        .update(updateData)
                        .eq('id', savedBusinessId);
                    if (error) console.error('Error updating business:', error);
                    newBrand.id = savedBusinessId;
                } else {
                    // Save new business
                    const businessData = {
                        user_id: user.id,
                        name: newBrand.name,
                        category: newBrand.category,
                        product: newBrand.product || null,
                        website: newBrand.website || null,
                        color_primary: newBrand.primaryColor,
                        color_secondary: newBrand.secondaryColor,
                        color_tertiary: newBrand.tertiaryColor || null,
                        color_schema: newBrand.colorSchema || 'custom',
                        typography_preset: null,
                        typography_custom: newBrand.typography || null,
                        logo_base64: newBrand.logo || null,
                        design_templates: newBrand.designTemplate || [],
                    };
                    const { data, error } = await supabase
                        .from('businesses')
                        .insert(businessData)
                        .select()
                        .single();
                    if (error) {
                        console.error('Error saving business:', error);
                    } else if (data) {
                        newBrand.id = data.id;
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            }
        }

        setBrandDNA(newBrand);
        const existingIdx = businesses.findIndex(b => b.name === newBrand.name);
        if (existingIdx >= 0) {
            const updated = [...businesses];
            updated[existingIdx] = newBrand;
            setBusinesses(updated);
        } else {
            setBusinesses([...businesses, newBrand]);
        }
        setIsSaving(false);
        setCurrentView('dashboard');
    };

    const canProceed = () => {
        if (step === 1) return localBrand.name.trim().length > 0 && localBrand.category.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl animation-fade-in">

                {/* Card — berisi header + progress + konten */}
                <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-8 mb-6">

                    {/* Badge + Judul + Subjudul */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary-darker rounded-full text-xs font-bold mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            Setup Profil Bisnis
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">
                            {step === 1 && 'Kenalkan bisnis Anda'}
                            {step === 2 && 'Pilih palet warna brand'}
                            {step === 3 && 'Tipografi brand'}
                            {step === 4 && 'Desain template brand'}
                        </h2>
                        <p className="text-slate-500 mt-1 text-sm">
                            Langkah {step} dari {STEPS.length}
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step > s.id ? 'bg-primary text-white' :
                                    step === s.id ? 'bg-primary text-white ring-4 ring-primary/20' :
                                        'bg-slate-200 text-slate-400'
                                    }`}>
                                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-0.5 w-10 rounded-full transition-all ${step > s.id ? 'bg-primary' : 'bg-slate-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100 mb-6" />
                    {/* Step 1: Nama + Kategori digabung */}
                    {step === 1 && (
                        <div className="space-y-6 animation-fade-in">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Bisnis</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={localBrand.name}
                                    onChange={e => setLocalBrand({ ...localBrand, name: e.target.value })}
                                    placeholder="Contoh: Kopi Nusantara, Gaya Fashion, dll."
                                    className="w-full pl-4 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                                />
                                {false && localBrand.name && (
                                    <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/20 animation-fade-in flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Instagram:</span>
                                        <span className="font-black text-primary text-sm">@{localBrand.name.toLowerCase().replace(/\s+/g, '_')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Bisnis</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border transition-all text-left ${localBrand.category ? 'border-primary/50 bg-white' : 'border-slate-200 bg-slate-50'}`}
                                    >
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span className={`text-sm flex-1 ${localBrand.category ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                                            {localBrand.category || 'Pilih kategori bisnis...'}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isCategoryDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)} />
                                            <div className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 max-h-48 overflow-y-auto animation-fade-in">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setLocalBrand({ ...localBrand, category: cat.label, product: '' });
                                                            setProductSearch('');
                                                            setIsCategoryDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${localBrand.category === cat.label ? 'bg-primary/10 text-primary-darker font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Produk / Jasa */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Produk / Jasa yang Ditawarkan</label>
                                <div className="relative">
                                    <div className="relative flex items-center">
                                        <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={productSearch}
                                            onChange={e => {
                                                setProductSearch(e.target.value);
                                                setIsProductDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsProductDropdownOpen(true)}
                                            placeholder={localBrand.category ? `Cari produk/jasa di ${localBrand.category}...` : 'Pilih kategori dulu, lalu ketik produk/jasa'}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/50 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                                        />
                                    </div>

                                    {isProductDropdownOpen && (localBrand.category || productSearch) && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsProductDropdownOpen(false)} />
                                            <div className="absolute z-20 mt-2 w-full bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl py-2 max-h-48 overflow-y-auto animation-fade-in">
                                                {(PRODUCT_SUGGESTIONS[localBrand.category] || [])
                                                    .filter(p => !productSearch || p.toLowerCase().includes(productSearch.toLowerCase()))
                                                    .map(suggestion => (
                                                        <button
                                                            key={suggestion}
                                                            onClick={() => {
                                                                setLocalBrand({ ...localBrand, product: suggestion });
                                                                setProductSearch(suggestion);
                                                                setIsProductDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${localBrand.product === suggestion ? 'bg-primary/10 text-primary-darker font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))
                                                }
                                                {productSearch && !(PRODUCT_SUGGESTIONS[localBrand.category] || []).some(p => p.toLowerCase() === productSearch.toLowerCase()) && (
                                                    <button
                                                        onClick={() => {
                                                            setLocalBrand({ ...localBrand, product: productSearch });
                                                            setIsProductDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-primary font-bold hover:bg-primary/5 transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">+</span>
                                                        Gunakan "{productSearch}"
                                                    </button>
                                                )}
                                                {!productSearch && !(PRODUCT_SUGGESTIONS[localBrand.category] || []).length && (
                                                    <p className="px-4 py-3 text-xs text-slate-400">Pilih kategori bisnis terlebih dahulu.</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {localBrand.product && (
                                    <div className="flex items-center gap-2 animation-fade-in">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-darker text-xs font-bold">
                                            {localBrand.product}
                                            <button onClick={() => { setLocalBrand({ ...localBrand, product: '' }); setProductSearch(''); }} className="hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website Bisnis <span className="text-slate-400 font-medium normal-case">(Opsional)</span></label>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="url"
                                        value={localBrand.website || ''}
                                        onChange={e => setLocalBrand({ ...localBrand, website: e.target.value })}
                                        placeholder="https://www.contoh.com"
                                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logo Bisnis (Opsional)</label>
                                <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-primary/50 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                        {(localBrand.logoPreview || localBrand.logo) ? (
                                            <img src={localBrand.logoPreview || localBrand.logo} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700">Pilih atau Tarik Logo Kesini</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Format PNG, JPG, SVG maks 5MB.</p>
                                    </div>
                                    <div className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm">
                                        <Upload className="w-3.5 h-3.5" /> Pilih File
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const previewUrl = URL.createObjectURL(file);
                                                setLocalBrand(prev => ({ ...prev, logoPreview: previewUrl }));
                                                try {
                                                    const { compressImage } = await import('./utils/imageCompression');
                                                    const compressed = await compressImage(file, { maxWidth: 512, maxHeight: 512, quality: 0.8 });
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setLocalBrand(prev => ({ ...prev, logo: reader.result, logoPreview: previewUrl }));
                                                    };
                                                    reader.readAsDataURL(compressed);
                                                } catch {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setLocalBrand(prev => ({ ...prev, logo: reader.result, logoPreview: previewUrl }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (() => {
                        const isManual = localBrand.colorSchema === 'custom';
                        return (
                            <div className="animation-fade-in space-y-5">
                                {/* Tab: Preset vs Manual */}
                                <div className="flex p-1 bg-slate-100 rounded-2xl">
                                    <button
                                        onClick={() => {
                                            if (isManual) {
                                                // kembali ke preset, pilih yang pertama
                                                handleSelectColor(COLOR_SCHEMAS[0]);
                                            }
                                        }}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isManual ? 'bg-white text-primary-darker shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Pilih Preset
                                    </button>
                                    <button
                                        onClick={() => handleSwitchToManual()}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isManual ? 'bg-white text-primary-darker shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Atur Manual
                                    </button>
                                </div>

                                {/* Preset Grid */}
                                {!isManual && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {COLOR_SCHEMAS.map(schema => {
                                            const isSelected = localBrand.colorSchema === schema.id;
                                            return (
                                                <button
                                                    key={schema.id}
                                                    onClick={() => handleSelectColor(schema)}
                                                    className={`p-3 rounded-2xl border-2 flex flex-col gap-2.5 transition-all text-left ${isSelected
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-slate-100 hover:border-primary/40 bg-white'
                                                        }`}
                                                >
                                                    {/* Color bar — 3 horizontal segments */}
                                                    <div className="flex w-full h-8 rounded-lg overflow-hidden">
                                                        <div className="flex-[2]" style={{ backgroundColor: schema.colors[0] }} />
                                                        <div className="flex-[2]" style={{ backgroundColor: schema.colors[1] }} />
                                                        <div className="flex-1" style={{ backgroundColor: schema.colors[2] }} />
                                                    </div>
                                                    {/* Name + check */}
                                                    <div className="flex items-center justify-between px-0.5">
                                                        <span className={`text-xs font-bold ${isSelected ? 'text-primary-darker' : 'text-slate-700'}`}>
                                                            {schema.name}
                                                        </span>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Manual — Primary input + Generate */}
                                {isManual && (
                                    <div className="space-y-5">

                                        {/* Phase 1: Primary color input */}
                                        <div className="p-5 bg-gradient-to-r from-slate-50 to-cyan-50/30 rounded-2xl border-2 border-dashed border-primary/30">
                                            <p className="text-sm font-black text-slate-800 mb-1">Masukkan Warna Primer Brand Anda</p>
                                            <p className="text-xs text-slate-500 mb-4">Kami akan generate 4 palet warna harmonis dari warna ini</p>
                                            <div className="flex items-center gap-3">
                                                {/* Color swatch + native picker */}
                                                <label htmlFor="primary-gen-picker" className="relative cursor-pointer shrink-0">
                                                    <div
                                                        className="w-12 h-12 rounded-xl border-2 shadow-md transition-all hover:scale-105 flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: customPrimaryInput || '#e2e8f0',
                                                            borderColor: customPrimaryInput ? customPrimaryInput : '#cbd5e1',
                                                        }}
                                                    >
                                                        {!customPrimaryInput && <span className="text-2xl">🎨</span>}
                                                    </div>
                                                    <input
                                                        id="primary-gen-picker"
                                                        type="color"
                                                        value={customPrimaryInput || '#0891b2'}
                                                        onChange={e => setCustomPrimaryInput(e.target.value)}
                                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                </label>

                                                {/* HEX text input */}
                                                <input
                                                    type="text"
                                                    value={customPrimaryInput}
                                                    placeholder="#e.g. #FF5733"
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
                                                            setCustomPrimaryInput(val.startsWith('#') ? val : '#' + val);
                                                        }
                                                    }}
                                                    className="flex-1 px-3 py-2.5 text-sm font-mono font-bold border-2 border-slate-200 rounded-xl bg-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 uppercase placeholder-slate-300 transition-all"
                                                    maxLength={7}
                                                />

                                                {/* Generate button */}
                                                <button
                                                    onClick={handleGeneratePalettes}
                                                    disabled={!customPrimaryInput || customPrimaryInput.length < 7 || isGenerating}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark disabled:from-slate-300 disabled:to-slate-300 text-white text-sm font-black rounded-xl shadow-primary-sm disabled:shadow-none transition-all hover:shadow-primary-lg active:scale-95 whitespace-nowrap"
                                                >
                                                    ✨ Generate
                                                </button>
                                            </div>
                                        </div>

                                        {/* Phase 2: Dramatic loading */}
                                        {isGenerating && (
                                            <div className="flex flex-col items-center justify-center py-10 gap-4 animation-fade-in">
                                                {/* Spinning rings */}
                                                <div className="relative w-16 h-16">
                                                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                                                    <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                                                    <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary-dark border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
                                                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                                                        🎨
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-black text-slate-800 text-sm">Menganalisis warna...</p>
                                                    <p className="text-xs text-slate-400 mt-1">Menghitung harmoni warna terbaik untuk brand Anda</p>
                                                </div>
                                                {/* Animated color bars */}
                                                <div className="flex gap-1.5">
                                                    {[customPrimaryInput, '#94a3b8', '#cbd5e1', '#e2e8f0'].map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-8 h-2 rounded-full animate-pulse"
                                                            style={{ backgroundColor: c, animationDelay: `${i * 0.15}s` }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Phase 3: 4 Palette recommendations */}
                                        {!isGenerating && generatedPalettes.length > 0 && (
                                            <div className="space-y-3 animation-fade-in">
                                                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                                    ✨ 4 Rekomendasi Palet — Pilih yang paling cocok
                                                </p>
                                                {generatedPalettes.map((palette, idx) => (
                                                    <button
                                                        key={palette.id}
                                                        onClick={() => handleSelectGeneratedPalette(palette, idx)}
                                                        className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${selectedPaletteIdx === idx
                                                            ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                                                            : 'border-slate-100 hover:border-primary/40 bg-white hover:bg-slate-50'}`}
                                                    >
                                                        {/* 3-color strip */}
                                                        <div className="flex gap-1 shrink-0">
                                                            {palette.colors.map((c, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`rounded-lg border border-slate-200/60 shadow-sm ${i === 0 ? 'w-10 h-10' : 'w-7 h-10'}`}
                                                                    style={{ backgroundColor: c }}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base">{palette.emoji}</span>
                                                                <p className="font-black text-slate-800 text-sm">{palette.name}</p>
                                                                {selectedPaletteIdx === idx && (
                                                                    <span className="ml-auto text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">Dipilih</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-0.5">{palette.desc}</p>
                                                            <div className="flex gap-1.5 mt-2">
                                                                {palette.colors.map((c, i) => (
                                                                    <span key={i} className="text-[9px] font-mono text-slate-400 uppercase">{c}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}

                                                {/* Re-generate with different primary */}
                                                <button
                                                    onClick={() => { setGeneratedPalettes([]); setSelectedPaletteIdx(null); setCustomPrimaryInput(''); }}
                                                    className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-primary-darker transition-colors"
                                                >
                                                    ↺ Coba warna primer lain
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })()}


                    {/* Step 3 — Tipografi Brand (swapped) */}
                    {step === 4 && (
                        <div className="space-y-4 animation-fade-in">
                            {/* Upload Desain — always shown as default */}
                            <div className="space-y-4">
                                {(localBrand.designTemplate || []).length === 0 && (
                                    <>
                                        <div className="flex flex-col items-center justify-center py-12 gap-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">📁</div>
                                            <div className="text-center">
                                                <p className="font-bold text-slate-700 text-sm">Upload file desain Anda</p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG, atau PDF — maks. 10MB</p>
                                            </div>
                                            <label className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-primary-dark transition-colors">
                                                Pilih File
                                                <input type="file" accept="image/*,.pdf" className="hidden" />
                                            </label>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                                            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400 font-medium">atau</span></div>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={handleGenerateTemplate}
                                    disabled={isGeneratingTemplate || isGeneratingAI}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-8 bg-primary/10 hover:bg-primary/20 text-primary-darker font-bold rounded-2xl transition-colors text-[15px] disabled:opacity-60"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {isGeneratingTemplate || isGeneratingAI ? 'Generating...' : 'Generate Template Desain'}
                                </button>

                                {/* Dramatic generating loading */}
                                {isGeneratingTemplate && ReactDOM.createPortal(
                                    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md animate-fade-in">
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
                                        <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">AI sedang merancang template...</h2>
                                        <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-8">
                                            Menganalisis brand DNA & membuat rekomendasi desain terbaik untuk brand Anda.
                                        </p>
                                        {/* Progress bar */}
                                        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary to-primary-darker rounded-full animate-pulse" style={{ width: '70%' }} />
                                        </div>
                                    </div>,
                                    document.body
                                )}

                                {/* Selected templates preview */}
                                {(localBrand.designTemplate || []).length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                <p className="text-xs font-bold text-primary-darker">
                                                    {(localBrand.designTemplate || []).length} template dipilih
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowTemplateModal(true)}
                                                className="text-xs font-bold text-primary hover:underline"
                                            >
                                                Ubah
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {generatedTemplates.filter(tpl => (localBrand.designTemplate || []).includes(tpl.id)).map(tpl => (
                                                <div key={tpl.id} className="rounded-xl border border-primary/20 overflow-hidden bg-white shadow-sm">
                                                    <div className="w-full aspect-square">
                                                        <img src={tpl.image_base64} alt="Template" className="w-full h-full object-cover" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-600 text-center py-1.5 truncate px-1">Template {(tpl.variation_index ?? 0) + 1}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Template Picker Modal */}
                            {showTemplateModal && ReactDOM.createPortal(
                                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                    {/* Backdrop */}
                                    <div
                                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                        onClick={() => setShowTemplateModal(false)}
                                    />
                                    {/* Modal content */}
                                    <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animation-fade-in">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900">Pilih Template Desain</h3>
                                                <p className="text-xs text-slate-400 mt-0.5">Pilih satu atau lebih template untuk brand Anda</p>
                                            </div>
                                            <button
                                                onClick={() => setShowTemplateModal(false)}
                                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                                            >
                                                <X className="w-4 h-4 text-slate-500" />
                                            </button>
                                        </div>

                                        {/* Template Grid — scrollable */}
                                        <div className="flex-1 overflow-y-auto p-6">
                                            {generateError && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                                                    {generateError}
                                                </div>
                                            )}
                                            {generatedTemplates.length === 0 && !generateError && (
                                                <div className="text-center py-12 text-slate-400 text-sm">
                                                    Belum ada template yang di-generate.
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3">
                                                {generatedTemplates.map(tpl => {
                                                    const isSelected = (localBrand.designTemplate || []).includes(tpl.id);
                                                    return (
                                                        <button
                                                            key={tpl.id}
                                                            onClick={() => {
                                                                const current = localBrand.designTemplate || [];
                                                                const updated = current.includes(tpl.id)
                                                                    ? current.filter(id => id !== tpl.id)
                                                                    : [...current, tpl.id];
                                                                setLocalBrand({ ...localBrand, designTemplate: updated });
                                                            }}
                                                            className={`rounded-2xl border-2 overflow-hidden flex flex-col transition-all text-left ${isSelected
                                                                ? 'border-primary shadow-md'
                                                                : 'border-slate-100 hover:border-primary/40'
                                                                }`}
                                                        >
                                                            <div className="relative w-full overflow-hidden aspect-square">
                                                                <img src={tpl.image_base64} alt={`Template ${(tpl.variation_index ?? 0) + 1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex items-center justify-between px-3 py-2.5 bg-white">
                                                                <span className={`text-xs font-bold leading-snug ${isSelected ? 'text-primary-darker' : 'text-slate-800'}`}>
                                                                    Template {(tpl.variation_index ?? 0) + 1}
                                                                </span>
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isSelected
                                                                    ? 'bg-primary border-primary'
                                                                    : 'border-slate-300 bg-white'
                                                                    }`}>
                                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                                            <p className="text-xs text-slate-400">
                                                {(localBrand.designTemplate || []).length} template dipilih
                                            </p>
                                            <button
                                                onClick={() => setShowTemplateModal(false)}
                                                className="px-6 py-2.5 bg-primary text-white text-sm font-black rounded-xl hover:bg-primary-dark transition-colors"
                                            >
                                                Selesai
                                            </button>
                                        </div>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                    )}

                    {/* Step 4 — Template Desain (swapped) */}
                    {step === 3 && (() => {
                        const selectedTypo = TYPOGRAPHY_PRESETS.find(t => t.id === localBrand.typography?.preset) || TYPOGRAPHY_PRESETS[0];
                        const toggleTypo = (id) => {
                            setLocalBrand({ ...localBrand, typography: { ...(localBrand.typography || {}), preset: id } });
                        };
                        return (
                            <div className="space-y-4 animation-fade-in">
                                {/* Live typography preview */}
                                <div className="relative bg-white border border-slate-100 rounded-2xl p-5 overflow-hidden shadow-sm">
                                    {/* decorative blob */}
                                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-primary/10 -translate-y-4 translate-x-4" />
                                    <p className="text-[10px] font-black tracking-widest text-primary mb-1">TEKS JUDUL</p>
                                    <p style={selectedTypo.heading} className="text-slate-900 mb-2">
                                        Masa Depan Brand Anda
                                    </p>
                                    <p className="text-[10px] font-black tracking-widest text-primary mb-0.5">SUB JUDUL</p>
                                    <p style={selectedTypo.sub} className="text-slate-700 mb-3">
                                        Kombinasi sempurna antara estetika dan fungsi.
                                    </p>
                                    <p className="text-[10px] font-black tracking-widest text-primary mb-0.5">DESKRIPSI</p>
                                    <p style={selectedTypo.body} className="text-slate-500">
                                        Ini adalah contoh teks paragraf atau deskripsi yang akan ditampilkan
                                        pada desain Anda. Tipografi yang tepat akan memastikan pesan Anda mudah
                                        dibaca dan menarik perhatian audiens secara efektif.
                                    </p>
                                </div>

                                {/* Tab: Template Siap Pakai / Pengaturan Advance */}
                                <div className="flex p-1 bg-slate-100 rounded-2xl">
                                    <button
                                        onClick={() => setTypoTab('preset')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${typoTab === 'preset' ? 'bg-white text-primary-darker shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Template Siap Pakai
                                    </button>
                                    <button
                                        onClick={() => setTypoTab('advance')}
                                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${typoTab === 'advance' ? 'bg-white text-primary-darker shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Pengaturan Advance
                                    </button>
                                </div>

                                {/* Preset grid */}
                                {typoTab === 'preset' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {TYPOGRAPHY_PRESETS.map(preset => {
                                            const isSel = (localBrand.typography?.preset || 'modern-bersih') === preset.id;
                                            return (
                                                <button
                                                    key={preset.id}
                                                    onClick={() => toggleTypo(preset.id)}
                                                    className={`rounded-2xl border-2 overflow-hidden flex flex-col text-left transition-all ${isSel
                                                        ? 'border-primary shadow-md'
                                                        : 'border-slate-100 hover:border-primary/40 bg-white'
                                                        }`}
                                                >
                                                    {/* Name + checkbox */}
                                                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                                                        <span className={`text-xs font-bold ${isSel ? 'text-primary-darker' : 'text-slate-700'}`}>
                                                            {preset.name}
                                                        </span>
                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isSel ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
                                                            }`}>
                                                            {isSel && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                    </div>
                                                    {/* Typography preview */}
                                                    <div className="px-3 pb-3 space-y-1">
                                                        <p style={{ ...preset.heading, fontSize: '1.1rem' }} className="text-slate-900 leading-tight">
                                                            Ag
                                                        </p>
                                                        <p style={{ ...preset.sub, fontSize: '0.75rem' }} className="text-slate-700">
                                                            Kombinasi ideal
                                                        </p>
                                                        <p style={{ ...preset.body, fontSize: '0.68rem' }} className="text-slate-500">
                                                            Teks paragraf yang nyaman dibaca oleh mata.
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Advance settings */}
                                {typoTab === 'advance' && (
                                    <div className="space-y-4">
                                        {[{ label: 'Judul', key: 'heading' }, { label: 'Sub Judul', key: 'sub' }, { label: 'Deskripsi', key: 'body' }].map(({ label, key }) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-wider text-primary">{label}</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-slate-500 font-semibold">Ketebalan</label>
                                                        <select
                                                            value={localBrand.typography?.[key]?.fontWeight || 700}
                                                            onChange={e => setLocalBrand({
                                                                ...localBrand,
                                                                typography: { ...localBrand.typography, [key]: { ...(localBrand.typography?.[key] || {}), fontWeight: Number(e.target.value) } }
                                                            })}
                                                            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value={300}>Tipis</option>
                                                            <option value={400}>Normal</option>
                                                            <option value={600}>Semi Bold</option>
                                                            <option value={700}>Bold</option>
                                                            <option value={800}>Extra Bold</option>
                                                            <option value={900}>Black</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-slate-500 font-semibold">Ukuran</label>
                                                        <select
                                                            value={localBrand.typography?.[key]?.fontSize || '1rem'}
                                                            onChange={e => setLocalBrand({
                                                                ...localBrand,
                                                                typography: { ...localBrand.typography, [key]: { ...(localBrand.typography?.[key] || {}), fontSize: e.target.value } }
                                                            })}
                                                            className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        >
                                                            <option value="0.75rem">XS</option>
                                                            <option value="0.875rem">S</option>
                                                            <option value="1rem">M</option>
                                                            <option value="1.25rem">L</option>
                                                            <option value="1.5rem">XL</option>
                                                            <option value="1.875rem">2XL</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                    <button
                        onClick={handleBack}
                        className="px-6 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                    <button
                        onClick={step === STEPS.length ? handleFinish : handleNext}
                        disabled={!canProceed() || isSaving}
                        className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker disabled:from-slate-300 disabled:to-slate-300 text-white font-bold rounded-2xl transition-all shadow-primary disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {step === STEPS.length ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Selesai & Mulai</>
                                ) : (
                                    <>Lanjut <ArrowRight className="w-5 h-5" /></>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingView;
