import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Typography Map ─────────────────────────────────────────────
const TYPOGRAPHY_MAP: Record<string, { heading: string; body: string; style: string }> = {
  "modern-bersih": {
    heading: "Inter (weight 800, tight letter-spacing)",
    body: "Inter (weight 400, clean and readable)",
    style: "Modern, clean, and professional — sharp geometric sans-serif"
  },
  "klasik-elegan": {
    heading: "Georgia serif (weight 700, elegant)",
    body: "Georgia serif (weight 400, italic sub-headings)",
    style: "Classic, elegant, and sophisticated — refined serif typography"
  },
  "tegas-kuat": {
    heading: "Arial Black (weight 900, uppercase, wide letter-spacing)",
    body: "Arial (weight 400, compact line-height)",
    style: "Bold, powerful, and commanding — strong impactful typography"
  },
  "kreatif-unik": {
    heading: "Trebuchet MS (weight 700, italic, wide letter-spacing)",
    body: "Trebuchet MS (weight 400, relaxed line-height)",
    style: "Creative, unique, and playful — dynamic italic typography"
  },
  "hangat-bersahabat": {
    heading: "Verdana (weight 700, no letter-spacing)",
    body: "Verdana (weight 400, generous line-height)",
    style: "Warm, friendly, and approachable — soft rounded typography"
  },
  "minimalis-tipis": {
    heading: "Inter thin (weight 300, very wide letter-spacing)",
    body: "Inter thin (weight 300, airy line-height)",
    style: "Minimalist, thin, and airy — elegant lightweight typography"
  },
};

// ─── Format Configs ─────────────────────────────────────────────
const FORMAT_CONFIGS: Record<string, { width: number; height: number; label: string; ratio: string }> = {
  ig_post: { width: 1080, height: 1080, label: "Instagram Post", ratio: "1:1" },
  ig_story: { width: 1080, height: 1920, label: "Instagram Story", ratio: "9:16" },
  reels_thumbnail: { width: 1080, height: 1920, label: "Reels Thumbnail", ratio: "9:16" },
};

// ─── Interfaces ─────────────────────────────────────────────────
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
  typography_custom?: {
    judul?: string;
    subJudul?: string;
    deskripsi?: string;
  };
  logo_base64?: string;
  brief_template?: string;
}

interface TemplateRequest {
  business_id?: string;
  business_data?: BusinessData;
  formats: string[];
  variations_per_format: number;
  style_preferences?: string;
  save_to_db?: boolean;
}

