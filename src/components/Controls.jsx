import React from 'react';
import { Sliders, Bookmark } from 'lucide-react';

export default function Controls({
  algorithm,
  params,
  onChangeParam,
  onSelectPreset,
}) {
  // Presets from lecture slides and exercises
  const presets = {
    DDA: [
      { label: 'Modul Contoh 1: (1,3) → (8,5)', values: { x0: 1, y0: 3, x1: 8, y1: 5 } },
      { label: 'Modul Latihan 2: (0,4) → (3,12)', values: { x0: 0, y0: 4, x1: 3, y1: 12 } },
      { label: 'Garis Mundur: (8,5) → (1,3)', values: { x0: 8, y0: 5, x1: 1, y1: 3 } },
      { label: 'Diagonal: (0,0) → (7,7)', values: { x0: 0, y0: 0, x1: 7, y1: 7 } },
    ],
    Bresenham: [
      { label: 'Modul Contoh 1: (20,10) → (30,18)', values: { x0: 20, y0: 10, x1: 30, y1: 18 } },
      { label: 'Modul Latihan 2: (0,4) → (3,12)', values: { x0: 0, y0: 4, x1: 3, y1: 12 } },
      { label: 'Curam (Steep): (2,2) → (6,11)', values: { x0: 2, y0: 2, x1: 6, y1: 11 } },
      { label: 'Garis Negatif: (15,10) → (5,4)', values: { x0: 15, y0: 10, x1: 5, y1: 4 } },
      { label: 'Garis Vertikal: (4,2) → (4,9)', values: { x0: 4, y0: 2, x1: 4, y1: 9 } },
      { label: 'Garis Horizontal: (2,5) → (9,5)', values: { x0: 2, y0: 5, x1: 9, y1: 5 } },
    ],
    MidpointCircle: [
      { label: 'Modul Contoh 1: r=10 (X²+Y²=100)', values: { r: 10, xc: 0, yc: 0 } },
      { label: 'Modul Contoh 2: r=12', values: { r: 12, xc: 0, yc: 0 } },
      { label: 'Modul Contoh 3: r=7, pusat (2,3)', values: { r: 7, xc: 2, yc: 3 } },
      { label: 'Latihan a: r=8 (X²+Y²=64)', values: { r: 8, xc: 0, yc: 0 } },
      { label: 'Latihan b: r=5, pusat (3,2)', values: { r: 5, xc: 3, yc: 2 } },
    ],
    MidpointEllipse: [
      { label: 'Modul Contoh 1: Rx=8, Ry=5, pusat (0,0)', values: { rx: 8, ry: 5, xc: 0, yc: 0 } },
      { label: 'Modul Contoh 2: Rx=6, Ry=2 (Reg 2 nihil)', values: { rx: 6, ry: 2, xc: 0, yc: 0 } },
      { label: 'Modul Contoh 3: Rx=13, Ry=11, pusat (3,4)', values: { rx: 13, ry: 11, xc: 3, yc: 4 } },
      { label: 'Latihan a: Rx=15, Ry=2', values: { rx: 15, ry: 2, xc: 0, yc: 0 } },
      { label: 'Latihan b: Rx=5, Ry=2, pusat (2,1)', values: { rx: 5, ry: 2, xc: 2, yc: 1 } },
    ],
  };

  const currentPresets = presets[algorithm] || [];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm text-slate-200">Parameter Input</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">Real-time update</span>
      </div>

      {/* Dynamic Input Fields */}
      <div className="space-y-4">
        {(algorithm === 'DDA' || algorithm === 'Bresenham') && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Titik Awal X0
              </label>
              <input
                type="number"
                value={params.x0 ?? 0}
                onChange={(e) => onChangeParam('x0', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Titik Awal Y0
              </label>
              <input
                type="number"
                value={params.y0 ?? 0}
                onChange={(e) => onChangeParam('y0', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Titik Akhir X1
              </label>
              <input
                type="number"
                value={params.x1 ?? 0}
                onChange={(e) => onChangeParam('x1', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Titik Akhir Y1
              </label>
              <input
                type="number"
                value={params.y1 ?? 0}
                onChange={(e) => onChangeParam('y1', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        )}

        {algorithm === 'MidpointCircle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Jari-Jari (r) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={params.r ?? 10}
                onChange={(e) => onChangeParam('r', Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Pusat Xc <span className="text-slate-500">(default 0)</span>
              </label>
              <input
                type="number"
                value={params.xc ?? 0}
                onChange={(e) => onChangeParam('xc', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Pusat Yc <span className="text-slate-500">(default 0)</span>
              </label>
              <input
                type="number"
                value={params.yc ?? 0}
                onChange={(e) => onChangeParam('yc', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        )}

        {algorithm === 'MidpointEllipse' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Radius X (rx) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={params.rx ?? 8}
                onChange={(e) => onChangeParam('rx', Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Radius Y (ry) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={params.ry ?? 5}
                onChange={(e) => onChangeParam('ry', Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Pusat Xc <span className="text-slate-500">(default 0)</span>
              </label>
              <input
                type="number"
                value={params.xc ?? 0}
                onChange={(e) => onChangeParam('xc', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Pusat Yc <span className="text-slate-500">(default 0)</span>
              </label>
              <input
                type="number"
                value={params.yc ?? 0}
                onChange={(e) => onChangeParam('yc', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-cyan-300 font-mono text-sm focus:outline-hidden focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Preset Buttons */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contoh Soal Modul Kuliah:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPreset(preset.values)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono border border-slate-800 hover:border-cyan-500/50 transition-all text-left"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
