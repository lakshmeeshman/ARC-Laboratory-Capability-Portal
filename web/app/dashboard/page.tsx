import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardCharts from '@/components/DashboardCharts';
import { getDashboardStats } from '@/lib/db';
import { Building2, Globe2, Layers, FlaskConical, BarChart3, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default function DashboardPage() {
  const stats = getDashboardStats();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Executive Analytics Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Global laboratory footprint, capability coverage, and portfolio distribution metrics.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>2026 Consolidated Analytics</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Labs</span>
              <span className="text-2xl font-black text-slate-900">{stats.kpis.totalLabs}</span>
              <span className="text-[10px] text-slate-500 block">Commercial + R&amp;T</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Countries</span>
              <span className="text-2xl font-black text-teal-600">{stats.kpis.totalCountries}</span>
              <span className="text-[10px] text-slate-500 block">Global regions</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Commercial Labs</span>
              <span className="text-2xl font-black text-blue-600">{stats.kpis.commercialLabs}</span>
              <span className="text-[10px] text-slate-500 block">Customer testing</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">R&amp;T Labs</span>
              <span className="text-2xl font-black text-purple-600">{stats.kpis.rtLabs}</span>
              <span className="text-[10px] text-slate-500 block">R&amp;D Innovation</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Capabilities</span>
              <span className="text-2xl font-black text-slate-900">{stats.kpis.totalCapabilities}</span>
              <span className="text-[10px] text-slate-500 block">Unique test types</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Entries</span>
              <span className="text-2xl font-black text-slate-700">{stats.kpis.totalRecords.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block">Extracted rows</span>
            </div>
          </div>

          {/* Recharts Analytics Component */}
          <DashboardCharts data={stats.charts} />
        </main>
      </div>
    </div>
  );
}
