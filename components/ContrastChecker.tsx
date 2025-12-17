import React from 'react';
import { ColorInfo } from '../types';

interface ContrastCheckerProps {
  colors: ColorInfo[];
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ colors }) => {
  // Take the first 5 colors to avoid overcrowding, or all if less than 5
  const displayColors = colors.slice(0, 5);

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
      <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
        <span>Usage Examples</span>
        <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">Preview</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Component Preview */}
        <div className="rounded-xl overflow-hidden shadow-lg" style={{ backgroundColor: displayColors[0]?.hex }}>
          <div className="h-32 w-full relative" style={{ backgroundColor: displayColors[1]?.hex }}>
            <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-full border-4 shadow-sm" 
                 style={{ backgroundColor: displayColors[2]?.hex, borderColor: displayColors[0]?.hex }}></div>
          </div>
          <div className="pt-10 px-6 pb-6">
            <div className="h-4 w-2/3 rounded mb-3 opacity-80" style={{ backgroundColor: displayColors[displayColors.length - 1]?.hex }}></div>
            <div className="h-3 w-full rounded mb-2 opacity-60" style={{ backgroundColor: displayColors[displayColors.length - 1]?.hex }}></div>
            <div className="h-3 w-4/5 rounded opacity-60" style={{ backgroundColor: displayColors[displayColors.length - 1]?.hex }}></div>
            <div className="mt-6">
              <button className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: displayColors[2]?.hex, color: getContrastYIQ(displayColors[2]?.hex || '#000') }}>
                Action Button
              </button>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div className="flex flex-col gap-4 rounded-xl p-6 justify-center" style={{ backgroundColor: displayColors[displayColors.length - 1]?.hex }}>
           <h4 className="text-4xl font-bold" style={{ color: displayColors[0]?.hex }}>
             Main Headline
           </h4>
           <p className="text-lg leading-relaxed" style={{ color: displayColors[1]?.hex }}>
             This is a preview of how the secondary color looks as body text against the last color in your palette.
             Good contrast is essential for readability.
           </p>
           <div className="flex gap-2 mt-2">
             {displayColors.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: c.hex }} title={c.name}></div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper for contrast text color
function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}
