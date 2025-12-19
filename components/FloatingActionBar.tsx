import React, { useMemo } from 'react';
import { IPOData, Registrar } from '../types';
import { REGISTRAR_URLS } from '../constants';

interface FloatingActionBarProps {
  selectedIPO: IPOData | null;
}

const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ selectedIPO }) => {
  const targetUrl = useMemo(() => {
    if (!selectedIPO) return null;
    
    // 1. Prioritize Custom URL from Sheet if available
    if (selectedIPO.registrarUrl && selectedIPO.registrarUrl.startsWith('http')) {
        return selectedIPO.registrarUrl;
    }

    // 2. Match Registrar Enum
    const regName = selectedIPO.registrar as string;
    
    if (regName.toLowerCase().includes('link')) return REGISTRAR_URLS[Registrar.LINKINTIME];
    if (regName.toLowerCase().includes('kfin')) return REGISTRAR_URLS[Registrar.KFINTECH];
    if (regName.toLowerCase().includes('big')) return REGISTRAR_URLS[Registrar.BIGSHARE];
    if (regName.toLowerCase().includes('bse')) return REGISTRAR_URLS[Registrar.BSE];
    
    // 3. Fallback to Google Search
    return `https://www.google.com/search?q=${encodeURIComponent(selectedIPO.name + " IPO allotment status " + selectedIPO.registrar)}`;
  }, [selectedIPO]);

  if (!selectedIPO) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 glass-panel z-50">
      <a
        href={targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-2xl mx-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-center shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
      >
        <span>Check Allotment Status</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <p className="text-center text-xs text-slate-500 mt-2">
        Redirects to secure {selectedIPO.registrar} portal
      </p>
    </div>
  );
};

export default FloatingActionBar;