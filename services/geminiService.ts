import { Palette, ColorInfo } from "../types";

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Helper to get RGB string
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 
    'rgb(0,0,0)';
}

// Helper to get HSL string
function hexToHslString(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// Basic keyword mapping for hues (0-360)
const COLOR_KEYWORDS: Record<string, number> = {
  'red': 0, 'crimson': 348, 'ruby': 340, 'fire': 15,
  'orange': 30, 'sunset': 25, 'coral': 16,
  'yellow': 60, 'gold': 50, 'sun': 55,
  'green': 120, 'forest': 130, 'nature': 110, 'lime': 90, 'emerald': 140,
  'cyan': 180, 'sky': 195, 'teal': 170, 'aqua': 175,
  'blue': 240, 'ocean': 210, 'sea': 220, 'royal': 230,
  'purple': 270, 'violet': 280, 'lavender': 260, 'indigo': 255,
  'pink': 300, 'rose': 330, 'magenta': 300, 'sakura': 350,
  'brown': 25, 'coffee': 30, 'wood': 35
};

export const generatePalette = async (prompt: string): Promise<Palette> => {
  // Simulate network delay for "AI" feel
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();
  
  // 1. Determine Base Hue
  let baseHue = Math.floor(Math.random() * 360);
  let foundKeyword = false;

  for (const [key, hue] of Object.entries(COLOR_KEYWORDS)) {
    if (lowerPrompt.includes(key)) {
      baseHue = hue;
      foundKeyword = true;
      break;
    }
  }

  // 2. Determine Saturation/Lightness vibe
  let baseSat = 70; // Default vibrant
  let baseLight = 50;
  
  if (lowerPrompt.includes('pastel') || lowerPrompt.includes('soft')) {
    baseSat = 40;
    baseLight = 75;
  } else if (lowerPrompt.includes('neon') || lowerPrompt.includes('cyber')) {
    baseSat = 100;
    baseLight = 60;
  } else if (lowerPrompt.includes('dark') || lowerPrompt.includes('night')) {
    baseSat = 60;
    baseLight = 25;
  } else if (lowerPrompt.includes('vintage') || lowerPrompt.includes('retro')) {
    baseSat = 40;
    baseLight = 60;
  }

  // 3. Generate 5 colors based on a harmony strategy
  const colors: ColorInfo[] = [];
  
  // Strategy: Analogous + Complementary accent
  // Color 1: Primary
  colors.push(createColor(baseHue, baseSat, baseLight, "Primary Base", "The foundational color derived from your theme."));
  
  // Color 2: Darker/Richer version
  colors.push(createColor(baseHue, baseSat + 10, Math.max(10, baseLight - 20), "Deep Shade", "A darker shade providing depth and contrast."));
  
  // Color 3: Lighter/Softer version
  colors.push(createColor(baseHue, Math.max(0, baseSat - 20), Math.min(95, baseLight + 30), "Soft Highlight", "A lighter tint for backgrounds or subtle elements."));
  
  // Color 4: Analogous (Neighbor)
  const analogHue = (baseHue + 30) % 360;
  colors.push(createColor(analogHue, baseSat, baseLight, "Analogous Harmony", "A neighboring hue that blends seamlessly."));
  
  // Color 5: Complementary (Opposite) - or Split
  const compHue = (baseHue + 180) % 360;
  colors.push(createColor(compHue, baseSat, baseLight, "Accent Contrast", "The opposite color on the wheel for striking accents."));

  return {
    id: generateId(),
    name: capitalize(prompt) + (foundKeyword ? " Theme" : " Palette"),
    description: `A ${foundKeyword ? 'thematic' : 'custom'} palette generated for "${prompt}" featuring harmonious blends and accessible contrasts.`,
    colors: colors,
    createdAt: Date.now()
  };
};

function createColor(h: number, s: number, l: number, name: string, desc: string): ColorInfo {
  // Add some slight randomness to make it feel organic
  const finalH = (h + Math.random() * 10 - 5 + 360) % 360;
  const finalS = Math.max(0, Math.min(100, s + Math.random() * 10 - 5));
  const finalL = Math.max(0, Math.min(100, l + Math.random() * 10 - 5));
  
  const hex = hslToHex(finalH, finalS, finalL);
  
  return {
    hex: hex,
    name: name,
    description: desc,
    rgb: hexToRgb(hex),
    hsl: hexToHslString(hex)
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}