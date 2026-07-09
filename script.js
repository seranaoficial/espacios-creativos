(function () {
  "use strict";

  // Curated palette of pleasant, well-balanced colors
  const PALETTE = [
    "#fefadf", // cream
    "#5f6c37", // olive
    "#273617", // forest
    "#dca15d", // ochre
    "#bc6c25", // terracotta
    "#3ecf8e", // supabase green
    "#f59e0b", // amber
    "#0ea5e9", // sky
    "#a855f7", // violet
    "#ec4899", // pink
    "#10b981", // emerald
    "#fb7185", // rose
    "#6366f1", // indigo
    "#facc15", // yellow
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#8b5cf6", // purple
  ];

  const body = document.body;
  const btn = document.getElementById("color-btn");
  const readout = document.getElementById("color-readout");

  // Track last index so we never repeat the same color twice in a row
  let lastIndex = -1;

  function pickRandomColor() {
    let idx;
    do {
      idx = Math.floor(Math.random() * PALETTE.length);
    } while (idx === lastIndex && PALETTE.length > 1);
    lastIndex = idx;
    return PALETTE[idx];
  }

  // Pick a readable text color (black or white) based on the background luminance
  function pickTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Standard relative luminance
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.6 ? "#273617" : "#fefadf";
  }

  function changeColor() {
    const color = pickRandomColor();
    body.style.backgroundColor = color;
    body.style.color = pickTextColor(color);
    readout.textContent = color;
  }

  btn.addEventListener("click", changeColor);

  // Bonus: also respond to Space and Enter when the button is focused
  btn.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      changeColor();
    }
  });
})();
