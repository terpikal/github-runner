import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Graphic Designer Skill - Design principles embedded as system knowledge
const GRAPHIC_DESIGNER_SYSTEM_PROMPT = `You are an expert graphic designer creating social media design templates.

## Design Principles (CRAP)
- **Contrast**: Make differences obvious — size, color, weight
- **Repetition**: Create consistency — reuse colors, fonts, patterns
- **Alignment**: Connect visually — grid, edges
- **Proximity**: Group related items — spacing

## Visual Hierarchy (order of impact)
1. Size — Larger = more important
2. Color/Contrast — Bright catches eye first
3. Position — Top-left priority
4. White Space — Isolation creates emphasis
5. Weight — Bold stands out

## Color System (60-30-10 Rule)
- 60% Dominant (background)
- 30% Secondary (containers, shapes)
- 10% Accent (CTAs, highlights)

## Typography Rules
- Max 2 fonts: 1 display + 1 body
- Hierarchy via size, not font changes
- Line height: 1.4-1.6 body, 1.1-1.2 headlines

## Layout Guidelines
- Use Z-Pattern for marketing/visual content
- Use F-Pattern for text-heavy content
- 8px spacing system (8, 16, 24, 32, 48)
- Ensure ≥20% white space

## Quality Checklist
- Clear hierarchy (squint test)
- Readable at target size
- Max 3-4 colors, 2 fonts
- Contrast 4.5:1+ (WCAG AA)
- Aligned to grid
- Enough white space
- Strong focal point

## Social Media Dimensions
- Instagram Post: 1080×1080 (1:1)
- Instagram Story: 1080×1920 (9:16)
- Reels Thumbnail: 1080×1920 (9:16)`;

interface BusinessData {
  name: string;
  category: string;
  product?: string;
  color_primary: string;
  color_secondary: string;
  color_tertiary?: string;
  color_schema: string;
  typography_preset?: string;
  logo_base64?: string;
}

interface TemplateRequest {
  business_id: string;
  formats: string[]; // ['ig_post', 'ig_story', 'reels_thumbnail']
  variations_per_format: number;
  style_preferences?: string;
}

const FORMAT_CONFIGS: Record<string, { width: number; height: number; label: string; ratio: string }> = {
  ig_post: { width: 1080, height: 1080, label: "Instagram Post", ratio: "1:1" },
  ig_story: { width: 1080, height: 1920, label: "Instagram Story", ratio: "9:16" },
  reels_thumbnail: { width: 1080, height: 1920, label: "Reels Thumbnail", ratio: "9:16" },
};

function buildPrompt(business: BusinessData, format: string, variationIndex: number): string {
  const config = FORMAT_CONFIGS[format];
  const styles = [
    "modern minimalist with bold typography",
    "elegant with luxury feel and subtle gradients",
    "vibrant and energetic with dynamic shapes",
    "clean corporate with professional layout",
    "creative and playful with geometric elements",
    "sophisticated dark theme with neon accents",
  ];
  const styleVariation = styles[variationIndex % styles.length];

  return `Create a professional ${config.label} design template (${config.ratio} aspect ratio) for a business called "${business.name}" in the "${business.category}" industry.
${business.product ? `Their main product/service: ${business.product}` : ""}

BRAND COLORS:
- Primary: ${business.color_primary}
- Secondary: ${business.color_secondary}
${business.color_tertiary ? `- Tertiary: ${business.color_tertiary}` : ""}
- Color scheme: ${business.color_schema}

DESIGN STYLE: ${styleVariation}

REQUIREMENTS:
- This is a TEMPLATE design — include placeholder areas for headline text, body text, and product image
- Use the brand colors prominently following the 60-30-10 rule
- Create clear visual hierarchy with a strong focal point
- Include decorative elements that match the brand's industry
- NO actual text content — use placeholder blocks/lines to indicate text areas
- Design should feel cohesive with the brand identity
- Leave space for a logo in a corner
- Make it visually striking and professional
- The design should work as a reusable template

DO NOT include any real text, words, or letters in the image. Use colored rectangles or lines as text placeholders.`;
}

