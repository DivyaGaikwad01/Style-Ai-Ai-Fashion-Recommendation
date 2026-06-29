import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-6"
        >
          <Wand2 className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">
            AI-Powered Fashion
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight">
          Your Personal
          <br />
          <span className="text-primary-foreground/90">Style Assistant</span>
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 font-light max-w-xl mx-auto">
          Upload your photo and let AI analyze your skin tone to recommend
          perfect colors, outfits, and fashion tips.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
