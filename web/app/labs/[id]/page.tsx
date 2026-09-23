import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getLabById } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Building2, Globe2, MapPin, Sparkles, Layers, ArrowLeft, FileSpreadsheet } from 'lucide-react';

export const revalidate = 0;

interface LabPageProps {
  params: Promise<{ id: string }>;
}

export default async function LabDetailPage({ params }: LabPageProps) {
  const { id } = await params;
  const data = getLabById(id);

  if (!data) {
    notFound();
  }

  const { lab, capabilities, categoryCounts, regionalAdditions } = data;

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lab Directory</span>
          </Link>

          {/* Lab Header Card */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                  <Building2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{lab.lab_name}</h1>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                      lab.lab_type === 'Commercial Lab'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {lab.lab_type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lab.city}, {lab.country}
                    </span>
                    &bull;
                    <span className="font-medium text-slate-600">{lab.region}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{capabilities.length}</span>
                <p className="text-xs text-slate-500 font-medium">Supported Capabilities</p>
              </div>
            </div>

            {lab.notes && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">Lab Overview: </span>{lab.notes}
              </p>
            )}

            {/* Category summary pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryCounts.map((cat) => (
                <div
                  key={cat.category}
                  className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-medium flex items-center gap-1.5"
                >
                  <span>{cat.category}</span>
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Additions Highlight if any */}
          {regionalAdditions.length > 0 && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Regional Added Capabilities ({regionalAdditions.length} blue-marked entries)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {regionalAdditions.map((added) => (
                  <div key={added.capability_id} className="bg-white p-2.5 rounded border border-blue-100 font-medium text-blue-950 flex items-center justify-between">
                    <span>{added.normalized_name}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      {added.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capability List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">Searchable Lab Capabilities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {capabilities.map((cap) => (
                <div
                  key={cap.capability_id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-1.5 text-xs hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 leading-snug">{cap.normalized_name}</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      {cap.availability_status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Category: <span className="text-slate-800 font-semibold">{cap.category}</span>
                  </div>
                  {cap.standard && (
                    <div className="text-[11px] text-teal-700 font-medium">
                      Standard: {cap.standard}
                    </div>
                  )}
                  {cap.method && (
                    <div className="text-[11px] text-slate-600 truncate">
                      Method: {cap.method}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
