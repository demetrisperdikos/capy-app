export function getMoodColor(value: number): string {
  const clamp = Math.max(1, Math.min(10, value));
  if (clamp <= 3) {
    return shadeColor(220, clamp, 1, 3);
  } else if (clamp <= 6) {
    return shadeColor(50, clamp, 4, 6);
  }
  return shadeColor(120, clamp, 7, 10);
}

function shadeColor(hue: number, val: number, start: number, end: number) {
  const percent = (val - start) / (end - start);
  // Lightness from 30% to 70%
  const light = 30 + percent * 40;
  return `hsl(${hue},70%,${light}% )`;
}
