
CREATE TABLE public.design_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    image_base64 TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'ig_post',
    width INTEGER NOT NULL DEFAULT 1080,
    height INTEGER NOT NULL DEFAULT 1080,
    prompt_used TEXT,
    style_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.design_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates" ON public.design_templates
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON public.design_templates
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.design_templates
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_design_templates_user_id ON public.design_templates(user_id);
CREATE INDEX idx_design_templates_business_id ON public.design_templates(business_id);
