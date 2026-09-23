import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getCategories } from '@/lib/db';
import Link from 'next/link';
import { Layers, Building2, FlaskConical, Search } from 'lucide-react';

export const revalidate = 0;

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Testing Capability Categories</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                The 8 standard testing categories extracted from the consolidated Excel workbooks.
              </p>
            </div>
            <span className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg">
              8 Standard Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.category}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-teal-400 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{cat.category}</h3>
                      <p className="text-xs text-slate-500">{cat.lab_count} labs supporting</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Unique Capabilities</span>
                    <span className="font-bold text-slate-900 text-base">{cat.unique_capabilities}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <span className="text-slate-400 font-medium block text-[11px]">Total Lab Entries</span>
                    <span className="font-bold text-teal-700 text-base">{cat.total_records}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/?category=${encodeURIComponent(cat.category)}`}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Find capabilities in {cat.category}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
