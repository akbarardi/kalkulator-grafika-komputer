/**
 * Algoritma Bresenham (Garis) - Generalisasi Semua Arah
 * Mendukung 8 oktan dengan swap/steep check, dan menampilkan
 * koordinat asli (x,y) serta format tabel persis konvensi modul.
 */
export function calculateBresenham(origX0, origY0, origX1, origY1) {
  origX0 = Number(origX0);
  origY0 = Number(origY0);
  origX1 = Number(origX1);
  origY1 = Number(origY1);

  const rawDx = origX1 - origX0;
  const rawDy = origY1 - origY0;

  // Kasus titik sama
  if (rawDx === 0 && rawDy === 0) {
    return {
      algorithm: 'Bresenham',
      isTrivial: true,
      caseType: 'single_point',
      params: { origX0, origY0, origX1, origY1 },
      summary: {
        rawDx: 0,
        rawDy: 0,
        note: 'Titik awal dan titik akhir sama.',
        startPoint: { x: origX0, y: origY0 },
      },
      rows: [],
      points: [{ x: origX0, y: origY0, isPrimary: true, k: 0 }],
    };
  }

  // Kasus Garis Vertikal (dx = 0)
  if (rawDx === 0) {
    const yStep = origY1 > origY0 ? 1 : -1;
    const count = Math.abs(rawDy);
    const rows = [];
    const points = [{ x: origX0, y: origY0, isPrimary: true, k: 0 }];

    let currY = origY0;
    for (let k = 0; k < count; k++) {
      currY += yStep;
      rows.push({
        k,
        pk: '-',
        nextPointStr: `(${origX0}, ${currY})`,
        xNext: origX0,
        yNext: currY,
        note: 'Garis vertikal (X tetap, Y melangkah)',
      });
      points.push({ x: origX0, y: currY, isPrimary: true, k: k + 1 });
    }

    return {
      algorithm: 'Bresenham',
      isTrivial: true,
      caseType: 'vertical',
      params: { origX0, origY0, origX1, origY1 },
      summary: {
        rawDx: 0,
        rawDy,
        dx: 0,
        dy: Math.abs(rawDy),
        note: 'Kasus Garis Vertikal (ΔX = 0): Y melangkah langsung tanpa parameter keputusan Pk.',
        startPoint: { x: origX0, y: origY0 },
      },
      rows,
      points,
    };
  }

  // Kasus Garis Horizontal (dy = 0)
  if (rawDy === 0) {
    const xStep = origX1 > origX0 ? 1 : -1;
    const count = Math.abs(rawDx);
    const rows = [];
    const points = [{ x: origX0, y: origY0, isPrimary: true, k: 0 }];

    let currX = origX0;
    for (let k = 0; k < count; k++) {
      currX += xStep;
      rows.push({
        k,
        pk: 0,
        nextPointStr: `(${currX}, ${origY0})`,
        xNext: currX,
        yNext: origY0,
        note: 'Garis horizontal (Y tetap, X melangkah)',
      });
      points.push({ x: currX, y: origY0, isPrimary: true, k: k + 1 });
    }

    return {
      algorithm: 'Bresenham',
      isTrivial: true,
      caseType: 'horizontal',
      params: { origX0, origY0, origX1, origY1 },
      summary: {
        rawDx,
        rawDy: 0,
        dx: Math.abs(rawDx),
        dy: 0,
        note: 'Kasus Garis Horizontal (ΔY = 0): X melangkah langsung tanpa parameter keputusan Pk.',
        startPoint: { x: origX0, y: origY0 },
      },
      rows,
      points,
    };
  }

  // General Bresenham Algorithm
  let x0 = origX0;
  let y0 = origY0;
  let x1 = origX1;
  let y1 = origY1;

  const steep = Math.abs(rawDy) > Math.abs(rawDx);
  if (steep) {
    // Transpose
    let temp = x0; x0 = y0; y0 = temp;
    temp = x1; x1 = y1; y1 = temp;
  }

  let swappedEndpoints = false;
  if (x0 > x1) {
    // Swap endpoints to ensure left-to-right increment
    let tempX = x0; x0 = x1; x1 = tempX;
    let tempY = y0; y0 = y1; y1 = tempY;
    swappedEndpoints = true;
  }

  const dx = x1 - x0;
  const dy = Math.abs(y1 - y0);
  const ystep = y0 < y1 ? 1 : -1;

  const twoDy = 2 * dy;
  const twoDyMinusTwoDx = 2 * dy - 2 * dx;
  const p0 = 2 * dy - dx;

  // Titik awal
  const startX = steep ? y0 : x0;
  const startY = steep ? x0 : y0;

  const rows = [];
  const points = [{ x: startX, y: startY, isPrimary: true, k: 0 }];

  let pk = p0;
  let y = y0;
  let x = x0;

  for (let k = 0; k < dx; k++) {
    const isPkNegative = pk < 0;
    const nextInternalX = x + 1;
    let nextInternalY = y;
    let nextPk = pk;
    let formulaStr = '';

    if (isPkNegative) {
      nextInternalY = y;
      nextPk = pk + twoDy;
      formulaStr = `${pk} + ${twoDy} = ${nextPk}`;
    } else {
      nextInternalY = y + ystep;
      nextPk = pk + twoDyMinusTwoDx;
      formulaStr = `${pk} + (${twoDyMinusTwoDx}) = ${nextPk}`;
    }

    const actualNextX = steep ? nextInternalY : nextInternalX;
    const actualNextY = steep ? nextInternalX : nextInternalY;

    rows.push({
      k,
      pk,
      nextPointStr: `(${actualNextX},${actualNextY})`,
      xNext: actualNextX,
      yNext: actualNextY,
      condition: isPkNegative ? 'Pk < 0' : 'Pk ≥ 0',
      actionStr: isPkNegative
        ? 'X+1, Y tetap'
        : `X+1, Y ${ystep > 0 ? '+ 1' : '- 1'}`,
      formulaStr,
      nextPk,
    });

    points.push({ x: actualNextX, y: actualNextY, isPrimary: true, k: k + 1 });

    x = nextInternalX;
    y = nextInternalY;
    pk = nextPk;
  }

  return {
    algorithm: 'Bresenham',
    isTrivial: false,
    params: { origX0, origY0, origX1, origY1 },
    summary: {
      rawDx,
      rawDy,
      dx,
      dy,
      p0,
      twoDy,
      twoDyMinusTwoDx,
      steep,
      swappedEndpoints,
      startPoint: { x: startX, y: startY },
      endPoint: {
        x: steep ? y : x,
        y: steep ? x : y,
      },
      note: steep
        ? 'Garis curam (|ΔY| > |ΔX|): dilakukan transpose (X↔Y) untuk perhitungan, hasil ditampilkan dalam koordinat asli (x, y).'
        : swappedEndpoints
        ? 'Titik endpoint disesuaikan dari kiri ke kanan (X0 ≤ X1) sesuai standar modul.'
        : 'Kasus standar modul (0 < m < 1).',
    },
    rows,
    points,
  };
}
