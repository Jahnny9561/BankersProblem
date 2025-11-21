import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import CodeVisualizer from './CodeVisualizer';
import { resources } from './translation'; 
import React, { useState, useEffect } from 'react';

function App() {
  //LANGUAGE STATE
  const [lang, setLang] = useState('bg'); // Default to Bulgarian ('bg') or English ('en')
  const t = resources[lang]; // Used to access current lang

  //GAME STATE
  const [gameState, setGameState] = useState('setup'); 
  const [simMode, setSimMode] = useState('visual'); 
  
  //DATA STATE
  const [numProcesses, setNumProcesses] = useState(4);
  const [totalResources, setTotalResources] = useState(12);
  const [maxTable, setMaxTable] = useState([6, 5, 4, 7]); 
  const [allocTable, setAllocTable] = useState([2, 1, 3, 0]); 
  const [completed, setCompleted] = useState([false, false, false, false]);

  //UI STATE
  const [currentStep, setCurrentStep] = useState(0); 
  const [logs, setLogs] = useState([]);
  const [errorProcessId, setErrorProcessId] = useState(null);

  //COMPUTED VALUES
  const totalAllocated = allocTable.reduce((a, b) => a + b, 0);
  const available = totalResources - totalAllocated;
  const isSetupValid = available >= 0;

  //Initial Log
  useEffect(() => {
    setLogs([t.logSetup]);
  }, [lang]);

  //RESIZING LOGIC
  useEffect(() => {
    if (gameState !== 'setup') return;
    const resize = (prev) => {
      const newArr = Array(numProcesses).fill(0);
      prev.forEach((v, i) => { if (i < numProcesses) newArr[i] = v; });
      return newArr;
    };
    setMaxTable(prev => resize(prev));
    setAllocTable(prev => resize(prev));
    setCompleted(Array(numProcesses).fill(false));
    setErrorProcessId(null);
  }, [numProcesses]);

  //RANDOMIZER
  const randomizeLevel = () => {
    const rTotal = Math.floor(Math.random() * 10) + 10; 
    const rProcs = Math.floor(Math.random() * 4) + 3; 
    const rMax = []; const rAlloc = []; let currentUsed = 0;

    for (let i = 0; i < rProcs; i++) {
      const m = Math.floor(Math.random() * (rTotal / 1.5)) + 3;
      rMax.push(m);
      const limit = Math.min(m - 1, rTotal - currentUsed - 2);
      const a = limit > 0 ? Math.floor(Math.random() * limit) : 0;
      rAlloc.push(a); currentUsed += a;
    }
    setTotalResources(rTotal); setNumProcesses(rProcs);
    setMaxTable(rMax); setAllocTable(rAlloc); setErrorProcessId(null);
    addLog(t.logRandom);
  };

  //HELPER FUNCTIONS
  const addLog = (msg) => setLogs(prev => [`> ${msg}`, ...prev].slice(0, 8));

  const runAnim = async (steps) => {
    if (simMode === 'instant') return;
    for (let s of steps) {
      setCurrentStep(s);
      await new Promise(r => setTimeout(r, 400));
    }
    setCurrentStep(0);
  };

  //MAIN ACTION HANDLER
  const handleRequest = async (pIndex) => {
    const isInstant = simMode === 'instant';
    
    if (!isInstant) await runAnim([1]); 
    const request = 1;

    //Availability
    if (request > available) {
      addLog(`P${pIndex} ${t.logWait}`);
      setErrorProcessId(pIndex);
      return;
    }

    //Safety Check (Rust)
    if (!isInstant) await runAnim([2]); 
    const nextAlloc = [...allocTable];
    nextAlloc[pIndex] += request;
    const nextAvail = available - request;
    
    let isSafe = false;
    try {
      const rustResponse = await invoke('check_safety', {
        numProcesses: numProcesses,
        maxTable: maxTable,
        allocTable: nextAlloc,
        available: nextAvail
      });
      isSafe = rustResponse.is_safe;
    } catch (e) {
      console.error(e); return;
    }

    if (!isSafe) {
      if (!isInstant) await runAnim([3]); 
      addLog(`${t.logDenied} (P${pIndex})`);
      setErrorProcessId(pIndex); 
      return; 
    }

    //Safe Path
    setErrorProcessId(null);
    if (!isInstant) await runAnim([4]);
    setAllocTable(nextAlloc);
    addLog(`${t.logGranted} P${pIndex}.`);

    //Check Finish
    if (!isInstant) await runAnim([5]);
    if (nextAlloc[pIndex] === maxTable[pIndex]) {
      if (!isInstant) await runAnim([6]);
      addLog(`P${pIndex} ${t.logFinish}`);
      
      const finalAlloc = [...nextAlloc];
      finalAlloc[pIndex] = 0;
      setAllocTable(finalAlloc);
      const newCompleted = [...completed];
      newCompleted[pIndex] = true;
      setCompleted(newCompleted);

      if (newCompleted.every(Boolean)) {
        setGameState('won');
        addLog(t.logWon);
      }
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setAllocTable(Array(numProcesses).fill(0));
    setCompleted(Array(numProcesses).fill(false));
    setErrorProcessId(null);
    addLog(t.logSetup);
  };

  return (
    <div className="h-screen w-screen bg-app-bg text-app-text flex font-sans overflow-hidden">

      {/* LEFT: SETUP */}
      <div className={`w-5/12 p-6 border-r border-white/10 flex flex-col bg-app-card transition-all duration-500 ${gameState !== 'setup' ? 'opacity-40 pointer-events-none filter grayscale' : ''}`}>
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
          <h2 className="text-xl font-bold text-blue-400">{t.setupTitle}</h2>
          <button onClick={randomizeLevel} className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded transition-all font-bold">
            {t.randomize}
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
           <div className="flex justify-between items-center">
             <label>{t.totalRes}</label>
             <input type="number" min="1" value={totalResources} onChange={e=>setTotalResources(Number(e.target.value))} className="bg-black/30 border border-white/10 rounded p-2 w-20 text-center font-mono"/>
           </div>
           <div className="flex justify-between items-center">
             <label>{t.procCount}</label>
             <input type="number" min="1" max="8" value={numProcesses} onChange={e=>setNumProcesses(Number(e.target.value))} className="bg-black/30 border border-white/10 rounded p-2 w-20 text-center font-mono"/>
           </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase opacity-50">
                <th className="text-left p-2">{t.colProc}</th>
                <th className="text-center p-2">{t.colAlloc}</th>
                <th className="text-center p-2">{t.colMax}</th>
              </tr>
            </thead>
            <tbody>
              {maxTable.map((max, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="p-2 font-mono text-blue-300">P{i}</td>
                  <td className="p-2 text-center">
                    <input type="number" min="0" max={max} value={allocTable[i]}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), maxTable[i]);
                        const newAlloc = [...allocTable]; newAlloc[i] = val; setAllocTable(newAlloc);
                      }}
                      className="w-16 bg-black/20 border border-white/10 rounded text-center focus:border-blue-500 outline-none"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input type="number" min="1" value={max}
                      onChange={(e) => { const newMax = [...maxTable]; newMax[i] = Number(e.target.value); setMaxTable(newMax); }}
                      className="w-16 bg-black/20 border border-white/10 rounded text-center focus:border-blue-500 outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
           <div className="flex justify-between mb-2 text-sm">
             <span>{t.initialAvail}</span>
             <span className={`font-bold ${!isSetupValid ? 'text-red-500' : 'text-emerald-400'}`}>{available}</span>
           </div>
           <button 
             onClick={() => { setGameState('playing'); addLog("System Started."); }}
             disabled={!isSetupValid || available < 0}
             className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold rounded shadow transition-all"
           >
             {t.startBtn}
           </button>
        </div>
      </div>

      {/* RIGHT: GAME */}
      <div className="w-7/12 p-6 flex flex-col relative bg-app-bg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-emerald-400">{t.simTitle}</h2>
          <div className="flex gap-3 items-center">
            <div className="flex bg-black/30 rounded p-1">
              <button onClick={() => setSimMode('visual')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${simMode === 'visual' ? 'bg-blue-600 text-white' : 'text-white/30 hover:text-white'}`}>{t.visual}</button>
              <button onClick={() => setSimMode('instant')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${simMode === 'instant' ? 'bg-emerald-600 text-white' : 'text-white/30 hover:text-white'}`}>{t.instant}</button>
            </div>
            <button onClick={resetGame} className="text-xs text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500/10">{t.reset}</button>
            <div className="flex gap-3 items-center bg-black/40 rounded-lg p-1 border border-white/10">              <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-bold rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'}`}>EN</button>
              <button onClick={() => setLang('bg')} className={`px-3 py-1 text-xs font-bold rounded ${lang === 'bg' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}>BG</button>
            </div>
          </div>
        </div>

        {gameState === 'playing' || gameState === 'won' ? (
          <>
            <CodeVisualizer step={currentStep} isVisible={simMode === 'visual'} lang={lang} />
            
            <div className="flex-1 overflow-auto mb-24 pr-2">
              <div className="grid gap-3">
                {allocTable.map((alloc, i) => {
                  const need = maxTable[i] - alloc;
                  const isDone = completed[i];
                  const isError = errorProcessId === i;

                  return (
                    <div key={i} className={`p-4 rounded-lg border flex items-center justify-between transition-all duration-500 ${
                      isDone 
                        ? 'bg-emerald-900/10 border-emerald-500/30 opacity-40 order-last scale-95' 
                        : isError 
                           ? 'bg-red-900/20 border-red-500'
                           : 'bg-app-card border-white/10 hover:border-blue-500/50'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex items-center justify-center rounded font-bold text-sm shadow-lg ${
                            isDone ? 'bg-emerald-600 text-white' : 
                            isError ? 'bg-red-600 text-white' : 
                            'bg-blue-900/50 text-blue-200'
                        }`}>
                           {isDone ? 'OK' : `P${i}`}
                        </div>
                        <div>
                          <div className="text-[10px] uppercase opacity-40 tracking-wider">{t.resLabel}</div>
                          <div className="font-mono text-lg">
                            <span className={alloc > 0 ? "text-white" : "opacity-30"}>{alloc}</span>
                            <span className="opacity-30 mx-2">/</span>
                            <span className="opacity-50">{maxTable[i]}</span>
                          </div>
                        </div>
                      </div>

                      {!isDone && (
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                             <div className="text-[10px] uppercase opacity-40 text-yellow-500 tracking-wider">{t.needsLabel}</div>
                             <div className="font-bold text-2xl text-yellow-400 font-mono">{need}</div>
                          </div>
                          <button 
                             onClick={() => handleRequest(i)}
                             disabled={simMode === 'visual' && currentStep !== 0}
                             className={`px-6 py-2 text-white rounded font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all
                                ${isError ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}
                             `}
                          >
                            {isError ? t.deniedBtn : t.reqBtn}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            
            {gameState === 'won' && (
               <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-sm">
                 <div className="text-center">
                    <h2 className="text-5xl font-bold text-white mb-2">{t.wonTitle}</h2>
                    <p className="text-emerald-400 mb-8 text-lg">{t.wonSub}</p>
                    <button onClick={() => setGameState('setup')} className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-110 transition-transform shadow-xl">
                      {t.newSimBtn}
                    </button>
                 </div>
               </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
            <div className="text-6xl opacity-20 font-bold">{t.setupTitle}</div>
          </div>
        )}

        {/* FOOTER */}
        <div className="absolute bottom-0 left-0 w-full bg-[#1a1a1a] border-t border-white/10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
           <div className="flex justify-between items-end">
             <div className="flex-1 mr-8">
               <div className="text-[10px] uppercase opacity-40 mb-1 tracking-widest">{t.logTitle}</div>
               <div className="font-mono text-xs text-yellow-500/90 h-8 overflow-hidden whitespace-nowrap text-ellipsis">
                  {logs[0]}
               </div>
             </div>
             <div className="text-right pl-8 border-l border-white/10">
               <div className="text-[10px] uppercase opacity-40 mb-1 tracking-widest">{t.availTitle}</div>
               <div className={`text-6xl font-mono font-bold tracking-tighter leading-none ${available < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                 {available}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default App;