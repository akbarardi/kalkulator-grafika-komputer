import React, { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { convertToMarkdown, convertToCSV, copyToClipboard } from '../utils/exportTable';

export default function OctantSymmetryTable({ algorithm, data }) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  if (!data || !data.symmetryTable || data.symmetryTable.length === 0) return null;

  const handleCopy = async (format) => {
    let headers = [];
    let rows = [];

    if (algorithm === 'MidpointCircle') {
      headers = [
        'k',
        'Dasar (x,y)',
        'Oktan 1 (x,y)',
        'Oktan 2 (-x,y)',
        'Oktan 3 (x,-y)',
        'Oktan 4 (-x,-y)',
        'Oktan 5 (y,x)',
        'Oktan 6 (-y,x)',
        'Oktan 7 (y,-x)',
        'Oktan 8 (-y,-x)',
      ];
      rows = data.symmetryTable.map((r) => [
        r.k,
        r.base,
        r.oct1,
        r.oct2,
        r.oct3,
        r.oct4,
        r.oct5,
        r.oct6,
        r.oct7,
        r.oct8,
      ]);
    } else if (algorithm === 'MidpointEllipse') {
      headers = [
        'No',
        'Titik Dasar (x,y)',
        'Kuadran 1 (x,y)',
        'Kuadran 2 (-x,y)',
        'Kuadran 3 (-x,-y)',
        'Kuadran 4 (x,-y)',
      ];
      rows = data.symmetryTable.map((r) => [
        r.index,
        r.base,
        r.q1,
        r.q2,
        r.q3,
        r.q4,
      ]);
    }

    const text = format === 'md' ? convertToMarkdown(headers, rows) : convertToCSV(headers, rows);
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md mt-6">
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-sm text-slate-200">
            {algorithm === 'MidpointCircle'
              ? 'Tabel Pencerminan Simetri 8 Oktan'
              : 'Tabel Pencerminan Simetri 4 Kuadran'}
          </h3>
          <span className="text-xs text-purple-400/80 font-mono">
            ({data.points.length} total pixel pada canvas)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCopy('md')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
          >
            {copiedFormat === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Markdown</span>
          </button>
          <button
            onClick={() => handleCopy('tsv')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
          >
            {copiedFormat === 'tsv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Salin Excel</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[360px]">
        {algorithm === 'MidpointCircle' ? (
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-3 py-2.5 text-center">k</th>
                <th className="px-3 py-2.5 text-center text-cyan-400">Dasar</th>
                <th className="px-3 py-2.5 text-center text-emerald-300">Oktan 1 (x,y)</th>
                <th className="px-3 py-2.5 text-center">Oktan 2 (-x,y)</th>
                <th className="px-3 py-2.5 text-center">Oktan 3 (x,-y)</th>
                <th className="px-3 py-2.5 text-center">Oktan 4 (-x,-y)</th>
                <th className="px-3 py-2.5 text-center">Oktan 5 (y,x)</th>
                <th className="px-3 py-2.5 text-center">Oktan 6 (-y,x)</th>
                <th className="px-3 py-2.5 text-center">Oktan 7 (y,-x)</th>
                <th className="px-3 py-2.5 text-center">Oktan 8 (-y,-x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.symmetryTable.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 text-slate-300 ${
                    idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80'
                  }`}
                >
                  <td className="px-3 py-2 text-center font-bold text-slate-400">{row.k}</td>
                  <td className="px-3 py-2 text-center font-semibold text-cyan-400 bg-cyan-950/20">{row.base}</td>
                  <td className="px-3 py-2 text-center text-emerald-300 bg-emerald-950/15">{row.oct1}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct2}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct3}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct4}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct5}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct6}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct7}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.oct8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-950/90 sticky top-0 z-10 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-3 py-2.5 text-center">No</th>
                <th className="px-3 py-2.5 text-center text-cyan-400">Dasar (x,y)</th>
                <th className="px-3 py-2.5 text-center text-emerald-300">Kuadran 1 (+x, +y)</th>
                <th className="px-3 py-2.5 text-center text-purple-300">Kuadran 2 (-x, +y)</th>
                <th className="px-3 py-2.5 text-center text-purple-300">Kuadran 3 (-x, -y)</th>
                <th className="px-3 py-2.5 text-center text-purple-300">Kuadran 4 (+x, -y)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.symmetryTable.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 text-slate-300 ${
                    idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80'
                  }`}
                >
                  <td className="px-3 py-2 text-center font-bold text-slate-400">{row.index}</td>
                  <td className="px-3 py-2 text-center font-semibold text-cyan-400 bg-cyan-950/20">{row.base}</td>
                  <td className="px-3 py-2 text-center text-emerald-300 bg-emerald-950/15">{row.q1}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.q2}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.q3}</td>
                  <td className="px-3 py-2 text-center text-purple-300">{row.q4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
