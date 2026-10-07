import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { FileSpreadsheet, Download, Database, CheckCircle2, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Download Excel Files - Archroma Lab Capability Finder',
  description: 'Download original source Excel workbooks and consolidated capability datasets',
};

const EXCEL_FILES = [
  {
    name: 'Lab capabilities Archroma 2026 Pakistan.xlsx',
    region: 'Pakistan',
    labs: 'Pakistan Textile & Chemical Hubs',
    size: '119.5 KB',
    description: 'Complete capability mapping for Pakistan lab locations including wet processing, analytical & fastness testing.',
  },
  {
    name: 'Lab capabilities Archroma 2026 Bangpoo.xlsx',
    region: 'Asia Pacific (Thailand)',
    labs: 'Bangpoo Commercial & Technical Labs',
    size: '123.4 KB',
    description: 'Comprehensive lab testing list for Bangpoo regional center and Thailand application laboratories.',
  },
  {
    name: 'Lab capabilities Archroma 2026 Langweid.xlsx',
    region: 'Europe (Germany)',
    labs: 'Langweid Innovation & Application Center',
    size: '118.8 KB',
    description: 'Core European application and analytical testing capabilities from Langweid, Germany.',
  },
  {
    name: 'Lab capabilities Archroma 2026 Liberec.xlsx',
    region: 'Europe (Czech Republic)',
    labs: 'Liberec Application Lab',
    size: '120.9 KB',
    description: 'European regional capabilities for textile testing and quality audit from Liberec.',
  },
  {
    name: 'Lab capabilities Archroma 2026 Printing Lab Castellbisbal.xlsx',
    region: 'Europe (Spain)',
    labs: 'Castellbisbal Printing & Color Lab',
    size: '119.0 KB',
    description: 'Specialized textile printing lab capability matrix from Castellbisbal, Spain.',
  },
  {
    name: 'Lab capabilities Archroma 2026 South Americas.xlsx',
    region: 'South America (Brazil / LATAM)',
    labs: 'South American Technical Centers',
    size: '119.2 KB',
    description: 'Latin America technical service and product application capability listings.',
  },
  {
    name: 'Lab capabilities Archroma 2026 Turkey.xlsx',
    region: 'Middle East & Africa (Turkey)',
    labs: 'Turkey Technical Center',
    size: '119.2 KB',
    description: 'Regional lab capability index for Turkey fastness, chemical, and physical testing.',
  },
  {
    name: 'Lab capabilities Archroma 2026 USA.xlsx',
    region: 'North America (USA)',
    labs: 'USA Technical & Commercial Labs',
    size: '119.0 KB',
    description: 'North American technical application laboratory capability data.',
  },
  {
    name: 'Lab capabilities Archroma 2026.xlsx',
    region: 'Global Overview',
    labs: 'Global Master Capabilities List',
    size: '118.7 KB',
    description: 'Consolidated master Excel spreadsheet covering global standard capability mapping.',
  },
  {
    name: 'Lab capabilities Archroma 2026_Sep.xlsx',
    region: 'Global Audit Update',
    labs: 'September 2026 Capability Update',
    size: '125.0 KB',
    description: 'Latest September 2026 audit update workbook with newly mapped test methods.',
  },
];

export default function DownloadsPage() {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                  <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                  <span>Source Excel Workbooks &amp; Data Export</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Download Original Excel Files</h1>
                <p className="text-slate-300 text-sm max-w-2xl">
                  Access and download all 10 raw Excel workbooks that power the Archroma Global Laboratory Capability Finder.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Return to Capability Finder</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Workbooks</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">10 Regional Excel Files</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Consolidated Records</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">21,793 Capability Rows</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mapped Labs &amp; Hubs</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">26 Labs Across 15 Countries</p>
              </div>
            </div>
          </div>

          {/* Files Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Available Excel Spreadsheets</span>
              </h2>
              <span className="text-xs text-slate-500 bg-slate-200 px-2.5 py-1 rounded-md font-mono">10 Files Available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXCEL_FILES.map((file, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{file.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1 font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                              <MapPin className="w-3 h-3 text-teal-600" />
                              {file.region}
                            </span>
                            <span>&bull;</span>
                            <span className="font-mono text-slate-600">{file.size}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {file.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-500">
                      Coverage: <strong className="text-slate-800">{file.labs}</strong>
                    </span>

                    <a
                      href={`/excel/${encodeURIComponent(file.name)}`}
                      download={file.name}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Excel</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
