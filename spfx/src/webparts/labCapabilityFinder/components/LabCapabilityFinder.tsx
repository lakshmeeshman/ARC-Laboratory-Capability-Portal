import * as React from 'react';
import { ILabCapabilityFinderProps } from './ILabCapabilityFinderProps';
import ProvenanceModal from './ProvenanceModal';

export interface SourceProvenance {
  source_file: string;
  source_sheet: string;
  source_row: number;
  source_indicator: string;
  source_color?: string;
  change_type?: string;
}

export interface CapabilityRecord {
  capability_id: string;
  capability_name: string;
  normalized_name: string;
  category: string;
  subcategory?: string;
  material?: string;
  method?: string;
  standard?: string;
  regulation?: string;
  end_use?: string;
  lab_id: string;
  lab_name: string;
  lab_type: string;
  country: string;
  region: string;
  city?: string;
  availability_status: string;
  source_indicator?: string;
  source_file: string;
  source_sheet: string;
  source_row: number;
  source_color?: string;
  change_type?: string;
  all_sources?: SourceProvenance[];
  source_count?: number;
}

export interface LabCapabilityFinderState {
  query: string;
  country: string;
  region: string;
  labId: string;
  labType: string;
  category: string;
  availability: string;
  results: { total: number; grouped: any[]; records: CapabilityRecord[] };
  metadata: { labs: any[]; countries: any[]; categories: any[] };
  loading: boolean;
  selectedRecord: CapabilityRecord | null;
}

export default class LabCapabilityFinder extends React.Component<ILabCapabilityFinderProps, LabCapabilityFinderState> {
  private searchTimeout: any = null;

  constructor(props: ILabCapabilityFinderProps) {
    super(props);
    this.state = {
      query: 'Cellulose Vat',
      country: 'all',
      region: 'all',
      labId: 'all',
      labType: 'all',
      category: 'all',
      availability: 'all',
      results: { total: 0, grouped: [], records: [] },
      metadata: { labs: [], countries: [], categories: [] },
      loading: false,
      selectedRecord: null
    };
  }

  public componentDidMount(): void {
    this.fetchMetadata();
    this.executeSearch();
  }

  private fetchMetadata = (): void => {
    const baseUrl = this.props.apiBaseUrl || 'http://localhost:3000';
    fetch(`${baseUrl}/api/labs`)
      .then(res => res.json())
      .then(data => {
        this.setState({ metadata: data });
      })
      .catch(err => console.error('Failed to load metadata in SPFx:', err));
  };