// ─── Step 1: Generate Design Brief using GPT-5 ─────────────────
async function generateDesignBrief(
  business: BusinessData,
  formats: string[],
  variationsPerFormat: number,
  apiKey: string,
): Promise<string> {
  // Build typography info for the brief prompt
  let typographyInfo = "";
  const presetId = business.typography_preset;
  const typoMap = presetId ? TYPOGRAPHY_MAP[presetId] : null;
  if (typoMap) {
    typographyInfo = `
- Typography preset: ${presetId}
  - Heading: ${typoMap.heading}
  - Body: ${typoMap.body}
  - Style: ${typoMap.style}`;
  } else if (business.typography_custom) {
    const tc = business.typography_custom;
    typographyInfo = `
- Custom typography:
  - Heading: ${tc.judul || "bold"}
  - Sub-heading: ${tc.subJudul || "medium"}
  - Body: ${tc.deskripsi || "regular"}`;
  }

  const formatDescriptions = formats.map(f => {
    const cfg = FORMAT_CONFIGS[f];
    return cfg ? `${cfg.label} (${cfg.ratio}, ${cfg.width}×${cfg.height})` : f;
  }).join(", ");

  const briefPrompt = `You are a senior graphic designer and creative director. Create a comprehensive design brief for a social media design template project.

## Client Information
- Business name: "${business.name}"
- Industry/category: "${business.category}"
${business.product ? `- Main product/service: "${business.product}"` : ""}
${business.website ? `- Website: "${business.website}"` : ""}

## Brand Identity
- Primary color: ${business.color_primary}
- Secondary color: ${business.color_secondary}
${business.color_tertiary ? `- Tertiary color: ${business.color_tertiary}` : ""}
- Color scheme: ${business.color_schema}
${typographyInfo}

## Project Requirements
- Formats needed: ${formatDescriptions}
- Number of variations per format: ${variationsPerFormat}
- Total templates to produce: ${formats.length * variationsPerFormat}

## Your Task
Create a detailed design brief that covers:

1. **Brand Analysis**: Summarize the brand personality based on the business info, colors, and typography
2. **Visual Direction**: Define the overall visual direction — mood, tone, aesthetic
3. **Color Strategy**: How to apply the 60-30-10 rule with the brand colors across all templates
4. **Typography Strategy**: How to use the selected typography to create hierarchy and visual impact
5. **Layout Principles**: Specific layout approaches for each format (considering aspect ratios)
6. **Design Variations**: Define ${variationsPerFormat} distinct style directions for the variations. Each variation must have:
   - A clear style name (e.g., "Bold Minimalist", "Elegant Gradient", "Dynamic Geometric")
   - Key visual characteristics
   - Mood/tone description
   - Specific decorative elements or patterns to use
7. **Content Zones**: Define where headline, body text, CTA, logo, and decorative elements should be placed
8. **Consistency Rules**: What elements must remain consistent across all variations to maintain brand cohesion

Write the brief in a structured, detailed manner. This brief will be used as the guiding document for an AI image generator to produce the actual templates. Be specific about visual details, not vague.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://postibel.lovable.app",
      "X-Title": "Postibel",
    },
    body: JSON.stringify({
      model: "openai/gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a world-class creative director specializing in brand identity and social media design systems. You create thorough, actionable design briefs that result in cohesive, professional template designs. Always respond in English for maximum clarity in downstream AI image generation."
        },
        { role: "user", content: briefPrompt },
      ],
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    const text = await response.text();
    console.error(`Brief generation error [${status}]:`, text);
    if (status === 429) throw new Error("RATE_LIMITED");
    if (status === 402) throw new Error("PAYMENT_REQUIRED");
    throw new Error(`BRIEF_GENERATION_FAILED_${status}`);
  }

  const data = await response.json();
  const brief = data.choices?.[0]?.message?.content;
  if (!brief) throw new Error("BRIEF_EMPTY");

  console.log("Design brief generated successfully, length:", brief.length);
  return brief;
}

// ─── Step 2: Build Image Prompt Using Brief ─────────────────────
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

function buildImagePrompt(
  business: BusinessData,
  format: string,
  variationIndex: number,
  brief: string,
): string {
  const config = FORMAT_CONFIGS[format];

  const websiteRule = business.website
    ? `- IMPORTANT: Include the website "${business.website}" visibly in the design (e.g. at the bottom or near the logo area). Use the EXACT text "${business.website}" — do not modify or abbreviate it.`
    : `- Do NOT include any website URL or web address in the design.`;

  // Build typography instruction
  let typographySection = "";
  const presetId = business.typography_preset;
  const typoMap = presetId ? TYPOGRAPHY_MAP[presetId] : null;
  if (typoMap) {
    typographySection = `
TYPOGRAPHY & FONT STYLE:
- Heading font: ${typoMap.heading}
- Body font: ${typoMap.body}
- Overall typography feel: ${typoMap.style}
- IMPORTANT: Match the font weight, spacing, and style described above in the design`;
  } else if (business.typography_custom) {
    const tc = business.typography_custom;
    typographySection = `
TYPOGRAPHY & FONT STYLE:
- Heading style: ${tc.judul || "bold"}
- Sub-heading style: ${tc.subJudul || "medium"}
- Body text style: ${tc.deskripsi || "regular"}
- Match these typography characteristics in the design`;
  }

  return `Create a professional ${config.label} design template (${config.ratio} aspect ratio) for "${business.name}" in the "${business.category}" industry.
${business.product ? `Their main product/service: ${business.product}` : ""}

## DESIGN BRIEF (follow this closely)
This is variation #${variationIndex + 1}. Refer to the design brief below for the specific style direction for this variation number:

${brief}

## BRAND COLORS
- Primary: ${business.color_primary}
- Secondary: ${business.color_secondary}
${business.color_tertiary ? `- Tertiary: ${business.color_tertiary}` : ""}
- Color scheme: ${business.color_schema}
${typographySection}

## REQUIREMENTS
- This is a TEMPLATE design — include areas for headline text, body text, and product image
- Use the brand colors prominently following the 60-30-10 rule
- Create clear visual hierarchy with a strong focal point
- Include decorative elements that match the brand's industry
- For any text areas, use Lorem ipsum dummy text (e.g. "Lorem Ipsum Dolor Sit Amet" for headlines)
- Design should feel cohesive with the brand identity
- Leave space for a logo in a corner
- Make it visually striking and professional
- The design should work as a reusable template
${websiteRule}

Use Lorem ipsum placeholder text for all text elements. DO NOT leave text areas empty.
IMPORTANT: Follow the design brief above for this specific variation's style direction.`;
}

