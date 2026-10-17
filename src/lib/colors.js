// Mix a hex colour with white; amount 0 = unchanged, 1 = white
export const lighten = (hex, amount) => {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * amount));
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
};

// Inline styles for a cell or swatch showing a shift type
export const shiftBackground = (type) => {
  if (!type) return { backgroundColor: 'transparent' };
  if (!type.striped) return { backgroundColor: type.color };
  const c = type.color;
  const light = lighten(c, 0.35);
  // Tiled linear-gradient rather than repeating-linear-gradient, which html2canvas can't render in exports
  return {
    backgroundColor: c,
    backgroundImage: `linear-gradient(45deg, ${c} 25%, ${light} 25%, ${light} 50%, ${c} 50%, ${c} 75%, ${light} 75%, ${light})`,
    backgroundSize: '20px 20px',
  };
};
