import React from 'react';
import { resources } from './translation';

const CodeVisualizer = ({ step, isVisible, lang }) => {
  if (!isVisible) return null;

  // Get text based on current language
  const t = resources[lang];

  const codeLines = [
    { id: 0, text: t.v0 },
    { id: 1, text: t.v1 },
    { id: 2, text: t.v2 },
    { id: 3, text: t.v3 },
    { id: 4, text: t.v4 },
    { id: 5, text: t.v5 },
    { id: 6, text: t.v6 },
  ];

  return (
    <div className="bg-black/50 rounded-lg p-4 font-mono text-xs border border-white/10 mb-4 shadow-inner">
      <h4 className="text-blue-400 font-bold mb-2 uppercase tracking-wider">
        System Kernel
      </h4>
      <div className="space-y-1">
        {codeLines.map((line) => (
          <div 
            key={line.id}
            className={`px-3 py-1 rounded transition-all border-l-2 ${
              step === line.id 
                ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400 pl-4 font-bold' 
                : 'text-white/40 border-transparent'
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeVisualizer;