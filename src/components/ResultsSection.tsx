import { motion } from "framer-motion";
import { Palette, Shirt, Lightbulb, ShoppingBag, ExternalLink } from "lucide-react";

export interface ShoppingItem {
  name: string;
  store: string;
  url: string;
}

export interface FashionResult {
  colors: string[];
  outfits: string[];
  tips: string[];
  shopping: ShoppingItem[];
}

interface ResultsSectionProps {
  results: FashionResult;
  imagePreview: string;
}

const colorMap: Record<string, string> = {
  "navy blue": "#001f3f",
  navy: "#001f3f",
  blue: "#2196F3",
  "royal blue": "#4169E1",
  "light blue": "#ADD8E6",
  "sky blue": "#87CEEB",
  red: "#F44336",
  maroon: "#800000",
  burgundy: "#800020",
  pink: "#E91E63",
  "blush pink": "#FFB6C1",
  "dusty rose": "#DCAE96",
  rose: "#FF007F",
  green: "#4CAF50",
  "olive green": "#808000",
  olive: "#808000",
  "forest green": "#228B22",
  "emerald green": "#50C878",
  emerald: "#50C878",
  teal: "#008080",
  purple: "#9C27B0",
  lavender: "#E6E6FA",
  plum: "#8E4585",
  orange: "#FF9800",
  coral: "#FF7F50",
  peach: "#FFDAB9",
  yellow: "#FFEB3B",
  "mustard yellow": "#E1AD01",
  mustard: "#E1AD01",
  gold: "#FFD700",
  white: "#FFFFFF",
  "off-white": "#FAF9F6",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  beige: "#F5F5DC",
  black: "#212121",
  gray: "#9E9E9E",
  grey: "#9E9E9E",
  "charcoal gray": "#36454F",
  charcoal: "#36454F",
  brown: "#795548",
  tan: "#D2B48C",
  camel: "#C19A6B",
  khaki: "#C3B091",
  silver: "#C0C0C0",
  "deep red": "#8B0000",
  "wine red": "#722F37",
  wine: "#722F37",
  turquoise: "#40E0D0",
  "powder blue": "#B0E0E6",
  mauve: "#E0B0FF",
  rust: "#B7410E",
  sage: "#BCB88A",
  "sage green": "#BCB88A",
  mint: "#98FF98",
  copper: "#B87333",
};

const getColorHex = (colorName: string): string => {
  const lower = colorName.toLowerCase().trim();
  return colorMap[lower] || "#888888";
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ResultsSection = ({ results, imagePreview }: ResultsSectionProps) => {
  const sections = [
    {
      title: "Best Colors",
      icon: <Palette className="w-6 h-6" />,
      emoji: "🎨",
      items: results.colors,
      isColor: true,
    },
    {
      title: "Outfit Ideas",
      icon: <Shirt className="w-6 h-6" />,
      emoji: "👗",
      items: results.outfits,
      isColor: false,
    },
    {
      title: "Fashion Tips",
      icon: <Lightbulb className="w-6 h-6" />,
      emoji: "💡",
      items: results.tips,
      isColor: false,
    },
    {
      title: "Shopping Suggestions",
      icon: <ShoppingBag className="w-6 h-6" />,
      emoji: "🛍️",
      items: [] as string[],
      isColor: false,
      isShopping: true,
    },
  ];

  return (
    <section className="py-16 px-6" id="results">
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center gradient-text mb-4"
        >
          Your Style Recommendations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-12"
        >
          Personalized just for you by AI
        </motion.p>

        {/* User photo mini-preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <img
            src={imagePreview}
            alt="Your uploaded photo"
            className="w-20 h-20 rounded-full object-cover border-4 border-primary/30 shadow-lg"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card p-6 hover:shadow-xl transition-shadow"
              style={{
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="gradient-bg p-2.5 rounded-xl text-primary-foreground">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {section.emoji} {section.title}
                </h3>
              </div>

              {section.isColor ? (
                <div className="space-y-3">
                  {/* Color palette visual */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {section.items.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg shadow-md border border-border"
                        style={{ backgroundColor: getColorHex(color) }}
                        title={color}
                      />
                    ))}
                  </div>
                  <ul className="space-y-1.5">
                    {section.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span
                          className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: getColorHex(item) }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : section.isShopping ? (
                <ul className="space-y-3">
                  {results.shopping.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-muted-foreground"> — {item.store}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
