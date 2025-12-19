import React from 'react';
import { IPOData } from '../types';

interface IPOInfoCardProps {
  ipo: IPOData | null;
}

const IPOInfoCard: React.FC<IPOInfoCardProps> = ({ ipo }) => {
  if (!ipo) {
    return null; // Don't show anything if nothing selected, clean UI
  }

  const isPositiveGMP = !ipo.gmp.includes('-');

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="glass-panel rounded-3xl p-1 border border-white/10 shadow-2xl">
        <div className="bg-slate-900/60 rounded-[22px] p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <p className="text-blue-400 font-bold text-xs tracking-widest uppercase mb-1">Selected IPO</p>
              <h2 className="text-3xl font-bold text-white leading-tight">{ipo.name}</h2>
            </div>
            <div className="mt-2 md:mt-0 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-200 text-xs font-medium">
              {ipo.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Expected GMP</p>
              <p className={`text-2xl font-bold ${isPositiveGMP ? 'text-green-400' : 'text-red-400'}`}>
                {ipo.gmp}
              </p>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Subscription</p>
              <p className="text-2xl font-bold text-white">{ipo.subscription}</p>
            </div>
          </div>

          <div className="mt-4 bg-blue-950/40 rounded-xl p-4 border border-blue-500/10 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs">Registrar</span>
              <span className="text-white font-medium">{ipo.registrar}</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/10"></div>
            <div className="flex flex-col text-right sm:text-left">
              <span className="text-slate-400 text-xs">Allotment Date</span>
              <span className="text-white font-medium">{ipo.allotmentDate || 'To Be Announced'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPOInfoCard;