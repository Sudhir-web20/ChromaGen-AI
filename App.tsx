import React, { useState, useEffect } from 'react';
import { Sparkles, Palette as PaletteIcon, Command, Search, Download } from 'lucide-react';
import { generatePalette } from './services/geminiService';
import { Palette, GeneratorStatus } from './types';
import { ColorCard } from './components/ColorCard';
import { ContrastChecker } from './components/ContrastChecker';
import { HistorySidebar } from './components/HistorySidebar';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [history, setHistory] = useState<Palette[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load history from local storage on mount
    const savedHistory = localStorage.getItem('chromagen_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (palette: Palette) => {
    const newHistory = [palette, ...history].slice(0, 20); // Keep last 20
    setHistory(newHistory);
    localStorage.setItem('chromagen_history', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('chromagen_history');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setStatus(GeneratorStatus.LOADING);
    try {
      const palette = await generatePalette(query);
      setCurrentPalette(palette);
      saveToHistory(palette);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GeneratorStatus.ERROR);
    }
  };

  const handleDownloadJson = () => {
    if (!currentPalette) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentPalette, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentPalette.name.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const suggestions = [
    "Cyberpunk Neon City",
    "Pastel Dream in Paris",
    "Deep Forest Mystery",
    "Vintage 1970s Coffee Shop",
    "Minimalist Corporate Tech",
    "Sunset over Santorini"
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white selection:bg-indigo-500/30">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="flex-shrink-0 px-6 py-4 md:px-12 md:py-8 flex justify-between items-center border-b border-white/5 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <PaletteIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                ChromaGen AI
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Intelligent Palette Generator</p>
            </div>
          </div>
          
          <div className="flex gap-4">
             {currentPalette && (
                <button 
                  onClick={handleDownloadJson}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-zinc-800"
                >
                  <Download size={16} />
                  Export JSON
                </button>
             )}
             <button 
               onClick={() => setShowHistory(!showHistory)} 
               className="lg:hidden p-2 text-zinc-400 hover:text-white"
             >
               <HistoryIcon size={24} />
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 flex flex-col gap-12">
            
            {/* Input Section */}
            <section className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
              {!currentPalette && (
                <div className="space-y-4 mb-12">
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Your imagination, <br />
                    <span className="text-indigo-400">visualized in color.</span>
                  </h2>
                  <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                    Describe a mood, a scene, or a theme, and let our engine curate the perfect harmonious color palette for you.
                  </p>
                </div>
              )}

              <form onSubmit={handleGenerate} className="relative group z-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-zinc-900 rounded-xl p-2 shadow-2xl border border-white/10">
                  <div className="pl-4 text-zinc-500">
                    <Sparkles size={20} />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your theme (e.g., 'Rainy London Street', '80s Synthwave')"
                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-zinc-600 font-medium"
                    autoFocus
                  />
                  <button 
                    type="button" 
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 mr-2 bg-zinc-800 rounded text-xs text-zinc-500 border border-zinc-700 pointer-events-none"
                  >
                    <Command size={12} /> 
                    <span>Enter</span>
                  </button>
                  <button
                    type="submit"
                    disabled={status === GeneratorStatus.LOADING || !query.trim()}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
                      ${status === GeneratorStatus.LOADING 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                  >
                    {status === GeneratorStatus.LOADING ? (
                      <>Processing...</>
                    ) : (
                      <>Generate <Search size={18} /></>
                    )}
                  </button>
                </div>
              </form>

              {/* Suggestions */}
              {!currentPalette && status !== GeneratorStatus.LOADING && (
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setQuery(s);
                        // Optional: auto-submit
                      }}
                      className="px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-full text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Loading State */}
            {status === GeneratorStatus.LOADING && (
              <div className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="h-64 md:h-80 bg-zinc-900 rounded-2xl"></div>
                 ))}
              </div>
            )}

            {/* Result Section */}
            {status === GeneratorStatus.SUCCESS && currentPalette && (
              <div className="w-full max-w-7xl mx-auto space-y-12 animate-slide-up pb-20">
                
                {/* Palette Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{currentPalette.name}</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl">{currentPalette.description}</p>
                  </div>
                  <div className="text-zinc-500 text-sm font-mono">
                    {currentPalette.colors.length} Colors • Generated by ChromaGen
                  </div>
                </div>

                {/* Color Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentPalette.colors.map((color, idx) => (
                    <ColorCard key={idx} color={color} index={idx} />
                  ))}
                </div>

                {/* Combinations / Checker */}
                <ContrastChecker colors={currentPalette.colors} />
                
              </div>
            )}

             {/* Error State */}
             {status === GeneratorStatus.ERROR && (
               <div className="text-center text-red-400 bg-red-400/10 p-6 rounded-xl border border-red-400/20 max-w-lg mx-auto">
                 <p className="font-semibold">Something went wrong.</p>
                 <p className="text-sm opacity-80 mt-1">Please check your internet connection or try a different description.</p>
               </div>
             )}

          </div>
        </div>
      </main>

      {/* History Sidebar - Desktop: Always visible if history exists, Mobile: Toggled */}
      <div className={`${showHistory ? 'fixed inset-0 z-50 lg:static' : 'hidden lg:flex'} flex flex-col`}>
        {/* Mobile Backdrop */}
        <div className="lg:hidden absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
        
        {/* Sidebar Content */}
        <div className="relative h-full">
           <HistorySidebar 
             history={history} 
             onSelect={(p) => {
               setCurrentPalette(p);
               setStatus(GeneratorStatus.SUCCESS);
               setShowHistory(false);
             }}
             onClear={handleClearHistory}
             currentId={currentPalette?.id}
           />
             <button 
               onClick={() => setShowHistory(false)}
               className="lg:hidden absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-white"
             >
               <span className="sr-only">Close</span>
               ✕
             </button>
        </div>
      </div>

    </div>
  );
};

// Simple Icon component for the header button
const HistoryIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
  </svg>
);

export default App;