# Deploy Edge Function ke Supabase Eksternal

## Prerequisites
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_REF`

## Setup Secrets
Jalankan di terminal:
```bash
supabase secrets set OPENROUTER_API_KEY="sk-or-v1-YOUR_KEY_HERE"
```

> SUPABASE_URL, SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY sudah otomatis tersedia di Edge Functions.

## Deploy
```bash
supabase functions deploy generate-templates --no-verify-jwt
```

## Test
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-templates \
  -H "Authorization: Bearer USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"business_id": "...", "formats": ["ig_post"], "variations_per_format": 1}'
```
