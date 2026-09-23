'use client';

import { FlaskConical, HelpCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-slate-800">Archroma Global Laboratory Capability Finder</h2>
        <span className="text-xs bg-teal-50 text-teal-700 font-medium px-2.5 py-0.5 rounded-full border border-teal-200">
          Internal Enterprise Tool
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600">
        <Link 
          href="/data-quality" 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Data QA Status</span>
        </Link>
        <span className="h-4 w-px bg-slate-200"></span>
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <FlaskConical className="w-4 h-4 text-teal-600" />
          <span>27 Mapped Labs & Hubs</span>
        </div>
      </div>
    </header>
  );
}
