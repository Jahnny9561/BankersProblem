import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen bg-app-bg text-app-text p-8 flex gap-6 font-mono">
      
      {/*Controls */}
      <div className="w-1/3 bg-app-card rounded-xl border border-white/10 p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">
          System Configuration
        </h2>
        <p className="opacity-70 text-sm">
         Total Resources will be here
        </p>
      </div>

      {/*Visualization */}
      <div className="w-2/3 flex flex-col gap-6">
        <div className="flex-1 bg-app-card rounded-xl border border-white/10 p-6 flex items-center justify-center">
          <h1 className="text-3xl font-bold">
            Banker's Algorithm
          </h1>
        </div>
      </div>

    </div>
  );
}

export default App;