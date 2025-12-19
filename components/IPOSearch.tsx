import React, { useState, useMemo, useEffect } from 'react';
import { IPOData, IPOStatus } from '../types';

interface IPOSearchProps {
  ipos: IPOData[];
  onSelect: (ipo: IPOData) => void;
  selectedId?: string;
}

const IPOSearch: React.FC<IPOSearchProps> = ({ ipos, onSelect, selectedId }) => {
  // Initialize query with selected IPO name if available, otherwise empty
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Sync query with selectedId when it changes externally (e.g. initial load)
  useEffect(() => {
    if (selectedId) {
        const selected = ipos.find(i => i.id === selectedId);
        if (selected) setQuery(selected.name);
    }
  }, [selectedId, ipos]);

  const filteredIPOs = useMemo(() => {
    const statusPriority = {
      [IPOStatus.ALLOTMENT_OUT]: 0,
      [IPOStatus.OPEN]: 1,
      [IPOStatus.CLOSED]: 2,
      [IPOStatus.UPCOMING]: 3,
      [IPOStatus.LISTED]: 4,
    };

    const sorted = [...ipos].sort((a, b) => {
      const statusA = (statusPriority as any)[a.status] ?? 99;
      const statusB = (statusPriority as any)[b.status] ?? 99;
      return statusA - statusB;
    });

    if (!query) return sorted;

    // UX Improvement: If the query matches the currently selected IPO exactly,
    // show the full list instead of filtering just that one item.
    // This allows users to open the dropdown and see other options easily.
    const selectedItem = ipos.find(i => i.id === selectedId);
    if (selectedItem && query === selectedItem.name) {
        return sorted;
    }

    return sorted.filter(ipo => 
      ipo.name.toLowerCase().includes(query.toLowerCase()) || 
      ipo.registrar.toLowerCase().includes(query.toLowerCase())
    );
  }, [ipos, query, selectedId]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl relative z-20">
        <label className="block text-slate-500 text-sm font-semibold mb-2 ml-1">
          Select Company Name
        </label>
        
        <div className="relative">
          <input
            type="text"
            className="block w-full px-4 py-4 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium transition-all bg-slate-50"
            placeholder="e.g. Tata Technologies"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onClick={() => setIsOpen(true)} // Re-open if clicked while focused but closed
          />
          
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
            onClick={(e) => {
                e.stopPropagation(); // Prevent input focus event interference
                setIsOpen(!isOpen);
            }}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 mx-6 md:mx-8 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto scrollbar-hide z-50">
            {filteredIPOs.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-400">No IPOs found</div>
            ) : (
              <ul className="py-1">
                {filteredIPOs.map((ipo) => (
                  <li
                    key={ipo.id}
                    onClick={() => {
                      onSelect(ipo);
                      setIsOpen(false);
                      setQuery(ipo.name);
                    }}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center border-b border-slate-50 last:border-none ${selectedId === ipo.id ? 'bg-blue-50' : ''}`}
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-800">{ipo.name}</p>
                      <p className="text-xs text-slate-400">{ipo.registrar}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      ipo.status === IPOStatus.ALLOTMENT_OUT ? 'bg-green-100 text-green-700' :
                      ipo.status === IPOStatus.OPEN ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ipo.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default IPOSearch;