/**
 * Algoritma DDA (Digital Differential Analyzer)
 * Menghasilkan iterasi pembentukan garis untuk semua arah
 */
export function calculateDDA(x0, y0, x1, y1) {
  x0 = Number(x0);
  y0 = Number(y0);
  x1 = Number(x1);
  y1 = Number(y1);

  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));

  const xIncrement = steps === 0 ? 0 : dx / steps;
  const yIncrement = steps === 0 ? 0 : dy / steps;
  const slope = dx !== 0 ? dy / dx : Infinity;

  const rows = [];
  const points = [];

  let x = x0;
  let y = y0;

  // k = 0 (titik awal)
  const roundX0 = Math.round(x);
  const roundY0 = Math.round(y);
  rows.push({
    k: 0,
    xReal: x,
    yReal: y,
    xRound: roundX0,
    yRound: roundY0,
  });
  points.push({ x: roundX0, y: roundY0, isPrimary: true, k: 0 });

  for (let k = 1; k <= steps; k++) {
    x += xIncrement;
    y += yIncrement;
    // Fix JS precision issues (e.g. 3.0000000000000004 -> 3)
    const fixedX = Number(Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : x.toFixed(4));
    const fixedY = Number(Math.abs(y - Math.round(y)) < 1e-9 ? Math.round(y) : y.toFixed(4));
    const roundX = Math.round(x);
    const roundY = Math.round(y);

    rows.push({
      k,
      xReal: fixedX,
      yReal: fixedY,
      xRound: roundX,
      yRound: roundY,
    });
    points.push({ x: roundX, y: roundY, isPrimary: true, k });
  }

  return {
    algorithm: 'DDA',
    params: { x0, y0, x1, y1 },
    summary: {
      dx,
      dy,
      steps,
      slope: slope === Infinity ? '∞' : slope.toFixed(4).replace(/\.?0+$/, ''),
      xIncrement: Number(xIncrement.toFixed(4)),
      yIncrement: Number(yIncrement.toFixed(4)),
      totalPixels: rows.length,
    },
    rows,
    points,
  };
}
