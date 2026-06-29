import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold gradient-text">StyleAI</span>
        </div>
        <p className="hidden sm:block text-sm text-muted-foreground font-medium">
          Smart Fashion Recommendation System
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
