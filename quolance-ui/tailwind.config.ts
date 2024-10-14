import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
        "3xl": "1600px",
        "4xl": "1800px",
      },
      colors: {
        //blue color
        b10: "#CFD8FA",
        b50: "#e6f0ff",
        b75: "#96c0ff",
        b100: "#6ba6ff",
        b200: "#2b7fff",
        b300: "#0065ff",
        b400: "#0047B3",
        b500: "#003e9c",
        b900: "#1E2783",

        //yellow color
        y50: "#fef9ea",
        y75: "#fde8a7",
        y100: "#fcdf83",
        y200: "#fad14d",
        y300: "#f9c729",
        y400: "#ae8b1d",
        y500: "#987919",
        y600: "#FFAB00",

        //violate color
        v50: "#f0ebff",
        v75: "#c3adff",
        v100: "#aa8bff",
        v200: "#8659ff",
        v300: "#6d37ff",
        v400: "#4c27b3",
        v500: "#42229c",

        //neutral color
        n10: "#fafafb",
        n20: "#f5f5f7",
        n30: "#ececef",
        n40: "#e0e0e5",
        n50: "#c3c3ce",
        n60: "#b4b4c2",
        n70: "#a8a8b8",
        n80: "#9a99ac",
        n90: "#8b8ba0",
        n100: "#7d7c94",
        n200: "#6e6e88",
        n300: "#605f7c",
        n400: "#545372",
        n500: "#454567",
        n600: "#39395d",
        n700: "#29284f",
        n800: "#1a1943",
        n900: "#0e0d39",

        //green-color
        g50: "#E9F9EF",
        g75: "#A4E7BD",

        g100: "#B9FF5A",
        g200: "#ABFF38",

        g300: "#22C55E",
        g400: "#118D57",

        //red color
        r50: "#F9E7E4",
        r100: "#FFAC82",
        r300: "#FF5630",

        // orange color
        o300: "#FFAB00",

        //electric blue,
        eb50: "#C9DBF5",
        eb100: "#ADF8FF",
        eb200: "#5AF0FF",

        // bg color
        bg1: "#F3FFD7",
        bg2: "#C6EFF3",
        bg3: "#FFF5CC",
        bg4: "#EFF7E4",
        bg5: "#FFCCC3",
        bg6: "#FEF6E5",

        // stroke color
        sp: "rgba(154, 153, 172, .4)",
      },
      padding: {
        "25": "100px",
        "30": "120px",
        "15": "60px",
      },
    },
  },
  plugins: [],
};
export default config;
