"use client";

import { ChevronDown } from "lucide-react";

export default function ModelerHeader() {
  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-semibold">Flowable</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {["Processes", "Case models", "Forms", "Decision Tables", "Apps"].map((item) => (
            <button
              key={item}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <span>admin Administrator</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}