import React, { useState } from 'react';
import { Copy, Check, Table, Info } from 'lucide-react';
import { convertToMarkdown, convertToCSV, copyToClipboard } from '../utils/exportTable';

export default function IterationTable({
  algorithm,
  data,
  hoveredPoint,
  onHoverPoint,
}) {
  const [copiedType, setCopiedType] = useState(null);

  const handleCopy = async (tableType, format) => {
    let headers = [];
    let rows = [];

    if (algorithm === 'DDA') {
      headers = ['k', 'x (real)', 'y (real)', 'x (dibulatkan)', 'y (dibulatkan)'];
      rows = data.rows.map((r) => [r.k, r.xReal, r.yReal, r.xRound, r.yRound]);
    } else if (algorithm === 'Bresenham') {
      headers = ['k', 'Pk', '(Xk+1, Yk+1)'];
      rows = data.rows.map((r) => [r.k, r.pk, r.nextPointStr]);
    } else if (algorithm === 'MidpointCircle') {
      const isTrans = data.summary.isTranslated;
      headers = isTrans
        ? ['k', 'x', 'y', '2X', '2Y', 'Pk', 'x (trans)', 'y (trans)']
        : ['k', '(X,Y)', '2X', '2Y', 'Pk'];
      rows = data.rows.map((r) =>
        isTrans
          ? [r.k, r.x, r.y, r.twoX, r.twoY, r.pk, r.xTrans, r.yTrans]
          : [r.k, r.pointStr, r.twoX, r.twoY, r.pk]
      );
    } else if (algorithm === 'MidpointEllipse') {
      const isTrans = data.summary.isTranslated;
      const targetRows = tableType === 'reg2' ? data.region2Rows : data.region1Rows;
      headers = isTrans
        ? ['k', 'x', 'y', 'Px', 'Py', 'Pk', 'x (trans)', 'y (trans)']
        : ['k', 'x', 'y', 'Px', 'Py', 'Pk'];
      rows = targetRows.map((r) =>
        isTrans
          ? [r.k, r.x, r.y, r.px, r.py, r.pk, r.xTrans, r.yTrans]
          : [r.k, r.x, r.y, r.px, r.py, r.pk]
      );
    }

    const text = format === 'md' ? convertToMarkdown(headers, rows) : convertToCSV(headers, rows);
    const success = await copyToClipboard(text);

    if (success) {
      setCopiedType(`${tableType}-${format}`);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  if (!data || (!data.rows?.length && !data.region1Rows?.length)) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
        Masukkan nilai parameter valid untuk melihat tabel iterasi.
      </div>
    );
  }

  // Render DDA Table
  if (algorithm === 'DDA') {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Tabel Iterasi DDA</h3>
            <span className="text-xs text-slate-500 font-mono">
              ({data.rows.length} langkah)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopy('dda', 'md')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
              title="Salin tabel format Markdown"
            >
              {copiedType === 'dda-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Markdown</span>
            </button>
            <button
              onClick={() => handleCopy('dda', 'tsv')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
              title="Salin tabel format Excel (TSV)"
            >
              {copiedType === 'dda-tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Excel/Word</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">k</th>
                <th className="px-4 py-3 text-right">x (real)</th>
                <th className="px-4 py-3 text-right">y (real)</th>
                <th className="px-4 py-3 text-center text-cyan-400">x (dibulatkan)</th>
                <th className="px-4 py-3 text-center text-cyan-400">y (dibulatkan)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.rows.map((row) => {
                const isHovered =
                  hoveredPoint &&
                  hoveredPoint.x === row.xRound &&
                  hoveredPoint.y === row.yRound;

                return (
                  <tr
                    key={row.k}
                    onMouseEnter={() => onHoverPoint({ x: row.xRound, y: row.yRound, isPrimary: true, k: row.k })}
                    onMouseLeave={() => onHoverPoint(null)}
                    className={`transition-colors cursor-pointer ${
                      isHovered
                        ? 'bg-cyan-950/60 text-cyan-200'
                        : row.k % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                        : 'bg-slate-900/80 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-400">
                      {row.k}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300">
                      {typeof row.xReal === 'number' ? row.xReal.toFixed(2) : row.xReal}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300">
                      {typeof row.yReal === 'number' ? row.yReal.toFixed(2) : row.yReal}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">
                      {row.xRound}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">
                      {row.yRound}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render Bresenham Table
  if (algorithm === 'Bresenham') {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Tabel Iterasi Bresenham (Garis)</h3>
            <span className="text-xs text-slate-500 font-mono">
              ({data.rows.length} langkah)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopy('bresenham', 'md')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
            >
              {copiedType === 'bresenham-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Markdown</span>
            </button>
            <button
              onClick={() => handleCopy('bresenham', 'tsv')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
            >
              {copiedType === 'bresenham-tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Excel/Word</span>
            </button>
          </div>
        </div>

        {/* Start Point Banner */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            Titik Awal (di-plot sebelum iterasi):
          </span>
          <span className="font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            ({data.summary.startPoint?.x}, {data.summary.startPoint?.y})
          </span>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">K</th>
                <th className="px-4 py-3 text-center text-cyan-400">Pk</th>
                <th className="px-4 py-3 text-center text-emerald-400 font-bold">(Xk+1, Yk+1)</th>
                <th className="px-4 py-3 text-left text-slate-400">Kondisi & Perhitungan Pk+1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.rows.map((row) => {
                const isHovered =
                  hoveredPoint &&
                  hoveredPoint.x === row.xNext &&
                  hoveredPoint.y === row.yNext;

                return (
                  <tr
                    key={row.k}
                    onMouseEnter={() => onHoverPoint({ x: row.xNext, y: row.yNext, isPrimary: true, k: row.k })}
                    onMouseLeave={() => onHoverPoint(null)}
                    className={`transition-colors cursor-pointer ${
                      isHovered
                        ? 'bg-cyan-950/60 text-cyan-200'
                        : row.k % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                        : 'bg-slate-900/80 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-2.5 text-center font-semibold text-slate-400">
                      {row.k}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-cyan-300 bg-cyan-950/15">
                      {row.pk}
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-emerald-400 bg-emerald-950/20">
                      {row.nextPointStr}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 text-[11px]">
                      {row.condition ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              row.condition.includes('<')
                                ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
                                : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                            }`}
                          >
                            {row.condition} → {row.actionStr}
                          </span>
                          <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
                            [{row.formulaStr}]
                          </span>
                        </div>
                      ) : (
                        <span>{row.note}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render Midpoint Circle Table
  if (algorithm === 'MidpointCircle') {
    const isTrans = data.summary.isTranslated;

    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-slate-200">Tabel Iterasi Midpoint Circle</h3>
            <span className="text-xs text-slate-500 font-mono">
              ({data.rows.length} baris, Oktan 1)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopy('circle', 'md')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
            >
              {copiedType === 'circle-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Markdown</span>
            </button>
            <button
              onClick={() => handleCopy('circle', 'tsv')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
            >
              {copiedType === 'circle-tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Excel/Word</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">k</th>
                {!isTrans ? (
                  <th className="px-4 py-3 text-center text-cyan-400 font-bold">(X,Y)</th>
                ) : (
                  <>
                    <th className="px-3 py-3 text-center text-cyan-400">x</th>
                    <th className="px-3 py-3 text-center text-cyan-400">y</th>
                  </>
                )}
                <th className="px-4 py-3 text-center">2X</th>
                <th className="px-4 py-3 text-center">2Y</th>
                <th className="px-4 py-3 text-center text-emerald-400 font-bold">Pk</th>
                {isTrans && (
                  <>
                    <th className="px-3 py-3 text-center text-amber-400 font-bold border-l border-slate-800">x (translasi)</th>
                    <th className="px-3 py-3 text-center text-amber-400 font-bold">y (translasi)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.rows.map((row, idx) => {
                const targetX = isTrans ? row.xTrans : row.x;
                const targetY = isTrans ? row.yTrans : row.y;
                const isHovered =
                  hoveredPoint &&
                  hoveredPoint.x === targetX &&
                  hoveredPoint.y === targetY;

                return (
                  <tr
                    key={idx}
                    onMouseEnter={() => onHoverPoint({ x: targetX, y: targetY, isPrimary: true, k: row.k })}
                    onMouseLeave={() => onHoverPoint(null)}
                    className={`transition-colors cursor-pointer ${
                      isHovered
                        ? 'bg-cyan-950/60 text-cyan-200'
                        : row.k === '-'
                        ? 'bg-amber-950/20 text-amber-200 font-semibold'
                        : idx % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                        : 'bg-slate-900/80 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-2.5 text-center font-bold text-slate-400">
                      {row.k === '-' ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/50">
                          -
                        </span>
                      ) : (
                        row.k
                      )}
                    </td>
                    {!isTrans ? (
                      <td className="px-4 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">
                        {row.pointStr}
                      </td>
                    ) : (
                      <>
                        <td className="px-3 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">
                          {row.x}
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">
                          {row.y}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-2.5 text-center text-slate-400">{row.twoX}</td>
                    <td className="px-4 py-2.5 text-center text-slate-400">{row.twoY}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-emerald-400 bg-emerald-950/15">
                      {row.pk}
                    </td>
                    {isTrans && (
                      <>
                        <td className="px-3 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20 border-l border-slate-800">
                          {row.xTrans}
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20">
                          {row.yTrans}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Render Midpoint Ellipse Tables (DUA TABEL TERPISAH: REGION 1 & REGION 2)
  if (algorithm === 'MidpointEllipse') {
    const isTrans = data.summary.isTranslated;

    return (
      <div className="space-y-6">
        {/* TABEL REGION 1 */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                Region 1
              </span>
              <h3 className="font-semibold text-sm text-slate-200">Tabel Iterasi Region 1 (dx &gt; dy)</h3>
              <span className="text-xs text-slate-500 font-mono">
                ({data.region1Rows.length} baris, berhenti saat Px ≥ Py)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleCopy('reg1', 'md')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
              >
                {copiedType === 'reg1-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Markdown</span>
              </button>
              <button
                onClick={() => handleCopy('reg1', 'tsv')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
              >
                {copiedType === 'reg1-tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Excel/Word</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-center">k</th>
                  <th className="px-4 py-3 text-center text-cyan-400 font-bold">x</th>
                  <th className="px-4 py-3 text-center text-cyan-400 font-bold">y</th>
                  <th className="px-4 py-3 text-center">Px</th>
                  <th className="px-4 py-3 text-center">Py</th>
                  <th className="px-4 py-3 text-center text-emerald-400 font-bold">Pk</th>
                  {isTrans && (
                    <>
                      <th className="px-4 py-3 text-center text-amber-400 font-bold border-l border-slate-800">x (trans)</th>
                      <th className="px-4 py-3 text-center text-amber-400 font-bold">y (trans)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.region1Rows.map((row) => {
                  const targetX = isTrans ? row.xTrans : row.x;
                  const targetY = isTrans ? row.yTrans : row.y;
                  const isHovered =
                    hoveredPoint &&
                    hoveredPoint.x === targetX &&
                    hoveredPoint.y === targetY;

                  return (
                    <tr
                      key={row.k}
                      onMouseEnter={() => onHoverPoint({ x: targetX, y: targetY, isPrimary: true, k: row.k })}
                      onMouseLeave={() => onHoverPoint(null)}
                      className={`transition-colors cursor-pointer ${
                        isHovered
                          ? 'bg-cyan-950/60 text-cyan-200'
                          : row.k === 0
                          ? 'bg-cyan-950/20 text-cyan-200 font-semibold'
                          : row.k % 2 === 0
                          ? 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                          : 'bg-slate-900/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-center font-bold text-slate-400">
                        {row.k}
                      </td>
                      <td className="px-4 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">{row.x}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-cyan-400 bg-cyan-950/20">{row.y}</td>
                      <td className="px-4 py-2.5 text-center text-slate-300">{row.px}</td>
                      <td className="px-4 py-2.5 text-center text-slate-300">{row.py}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-emerald-400 bg-emerald-950/15">
                        {row.pk}
                      </td>
                      {isTrans && (
                        <>
                          <td className="px-4 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20 border-l border-slate-800">
                            {row.xTrans}
                          </td>
                          <td className="px-4 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20">
                            {row.yTrans}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL REGION 2 */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-950 text-purple-400 border border-purple-800/40">
                Region 2
              </span>
              <h3 className="font-semibold text-sm text-slate-200">Tabel Iterasi Region 2 (dy &gt; dx)</h3>
              <span className="text-xs text-slate-500 font-mono">
                {data.reg2Available
                  ? `(${data.region2Rows.length} baris, berhenti saat y = 0)`
                  : '(Tidak ada)'}
              </span>
            </div>
            {data.reg2Available && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy('reg2', 'md')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
                >
                  {copiedType === 'reg2-md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Markdown</span>
                </button>
                <button
                  onClick={() => handleCopy('reg2', 'tsv')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
                >
                  {copiedType === 'reg2-tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Excel/Word</span>
                </button>
              </div>
            )}
          </div>

          {!data.reg2Available ? (
            <div className="p-6 text-center text-sm font-mono text-amber-400 bg-amber-950/20">
              Tidak ada iterasi Region 2 karena koordinat Y sudah mencapai 0 pada akhir Region 1 (sesuai Contoh 2 Modul).
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-center">k</th>
                    <th className="px-4 py-3 text-center text-purple-400 font-bold">x</th>
                    <th className="px-4 py-3 text-center text-purple-400 font-bold">y</th>
                    <th className="px-4 py-3 text-center">Px</th>
                    <th className="px-4 py-3 text-center">Py</th>
                    <th className="px-4 py-3 text-center text-emerald-400 font-bold">Pk</th>
                    {isTrans && (
                      <>
                        <th className="px-4 py-3 text-center text-amber-400 font-bold border-l border-slate-800">x (trans)</th>
                        <th className="px-4 py-3 text-center text-amber-400 font-bold">y (trans)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.region2Rows.map((row, idx) => {
                    const targetX = isTrans ? row.xTrans : row.x;
                    const targetY = isTrans ? row.yTrans : row.y;
                    const isHovered =
                      hoveredPoint &&
                      hoveredPoint.x === targetX &&
                      hoveredPoint.y === targetY;

                    return (
                      <tr
                        key={idx}
                        onMouseEnter={() => onHoverPoint({ x: targetX, y: targetY, isPrimary: true, k: row.k })}
                        onMouseLeave={() => onHoverPoint(null)}
                        className={`transition-colors cursor-pointer ${
                          isHovered
                            ? 'bg-purple-950/60 text-purple-200'
                            : row.isCarryOver
                            ? 'bg-amber-950/25 text-amber-200 font-semibold'
                            : idx % 2 === 0
                            ? 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-300'
                            : 'bg-slate-900/80 hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <td className="px-4 py-2.5 text-center font-bold text-slate-400">
                          {row.isCarryOver ? (
                            <span
                              className="px-1.5 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/50"
                              title="Baris carry-over dari akhir Region 1"
                            >
                              -
                            </span>
                          ) : (
                            row.k
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center font-bold text-purple-400 bg-purple-950/20">{row.x}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-purple-400 bg-purple-950/20">{row.y}</td>
                        <td className="px-4 py-2.5 text-center text-slate-300">{row.px}</td>
                        <td className="px-4 py-2.5 text-center text-slate-300">{row.py}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-emerald-400 bg-emerald-950/15">
                          {row.pk}
                        </td>
                        {isTrans && (
                          <>
                            <td className="px-4 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20 border-l border-slate-800">
                              {row.xTrans}
                            </td>
                            <td className="px-4 py-2.5 text-center font-bold text-amber-400 bg-amber-950/20">
                              {row.yTrans}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
