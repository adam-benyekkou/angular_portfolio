// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        terminal: ["JetBrains Mono", "monospace"],
        "terminal-retro": ["VT323", "monospace"],
        "terminal-nier": ["Major Mono Display", "monospace"],
      },
      colors: {
        nier: {
          dark: "#2a2a2a",
          darker: "#1f1f1f",
          light: "#e9dcc9",
          accent: "#c8b086",
          highlight: "#d9cdb9",
          subtle: "#3a3a3a",
          red: "#9e3f3f",
        },
      },
    },
  },
};
