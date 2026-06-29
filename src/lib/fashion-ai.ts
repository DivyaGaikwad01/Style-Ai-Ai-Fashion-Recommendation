import type { FashionResult, ShoppingItem } from "@/components/ResultsSection";

/**
 * Analyzes skin tone from an image by sampling pixel colors.
 * Uses canvas to extract pixel data from the center region.
 */
export const analyzeSkinTone = (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample center region of the image
      const cx = Math.floor(img.width / 2);
      const cy = Math.floor(img.height / 2);
      const sampleSize = Math.min(50, Math.floor(img.width / 4));
      const imageData = ctx.getImageData(
        cx - sampleSize,
        cy - sampleSize,
        sampleSize * 2,
        sampleSize * 2
      );

      let totalR = 0, totalG = 0, totalB = 0, count = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        // Filter for skin-like tones
        if (r > 60 && g > 40 && b > 20 && r > g && r > b) {
          totalR += r;
          totalG += g;
          totalB += b;
          count++;
        }
      }

      if (count === 0) {
        resolve("medium");
        return;
      }

      const avgR = totalR / count;
      const brightness = (avgR + totalG / count + totalB / count) / 3;

      if (brightness > 180) resolve("light");
      else if (brightness > 120) resolve("medium");
      else resolve("dark");
    };
    img.src = imageDataUrl;
  });
};

/**
 * Parse AI text response into structured fashion result.
 */
export const parseAIResponse = (text: string): FashionResult => {
  const result: FashionResult = {
    colors: [],
    outfits: [],
    tips: [],
    shopping: [],
  };

  const sections = text.split(/\n(?=COLORS:|OUTFITS:|TIPS:|SHOPPING:)/i);

  for (const section of sections) {
    const lines = section
      .split("\n")
      .map((l) => l.replace(/^[-•*]\s*/, "").trim())
      .filter((l) => l && !l.match(/^(COLORS|OUTFITS|TIPS|SHOPPING):/i));

    if (/COLORS:/i.test(section)) result.colors = lines.slice(0, 8);
    else if (/OUTFITS:/i.test(section)) result.outfits = lines.slice(0, 6);
    else if (/TIPS:/i.test(section)) result.tips = lines.slice(0, 6);
    else if (/SHOPPING:/i.test(section)) {
      result.shopping = lines.slice(0, 6).map((line): ShoppingItem => {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length >= 3) {
          return { name: parts[0], store: parts[1], url: parts[2] };
        }
        // Fallback: try to extract URL from the line
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        const cleanName = line.replace(/(https?:\/\/[^\s]+)/, "").replace(/[-|]/, "").trim();
        return {
          name: cleanName || line,
          store: "Shop",
          url: urlMatch?.[0] || `https://www.amazon.com/s?k=${encodeURIComponent(cleanName || line)}`,
        };
      });
    }
  }

  return result;
};
