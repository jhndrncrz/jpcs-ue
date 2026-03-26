/**
 * Calculate the relative luminance of a color
 * @param hex - Hex color string (e.g., #ffffff or #fff)
 */
function getLuminance(hex: string): number {
  let r = 0, g = 0, b = 0;

  // Handle shorthand hex
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  const [rl, gl, bl] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * Resolves project-specific color variables to hex for luminance calculation
 */
function resolveColor(color: string): string {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color;
  
  // Map common project variables to their hex equivalents
  const mapping: { [key: string]: string } = {
    'var(--primary)': '#ff8200',
    'var(--c-orange)': '#ff8200',
    'var(--c-red-dark)': '#ac131e',
    'var(--c-orange-fire)': '#ff5719',
    'var(--surface)': '#ffffff',
    'var(--background)': '#ffffff',
    '#3b82f6': '#3b82f6',
    '#8b5cf6': '#8b5cf6',
    '#f43f5e': '#f43f5e',
    '#10b981': '#10b981',
    '#f59e0b': '#f59e0b',
    '#06b6d4': '#06b6d4'
  };

  return mapping[color] || '#ffffff';
}

/**
 * Returns either white or black depending on the background color's contrast
 */
export function getContrastColor(backgroundColor: string): string {
  const hex = resolveColor(backgroundColor);
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
