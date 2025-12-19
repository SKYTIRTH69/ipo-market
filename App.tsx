import React, { useState, useEffect, useCallback } from 'react';
import { IPOData, MarketFeedItem } from './types';
import { GOOGLE_SHEET_CSV_URL } from './constants';
import { fetchMarketNews } from './services/geminiService';
import { fetchSheetData } from './services/sheetService';

import IPOSearch from './components/IPOSearch';
import IPOInfoCard from './components/IPOInfoCard';
import MarketFeed from './components/MarketFeed';
import FloatingActionBar from './components/FloatingActionBar';
import Toast from './components/Toast';

const App: React.FC = () => {
  // State
  const [ipos, setIPOs] = useState<IPOData[]>([]);
  const [feedItems, setFeedItems] = useState<MarketFeedItem[]>([]);
  
  // Loading states
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  
  const [selectedIPO, setSelectedIPO] = useState<IPOData | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  
  const hasApiKey = !!process.env.API_KEY;

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
  };

  const handleFetchData = useCallback(() => {
    // 1. Fetch Sheet Data (Single Source of Truth for IPOs)
    setIsSheetLoading(true);
    fetchSheetData(GOOGLE_SHEET_CSV_URL).then(data => {
        setIPOs(data);
        setIsSheetLoading(false);
        if (data.length === 0) {
           showToast("No active IPOs found in the linked sheet.", "info");
        }
    }).catch(err => {
        console.error("Sheet fetch failed", err);
        setIsSheetLoading(false);
        showToast(err instanceof Error ? err.message : "Failed to load IPO data. Check connection.", "error");
    });

    if (hasApiKey) {
        // 2. Fetch Market News (Independent - Does not affect IPO list)
        setIsNewsLoading(true);
        fetchMarketNews(process.env.API_KEY as string).then(data => {
            setFeedItems(data);
            setIsNewsLoading(false);
        }).catch(e => {
            console.error("News fetch failed", e);
            setIsNewsLoading(false);
            // News failure is less critical, show warning
            showToast("Could not update market news feed.", "warning");
        });
    }
  }, [hasApiKey]);

  useEffect(() => {
    handleFetchData();
    
    // Auto-refresh every 2 minutes
    const intervalId = setInterval(() => {
        handleFetchData();
    }, 120000); 

    return () => clearInterval(intervalId);
  }, [handleFetchData]);

  // Sync selected IPO if it updates in the background (e.g. status change in sheet)
  useEffect(() => {
      if (selectedIPO && ipos.length > 0) {
          const updated = ipos.find(i => i.id === selectedIPO.id || i.name === selectedIPO.name);
          if (updated && updated !== selectedIPO) {
              setSelectedIPO(updated);
          }
      }
  }, [ipos, selectedIPO]);

  return (
    <div className="min-h-screen font-sans text-slate-50 pb-20 relative overflow-x-hidden bg-[#0B1120]">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[150px]"></div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
             </div>
             <div>
               <h1 className="text-lg font-bold text-white leading-none">IPO Allotment Tracker</h1>
               <p className="text-[10px] text-slate-400 font-medium">Real-time status for Indian Stock Market IPOs</p>
             </div>
          </div>
          
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-full px-3 py-1.5 flex items-center space-x-2 backdrop-blur-sm">
            <span className={`relative flex h-2 w-2`}>
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isSheetLoading || isNewsLoading ? 'duration-300' : 'duration-1000'}`}></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">Market Live</span>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="px-6 pt-10 pb-12 max-w-4xl mx-auto text-center">
          
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">Live Market Feed Active</span>
          </div>

          {/* Headlines */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Track Your <span className="text-blue-500">IPO Fortune</span>
          </h1>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Skip the manual search. One-click access to all major Indian registrar allotment portals. Secure, fast, and always current.
          </p>

          {/* Search Area */}
          <div className="mb-12">
            <IPOSearch 
              ipos={ipos} 
              onSelect={setSelectedIPO} 
              selectedId={selectedIPO?.id}
            />
          </div>

          {/* Active IPO Info */}
          <IPOInfoCard ipo={selectedIPO} />

        </main>

        <MarketFeed items={feedItems} isLoading={isNewsLoading && feedItems.length === 0} />
      </div>

      <FloatingActionBar selectedIPO={selectedIPO} />

    </div>
  );
};

export default App;