  private executeSearch = (): void => {
    this.setState({ loading: true });
    const baseUrl = this.props.apiBaseUrl || 'http://localhost:3000';
    const { query, country, region, labId, labType, category, availability } = this.state;

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (country !== 'all') params.set('country', country);
    if (region !== 'all') params.set('region', region);
    if (labId !== 'all') params.set('labId', labId);
    if (labType !== 'all') params.set('labType', labType);
    if (category !== 'all') params.set('category', category);
    if (availability !== 'all') params.set('availability', availability);

    fetch(`${baseUrl}/api/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ results: data, loading: false });
      })
      .catch(err => {
        console.error('SPFx search error:', err);
        this.setState({ loading: false });
      });
  };

  private handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    this.setState({ query: val });
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.executeSearch();
    }, 300);
  };

  public render(): React.ReactElement<ILabCapabilityFinderProps> {
    const { results, metadata, loading, selectedRecord, query, country, labType, category, availability } = this.state;
    const sampleQueries = ['Cellulose Vat', 'Dyeing', 'Pad Thermosol', 'Hydrostatic Pressure', 'AATCC 22', 'AATCC 42', 'AATCC 127', 'Camouflage', 'Automotive', 'Alkali Solubility', 'DIN 54281', 'FR', 'Printing', 'Discharge'];

    return (
      <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        {/* Header Banner */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', color: '#2dd4bf', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Archroma Global Laboratory Capability Finder &bull; SharePoint Native
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Search Laboratory Capabilities</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
            Search across global labs, testing methods, fiber materials, and standards with auditable multi-workbook source provenance.
          </p>

          {/* Search Box */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={query}
              onChange={this.handleQueryChange}
              placeholder="Search test, material, standard (e.g. Cellulose Vat, AATCC 22, Pad Thermosol, Hydrostatic)..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none' }}
            />
            {query && (
              <button
                onClick={() => this.setState({ query: '' }, () => this.executeSearch())}
                style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#334155', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Sample Chips */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
            <span style={{ color: '#94a3b8', alignSelf: 'center' }}>Popular:</span>
            {sampleQueries.map(sq => (
              <button
                key={sq}
                onClick={() => this.setState({ query: sq }, () => this.executeSearch())}
                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: query.toLowerCase() === sq.toLowerCase() ? '#2dd4bf' : '#1e293b', color: query.toLowerCase() === sq.toLowerCase() ? '#0f172a' : '#cbd5e1', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '11px' }}>
          <div>
            <label style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Country</label>
            <select value={country} onChange={(e) => this.setState({ country: e.target.value }, () => this.executeSearch())} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="all">All Countries ({metadata.countries ? metadata.countries.length : 0})</option>
              {metadata.countries && metadata.countries.map((c: any) => (
                <option key={c.country} value={c.country}>{c.country}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Lab Type</label>
            <select value={labType} onChange={(e) => this.setState({ labType: e.target.value }, () => this.executeSearch())} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="all">All Lab Types</option>
              <option value="Commercial Lab">Commercial Lab</option>
              <option value="R&T Lab">R&T Lab</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Category</label>
            <select value={category} onChange={(e) => this.setState({ category: e.target.value }, () => this.executeSearch())} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="all">All Categories ({metadata.categories ? metadata.categories.length : 0})</option>
              {metadata.categories && metadata.categories.map((cat: any) => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>Availability</label>
            <select value={availability} onChange={(e) => this.setState({ availability: e.target.value }, () => this.executeSearch())} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="all">All Statuses</option>
              <option value="Available">Available (X)</option>
              <option value="Conditional / Special">Conditional ((X))</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Results ({results.total} matching capabilities across {results.grouped.length} countries)
          </h3>
          {loading && <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 600 }}>Searching API...</span>}
        </div>

        {/* Results List */}
        {results.grouped.length === 0 && !loading ? (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
            No capabilities found matching your search. Try resetting filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.grouped.map((countryGroup: any) => (
              <div key={countryGroup.country} style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 16px', fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>🌍 {countryGroup.country} ({countryGroup.region})</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#cbd5e1' }}>{countryGroup.labs.length} labs supporting</span>
                </div>

                <div style={{ padding: '16px' }}>
                  {countryGroup.labs.map((lab: any) => (
                    <div key={lab.lab_id} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>🏢 {lab.lab_name}</span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: lab.lab_type === 'Commercial Lab' ? '#eff6ff' : '#faf5ff', color: lab.lab_type === 'Commercial Lab' ? '#1d4ed8' : '#7e22ce', fontWeight: 600, border: '1px solid #bfdbfe' }}>
                          {lab.lab_type}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                        {lab.capabilities.map((cap: CapabilityRecord) => (
                          <div key={cap.capability_id} style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{cap.normalized_name}</div>
                              <div style={{ color: '#0d9488', fontWeight: 600, marginBottom: '2px' }}>Category: {cap.category}</div>
                              {cap.standard && <div style={{ color: '#475569' }}>Norm: {cap.standard}</div>}
                            </div>
                            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#64748b' }}>
                                {cap.source_count && cap.source_count > 1 ? `Confirmed in ${cap.source_count} workbooks` : `Source: ${cap.source_file.replace('.xlsx', '')}`}
                              </span>
                              <button
                                onClick={() => this.setState({ selectedRecord: cap })}
                                style={{ color: '#0d9488', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' }}
                              >
                                View details &raquo;
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

        {/* Modal */}
        {selectedRecord && (
          <ProvenanceModal
            record={selectedRecord}
            onClose={() => this.setState({ selectedRecord: null })}
          />
        )}
      </div>
    );
  }
}
