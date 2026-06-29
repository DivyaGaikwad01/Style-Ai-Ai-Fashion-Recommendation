import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          Built with <Heart className="w-4 h-4 text-secondary fill-secondary" /> by{" "}
          <span className="font-semibold gradient-text">Aishwarya</span>
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          StyleAI — Smart Fashion Recommendation System
        </p>
      </div>
    </footer>
  );
};

export default Footer;
