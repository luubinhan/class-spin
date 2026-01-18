
import React, { useState, useEffect, useCallback } from 'react';
import { WheelItem, GameState } from './types';
import { WHEEL_COLORS, INITIAL_NAMES } from './utils/constants';
import { audioManager } from './utils/audio';
import Wheel from './components/Wheel';
import Confetti from './components/Confetti';
import { Trash2, RotateCcw, Play, List, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'class_spin_picker_entries';

const App: React.FC = () => {
  const [inputText, setInputText] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : INITIAL_NAMES.join('\n');
  });
  
  const [items, setItems] = useState<WheelItem[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, inputText);
  }, [inputText]);

  useEffect(() => {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const newItems: WheelItem[] = lines.map((text, i) => ({
      id: `${text}-${i}`,
      text: text.trim(),
      color: WHEEL_COLORS[i % WHEEL_COLORS.length]
    }));
    setItems(newItems);
  }, [inputText]);

  const handleSpin = useCallback(() => {
    if (items.length < 2 || gameState !== GameState.IDLE) return;
    setGameState(GameState.SPINNING);
    setWinner(null);
  }, [items, gameState]);

  const onSpinEnd = (winnerIndex: number) => {
    const wonItem = items[winnerIndex];
    setWinner(wonItem);
    setGameState(GameState.CELEBRATING);
    setShowWinnerModal(true);
    audioManager.playWin();
  };

  const removeWinner = () => {
    const newLines = inputText
      .split('\n')
      .filter(line => line.trim() !== '' && line.trim() !== winner?.text);
    setInputText(newLines.join('\n'));
    setShowWinnerModal(false);
    setGameState(GameState.IDLE);
    setWinner(null);
  };

  const handleReset = () => {
    setInputText('');
    setWinner(null);
    setGameState(GameState.IDLE);
    setShowWinnerModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSpin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSpin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 lg:p-8 bg-[#0f172a] text-slate-100 overflow-hidden">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            ClassSpin
          </h1>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 text-sm font-semibold"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-12">
        
        {/* Left: Input Panel */}
        <section className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-6 h-[50vh] lg:h-[80vh]">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <List className="text-blue-400" size={20} />
                <h2 className="font-bold text-lg">Class List ({items.length})</h2>
              </div>
            </div>
            
            <textarea
              className="flex-1 w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-mono text-sm no-scrollbar transition-all"
              placeholder="Enter student names..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={gameState === GameState.SPINNING}
            />

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
              <span>Shortcut: <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400 font-sans">Ctrl+Enter</kbd></span>
            </div>
          </div>
        </section>

        {/* Center/Right: Wheel View */}
        <section className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center justify-center relative">
          <div className="relative group">
            <Wheel 
              items={items} 
              spinning={gameState === GameState.SPINNING} 
              onSpinEnd={onSpinEnd}
            />

            {/* Spin Button - CENTER OF WHEEL */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <button
                onClick={handleSpin}
                disabled={items.length < 2 || gameState !== GameState.IDLE}
                className={`
                  relative w-24 h-24 rounded-full flex flex-col items-center justify-center font-black transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]
                  ${gameState === GameState.SPINNING || items.length < 2
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border-4 border-slate-700'
                    : 'bg-white text-slate-900 hover:scale-110 active:scale-90 border-4 border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]'}
                `}
              >
                {gameState === GameState.SPINNING ? (
                  <RotateCcw className="animate-spin" size={28} />
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-tighter mb-0.5">Click</span>
                    <span className="text-lg leading-tight uppercase">Spin</span>
                  </>
                )}
                {/* Visual arrow decoration for button to feel part of wheel */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rotate-45 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-slate-500 text-sm font-medium animate-pulse">
              {gameState === GameState.IDLE ? "Ready to pick a student" : "Spinning..."}
            </p>
          </div>
        </section>
      </main>

      {/* Winner Modal */}
      {showWinnerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => { setShowWinnerModal(false); setGameState(GameState.IDLE); }}></div>
          <Confetti />
          
          <div className="relative bg-slate-900 border border-slate-700 p-10 rounded-[48px] shadow-2xl w-full max-w-lg flex flex-col items-center text-center animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-2xl ring-4 ring-white/10"
              style={{ backgroundColor: winner?.color }}
            >
              <Sparkles className="text-white" size={56} />
            </div>
            <h3 className="text-blue-400 font-black uppercase tracking-[0.2em] text-sm mb-4">Selected Student</h3>
            <h2 className="text-6xl font-black text-white mb-10 drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] leading-tight">
              {winner?.text}
            </h2>
            
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={removeWinner}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-3xl transition-all shadow-xl hover:shadow-blue-500/30"
              >
                <Trash2 size={24} /> Remove & Spin Again
              </button>
              <button
                onClick={() => { setShowWinnerModal(false); setGameState(GameState.IDLE); }}
                className="w-full px-8 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-3xl transition-all"
              >
                Keep in List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
