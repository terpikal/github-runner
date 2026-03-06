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
  website?: string;
  color_primary: string;
  color_secondary: string;
  color_tertiary?: string;
  color_schema: string;
  typography_preset?: string;
  logo_base64?: string;
}

interface TemplateRequest {
  business_id?: string;
  business_data?: BusinessData;
  formats: string[];
  variations_per_format: number;
  style_preferences?: string;
  save_to_db?: boolean;
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
    "retro vintage with warm tones and textured feel",
    "futuristic tech with glassmorphism effects",
    "nature-inspired organic shapes and earthy palette",
  ];
  const styleVariation = styles[variationIndex % styles.length];

  const websiteRule = business.website
    ? `- IMPORTANT: Include the website "${business.website}" visibly in the design (e.g. at the bottom or near the logo area). Use the EXACT text "${business.website}" — do not modify or abbreviate it.`
    : `- Do NOT include any website URL or web address in the design.`;

  return `Create a professional ${config.label} design template (${config.ratio} aspect ratio) for a business called "${business.name}" in the "${business.category}" industry.
${business.product ? `Their main product/service: ${business.product}` : ""}

BRAND COLORS:
- Primary: ${business.color_primary}
- Secondary: ${business.color_secondary}
${business.color_tertiary ? `- Tertiary: ${business.color_tertiary}` : ""}
- Color scheme: ${business.color_schema}

DESIGN STYLE: ${styleVariation}

REQUIREMENTS:
- This is a TEMPLATE design — include areas for headline text, body text, and product image
- Use the brand colors prominently following the 60-30-10 rule
- Create clear visual hierarchy with a strong focal point
- Include decorative elements that match the brand's industry
- For any text areas, use Lorem ipsum dummy text (e.g. "Lorem Ipsum Dolor Sit Amet" for headlines, "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." for body text)
- Design should feel cohesive with the brand identity
- Leave space for a logo in a corner
- Make it visually striking and professional
- The design should work as a reusable template
${websiteRule}

Use Lorem ipsum placeholder text for all text elements. DO NOT leave text areas empty or use colored rectangles — always fill them with realistic-looking Lorem ipsum dummy text to show how the final design will look.`;
}

async function generateTemplateImage(
  prompt: string,
  apiKey: string,
  businessLogoBase64?: string
): Promise<string | null> {
  // Only use logo if it's actual base64 data, not a blob URL
  if (businessLogoBase64 && (businessLogoBase64.startsWith('blob:') || businessLogoBase64.startsWith('http'))) {
    businessLogoBase64 = undefined;
  }
  const messages: any[] = [
    { role: "system", content: GRAPHIC_DESIGNER_SYSTEM_PROMPT },
  ];

  if (businessLogoBase64) {
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://postibel.lovable.app",
      "X-Title": "Postibel",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-preview-image-generation",
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
    const { business_id, business_data, formats, variations_per_format = 3, save_to_db = true } = body;

    if ((!business_id && !business_data) || !formats || formats.length === 0) {
      return new Response(JSON.stringify({ error: "business_id or business_data, and formats are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let business: BusinessData;

    if (business_data) {
      // Use inline business data (no DB fetch needed)
      business = business_data;
    } else {
      // Fetch business data from DB
      const { data: bizData, error: bizError } = await supabaseAuth
        .from("businesses")
        .select("*")
        .eq("id", business_id!)
        .eq("user_id", user.id)
        .single();

      if (bizError || !bizData) {
        return new Response(JSON.stringify({ error: "Business not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      business = bizData as BusinessData;
    }

    // Check cache only if we have a business_id and save_to_db is true
    const requestedFormats = formats.slice(0, 3); // max 3 formats
    const cachedResults: any[] = [];
    const formatsToGenerate: string[] = [];

    if (business_id && save_to_db) {
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
    } else {
      formatsToGenerate.push(...requestedFormats);
    }

    // Generate templates in parallel batches to avoid timeout
    const results: any[] = [...cachedResults];
    const errors: string[] = [];
    const BATCH_SIZE = 3; // Process 3 at a time to balance speed vs rate limits

    // Build all generation tasks
    interface GenTask { format: string; variationIndex: number; config: { width: number; height: number; label: string; ratio: string } }
    const tasks: GenTask[] = [];
    for (const format of formatsToGenerate) {
      const config = FORMAT_CONFIGS[format];
      if (!config) {
        errors.push(`Unknown format: ${format}`);
        continue;
      }
      for (let i = 0; i < variations_per_format; i++) {
        tasks.push({ format, variationIndex: i, config });
      }
    }

    // Process in batches
    for (let batchStart = 0; batchStart < tasks.length; batchStart += BATCH_SIZE) {
      const batch = tasks.slice(batchStart, batchStart + BATCH_SIZE);

      // Add delay between batches (skip first)
      if (batchStart > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const batchResults = await Promise.allSettled(
        batch.map(async (task) => {
          const prompt = buildPrompt(business as BusinessData, task.format, task.variationIndex);
          let imageBase64 = await generateTemplateImage(
            prompt,
            LOVABLE_API_KEY,
            business.logo_base64 || undefined
          );

          // Retry once on failure
          if (!imageBase64) {
            console.warn(`Retry: ${task.format} variation ${task.variationIndex + 1}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            imageBase64 = await generateTemplateImage(prompt, LOVABLE_API_KEY, business.logo_base64 || undefined);
          }

          if (!imageBase64) {
            throw new Error(`GENERATION_FAILED:${task.format}:${task.variationIndex}`);
          }

          return { imageBase64, prompt, task };
        })
      );

      for (const result of batchResults) {
        if (result.status === "rejected") {
          const msg = result.reason instanceof Error ? result.reason.message : "Unknown error";
          if (msg === "RATE_LIMITED") {
            errors.push("Rate limited - some variations skipped");
          } else if (msg === "PAYMENT_REQUIRED") {
            return new Response(
              JSON.stringify({ error: "AI credits depleted.", partial_results: results }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          } else if (msg.startsWith("GENERATION_FAILED:")) {
            const parts = msg.split(":");
            errors.push(`Failed to generate ${parts[1]} variation ${Number(parts[2]) + 1}`);
          } else {
            errors.push(msg);
          }
          continue;
        }

        const { imageBase64, prompt, task } = result.value;

        if (save_to_db && business_id) {
          const { data: template, error: insertError } = await supabaseAuth
            .from("design_templates")
            .insert({
              user_id: user.id,
              business_id: business_id,
              image_base64: imageBase64,
              format: task.format,
              width: task.config.width,
              height: task.config.height,
              prompt_used: prompt,
              style_metadata: {
                brand_colors: {
                  primary: business.color_primary,
                  secondary: business.color_secondary,
                  tertiary: business.color_tertiary,
                },
                color_schema: business.color_schema,
                typography_preset: business.typography_preset,
                variation_index: task.variationIndex,
              },
            })
            .select()
            .single();

          if (insertError) {
            console.error("Insert error:", insertError);
            errors.push(`DB insert failed for ${task.format} variation ${task.variationIndex + 1}`);
            continue;
          }

          results.push({
            id: template.id,
            format: task.format,
            width: task.config.width,
            height: task.config.height,
            image_base64: imageBase64,
            variation_index: task.variationIndex,
            cached: false,
          });
        } else {
          results.push({
            id: crypto.randomUUID(),
            format: task.format,
            width: task.config.width,
            height: task.config.height,
            image_base64: imageBase64,
            variation_index: task.variationIndex,
            cached: false,
          });
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
