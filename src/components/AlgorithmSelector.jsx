import React from 'react';
import { Minus, Slash, Circle, Orbit } from 'lucide-react';

export default function AlgorithmSelector({ activeTab, onSelectTab }) {
  const tabs = [
    {
      id: 'DDA',
      name: 'DDA Line',
      desc: 'Digital Differential Analyzer',
      icon: Minus,
      badge: 'Pertemuan II',
    },
    {
      id: 'Bresenham',
      name: 'Bresenham Line',
      desc: 'Integer Increment Algorithm',
      icon: Slash,
      badge: 'Pertemuan II',
    },
    {
      id: 'MidpointCircle',
      name: 'Midpoint Circle',
      desc: 'Lingkaran 8-Oktan',
      icon: Circle,
      badge: 'Pertemuan II',
    },
    {
      id: 'MidpointEllipse',
      name: 'Midpoint Ellipse',
      desc: 'Ellips 2-Region & 4-Kuadran',
      icon: Orbit,
      badge: 'Pertemuan III',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 no-print">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 group ${
              isActive
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-500 border border-slate-800">
                {tab.badge}
              </span>
            </div>

            <div className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
              {tab.name}
            </div>
            <div className="text-xs text-slate-400 truncate mt-0.5">
              {tab.desc}
            </div>

            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
