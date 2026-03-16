/**
 * Curated font list for MailDraft email templates.
 *
 * Each entry:
 *   name      — display name shown in the UI
 *   fontStack — complete Outlook-safe CSS font-family string.
 *               Multi-word names are wrapped in double quotes per CSS spec.
 *   isCustom  — true = Google Font (needs @import injection in both editor
 *               preview and exported email HTML). false = system / web-safe.
 *   category  — used for grouping in the FontPicker dropdown.
 */
export const FONTS = [
  // ── Web Safe ──────────────────────────────────────────────────────────────
  {
    name:      'Arial',
    fontStack: 'Arial, Helvetica, sans-serif',
    isCustom:  false,
    category:  'web-safe',
  },
  {
    name:      'Georgia',
    fontStack: 'Georgia, "Times New Roman", Times, serif',
    isCustom:  false,
    category:  'web-safe',
  },
  {
    name:      'Helvetica Neue',
    fontStack: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    isCustom:  false,
    category:  'web-safe',
  },
  {
    name:      'Tahoma',
    fontStack: 'Tahoma, Geneva, Verdana, sans-serif',
    isCustom:  false,
    category:  'web-safe',
  },
  {
    name:      'Trebuchet MS',
    fontStack: '"Trebuchet MS", Helvetica, sans-serif',
    isCustom:  false,
    category:  'web-safe',
  },
  {
    name:      'Verdana',
    fontStack: 'Verdana, Geneva, Tahoma, sans-serif',
    isCustom:  false,
    category:  'web-safe',
  },

  // ── Google Fonts – Sans-serif ─────────────────────────────────────────────
  {
    name:      'Inter',
    fontStack: 'Inter, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Roboto',
    fontStack: 'Roboto, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Open Sans',
    fontStack: '"Open Sans", Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Lato',
    fontStack: 'Lato, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Montserrat',
    fontStack: 'Montserrat, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Poppins',
    fontStack: 'Poppins, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Nunito',
    fontStack: 'Nunito, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Raleway',
    fontStack: 'Raleway, Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'DM Sans',
    fontStack: '"DM Sans", Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },
  {
    name:      'Plus Jakarta Sans',
    fontStack: '"Plus Jakarta Sans", Helvetica, Arial, sans-serif',
    isCustom:  true,
    category:  'google-sans',
  },

  // ── Google Fonts – Serif ──────────────────────────────────────────────────
  {
    name:      'Playfair Display',
    fontStack: '"Playfair Display", Georgia, "Times New Roman", serif',
    isCustom:  true,
    category:  'google-serif',
  },
  {
    name:      'Merriweather',
    fontStack: 'Merriweather, Georgia, "Times New Roman", serif',
    isCustom:  true,
    category:  'google-serif',
  },
  {
    name:      'Lora',
    fontStack: 'Lora, Georgia, "Times New Roman", serif',
    isCustom:  true,
    category:  'google-serif',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Find a font object by display name. Returns undefined if not found. */
export function getFontByName(name) {
  return FONTS.find(f => f.name === name);
}

/**
 * Extract the primary font name from a CSS font-family string.
 * e.g.  '"Open Sans", Arial, sans-serif'  →  'Open Sans'
 */
export function extractFontName(fontStack = '') {
  return fontStack.split(',')[0].trim().replace(/['"]/g, '');
}

/**
 * Returns a Google Fonts CSS stylesheet URL for the given font name,
 * or null when the font is a system / web-safe font.
 * Requests weights 400, 600, and 700 to cover most email use-cases.
 */
export function getGoogleFontsUrl(name) {
  const font = getFontByName(name);
  if (!font?.isCustom) return null;
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;600;700&display=swap`;
}

/**
 * Lazily inject a Google Fonts <link> into the document <head> for
 * live editor preview. Safe to call many times — deduplicates by ID.
 * No-op for system fonts.
 */
export function ensureFontLoaded(name) {
  const url = getGoogleFontsUrl(name);
  if (!url) return;
  const id = `gf-${name.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(id)) {
    const link  = document.createElement('link');
    link.id     = id;
    link.rel    = 'stylesheet';
    link.href   = url;
    document.head.appendChild(link);
  }
}
