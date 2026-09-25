import React from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FormulaSummary({ algorithm, data }) {
  if (!data) return null;

  if (algorithm === 'DDA') {
    const { summary, params } = data;
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm text-slate-200">Perhitungan Parameter DDA</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 font-mono text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">ΔX (x1 - x0)</div>
            <div className="text-sm font-bold text-cyan-400">
              {summary.dx} <span className="text-[10px] text-slate-500 font-normal">({params.x1} - {params.x0})</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">ΔY (y1 - y0)</div>
            <div className="text-sm font-bold text-cyan-400">
              {summary.dy} <span className="text-[10px] text-slate-500 font-normal">({params.y1} - {params.y0})</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Gradien (m)</div>
            <div className="text-sm font-bold text-emerald-400">
              {summary.slope}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Steps</div>
            <div className="text-sm font-bold text-amber-400">
              {summary.steps} <span className="text-[10px] text-slate-500 font-normal">max(|dx|, |dy|)</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">xIncrement</div>
            <div className="text-sm font-bold text-purple-400">
              {summary.xIncrement}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">yIncrement</div>
            <div className="text-sm font-bold text-purple-400">
              {summary.yIncrement}
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-mono">
          <span className="text-cyan-400 font-semibold">Rumus Operasi: </span>
          x<sub>k+1</sub> = x<sub>k</sub> + {summary.xIncrement}, &nbsp;
          y<sub>k+1</sub> = y<sub>k</sub> + {summary.yIncrement}. &nbsp;
          Plot pixel dilakukan dengan membulatkan koordinat (round(x), round(y)).
        </div>
      </div>
    );
  }

  if (algorithm === 'Bresenham') {
    const { summary, params, isTrivial } = data;
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Konstanta & Parameter Bresenham</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
            {summary.note}
          </span>
        </div>

        {!isTrivial ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 font-mono text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 mb-1 text-[11px]">ΔX</div>
                <div className="text-sm font-bold text-cyan-400">{summary.dx}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 mb-1 text-[11px]">ΔY</div>
                <div className="text-sm font-bold text-cyan-400">{summary.dy}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 mb-1 text-[11px]">P0 (2ΔY - ΔX)</div>
                <div className="text-sm font-bold text-amber-400">
                  {summary.p0} <span className="text-[10px] text-slate-500 font-normal">({2 * summary.dy} - {summary.dx})</span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 mb-1 text-[11px]">2ΔY</div>
                <div className="text-sm font-bold text-emerald-400">{summary.twoDy}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 mb-1 text-[11px]">2ΔY - 2ΔX</div>
                <div className="text-sm font-bold text-emerald-400">{summary.twoDyMinusTwoDx}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
                <div className="text-cyan-400 font-semibold mb-1">Jika Pk &lt; 0:</div>
                <div>• Titik selanjutnya: <span className="text-emerald-400 font-bold">(Xk + 1, Yk)</span></div>
                <div>• Parameter: <span className="text-amber-400 font-bold">Pk+1 = Pk + 2ΔY</span> (Pk + {summary.twoDy})</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
                <div className="text-cyan-400 font-semibold mb-1">Jika Pk ≥ 0:</div>
                <div>• Titik selanjutnya: <span className="text-emerald-400 font-bold">(Xk + 1, Yk + 1)</span></div>
                <div>• Parameter: <span className="text-amber-400 font-bold">Pk+1 = Pk + 2ΔY - 2ΔX</span> (Pk + ({summary.twoDyMinusTwoDx}))</div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs font-mono text-slate-300">
            {summary.note}
          </div>
        )}
      </div>
    );
  }

  if (algorithm === 'MidpointCircle') {
    const { summary } = data;
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Parameter Algoritma Midpoint Circle</h3>
          </div>
          {summary.isTranslated && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/50 font-mono">
              Pusat ({summary.xc}, {summary.yc})
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 font-mono text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Jari-jari (r)</div>
            <div className="text-sm font-bold text-cyan-400">{summary.r}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Titik Awal (0, r)</div>
            <div className="text-sm font-bold text-amber-400">{summary.initialPoint}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">P0 = 1 - r</div>
            <div className="text-sm font-bold text-emerald-400">
              {summary.p0} <span className="text-[10px] text-slate-500 font-normal">(1 - {summary.r})</span>
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Kondisi Berhenti</div>
            <div className="text-sm font-bold text-purple-400">X ≥ Y</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
            <div className="text-cyan-400 font-semibold mb-1">Jika Pk &lt; 0:</div>
            <div>• Titik: <span className="text-emerald-400 font-bold">(Xk + 1, Yk)</span> (X bertambah, Y tetap)</div>
            <div>• Rumus: <span className="text-amber-400 font-bold">Pk+1 = Pk + 2Xk+1 + 1</span></div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
            <div className="text-cyan-400 font-semibold mb-1">Jika Pk ≥ 0:</div>
            <div>• Titik: <span className="text-emerald-400 font-bold">(Xk + 1, Yk - 1)</span> (X bertambah, Y berkurang)</div>
            <div>• Rumus: <span className="text-amber-400 font-bold">Pk+1 = Pk + 2Xk+1 + 1 - 2Yk+1</span></div>
          </div>
        </div>
      </div>
    );
  }

  if (algorithm === 'MidpointEllipse') {
    const { summary } = data;
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Parameter Algoritma Midpoint Ellipse</h3>
          </div>
          {summary.isTranslated && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/50 text-amber-300 border border-amber-800/50 font-mono">
              Pusat ({summary.xc}, {summary.yc})
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4 font-mono text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Rx, Ry</div>
            <div className="text-sm font-bold text-cyan-400">{summary.rx}, {summary.ry}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Rx²</div>
            <div className="text-sm font-bold text-slate-300">{summary.rx2}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">Ry²</div>
            <div className="text-sm font-bold text-slate-300">{summary.ry2}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">2Ry² (ΔPx)</div>
            <div className="text-sm font-bold text-emerald-400">{summary.twoRy2}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">2Rx² (ΔPy)</div>
            <div className="text-sm font-bold text-emerald-400">{summary.twoRx2}</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-500 mb-1 text-[11px]">P1_0 (Region 1)</div>
            <div className="text-sm font-bold text-amber-400">{summary.p10}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
            <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Region 1 (dx &gt; dy): Px &lt; Py
            </div>
            <div>• P1_0 = Ry² - Rx²·Ry + ¼ Rx² = {summary.p10}</div>
            <div>• Jika P1k &lt; 0: X+1, Y tetap, P1k+1 = P1k + Ry² + Px</div>
            <div>• Jika P1k ≥ 0: X+1, Y-1, P1k+1 = P1k + Ry² + Px - Py</div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-slate-300">
            <div className="text-purple-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Region 2 (dy &gt; dx): y &gt; 0
            </div>
            <div>• P2_0 = Ry²(x+½)² + Rx²(y-1)² - Rx²·Ry² {summary.p20 !== null ? `= ${summary.p20}` : ''}</div>
            <div>• Jika P2k ≤ 0: X+1, Y-1, P2k+1 = P2k + Rx² + Px - Py</div>
            <div>• Jika P2k &gt; 0: X tetap, Y-1, P2k+1 = P2k + Rx² - Py</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
