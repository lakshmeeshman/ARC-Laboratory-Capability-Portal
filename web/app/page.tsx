'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProvenanceModal from '@/components/ProvenanceModal';
import { CapabilityRecord } from '@/lib/db';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Globe2, 
  Building2, 
  CheckCircle2, 
  Info, 
  FileSpreadsheet, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function LabCapabilityFinderContent() {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get('embedded') === 'true' || searchParams.get('embedded') === '1';

  const [query, setQuery] = useState('Cellulose Vat');
  const [country, setCountry] = useState('all');
  const [region, setRegion] = useState('all');
  const [labId, setLabId] = useState('all');
  const [labType, setLabType] = useState('all');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all');

  const [metadata, setMetadata] = useState<{ labs: any[]; countries: any[]; categories: any[] }>({
    labs: [],
    countries: [],
    categories: []
  });

  const [results, setResults] = useState<{ total: number; grouped: any[]; records: CapabilityRecord[] }>({
    total: 0,
    grouped: [],
    records: []
  });

  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CapabilityRecord | null>(null);

  // Quick sample queries
  const sampleQueries = [
    'Cellulose Vat',
    'Dyeing',
    'Pad Thermosol',
    'Hydrostatic Pressure',
    'AATCC 22',
    'AATCC 42',
    'AATCC 127',
    'Camouflage',
    'Automotive',
    'Alkali Solubility',
    'DIN 54281',
    'FR',
    'Printing',
    'Discharge'
  ];

  // Fetch filter metadata on load
  useEffect(() => {
    fetch('/api/labs')
      .then(res => res.json())
      .then(data => setMetadata(data))
      .catch(err => console.error(err));
  }, []);

  // Search API fetcher
  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (country !== 'all') params.set('country', country);
      if (region !== 'all') params.set('region', region);
      if (labId !== 'all') params.set('labId', labId);
      if (labType !== 'all') params.set('labType', labType);
      if (category !== 'all') params.set('category', category);
      if (availability !== 'all') params.set('availability', availability);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 250);
    return () => clearTimeout(timer);
  }, [query, country, region, labId, labType, category, availability]);

  const resetFilters = () => {
    setQuery('');
    setCountry('all');
    setRegion('all');
    setLabId('all');
    setLabType('all');
    setCategory('all');
    setAvailability('all');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Hide Sidebar when running inside SharePoint embedded mode */}
      {!isEmbedded && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {!isEmbedded && <Header />}

        <main className={`flex-1 overflow-y-auto ${isEmbedded ? 'p-4 space-y-4' : 'p-6 space-y-6'}`}>
          {/* Main Hero Search Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Unified Excel Capability Index (2026 Baseline + Regional Additions)</span>
                {isEmbedded && (
                  <span className="bg-teal-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ml-1">
                    SharePoint Mode
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight">Archroma Lab Capability Finder</h1>
              <p className="text-xs text-slate-300 max-w-2xl">
                Search for any test, standard, fiber material, or method to quickly locate performing labs, location availability, and exact Excel source provenance.
              </p>

              {/* Large Search Input */}
              <div className="relative pt-2">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a test, material, method or standard (e.g., Cellulose Vat, AATCC 22, Pad Thermosol, Hydrostatic, Automotive)..."
                    className="w-full pl-12 pr-28 py-3.5 bg-white text-slate-900 placeholder-slate-400 rounded-xl shadow-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Sample Queries */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium mr-1">Popular searches:</span>
                {sampleQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className={`px-2.5 py-1 rounded-lg border transition-all text-xs font-medium ${
                      query.toLowerCase() === q.toLowerCase()
                        ? 'bg-teal-400 text-slate-950 font-bold border-teal-300 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Combinable Filters Bar */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>Combinable Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Country Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Countries ({metadata.countries?.length || 0})</option>
                  {metadata.countries?.map((c: any) => (
                    <option key={c.country} value={c.country}>
                      {c.country} ({c.lab_count} labs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Lab Type Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Lab Type</label>
                <select
                  value={labType}
                  onChange={(e) => setLabType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Lab Types</option>
                  <option value="Commercial Lab">Commercial Lab</option>
                  <option value="R&T Lab">R&T Lab</option>
                </select>
              </div>

              {/* Specific Lab Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Specific Lab</label>
                <select
                  value={labId}
                  onChange={(e) => setLabId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Labs ({metadata.labs?.length || 0})</option>
                  {metadata.labs?.map((l: any) => (
                    <option key={l.lab_id} value={l.lab_id}>
                      {l.lab_name} ({l.lab_type}) - {l.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Capability Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Categories ({metadata.categories?.length || 0})</option>
                  {metadata.categories?.map((cat: any) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Regions</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="North America">North America</option>
                  <option value="Latin America">Latin America</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Availability</option>
                  <option value="Available">Available (X)</option>
                  <option value="Conditional / Special">Conditional / Special ((X))</option>
                  <option value="Planned / Optional">Planned / Optional (O)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Result Header / Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {query ? `Results for "${query}"` : 'All Capabilities Index'}
              </h2>
              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
                {results.total} records found
              </span>
              <span className="text-xs text-slate-500 font-medium">
                across {results.grouped.length} countries
              </span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-teal-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>Searching capability database...</span>
              </div>
            )}
          </div>

          {/* Grouped Results Display: Country -> Lab -> Capabilities */}
          {results.grouped.length === 0 && !loading ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
              <Info className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 text-base">No Matching Capabilities Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No capabilities matched your current search and filter selection. Try adjusting the query string or resetting combinable filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors mt-2"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {results.grouped.map((countryGroup: any) => (
                <div key={countryGroup.country} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Country Group Header */}
                  <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-sm tracking-wide">{countryGroup.country}</h3>
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium">
                        {countryGroup.region}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {countryGroup.labs.length} {countryGroup.labs.length === 1 ? 'lab location' : 'lab locations'} supporting
                    </div>
                  </div>

                  {/* Labs inside Country */}
                  <div className="divide-y divide-slate-100">
                    {countryGroup.labs.map((lab: any) => (
                      <div key={lab.lab_id} className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Building2 className="w-4 h-4 text-teal-600" />
                            <Link 
                              href={`/labs/${lab.lab_id}`}
                              className="font-bold text-slate-900 text-sm hover:text-teal-600 hover:underline flex items-center gap-1"
                            >
                              <span>{lab.lab_name}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </Link>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              lab.lab_type === 'Commercial Lab' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {lab.lab_type}
                            </span>
                            {lab.city && lab.city !== lab.lab_name && (
                              <span className="text-xs text-slate-500">City: {lab.city}</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            {lab.capabilities.length} matched capabilities
                          </span>
                        </div>

                        {/* Capability Cards Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {lab.capabilities.map((cap: CapabilityRecord) => (
                            <div
                              key={cap.capability_id}
                              className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 hover:bg-white hover:shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-2"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                                    {cap.normalized_name}
                                  </h4>
                                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    cap.availability_status === 'Available'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : cap.availability_status === 'Conditional / Special'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                    {cap.availability_status} ({cap.source_indicator})
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[11px] text-slate-600">
                                  <span className="bg-slate-200/80 px-1.5 py-0.5 rounded font-medium text-slate-700">
                                    {cap.category}
                                  </span>
                                  {cap.standard && (
                                    <span className="text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                      Norm: {cap.standard}
                                    </span>
                                  )}
                                  {cap.method && (
                                    <span className="text-slate-600">
                                      Method: {cap.method}
                                    </span>
                                  )}
                                  {cap.end_use && (
                                    <span className="text-slate-600 font-medium">
                                      End use: {cap.end_use}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Source Provenance Link */}
                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">
                                  {cap.source_count && cap.source_count > 1
                                    ? `Confirmed in ${cap.source_count} workbooks`
                                    : `Source: ${cap.source_file.replace('.xlsx', '')}`}
                                </span>
                                <button
                                  onClick={() => setSelectedRecord(cap)}
                                  className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                                  <span>View source details</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Source Provenance Modal */}
      <ProvenanceModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}

export default function LabCapabilityFinder() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-900 text-teal-400 font-semibold text-sm">
        Loading Archroma Lab Capability Finder...
      </div>
    }>
      <LabCapabilityFinderContent />
    </Suspense>
  );
}
