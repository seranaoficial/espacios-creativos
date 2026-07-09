(function () {
  "use strict";

  // Paleta curada de colores agradables y bien equilibrados.
  // (Mantenemos la paleta original — está probada y se ve genial.)
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

  // Claves de localStorage (constantes para evitar typos).
  const STORAGE_COLOR = "espacioCreativo.color";
  const STORAGE_COUNT = "espacioCreativo.count";

  // Referencias al DOM.
  const body    = document.body;
  const btn     = document.getElementById("color-btn");
  const readout = document.getElementById("color-readout");
  const copyBtn = document.getElementById("copy-btn");
  const counter = document.getElementById("counter");
  const previewList = document.getElementById("preview-list");

  // Estado: evitamos repetir el mismo color dos veces seguidas.
  let lastIndex = -1;
  let count = 0;

  // -------- Funciones puras --------

  // Devuelve un índice aleatorio distinto del anterior.
  function pickIndex(previous) {
    if (PALETTE.length <= 1) return 0;
    let idx;
    do {
      idx = Math.floor(Math.random() * PALETTE.length);
    } while (idx === previous);
    return idx;
  }

  // Devuelve un color aleatorio de la paleta (no igual al último).
  function pickRandomColor() {
    lastIndex = pickIndex(lastIndex);
    return PALETTE[lastIndex];
  }

  // Devuelve los próximos N colores distintos del actual y entre sí (en orden aleatorio).
  // No modifica `lastIndex` — la vista previa no debe afectar al "siguiente real".
  function pickPreviewColors(currentColor, n) {
    const currentIndex = PALETTE.indexOf(currentColor);
    const result = [];
    let prev = currentIndex;
    for (let i = 0; i < n; i++) {
      const idx = pickIndex(prev);
      result.push(PALETTE[idx]);
      prev = idx;
    }
    return result;
  }

  // Calcula un color de texto (negro o crema) según la luminancia del fondo.
  function pickTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Luminancia relativa estándar.
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.6 ? "#273617" : "#fefadf";
  }

  // -------- Persistencia (localStorage) --------

  function saveColor(color) {
    try { localStorage.setItem(STORAGE_COLOR, color); } catch (_) { /* sin storage = no-op */ }
  }

  function loadColor() {
    try { return localStorage.getItem(STORAGE_COLOR); } catch (_) { return null; }
  }

  function saveCount(n) {
    try { localStorage.setItem(STORAGE_COUNT, String(n)); } catch (_) { /* no-op */ }
  }

  function loadCount() {
    try {
      const raw = localStorage.getItem(STORAGE_COUNT);
      const n = parseInt(raw, 10);
      return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch (_) { return 0; }
  }

  // -------- Render --------

  // Aplica un color al fondo + texto + readout (sin tocar el contador).
  function applyColor(color) {
    body.style.backgroundColor = color;
    body.style.color = pickTextColor(color);
    readout.textContent = color;
  }

  // Pinta la vista previa de los próximos 5 colores.
  function renderPreview(currentColor) {
    const next = pickPreviewColors(currentColor, 5);
    previewList.innerHTML = "";
    next.forEach(function (c) {
      const li = document.createElement("li");
      li.style.backgroundColor = c;
      li.title = c; // tooltip accesible
      previewList.appendChild(li);
    });
  }

  function updateCounter() {
    counter.textContent = "Cambios: " + count;
  }

  // -------- Acción principal: cambiar color --------

  function changeColor() {
    const color = pickRandomColor();
    applyColor(color);
    renderPreview(color);
    count += 1;
    updateCounter();

    // Persistir.
    saveColor(color);
    saveCount(count);

    // Animación de pulso en el botón (forzar reflow para reiniciar la animación).
    btn.classList.remove("pulse");
    // eslint-disable-next-line no-unused-expressions
    btn.offsetWidth;
    btn.classList.add("pulse");
  }

  // -------- Copiar HEX al portapapeles --------

  let copyResetTimer = null;

  function copyHex() {
    const hex = readout.textContent || "";
    const showCopied = function () {
      copyBtn.textContent = "¡Copiado!";
      copyBtn.classList.add("copied");
      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(function () {
        copyBtn.textContent = "Copiar HEX";
        copyBtn.classList.remove("copied");
      }, 1500);
    };

    // API moderna (HTTPS o localhost).
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(showCopied).catch(function () {
        // Si falla, probamos con el fallback.
        legacyCopy(hex) && showCopied();
      });
      return;
    }
    // Fallback para contextos sin clipboard API.
    if (legacyCopy(hex)) showCopied();
  }

  // Fallback clásico: usa un textarea temporal y document.execCommand.
  function legacyCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  // -------- Inicialización --------

  function init() {
    // Restaurar contador y color guardados.
    count = loadCount();
    updateCounter();
    const saved = loadColor();
    if (saved && PALETTE.indexOf(saved) !== -1) {
      // Si el color guardado está en la paleta, lo respetamos (incluyendo su lastIndex).
      applyColor(saved);
      lastIndex = PALETTE.indexOf(saved);
    } else {
      // Primera vez: aplicamos el color por defecto (#fefadf) y previsualizamos los próximos.
      applyColor("#fefadf");
      lastIndex = PALETTE.indexOf("#fefadf");
    }
    renderPreview(readout.textContent);

    // Click en el botón principal.
    btn.addEventListener("click", changeColor);

    // Botón copiar HEX.
    copyBtn.addEventListener("click", copyHex);

    // Atajo de teclado: barra espaciadora o tecla "c" en cualquier parte de la página.
    // No se activa si el usuario está escribiendo en un input/textarea/contenteditable.
    document.addEventListener("keydown", function (e) {
      const target = e.target;
      const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || (target && target.isContentEditable)) return;
      if (e.key === " " || e.key === "Spacebar" || e.key.toLowerCase() === "c") {
        e.preventDefault();
        changeColor();
      }
    });

    // Quitar la clase .pulse cuando termina la animación (limpieza).
    btn.addEventListener("animationend", function () {
      btn.classList.remove("pulse");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