// ─── Step 3: Generate Image ─────────────────────────────────────
async function generateTemplateImage(
  prompt: string,
  apiKey: string,
  businessLogoBase64?: string,
): Promise<string | null> {
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
  const parts = data.choices?.[0]?.message?.content;
  let imageUrl: string | null = null;
  if (Array.isArray(parts)) {
    const imgPart = parts.find((p: any) => p.type === "image_url" || p.type === "image");
    if (imgPart?.image_url?.url) {
      imageUrl = imgPart.image_url.url;
    }
  }
  if (!imageUrl) {
    imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
  }
  return imageUrl || null;
}

// ─── Main Handler ───────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");
    OPENROUTER_API_KEY = OPENROUTER_API_KEY.replace(/^(sk-or-v1)\s+/, "$1-");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
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
      business = business_data;
    } else {
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

    // ─── Step 1: Generate or reuse design brief ─────────────────
    let brief = business.brief_template || "";

    if (!brief) {
      console.log("Generating design brief with GPT-5...");
      brief = await generateDesignBrief(
        business,
        formats,
        variations_per_format,
        OPENROUTER_API_KEY,
      );

      // Save brief to database if we have a business_id
      if (business_id) {
        const { error: updateError } = await supabaseAuth
          .from("businesses")
          .update({ brief_template: brief })
          .eq("id", business_id);

        if (updateError) {
          console.error("Failed to save brief to DB:", updateError);
        } else {
          console.log("Design brief saved to database");
        }
      }
    } else {
      console.log("Reusing existing design brief from database");
    }

    // ─── Step 2: Check cache ────────────────────────────────────
    const requestedFormats = formats.slice(0, 3);
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

    // ─── Step 3: Generate template images ───────────────────────
    const results: any[] = [...cachedResults];
    const errors: string[] = [];
    const BATCH_SIZE = 3;

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

    for (let batchStart = 0; batchStart < tasks.length; batchStart += BATCH_SIZE) {
      const batch = tasks.slice(batchStart, batchStart + BATCH_SIZE);

      if (batchStart > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const batchResults = await Promise.allSettled(
        batch.map(async (task) => {
          const prompt = buildImagePrompt(business, task.format, task.variationIndex, brief);
          let imageBase64 = await generateTemplateImage(
            prompt,
            OPENROUTER_API_KEY,
            business.logo_base64 || undefined,
          );

          if (!imageBase64) {
            console.warn(`Retry: ${task.format} variation ${task.variationIndex + 1}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            imageBase64 = await generateTemplateImage(prompt, OPENROUTER_API_KEY, business.logo_base64 || undefined);
          }

          if (!imageBase64) {
            throw new Error(`GENERATION_FAILED:${task.format}:${task.variationIndex}`);
          }

          return { imageBase64, prompt, task };
        }),
      );

      for (const result of batchResults) {
        if (result.status === "rejected") {
          const msg = result.reason instanceof Error ? result.reason.message : "Unknown error";
          if (msg === "RATE_LIMITED") {
            errors.push("Rate limited - some variations skipped");
          } else if (msg === "PAYMENT_REQUIRED") {
            return new Response(
              JSON.stringify({ error: "AI credits depleted.", partial_results: results }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
        brief_generated: !business.brief_template,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
