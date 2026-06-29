import { useState, useRef } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import ResultsSection, { type FashionResult } from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { analyzeSkinTone, parseAIResponse } from "@/lib/fashion-ai";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fashion-recommend`;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FashionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: {
    image: File;
    imagePreview: string;
    gender: string;
    occasion: string;
  }) => {
    setIsLoading(true);
    setResults(null);
    setImagePreview(data.imagePreview);

    try {
      // Step 1: Analyze skin tone from the image
      const skinTone = await analyzeSkinTone(data.imagePreview);
      toast.info(`Detected skin tone: ${skinTone}`);

      // Step 2: Call AI edge function
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          skinTone,
          gender: data.gender,
          occasion: data.occasion,
        }),
      });

      if (response.status === 429) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
        return;
      }
      if (response.status === 402) {
        toast.error("AI credits exhausted. Please add funds.");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const result = await response.json();
      const parsed = parseAIResponse(result.recommendation);
      setResults(parsed);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <UploadSection onSubmit={handleSubmit} isLoading={isLoading} />
      <div ref={resultsRef}>
        {results && (
          <ResultsSection results={results} imagePreview={imagePreview} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
