import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, PartyPopper, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadSectionProps {
  onSubmit: (data: {
    image: File;
    imagePreview: string;
    gender: string;
    occasion: string;
  }) => void;
  isLoading: boolean;
}

const UploadSection = ({ onSubmit, isLoading }: UploadSectionProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("female");
  const [occasion, setOccasion] = useState<string>("casual");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!image || !preview) return;
    onSubmit({ image, imagePreview: preview, gender, occasion });
  };

  const occasions = [
    { value: "casual", label: "Casual", icon: "👕" },
    { value: "party", label: "Party", icon: "🎉" },
    { value: "wedding", label: "Wedding", icon: "💍" },
    { value: "formal", label: "Formal", icon: "👔" },
  ];

  return (
    <section className="py-16 px-6" id="upload">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-10"
        >
          <h2 className="text-2xl font-bold text-center gradient-text mb-8">
            Upload Your Photo
          </h2>

          {/* Image upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/60 transition-colors mb-6 group"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative inline-block"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg mx-auto object-cover shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute -top-2 -right-2 rounded-full gradient-bg p-1"
                  >
                    <X className="w-4 h-4 text-primary-foreground" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Upload className="w-12 h-12 text-primary/40 mx-auto mb-3 group-hover:text-primary/70 transition-colors" />
                  <p className="text-muted-foreground text-sm">
                    Click to upload your photo
                  </p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    JPG, PNG up to 10MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gender selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <User className="w-4 h-4 text-primary" />
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["female", "male"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    gender === g
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {g === "female" ? "👩 Female" : "👨 Male"}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion selection */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <PartyPopper className="w-4 h-4 text-primary" />
              Occasion
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {occasions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setOccasion(o.value)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    occasion === o.value
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {o.icon} {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={!image || isLoading}
            className="w-full py-6 text-base font-semibold gradient-bg text-primary-foreground border-0 hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Your Style...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSection;
