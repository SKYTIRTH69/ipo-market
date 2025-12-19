import React from 'react';
import { MarketFeedItem } from '../types';

interface MarketFeedProps {
  items: MarketFeedItem[];
  isLoading: boolean;
}

const MarketFeed: React.FC<MarketFeedProps> = ({ items, isLoading }) => {
  return (
    <div className="mt-8 mx-4 pb-24">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Market Intelligence</h3>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-16 w-full bg-slate-800/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No recent updates available.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 rounded-lg p-3 transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-200 font-medium line-clamp-2">{item.headline}</p>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{item.source}</span>
                <span>{item.timestamp}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketFeed;