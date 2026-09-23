import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getCountries } from '@/lib/db';
import Link from 'next/link';
import { Globe2, Building2, Layers, ChevronRight } from 'lucide-react';

export const revalidate = 0;

export default function CountriesPage() {
  const countries = getCountries();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Archroma Country Directory</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of lab presence and testing capabilities organized by country.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg">
              {countries.length} Mapped Countries
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((c) => (
              <Link
                key={c.country}
                href={`/countries/${encodeURIComponent(c.country)}`}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                        {c.country}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">{c.region}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-slate-400 font-medium block text-[11px]">Lab Locations</span>
                      <span className="font-bold text-slate-900 text-sm">{c.lab_count}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                      <span className="text-slate-400 font-medium block text-[11px]">Capabilities</span>
                      <span className="font-bold text-teal-700 text-sm">{c.capability_count}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold group-hover:text-teal-600">
                  <span>Explore country labs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
