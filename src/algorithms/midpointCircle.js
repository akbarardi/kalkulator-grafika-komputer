/**
 * Algoritma Midpoint Circle
 * Menghitung titik-titik lingkaran pada oktan pertama dan pencerminan ke 8 oktan.
 * Format tabel dan label k = "-" sesuai modul dosen.
 */
export function calculateMidpointCircle(r, xc = 0, yc = 0) {
  r = Number(r);
  xc = Number(xc) || 0;
  yc = Number(yc) || 0;

  if (r <= 0) {
    return {
      algorithm: 'MidpointCircle',
      params: { r, xc, yc },
      summary: { r, xc, yc, p0: 0, totalRows: 0 },
      rows: [],
      points: [{ x: xc, y: yc, isPrimary: true, isCenter: true }],
      symmetryTable: [],
    };
  }

  const p0 = 1 - r;
  const rows = [];
  const primaryPoints = [];

  let x = 0;
  let y = r;
  let pk = p0;

  // Baris pertama titik awal dengan k = "-"
  rows.push({
    k: '-',
    pointStr: `(${x},${y})`,
    x,
    y,
    twoX: 2 * x,
    twoY: 2 * y,
    pk,
    xTrans: x + xc,
    yTrans: y + yc,
    isInitial: true,
  });
  primaryPoints.push({ x: x + xc, y: y + yc, rawX: x, rawY: y, isPrimary: true, kLabel: '-' });

  let k = 0;
  while (x < y) {
    const prevPk = pk;
    const prevX = x;
    const prevY = y;

    if (prevPk < 0) {
      x = prevX + 1;
      y = prevY;
      pk = prevPk + 2 * x + 1;
    } else {
      x = prevX + 1;
      y = prevY - 1;
      pk = prevPk + 2 * x + 1 - 2 * y;
    }

    rows.push({
      k,
      pointStr: `(${x},${y})`,
      x,
      y,
      twoX: 2 * x,
      twoY: 2 * y,
      pk,
      xTrans: x + xc,
      yTrans: y + yc,
      condition: prevPk < 0 ? 'Pk < 0' : 'Pk ≥ 0',
      actionStr: prevPk < 0 ? 'X+1, Y tetap' : 'X+1, Y-1',
      formulaStr:
        prevPk < 0
          ? `${prevPk} + 2(${x}) + 1 = ${pk}`
          : `${prevPk} + 2(${x}) + 1 - 2(${y}) = ${pk}`,
    });
    primaryPoints.push({ x: x + xc, y: y + yc, rawX: x, rawY: y, isPrimary: true, kLabel: k });

    k++;
  }

  // Buat tabel simetri 8 oktan
  // Oktan 1: (x,y), 2: (-x,y), 3: (x,-y), 4: (-x,-y), 5: (y,x), 6: (-y,x), 7: (y,-x), 8: (-y,-x)
  const symmetryTable = rows.map((row) => {
    const rx = row.x;
    const ry = row.y;
    return {
      k: row.k,
      base: `(${rx},${ry})`,
      oct1: `(${rx + xc}, ${ry + yc})`,
      oct2: `(${-rx + xc}, ${ry + yc})`,
      oct3: `(${rx + xc}, ${-ry + yc})`,
      oct4: `(${-rx + xc}, ${-ry + yc})`,
      oct5: `(${ry + xc}, ${rx + yc})`,
      oct6: `(${-ry + xc}, ${rx + yc})`,
      oct7: `(${ry + xc}, ${-rx + yc})`,
      oct8: `(${-ry + xc}, ${-rx + yc})`,
    };
  });

  // Hasilkan seluruh titik untuk visualisasi canvas tanpa duplikat
  const pointMap = new Map();

  // Tambahkan titik pusat jika ada
  // Tambahkan titik-titik 8 oktan
  rows.forEach((row) => {
    const octants = [
      { x: row.x, y: row.y, isPrimary: true },
      { x: -row.x, y: row.y, isPrimary: false },
      { x: row.x, y: -row.y, isPrimary: false },
      { x: -row.x, y: -row.y, isPrimary: false },
      { x: row.y, y: row.x, isPrimary: false },
      { x: -row.y, y: row.x, isPrimary: false },
      { x: row.y, y: -row.x, isPrimary: false },
      { x: -row.y, y: -row.x, isPrimary: false },
    ];

    octants.forEach((pt) => {
      const actualX = pt.x + xc;
      const actualY = pt.y + yc;
      const key = `${actualX},${actualY}`;
      if (!pointMap.has(key) || pt.isPrimary) {
        pointMap.set(key, {
          x: actualX,
          y: actualY,
          isPrimary: pt.isPrimary,
          origX: pt.x,
          origY: pt.y,
          k: row.k,
        });
      }
    });
  });

  const allPoints = Array.from(pointMap.values());

  return {
    algorithm: 'MidpointCircle',
    params: { r, xc, yc },
    summary: {
      r,
      xc,
      yc,
      p0,
      initialPoint: `(0, ${r})`,
      translatedInitial: `(${xc}, ${r + yc})`,
      totalPrimaryRows: rows.length,
      totalCirclePoints: allPoints.length,
      isTranslated: xc !== 0 || yc !== 0,
    },
    rows,
    primaryPoints,
    symmetryTable,
    points: allPoints,
  };
}
