import { calculateDDA } from '../algorithms/dda.js';
import { calculateBresenham } from '../algorithms/bresenham.js';
import { calculateMidpointCircle } from '../algorithms/midpointCircle.js';
import { calculateMidpointEllipse } from '../algorithms/midpointEllipse.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== TEST SUITE: ALGORITMA PRIMITIF GRAFIS ===\n');

// 1. TEST DDA
console.log('--- 1. Testing DDA Line Algorithm ---');
{
  const res = calculateDDA(1, 3, 8, 5);
  assert(res.rows.length === 8, 'DDA (1,3) ke (8,5) harus memiliki 8 baris (k=0 sampai 7)');
  assert(res.rows[0].k === 0 && res.rows[0].xRound === 1 && res.rows[0].yRound === 3, 'Baris 0 DDA adalah (1, 3)');
  assert(res.rows[7].k === 7 && res.rows[7].xRound === 8 && res.rows[7].yRound === 5, 'Baris 7 DDA adalah (8, 5)');
  assert(res.summary.steps === 7, 'Steps = 7');
  assert(Math.abs(res.rows[1].yReal - 3.2857) < 0.01, 'Yi baris 1 mendekati 3.29');
}

// 2. TEST BRESENHAM
console.log('\n--- 2. Testing Bresenham Line Algorithm ---');
{
  // Modul Contoh 1: (20,10) -> (30,18)
  const res = calculateBresenham(20, 10, 30, 18);
  assert(res.rows.length === 10, 'Bresenham (20,10) ke (30,18) harus memiliki 10 baris iterasi (k=0..9)');
  assert(res.summary.p0 === 6, 'P0 harus bernilai 6');
  assert(res.summary.twoDy === 16, '2ΔY harus bernilai 16');
  assert(res.summary.twoDyMinusTwoDx === -4, '2ΔY - 2ΔX harus bernilai -4');
  
  // Cek nilai persis slide 4:
  assert(res.rows[0].k === 0 && res.rows[0].pk === 6 && res.rows[0].nextPointStr === '(21,11)', 'Row 0: k=0, Pk=6, (21,11)');
  assert(res.rows[1].k === 1 && res.rows[1].pk === 2 && res.rows[1].nextPointStr === '(22,12)', 'Row 1: k=1, Pk=2, (22,12)');
  assert(res.rows[2].k === 2 && res.rows[2].pk === -2 && res.rows[2].nextPointStr === '(23,12)', 'Row 2: k=2, Pk=-2, (23,12)');
  assert(res.rows[9].k === 9 && res.rows[9].pk === 10 && res.rows[9].nextPointStr === '(30,18)', 'Row 9: k=9, Pk=10, (30,18)');

  // Kasus Garis Vertikal & Horizontal
  const resVert = calculateBresenham(4, 2, 4, 7);
  assert(resVert.isTrivial && resVert.caseType === 'vertical', 'Garis vertikal terdeteksi kasus khusus');
  assert(resVert.rows.length === 5, 'Garis vertikal 5 langkah');

  const resHoriz = calculateBresenham(2, 5, 8, 5);
  assert(resHoriz.isTrivial && resHoriz.caseType === 'horizontal', 'Garis horizontal terdeteksi kasus khusus');
  assert(resHoriz.rows.length === 6, 'Garis horizontal 6 langkah');

  // Kasus Steep Line (|ΔY| > |ΔX|)
  const resSteep = calculateBresenham(2, 2, 6, 11);
  assert(resSteep.summary.steep === true, 'Garis curam terdeteksi steep=true');
  const lastPt = resSteep.rows[resSteep.rows.length - 1];
  assert(lastPt.xNext === 6 && lastPt.yNext === 11, 'Hasil titik akhir garis curam dalam koordinat asli (6, 11)');
}

