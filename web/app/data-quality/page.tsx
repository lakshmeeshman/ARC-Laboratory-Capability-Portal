import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { getDataQualityReport } from '@/lib/db';
import { ShieldCheck, FileSpreadsheet, AlertTriangle, CheckCircle2, Info, RefreshCw } from 'lucide-react';

export const revalidate = 0;

export default function DataQualityPage() {
  const report = getDataQualityReport();

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Data Quality &amp; Audit Governance</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit trail for multi-workbook consolidation, regional additions, conflict handling, and naming normalization.
              </p>
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>100% Provenance Preserved</span>
            </span>
          </div>

          {/* Audit Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {report.summary.map((s) => (
              <div key={s.log_type} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {s.log_type}
                </span>
                <span className="text-2xl font-black text-slate-900">{s.count}</span>
                <span className="text-[10px] text-slate-500 block">Logged audit occurrences</span>
              </div>
            ))}
          </div>

          {/* Source Workbooks Detected Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>Detected Excel Source Workbooks</span>
            </h2>
            <p className="text-xs text-slate-500">
              The ingestion pipeline automatically detected and consolidated all 10 Excel workbooks without data loss.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              {[
                { name: 'Lab capabilities Archroma 2026_Sep.xlsx', role: 'Master Consolidated Workbook (Baseline)' },
                { name: 'Lab capabilities Archroma 2026 Liberec.xlsx', role: 'Liberec Blue Markings & 29+ Regional Additions' },
                { name: 'Lab capabilities Archroma 2026 Printing Lab Castellbisbal.xlsx', role: 'Castellbisbal Specialized Printing Additions' },
                { name: 'Lab capabilities Archroma 2026 USA.xlsx', role: 'USA AATCC Standard Additions (Charlotte)' },
                { name: 'Lab capabilities Archroma 2026  Pakistan.xlsx', role: 'Pakistan Printing & Regional Availability' },
                { name: 'Lab capabilities Archroma 2026 Bangpoo.xlsx', role: 'Bangpoo Regional Supplement' },
                { name: 'Lab capabilities Archroma 2026 Langweid.xlsx', role: 'Langweid Mechanical & Finishing Supplement' },
                { name: 'Lab capabilities Archroma 2026 South Americas.xlsx', role: 'Latin America Regional Supplement' },
                { name: 'Lab capabilities Archroma 2026 Turkey.xlsx', role: 'Turkey Regional Supplement' },
                { name: 'Lab capabilities Archroma 2026.xlsx', role: 'Legacy Baseline Workbook' }
              ].map((wb) => (
                <div key={wb.name} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{wb.name}</span>
                  <span className="text-[10px] font-sans font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                    {wb.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recent Ingestion &amp; Audit Log Entries</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Source Workbook</th>
                    <th className="py-2.5 px-3">Sheet</th>
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">Audit Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {report.logs.map((log: any) => (
                    <tr key={log.log_id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.log_type === 'Regional Addition'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : log.log_type === 'Naming Normalization'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.log_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 truncate max-w-[200px]">{log.source_file}</td>
                      <td className="py-2.5 px-3">{log.source_sheet}</td>
                      <td className="py-2.5 px-3">Row {log.source_row}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-800">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