async function generateTemplateImage(
  prompt: string,
  apiKey: string,
  businessLogoBase64?: string
): Promise<string | null> {
  const messages: any[] = [];

  if (businessLogoBase64) {
    // If logo available, use it as reference for brand consistency
    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt + "\n\nUse the provided logo as a reference for brand identity. Incorporate it subtly into the template design." },
        {
          type: "image_url",
          image_url: { url: businessLogoBase64.startsWith("data:") ? businessLogoBase64 : `data:image/png;base64,${businessLogoBase64}` },
        },
      ],
    });
  } else {
    messages.push({ role: "user", content: prompt });
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image-preview",
      messages,
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new Error("RATE_LIMITED");
    if (status === 402) throw new Error("PAYMENT_REQUIRED");
    const text = await response.text();
    console.error(`AI gateway error [${status}]:`, text);
    throw new Error(`AI_GATEWAY_ERROR_${status}`);
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  return imageUrl || null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create authenticated client to get user
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");

    // Verify the user
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: TemplateRequest = await req.json();
    const { business_id, formats, variations_per_format = 3 } = body;

    if (!business_id || !formats || formats.length === 0) {
      return new Response(JSON.stringify({ error: "business_id and formats are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch business data
    const { data: business, error: bizError } = await supabaseAuth
      .from("businesses")
      .select("*")
      .eq("id", business_id)
      .eq("user_id", user.id)
      .single();

    if (bizError || !business) {
      return new Response(JSON.stringify({ error: "Business not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check cache: if templates already exist for this business+format combo, return cached
    const requestedFormats = formats.slice(0, 3); // max 3 formats
    const cachedResults: any[] = [];
    const formatsToGenerate: string[] = [];

    for (const format of requestedFormats) {
      const { data: existing } = await supabaseAuth
        .from("design_templates")
        .select("*")
        .eq("business_id", business_id)
        .eq("user_id", user.id)
        .eq("format", format)
        .order("created_at", { ascending: false })
        .limit(variations_per_format);

      if (existing && existing.length >= variations_per_format) {
        // Cache hit — use existing templates
        for (const t of existing) {
          cachedResults.push({
            id: t.id,
            format: t.format,
            width: t.width,
            height: t.height,
            image_base64: t.image_base64,
            variation_index: t.style_metadata?.variation_index ?? 0,
            cached: true,
          });
        }
      } else {
        formatsToGenerate.push(format);
      }
    }

    // Generate new templates sequentially (1 by 1) to avoid rate limits
    const results: any[] = [...cachedResults];
    const errors: string[] = [];
    const DELAY_BETWEEN_REQUESTS_MS = 3000; // 3s delay between AI calls

    for (const format of formatsToGenerate) {
      const config = FORMAT_CONFIGS[format];
      if (!config) {
        errors.push(`Unknown format: ${format}`);
        continue;
      }

      for (let i = 0; i < variations_per_format; i++) {
        try {
          // Add delay between requests (skip first)
          if (results.length > cachedResults.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS_MS));
          }

          const prompt = buildPrompt(business as BusinessData, format, i);
          const imageBase64 = await generateTemplateImage(
            prompt,
            LOVABLE_API_KEY,
            business.logo_base64 || undefined
          );

          if (!imageBase64) {
            errors.push(`Failed to generate ${format} variation ${i + 1}`);
            continue;
          }

          // Save to database (acts as cache for future requests)
          const { data: template, error: insertError } = await supabaseAuth
            .from("design_templates")
            .insert({
              user_id: user.id,
              business_id: business_id,
              image_base64: imageBase64,
              format: format,
              width: config.width,
              height: config.height,
              prompt_used: prompt,
              style_metadata: {
                brand_colors: {
                  primary: business.color_primary,
                  secondary: business.color_secondary,
                  tertiary: business.color_tertiary,
                },
                color_schema: business.color_schema,
                typography_preset: business.typography_preset,
                variation_index: i,
              },
            })
            .select()
            .single();

          if (insertError) {
            console.error("Insert error:", insertError);
            errors.push(`DB insert failed for ${format} variation ${i + 1}`);
            continue;
          }

          results.push({
            id: template.id,
            format: format,
            width: config.width,
            height: config.height,
            image_base64: imageBase64,
            variation_index: i,
            cached: false,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          if (msg === "RATE_LIMITED") {
            // Wait longer and retry once
            await new Promise(resolve => setTimeout(resolve, 10000));
            try {
              const prompt = buildPrompt(business as BusinessData, format, i);
              const retryImage = await generateTemplateImage(prompt, LOVABLE_API_KEY, business.logo_base64 || undefined);
              if (retryImage) {
                const { data: t } = await supabaseAuth.from("design_templates").insert({
                  user_id: user.id, business_id, image_base64: retryImage, format,
                  width: config.width, height: config.height, prompt_used: prompt,
                  style_metadata: { variation_index: i },
                }).select().single();
                if (t) results.push({ id: t.id, format, width: config.width, height: config.height, image_base64: retryImage, variation_index: i, cached: false });
                continue;
              }
            } catch {
              // Retry also failed
            }
            return new Response(
              JSON.stringify({ error: "Rate limit exceeded.", partial_results: results }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (msg === "PAYMENT_REQUIRED") {
            return new Response(
              JSON.stringify({ error: "AI credits depleted.", partial_results: results }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          errors.push(`${format} variation ${i + 1}: ${msg}`);
        }
      }
    }

    const cachedCount = results.filter((r: any) => r.cached).length;
    const generatedCount = results.filter((r: any) => !r.cached).length;

    return new Response(
      JSON.stringify({
        success: true,
        templates: results,
        total_generated: results.length,
        from_cache: cachedCount,
        freshly_generated: generatedCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-templates error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
