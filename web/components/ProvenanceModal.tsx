'use client';

import { CapabilityRecord } from '@/lib/db';
import { X, FileSpreadsheet, MapPin, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface ProvenanceModalProps {
  record: CapabilityRecord | null;
  onClose: () => void;
}

export default function ProvenanceModal({ record, onClose }: ProvenanceModalProps) {
  if (!record) return null;

  const sources = record.all_sources && record.all_sources.length > 0
    ? record.all_sources
    : [{
        source_file: record.source_file,
        source_sheet: record.source_sheet,
        source_row: record.source_row,
        source_indicator: record.source_indicator || 'X',
        source_color: record.source_color,
        change_type: record.change_type
      }];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-semibold text-sm">Capability Source Provenance</h3>
              <p className="text-xs text-slate-400">Multi-Workbook Consolidation Audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Capability Name</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{record.capability_name}</p>
            {record.normalized_name !== record.capability_name && (
              <p className="text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 mt-1 inline-block font-medium">
                Normalized Alias: {record.normalized_name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Category / Sheet:</span>
              <p className="font-semibold text-slate-800 mt-0.5">{record.category}</p>
            </div>
            {record.subcategory && (
              <div>
                <span className="text-slate-500 font-medium">Subcategory / Group:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.subcategory}</p>
              </div>
            )}
            {record.standard && (
              <div>
                <span className="text-slate-500 font-medium">Standard / Norm:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.standard}</p>
              </div>
            )}
            {record.method && (
              <div>
                <span className="text-slate-500 font-medium">Method / Procedure:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{record.method}</p>
              </div>
            )}
          </div>

          {/* Location details */}
          <div className="bg-teal-50/70 border border-teal-200 p-3.5 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>{record.lab_name} ({record.lab_type})</span>
            </div>
            <p className="text-teal-800 pl-5">
              {record.city ? `${record.city}, ` : ''}{record.country} &bull; <span className="font-medium">{record.region}</span>
            </p>
          </div>

          {/* Excel Source Locations List */}
          <div className="border border-slate-200 rounded-lg p-3.5 space-y-2.5 text-xs bg-white">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                <span>Confirming Workbooks ({sources.length} files)</span>
              </div>
              <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Audited &amp; Consolidated
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {sources.map((src, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] font-mono flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="font-bold text-slate-800">{src.source_file}</span>
                    <span className="text-slate-400 font-sans block text-[10px]">
                      Sheet: {src.source_sheet} &bull; Row {src.source_row}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-sans">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-300 font-bold text-slate-700">
                      Indicator: &quot;{src.source_indicator}&quot;
                    </span>
                    {src.source_color && (
                      <span className="block text-[10px] text-blue-700 font-semibold mt-0.5">
                        {src.source_color}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span className="font-medium text-slate-700">Availability Status:</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {record.availability_status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold transition-colors"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
}
