import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getLabs } from '@/lib/db';
import Link from 'next/link';
import { Building2, MapPin, Globe2, Layers, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default function LabsMasterPage() {
  const labs = getLabs();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Archroma Master Lab Directory</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete catalog of 26 active Commercial &amp; R&amp;T innovation laboratories across global regions.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-xs">
              {labs.length} Master Labs Registered
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labs.map((lab) => (
              <Link
                key={lab.lab_id}
                href={`/labs/${lab.lab_id}`}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
                          {lab.lab_name}
                        </h3>
                        <span className="text-xs text-slate-500">{lab.city}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      lab.lab_type === 'Commercial Lab'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {lab.lab_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      {lab.country}
                    </span>
                    &bull;
                    <span className="font-medium text-slate-500">{lab.region}</span>
                  </div>

                  {lab.notes && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 italic">
                      {lab.notes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-700">
                    {lab.capability_count} capabilities supported
                  </span>
                  <span className="text-slate-400 group-hover:text-teal-600 font-semibold flex items-center gap-0.5">
                    Explore lab <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
