import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import AlgorithmSelector from './components/AlgorithmSelector';
import Controls from './components/Controls';
import FormulaSummary from './components/FormulaSummary';
import IterationTable from './components/IterationTable';
import OctantSymmetryTable from './components/OctantSymmetryTable';
import GridCanvas from './components/GridCanvas';

import { calculateDDA } from './algorithms/dda';
import { calculateBresenham } from './algorithms/bresenham';
import { calculateMidpointCircle } from './algorithms/midpointCircle';
import { calculateMidpointEllipse } from './algorithms/midpointEllipse';
import { Sparkles, HelpCircle, FileSpreadsheet, Eye } from 'lucide-react';

export default function App() {
  const [activeAlgorithm, setActiveAlgorithm] = useState('DDA');

  // Input states per algorithm
  const [ddaParams, setDdaParams] = useState({ x0: 1, y0: 3, x1: 8, y1: 5 });
  const [bresenhamParams, setBresenhamParams] = useState({ x0: 20, y0: 10, x1: 30, y1: 18 });
  const [circleParams, setCircleParams] = useState({ r: 10, xc: 0, yc: 0 });
  const [ellipseParams, setEllipseParams] = useState({ rx: 8, ry: 5, xc: 0, yc: 0 });

  // Cross-interaction hover state
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Active view tab for table area: 'main' (Tabel Iterasi Utama) | 'symmetry' (Tabel Simetri)
  const [tableTab, setTableTab] = useState('main');

  // Get current algorithm parameters and setter
  const currentParams = useMemo(() => {
    switch (activeAlgorithm) {
      case 'DDA':
        return ddaParams;
      case 'Bresenham':
        return bresenhamParams;
      case 'MidpointCircle':
        return circleParams;
      case 'MidpointEllipse':
        return ellipseParams;
      default:
        return {};
    }
  }, [activeAlgorithm, ddaParams, bresenhamParams, circleParams, ellipseParams]);

  const handleChangeParam = (field, value) => {
    const num = value === '' ? '' : Number(value);
    switch (activeAlgorithm) {
      case 'DDA':
        setDdaParams((prev) => ({ ...prev, [field]: num }));
        break;
      case 'Bresenham':
        setBresenhamParams((prev) => ({ ...prev, [field]: num }));
        break;
      case 'MidpointCircle':
        setCircleParams((prev) => ({ ...prev, [field]: num }));
        break;
      case 'MidpointEllipse':
        setEllipseParams((prev) => ({ ...prev, [field]: num }));
        break;
      default:
        break;
    }
  };

  const handleSelectPreset = (values) => {
    switch (activeAlgorithm) {
      case 'DDA':
        setDdaParams(values);
        break;
      case 'Bresenham':
        setBresenhamParams(values);
        break;
      case 'MidpointCircle':
        setCircleParams(values);
        break;
      case 'MidpointEllipse':
        setEllipseParams(values);
        break;
      default:
        break;
    }
  };

  // Run calculation
  const calculationResult = useMemo(() => {
    try {
      switch (activeAlgorithm) {
        case 'DDA':
          return calculateDDA(
            ddaParams.x0,
            ddaParams.y0,
            ddaParams.x1,
            ddaParams.y1
          );
        case 'Bresenham':
          return calculateBresenham(
            bresenhamParams.x0,
            bresenhamParams.y0,
            bresenhamParams.x1,
            bresenhamParams.y1
          );
        case 'MidpointCircle':
          return calculateMidpointCircle(
            circleParams.r,
            circleParams.xc,
            circleParams.yc
          );
        case 'MidpointEllipse':
          return calculateMidpointEllipse(
            ellipseParams.rx,
            ellipseParams.ry,
            ellipseParams.xc,
            ellipseParams.yc
          );
        default:
          return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [activeAlgorithm, ddaParams, bresenhamParams, circleParams, ellipseParams]);

  // Determine points for canvas
  const canvasPoints = useMemo(() => {
    if (!calculationResult) return [];
    return calculationResult.points || [];
  }, [calculationResult]);

  // Center point for Circle & Ellipse
  const centerPoint = useMemo(() => {
    if (activeAlgorithm === 'MidpointCircle') {
      return { x: Number(circleParams.xc) || 0, y: Number(circleParams.yc) || 0 };
    }
    if (activeAlgorithm === 'MidpointEllipse') {
      return { x: Number(ellipseParams.xc) || 0, y: Number(ellipseParams.yc) || 0 };
    }
    return null;
  }, [activeAlgorithm, circleParams, ellipseParams]);

  // Line endpoints for continuous guide
  const lineStart = useMemo(() => {
    if (activeAlgorithm === 'DDA') return { x: Number(ddaParams.x0), y: Number(ddaParams.y0) };
    if (activeAlgorithm === 'Bresenham') return { x: Number(bresenhamParams.x0), y: Number(bresenhamParams.y0) };
    return null;
  }, [activeAlgorithm, ddaParams, bresenhamParams]);

  const lineEnd = useMemo(() => {
    if (activeAlgorithm === 'DDA') return { x: Number(ddaParams.x1), y: Number(ddaParams.y1) };
    if (activeAlgorithm === 'Bresenham') return { x: Number(bresenhamParams.x1), y: Number(bresenhamParams.y1) };
    return null;
  }, [activeAlgorithm, ddaParams, bresenhamParams]);

  const hasSymmetryTable =
    activeAlgorithm === 'MidpointCircle' || activeAlgorithm === 'MidpointEllipse';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans bg-grid-pattern">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Algorithm Tabs */}
        <AlgorithmSelector
          activeTab={activeAlgorithm}
          onSelectTab={(tab) => {
            setActiveAlgorithm(tab);
            setTableTab('main');
            setHoveredPoint(null);
          }}
        />

        {/* Input Controls and Formula Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
          <div className="lg:col-span-5">
            <Controls
              algorithm={activeAlgorithm}
              params={currentParams}
              onChangeParam={handleChangeParam}
              onSelectPreset={handleSelectPreset}
            />
          </div>
          <div className="lg:col-span-7">
            <FormulaSummary
              algorithm={activeAlgorithm}
              data={calculationResult}
            />
          </div>
        </div>

        {/* Main Content: Split Grid Canvas and Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column (Canvas Visualizer) */}
          <div className="xl:col-span-6 space-y-4">
            <div className="h-[460px] sm:h-[540px]">
              <GridCanvas
                points={canvasPoints}
                summary={calculationResult?.summary || {}}
                algorithm={activeAlgorithm}
                hoveredPoint={hoveredPoint}
                onHoverPoint={setHoveredPoint}
                centerPoint={centerPoint}
                startPoint={lineStart}
                endPoint={lineEnd}
              />
            </div>

            {/* Explanatory Note for Course Conventions */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 space-y-2 no-print">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                Konvensi Penulisan Modul Dosen:
              </div>
              {activeAlgorithm === 'DDA' && (
                <p>
                  Pada tabel DDA, kolom desimal <code>x (real)</code> dan <code>y (real)</code> dihitung dengan penambahan float kontinu, lalu dibulatkan ke integer terdekat <code>(round(x), round(y))</code>.
                </p>
              )}
              {activeAlgorithm === 'Bresenham' && (
                <p>
                  Kolom <code>(Xk+1, Yk+1)</code> menunjukkan koordinat pixel yang dihasilkan dari evaluasi <code>Pk</code> pada baris tersebut. Titik awal <code>(x0, y0)</code> di-plot sebelum perulangan k.
                </p>
              )}
              {activeAlgorithm === 'MidpointCircle' && (
                <p>
                  Baris pertama titik awal diberi label <code>k = "-"</code> dengan <code>(0, r)</code> dan <code>Pk = 1 - r</code>. Iterasi perulangan baru dimulai pada baris berikutnya <code>k = 0</code>.
                </p>
              )}
              {activeAlgorithm === 'MidpointEllipse' && (
                <p>
                  Region 1 dimulai langsung dari <code>k = 0</code> sebagai titik awal <code>(0, ry)</code>. Region 2 diawali baris carry-over dari akhir Region 1 dengan label <code>k = "-"</code> dan <code>Pk</code> dihitung ulang dengan rumus P2₀.
                </p>
              )}
            </div>
          </div>

          {/* Right Column (Tables) */}
          <div className="xl:col-span-6 space-y-4">
            {/* Table View Switcher (if Circle / Ellipse) */}
            {hasSymmetryTable && (
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 no-print">
                <button
                  onClick={() => setTableTab('main')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    tableTab === 'main'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Tabel Iterasi Modul</span>
                </button>
                <button
                  onClick={() => setTableTab('symmetry')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    tableTab === 'symmetry'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {activeAlgorithm === 'MidpointCircle'
                      ? 'Tabel Simetri 8 Oktan'
                      : 'Tabel Simetri 4 Kuadran'}
                  </span>
                </button>
              </div>
            )}

            {/* Display Active Table */}
            {tableTab === 'main' ? (
              <IterationTable
                algorithm={activeAlgorithm}
                data={calculationResult}
                hoveredPoint={hoveredPoint}
                onHoverPoint={setHoveredPoint}
              />
            ) : (
              <OctantSymmetryTable
                algorithm={activeAlgorithm}
                data={calculationResult}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-800/80 bg-slate-950/60 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Kalkulator Grafika Komputer & Pengolahan Citra — Dibuat untuk mempermudah pengerjaan dan verifikasi tugas mandiri.
          </p>
          <p className="mt-1 text-[11px] text-slate-600 font-mono">
            Client-Side Only • Siap Deploy ke GitHub Pages
          </p>
        </div>
      </footer>
    </div>
  );
}
