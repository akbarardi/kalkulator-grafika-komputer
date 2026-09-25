/**
 * Algoritma Midpoint Ellipse
 * Menghasilkan dua tabel terpisah: Region 1 dan Region 2,
 * dengan format label k persis modul dosen (k=0 titik awal di Region 1,
 * k="-" carry-over di Region 2).
 */
export function calculateMidpointEllipse(rx, ry, xc = 0, yc = 0) {
  rx = Number(rx);
  ry = Number(ry);
  xc = Number(xc) || 0;
  yc = Number(yc) || 0;

  if (rx <= 0 || ry <= 0) {
    return {
      algorithm: 'MidpointEllipse',
      params: { rx, ry, xc, yc },
      summary: { rx, ry, xc, yc },
      region1: [],
      region2: [],
      symmetryTable: [],
      points: [{ x: xc, y: yc, isPrimary: true }],
    };
  }

  const rx2 = rx * rx;
  const ry2 = ry * ry;
  const twoRy2 = 2 * ry2;
  const twoRx2 = 2 * rx2;

  // Format angka desimal agar persis tanpa noise floating point (misal -129.75)
  const formatNumber = (num) => {
    if (Number.isInteger(num)) return num;
    const rounded = Math.round(num * 10000) / 10000;
    return rounded;
  };

  // -------------------------------------------------------------
  // REGION 1
  // -------------------------------------------------------------
  let x = 0;
  let y = ry;
  let p10 = ry2 - rx2 * ry + 0.25 * rx2;
  let px = 0;
  let py = 2 * rx2 * y;

  const region1Rows = [];
  const primaryPoints = [];

  // Baris k = 0 adalah titik awal itu sendiri
  let p1k = p10;
  region1Rows.push({
    k: 0,
    x,
    y,
    px,
    py,
    pk: formatNumber(p1k),
    xTrans: x + xc,
    yTrans: y + yc,
    isInitial: true,
  });
  primaryPoints.push({ x: x + xc, y: y + yc, rawX: x, rawY: y, region: 1, isPrimary: true });

  let reg1K = 0;
  while (px < py) {
    reg1K++;
    x = x + 1;
    px = px + twoRy2;

    if (p1k >= 0) {
      y = y - 1;
      py = py - twoRx2;
      p1k = p1k + ry2 + px - py;
    } else {
      p1k = p1k + ry2 + px;
    }

    region1Rows.push({
      k: reg1K,
      x,
      y,
      px,
      py,
      pk: formatNumber(p1k),
      xTrans: x + xc,
      yTrans: y + yc,
    });
    primaryPoints.push({ x: x + xc, y: y + yc, rawX: x, rawY: y, region: 1, isPrimary: true });
  }

  // -------------------------------------------------------------
  // REGION 2
  // -------------------------------------------------------------
  const region2Rows = [];
  const lastReg1 = region1Rows[region1Rows.length - 1];

  let reg2Available = true;
  if (lastReg1.y <= 0) {
    reg2Available = false;
  } else {
    // Carry over titik terakhir dari region 1
    let x2 = lastReg1.x;
    let y2 = lastReg1.y;
    let px2 = lastReg1.px;
    let py2 = lastReg1.py;

    // Rumus P2_0 menggunakan rumus titik tengah:
    // P2_0 = ry^2 * (x0 + 0.5)^2 + rx^2 * (y0 - 1)^2 - rx^2 * ry^2
    const p20 =
      ry2 * Math.pow(x2 + 0.5, 2) +
      rx2 * Math.pow(y2 - 1, 2) -
      rx2 * ry2;

    let p2k = p20;

    // Baris carry-over dengan label k = "-"
    region2Rows.push({
      k: '-',
      x: x2,
      y: y2,
      px: px2,
      py: py2,
      pk: formatNumber(p2k),
      xTrans: x2 + xc,
      yTrans: y2 + yc,
      isCarryOver: true,
    });

    let reg2K = 0;
    while (y2 > 0) {
      y2 = y2 - 1;
      py2 = py2 - twoRx2;

      if (p2k <= 0) {
        x2 = x2 + 1;
        px2 = px2 + twoRy2;
        p2k = p2k + rx2 + px2 - py2;
      } else {
        p2k = p2k + rx2 - py2;
      }

      region2Rows.push({
        k: reg2K,
        x: x2,
        y: y2,
        px: px2,
        py: py2,
        pk: formatNumber(p2k),
        xTrans: x2 + xc,
        yTrans: y2 + yc,
      });
      primaryPoints.push({ x: x2 + xc, y: y2 + yc, rawX: x2, rawY: y2, region: 2, isPrimary: true });

      reg2K++;
    }
  }

  // Gabungkan titik unik pada kuadran pertama
  const quadrant1Points = [];
  const q1Set = new Set();
  primaryPoints.forEach((p) => {
    const key = `${p.rawX},${p.rawY}`;
    if (!q1Set.has(key)) {
      q1Set.add(key);
      quadrant1Points.push(p);
    }
  });

  // Tabel simetri 4 kuadran
  const symmetryTable = quadrant1Points.map((pt, idx) => {
    const qx = pt.rawX;
    const qy = pt.rawY;
    return {
      index: idx + 1,
      base: `(${qx},${qy})`,
      q1: `(${qx + xc}, ${qy + yc})`,
      q2: `(${-qx + xc}, ${qy + yc})`,
      q3: `(${-qx + xc}, ${-qy + yc})`,
      q4: `(${qx + xc}, ${-qy + yc})`,
    };
  });

  // Kumpulkan seluruh titik untuk visualisasi canvas (4 kuadran)
  const pointMap = new Map();
  quadrant1Points.forEach((pt) => {
    const coords = [
      { x: pt.rawX, y: pt.rawY, isPrimary: true },
      { x: -pt.rawX, y: pt.rawY, isPrimary: false },
      { x: -pt.rawX, y: -pt.rawY, isPrimary: false },
      { x: pt.rawX, y: -pt.rawY, isPrimary: false },
    ];

    coords.forEach((c) => {
      const actualX = c.x + xc;
      const actualY = c.y + yc;
      const key = `${actualX},${actualY}`;
      if (!pointMap.has(key) || c.isPrimary) {
        pointMap.set(key, {
          x: actualX,
          y: actualY,
          isPrimary: c.isPrimary,
          rawX: c.x,
          rawY: c.y,
        });
      }
    });
  });

  const allPoints = Array.from(pointMap.values());

  return {
    algorithm: 'MidpointEllipse',
    params: { rx, ry, xc, yc },
    summary: {
      rx,
      ry,
      xc,
      yc,
      rx2,
      ry2,
      twoRx2,
      twoRy2,
      p10: formatNumber(p10),
      reg2Available,
      p20: reg2Available && region2Rows.length > 0 ? region2Rows[0].pk : null,
      isTranslated: xc !== 0 || yc !== 0,
      totalQ1Points: quadrant1Points.length,
      totalEllipsePoints: allPoints.length,
    },
    region1Rows,
    region2Rows,
    reg2Available,
    quadrant1Points,
    symmetryTable,
    points: allPoints,
  };
}
