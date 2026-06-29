import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skinTone, gender, occasion } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a professional fashion stylist AI. Based on the user's skin tone, gender, and occasion, provide personalized fashion recommendations.

You MUST respond in EXACTLY this format with these 4 sections. Each section must have 4-6 bullet items:

COLORS:
- color name 1
- color name 2
- color name 3
- color name 4
- color name 5

OUTFITS:
- outfit suggestion 1
- outfit suggestion 2
- outfit suggestion 3
- outfit suggestion 4

TIPS:
- fashion tip 1
- fashion tip 2
- fashion tip 3
- fashion tip 4

SHOPPING:
- Item name | Store name | https://store-url.com/search?q=item
- Item name | Store name | https://store-url.com/search?q=item
- Item name | Store name | https://store-url.com/search?q=item
- Item name | Store name | https://store-url.com/search?q=item

Keep color names simple (e.g. "Navy Blue", "Coral", "Emerald Green"). Keep outfit and tip descriptions concise (1 sentence). For SHOPPING, use REAL working search URLs from major retailers like Amazon (https://www.amazon.com/s?k=), Zara (https://www.zara.com/us/en/search?searchTerm=), H&M (https://www2.hm.com/en_us/search-results.html?q=), Nordstrom (https://www.nordstrom.com/sr?keyword=), ASOS (https://www.asos.com/us/search/?q=). Format each shopping item exactly as: Item description | Store Name | URL`;

    const userPrompt = `My skin tone is ${skinTone}, I am ${gender}, and the occasion is ${occasion}. Please recommend the best colors, outfits, fashion tips, and shopping suggestions for me.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const recommendation = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fashion recommend error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
