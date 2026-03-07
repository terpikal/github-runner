# Edit src/integrations/supabase/client.ts

Ganti isi file dengan:

```typescript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJ...YOUR_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

## Di mana mendapatkan nilai-nilai ini:
1. Buka Supabase Dashboard > Settings > API
2. **Project URL** → gunakan sebagai `SUPABASE_URL`
3. **anon/public key** → gunakan sebagai `SUPABASE_PUBLISHABLE_KEY`

## Update useGenerateTemplates.js
Buka `src/hooks/useGenerateTemplates.js`, ganti baris 4:

```javascript
// SEBELUM (Lovable Cloud):
const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-templates`;

// SESUDAH (Supabase eksternal):
const GENERATE_URL = "https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-templates";
```

Atau, buat file `.env` lokal (jika develop di luar Lovable):
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...YOUR_ANON_KEY
```
