/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Luxurious golden color palette (palace gold)
        golden: {
          50: "#FFF9E6", // Very light cream-gold
          100: "#FFEEB8", // Light cream-gold
          200: "#FFD966", // Bright light gold
          300: "#F4C430", // Bright saffron gold
          400: "#E6BE44", // Warm bright gold
          500: "#D4AF37", // Classic luxury gold (MAIN)
          600: "#C5A028", // Rich gold
          700: "#B8941F", // Deep gold
          800: "#9A7B1A", // Darker gold
          900: "#7D6315", // Bronze gold
          950: "#5C4A10", // Dark bronze
        },
        // Luxurious burgundy/red colors
        burgundy: {
          50: "#FFF1F3", // Very light pink-red
          100: "#FFE0E5", // Light pink-red
          200: "#FFC7D1", // Soft pink
          300: "#FF9BB0", // Light burgundy
          400: "#E84A5F", // Medium red
          500: "#C8102E", // Deep crimson (MAIN)
          600: "#A01731", // Rich burgundy
          700: "#8B1538", // Deep burgundy
          800: "#6D1028", // Dark burgundy
          900: "#550C1F", // Very dark burgundy
          950: "#3D0816", // Almost black-red
        },
        // Warm white for better eye comfort
        "warm-white": "#fef9f3",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gold-gradient":
          "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%), radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }) {
      addVariant("whitestone", ".whitestone &");
    },
  ],
};
