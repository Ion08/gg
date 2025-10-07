'use client';

import { useState } from 'react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
  disabled?: boolean;
}

export default function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    onExport(format);
    setShowMenu(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-5 py-2 text-sm font-medium text-slate-100 backdrop-blur-lg transition-all hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300/60 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        aria-label="Export data"
        aria-haspopup="true"
        aria-expanded={showMenu}
      >
        <span className="text-sky-100">Export</span>
        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.133l3.71-3.901a.75.75 0 111.08 1.04l-4.25 4.47a.75.75 0 01-1.08 0l-4.25-4.47a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-[0_20px_60px_-30px_rgba(56,189,248,0.8)] backdrop-blur-xl z-10">
          <div className="space-y-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleExport('csv')}
              className="block w-full rounded-xl px-4 py-2 text-left text-sm text-slate-100 transition-colors hover:bg-sky-400/20"
              role="menuitem"
            >
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="block w-full rounded-xl px-4 py-2 text-left text-sm text-slate-100 transition-colors hover:bg-sky-400/20"
              role="menuitem"
            >
              Export as JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="block w-full rounded-xl px-4 py-2 text-left text-sm text-slate-100 transition-colors hover:bg-sky-400/20"
              role="menuitem"
            >
              Export as PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
