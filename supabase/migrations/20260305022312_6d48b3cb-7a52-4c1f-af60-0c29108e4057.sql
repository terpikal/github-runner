
-- Create businesses table
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Profil
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    product TEXT,
    website TEXT,
    
    -- Logo (base64 + path)
    logo_base64 TEXT,
    logo_path TEXT,
    
    -- Branding
    color_primary TEXT NOT NULL DEFAULT '#000000',
    color_secondary TEXT NOT NULL DEFAULT '#ffffff',
    color_tertiary TEXT,
    color_schema TEXT NOT NULL DEFAULT 'bold',
    typography_preset TEXT DEFAULT 'modern-clean',
    typography_custom JSONB,
    
    -- Template
    design_templates TEXT[] DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own business"
    ON public.businesses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own business"
    ON public.businesses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business"
    ON public.businesses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business"
    ON public.businesses FOR DELETE
    USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON public.businesses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
