import React from 'react';
import { Palette } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: Palette[];
  onSelect: (palette: Palette) => void;
  onClear: () => void;
  currentId?: string;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, currentId }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full lg:w-80 flex-shrink-0 bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 flex flex-col h-auto lg:h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Clock size={18} />
          History
        </h2>
        <button 
          onClick={onClear}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      <div className="space-y-4">
        {history.map((palette) => (
          <div 
            key={palette.id}
            onClick={() => onSelect(palette)}
            className={`group cursor-pointer rounded-xl p-3 border transition-all duration-200 ${
              currentId === palette.id 
                ? 'bg-zinc-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-sm truncate ${currentId === palette.id ? 'text-indigo-300' : 'text-zinc-300 group-hover:text-white'}`}>
                {palette.name}
              </span>
              <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400" />
            </div>
            
            <div className="flex h-3 rounded-full overflow-hidden w-full">
              {palette.colors.map((color, idx) => (
                <div 
                  key={idx} 
                  style={{ backgroundColor: color.hex, width: `${100 / palette.colors.length}%` }} 
                  className="h-full"
                />
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 truncate">
              {new Date(palette.createdAt).toLocaleDateString()} • {palette.colors.length} colors
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};