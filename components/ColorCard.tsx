import React, { useState } from 'react';
import { ColorInfo } from '../types';
import { Copy, Check } from 'lucide-react';

interface ColorCardProps {
  color: ColorInfo;
  index: number;
}

export const ColorCard: React.FC<ColorCardProps> = ({ color, index }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Determine if text should be black or white based on background luminance
  const isLight = (hex: string) => {
    const c = hex.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma > 128;
  };

  const textColorClass = isLight(color.hex) ? 'text-black' : 'text-white';
  const subTextColorClass = isLight(color.hex) ? 'text-black/60' : 'text-white/60';

  return (
    <div 
      className={`group relative flex flex-col justify-end p-6 h-64 md:h-80 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl overflow-hidden`}
      style={{ backgroundColor: color.hex, transitionDelay: `${index * 50}ms` }}
    >
      <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
        <button 
          onClick={() => copyToClipboard(color.hex, 'hex')}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
          title="Copy HEX"
        >
          {copied === 'hex' ? <Check size={18} className={textColorClass} /> : <Copy size={18} className={textColorClass} />}
        </button>
      </div>

      <div className="z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className={`text-2xl font-bold mb-1 ${textColorClass}`}>{color.hex}</h3>
        <p className={`font-medium mb-2 ${textColorClass}`}>{color.name}</p>
        <div className={`text-sm ${subTextColorClass} space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75`}>
          <p className="flex justify-between items-center cursor-pointer hover:bg-black/5 p-1 rounded" onClick={() => copyToClipboard(color.rgb || '', 'rgb')}>
            <span>RGB</span>
            <span className="font-mono">{color.rgb}</span>
          </p>
          <p className="flex justify-between items-center cursor-pointer hover:bg-black/5 p-1 rounded" onClick={() => copyToClipboard(color.hsl || '', 'hsl')}>
            <span>HSL</span>
            <span className="font-mono">{color.hsl}</span>
          </p>
          <p className="mt-3 text-xs italic border-t border-black/10 pt-2">{color.description}</p>
        </div>
      </div>
    </div>
  );
};