// 3. TEST MIDPOINT CIRCLE
console.log('\n--- 3. Testing Midpoint Circle Algorithm ---');
{
  // Modul Contoh 1: r = 10, pusat (0,0)
  const res = calculateMidpointCircle(10, 0, 0);
  assert(res.rows.length === 8, 'Circle r=10 menghasilkan 8 baris (baris "-" + 7 baris k=0..6)');
  assert(res.rows[0].k === '-' && res.rows[0].pk === -9 && res.rows[0].pointStr === '(0,10)', 'Baris awal k="-" bernilai (0,10) dengan Pk=-9');
  assert(res.rows[1].k === 0 && res.rows[1].pk === -6 && res.rows[1].pointStr === '(1,10)', 'Baris k=0 bernilai (1,10) dengan Pk=-6');
  assert(res.rows[7].k === 6 && res.rows[7].pk === 6 && res.rows[7].pointStr === '(7,7)', 'Baris k=6 bernilai (7,7) dengan Pk=6 (berhenti saat X >= Y)');
  assert(res.symmetryTable.length === 8, 'Tabel simetri 8 oktan memiliki 8 baris');

  // Modul Contoh 3: r = 7, pusat (2,3)
  const res3 = calculateMidpointCircle(7, 2, 3);
  assert(res3.rows[0].k === '-' && res3.rows[0].xTrans === 2 && res3.rows[0].yTrans === 10, 'Lingkaran translasi (2,3): baris awal trans adalah (2, 10)');
  const rowK4 = res3.rows.find((r) => r.k === 4);
  assert(rowK4 && rowK4.xTrans === 7 && rowK4.yTrans === 8, 'Lingkaran translasi baris k=4 trans adalah (7, 8)');
}

// 4. TEST MIDPOINT ELLIPSE
console.log('\n--- 4. Testing Midpoint Ellipse Algorithm ---');
{
  // Modul Contoh 1: Rx = 8, Ry = 5, pusat (0,0)
  const res = calculateMidpointEllipse(8, 5, 0, 0);
  assert(res.region1Rows.length === 8, 'Region 1 harus memiliki 8 baris (k=0..7)');
  assert(res.region1Rows[0].k === 0 && res.region1Rows[0].pk === -279, 'Region 1 k=0 adalah titik awal (0,5) dengan Pk = -279');
  assert(res.region1Rows[7].k === 7 && res.region1Rows[7].px === 350 && res.region1Rows[7].py === 256 && res.region1Rows[7].pk === 144, 'Region 1 k=7 Px=350, Py=256, Pk=144');

  assert(res.reg2Available === true, 'Region 2 tersedia');
  assert(res.region2Rows.length === 3, 'Region 2 memiliki 3 baris (k="-", 0, 1)');
  assert(res.region2Rows[0].k === '-' && res.region2Rows[0].pk === -129.75, 'Region 2 carry-over k="-" memiliki Pk = -129.75 persis pecahan modul');
  assert(res.region2Rows[1].k === 0 && res.region2Rows[1].pk === 206.25, 'Region 2 k=0 memiliki Pk = 206.25');
  assert(res.region2Rows[2].k === 1 && res.region2Rows[2].y === 0 && res.region2Rows[2].pk === 270.25, 'Region 2 k=1 mencapai y=0 dengan Pk = 270.25');

  // Modul Contoh 2: Rx = 6, Ry = 2
  const res2 = calculateMidpointEllipse(6, 2, 0, 0);
  assert(res2.reg2Available === false, 'Contoh 2: Region 2 tidak ada karena y sudah = 0 di Region 1');
  assert(res2.region2Rows.length === 0, 'Contoh 2: Region 2 array kosong');

  // Modul Contoh 3: Rx = 13, Ry = 11, pusat (3,4)
  const res3 = calculateMidpointEllipse(13, 11, 3, 4);
  assert(res3.region1Rows[0].xTrans === 3 && res3.region1Rows[0].yTrans === 15, 'Contoh 3: Translasi awal (3, 15)');
  assert(res3.region2Rows[0].k === '-' && res3.region2Rows[0].xTrans === 13 && res3.region2Rows[0].yTrans === 11, 'Contoh 3: Carry-over trans (13, 11)');
  assert(res3.region2Rows[1].k === 0 && res3.region2Rows[1].pk === -221.75, 'Contoh 3: Reg 2 row 0 Pk = -221.75');
}

console.log(`\n========================================`);
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nALL TESTS PASSED WITH 100% ACCURACY! 🎉');
}
