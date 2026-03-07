-- ============================================================
-- POSTIBEL: Full Schema Migration for External Supabase
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Function: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 2. Table: businesses
CREATE TABLE IF NOT EXISTS public.businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    product text,
    website text,
    logo_base64 text,
    logo_path text,
    color_primary text NOT NULL DEFAULT '#000000',
    color_secondary text NOT NULL DEFAULT '#ffffff',
    color_tertiary text,
    color_schema text NOT NULL DEFAULT 'bold',
    typography_preset text DEFAULT 'modern-clean',
    typography_custom jsonb,
    design_templates text[] DEFAULT '{}'::text[],
    brief_template text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Table: design_templates
CREATE TABLE IF NOT EXISTS public.design_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    business_id uuid NOT NULL REFERENCES public.businesses(id),
    image_base64 text NOT NULL,
    format text NOT NULL DEFAULT 'ig_post',
    width integer NOT NULL DEFAULT 1080,
    height integer NOT NULL DEFAULT 1080,
    prompt_used text,
    style_metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Trigger: auto-update updated_at on businesses
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_templates ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: businesses
CREATE POLICY "Users can view their own business"
    ON public.businesses FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business"
    ON public.businesses FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business"
    ON public.businesses FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business"
    ON public.businesses FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. RLS Policies: design_templates
CREATE POLICY "Users can view own templates"
    ON public.design_templates FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
    ON public.design_templates FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
    ON public.design_templates FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
