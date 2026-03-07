# Auth Settings untuk Supabase Eksternal

Di Supabase Dashboard > Authentication > Settings:

1. **Enable Email Auth** → aktifkan
2. **Confirm email** → NONAKTIFKAN (auto-confirm, sesuai setup saat ini)
3. **Site URL** → `https://postibel.lovable.app` (atau URL preview Lovable Anda)
4. **Redirect URLs** → tambahkan:
   - `https://postibel.lovable.app`
   - `https://id-preview--0daac0f3-b2b0-445f-becd-d6542fe3eae3.lovable.app`
   - `http://localhost:5173` (untuk dev)
