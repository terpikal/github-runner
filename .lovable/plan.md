## Plan: Implementasi React Router

### Perubahan

**1. `src/main.jsx**` — Hapus route `/design-system` yang terpisah, biarkan semua routing di dalam `App`.

**2. `src/App.jsx**` — Import `useNavigate`, `useLocation`, `Routes`, `Route` dari `react-router-dom`. Ganti `currentView` state dengan `useLocation().pathname` untuk mendeteksi halaman aktif. Ganti semua `setCurrentView('xxx')` dengan `navigate('/xxx')`.

### Route Mapping


| Halaman                    | Path             |
| -------------------------- | ---------------- |
| Buat Konten (Dashboard)    | `/buat_konten`   |
| Hasil Generate             | `/results`       |
| Edit Konten                | `/editor`        |
| Konten Post (Bank/Planner) | `/library`       |
| Foto Model                 | `/foto-model`    |
| Edit Video                 | `/video-editor`  |
| Profil                     | `/profile`       |
| Signup                     | `/signup`        |
| Onboarding                 | `/onboarding`    |
| Generating (loading)       | `/generating`    |
| Design System              | `/design-system` |


### Implementasi Detail

- Buat wrapper `navigate` function yang menggantikan semua `setCurrentView` calls (~226 occurrences)
- Setiap view component tetap sama, hanya cara navigasi yang berubah
- `currentView` dihitung dari `location.pathname` (e.g., `/library` → `'library'`, `/` → `'dashboard'`)
- Sidebar, MobileNav, MobileHeader: `setCurrentView` diganti `navigate`
- State global (editingPost, generatedResults, dll) tetap di level App
- Rendering view: ganti conditional `{currentView === 'xxx' && ...}` dengan `<Routes><Route>` pattern

### Yang Tidak Berubah

- Semua komponen view tetap identik secara visual dan fungsional
- State management tetap sama
- Design system tidak terpengaruh