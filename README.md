# Espacio Creativo

Una mini-experiencia visual interactiva: un solo botón cambia el color de fondo
a partir de una paleta curada. Pura web estática — sin build, sin dependencias,
sin tracking.

- 🌐 **Sitio en vivo:** <https://espacio-creativo.vercel.app>
- 📦 **Repo:** <https://github.com/seranaoficial/espacios-creativos>

## Características

- 🎨 **Paleta curada** de 18 colores armónicos (crema, oliva, ocre, terracota, esmeralda…)
- ⌨️ **Atajos de teclado globales:** pulsa `C` o `Espacio` en cualquier parte de la página
- 💾 **Persistencia local:** el último color y el contador se guardan en `localStorage` y se restauran al recargar
- 📋 **Copiar HEX:** botón al lado del color actual que copia el código al portapapeles con feedback "¡Copiado!"
- 🔮 **Vista previa** de los próximos 5 colores aleatorios
- ✨ **Animación de pulso** en el botón al cambiar de color (CSS keyframes)
- 🔢 **Contador de cambios** visible bajo el color actual
- 🖼️ **Favicon SVG inline** y **Open Graph / Twitter Card** para vistas previas al compartir en WhatsApp, Twitter, etc.
- ♿ **Accesible:** etiquetas `aria-label`, contraste de texto adaptado al fondo, focus visible

## Cómo correrlo en local

Es un sitio estático puro: solo necesitas un servidor HTTP.

### Opción 1 — `python3` (recomendado, sin instalar nada)

```bash
cd color-web
python3 -m http.server 8000
# Abre http://localhost:8000 en el navegador
```

### Opción 2 — `npx serve` (si tienes Node)

```bash
cd color-web
npx serve .
```

### Opción 3 — abrir el `index.html` directamente

Funciona, aunque algunas APIs (como `navigator.clipboard` o `localStorage` en
algunos navegadores) requieren `http://` o `https://`. Usa la opción 1 si ves
problemas.

## Estructura

```
color-web/
├── index.html   # marcado + favicon inline + meta tags OG
├── styles.css   # estilos + keyframes de la animación de pulso
├── script.js    # lógica de paleta, persistencia, atajos, copiar
└── README.md    # este archivo
```

## Despliegue

El proyecto se despliega en Vercel como sitio estático. No requiere build step:
Vercel sirve los tres archivos tal cual desde la raíz del repositorio.

## Licencia

MIT — hecho con cariño para la comunidad de [Serana Oficial](https://github.com/seranaoficial).
