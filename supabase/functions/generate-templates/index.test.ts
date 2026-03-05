import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

Deno.test("generate-templates - requires auth", async () => {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business_id: "test", formats: ["ig_post"] }),
  });
  const body = await res.text();
  console.log("No auth response:", res.status, body);
  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

Deno.test("generate-templates - full flow", async () => {
  // Sign up test user
  const email = `test-${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: "TestPassword123!",
  });
  
  if (authError) throw new Error(`Signup failed: ${authError.message}`);
  console.log("✅ User created:", authData.user?.id);

  const token = authData.session?.access_token;
  if (!token) throw new Error("No session token");

  // Create business
  const { data: biz, error: bizError } = await supabase
    .from("businesses")
    .insert({
      user_id: authData.user!.id,
      name: "Test Coffee Shop",
      category: "Kedai Kopi",
      product: "Kopi Susu",
      color_primary: "#0891B2",
      color_secondary: "#14B8A6",
      color_tertiary: "#ECFEFF",
      color_schema: "ocean-breeze",
      typography_preset: "modern-clean",
    })
    .select()
    .single();

  if (bizError) throw new Error(`Business create failed: ${bizError.message}`);
  console.log("✅ Business created:", biz.id);

  // Call generate-templates with just 1 variation for speed
  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      business_id: biz.id,
      formats: ["ig_post"],
      variations_per_format: 1,
    }),
  });

  const result = await res.json();
  console.log("Generate response status:", res.status);
  console.log("Generate result:", JSON.stringify({
    success: result.success,
    total_generated: result.total_generated,
    from_cache: result.from_cache,
    errors: result.errors,
    has_templates: result.templates?.length > 0,
    template_has_image: result.templates?.[0]?.image_base64?.length > 0,
  }, null, 2));

  if (res.status !== 200) {
    console.error("Full error:", JSON.stringify(result));
    throw new Error(`Expected 200, got ${res.status}: ${result.error}`);
  }

  if (!result.templates || result.templates.length === 0) {
    throw new Error("No templates generated");
  }

  console.log("✅ Template generated successfully! Image size:", result.templates[0].image_base64?.length, "chars");

  // Cleanup
  await supabase.from("design_templates").delete().eq("business_id", biz.id);
  await supabase.from("businesses").delete().eq("id", biz.id);
  console.log("✅ Cleanup done");
});
