'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Building2, 
  Globe2, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  FlaskConical 
} from 'lucide-react';

const navigation = [
  { name: 'Lab Capability Finder', href: '/', icon: Search },
  { name: 'Labs Master', href: '/labs', icon: Building2 },
  { name: 'Countries View', href: '/countries', icon: Globe2 },
  { name: 'Capability Categories', href: '/categories', icon: Layers },
  { name: 'Analytics Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Data Quality & Audit', href: '/data-quality', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
          <FlaskConical className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-wide text-white leading-none">ARCHROMA</h1>
          <p className="text-[11px] text-teal-400 font-medium tracking-wider uppercase mt-1">Lab Capability Finder</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 font-semibold shadow-sm border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
        <p className="font-medium text-slate-300">Global Lab Capability Index</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Updated 2026 Consolidated Data</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-teal-400 bg-teal-950/60 border border-teal-800/50 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span>10 Workbooks Consolidated</span>
        </div>
      </div>
    </aside>
  );
}
