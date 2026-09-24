import * as React from 'react';
import ProvenanceModal from './ProvenanceModal';
export default class LabCapabilityFinder extends React.Component {
    constructor(props) {
        super(props);
        this.searchTimeout = null;
        this.fetchMetadata = () => {
            const baseUrl = this.props.apiBaseUrl || 'http://localhost:3000';
            fetch(`${baseUrl}/api/labs`)
                .then(res => res.json())
                .then(data => {
                this.setState({ metadata: data });
            })
                .catch(err => console.error('Failed to load metadata in SPFx:', err));
        };
        this.executeSearch = () => {
            this.setState({ loading: true });
            const baseUrl = this.props.apiBaseUrl || 'http://localhost:3000';
            const { query, country, region, labId, labType, category, availability } = this.state;
            const params = new URLSearchParams();
            if (query)
                params.set('q', query);
            if (country !== 'all')
                params.set('country', country);
            if (region !== 'all')
                params.set('region', region);
            if (labId !== 'all')
                params.set('labId', labId);
            if (labType !== 'all')
                params.set('labType', labType);
            if (category !== 'all')
                params.set('category', category);
            if (availability !== 'all')
                params.set('availability', availability);
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
        this.handleQueryChange = (e) => {
            const val = e.target.value;
            this.setState({ query: val });
            if (this.searchTimeout)
                clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.executeSearch();
            }, 300);
        };
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
    componentDidMount() {
        this.fetchMetadata();
        this.executeSearch();
    }
    render() {
        const { results, metadata, loading, selectedRecord, query, country, labType, category, availability } = this.state;
        const sampleQueries = ['Cellulose Vat', 'Dyeing', 'Pad Thermosol', 'Hydrostatic Pressure', 'AATCC 22', 'AATCC 42', 'AATCC 127', 'Camouflage', 'Automotive', 'Alkali Solubility', 'DIN 54281', 'FR', 'Printing', 'Discharge'];
        return (React.createElement("div", { style: { fontFamily: 'Segoe UI, sans-serif', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' } },
            React.createElement("div", { style: { backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '16px' } },
                React.createElement("div", { style: { fontSize: '11px', color: '#2dd4bf', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' } }, "Archroma Global Laboratory Capability Finder \u2022 SharePoint Native"),
                React.createElement("h2", { style: { fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' } }, "Search Laboratory Capabilities"),
                React.createElement("p", { style: { fontSize: '12px', color: '#94a3b8', margin: 0, maxWidth: '600px' } }, "Search across global labs, testing methods, fiber materials, and standards with auditable multi-workbook source provenance."),
                React.createElement("div", { style: { marginTop: '16px', display: 'flex', gap: '8px' } },
                    React.createElement("input", { type: "text", value: query, onChange: this.handleQueryChange, placeholder: "Search test, material, standard (e.g. Cellulose Vat, AATCC 22, Pad Thermosol, Hydrostatic)...", style: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', color: '#0f172a', outline: 'none' } }),
                    query && (React.createElement("button", { onClick: () => this.setState({ query: '' }, () => this.executeSearch()), style: { padding: '10px 14px', borderRadius: '8px', backgroundColor: '#334155', color: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 } }, "Clear"))),
                React.createElement("div", { style: { marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' } },
                    React.createElement("span", { style: { color: '#94a3b8', alignSelf: 'center' } }, "Popular:"),
                    sampleQueries.map(sq => (React.createElement("button", { key: sq, onClick: () => this.setState({ query: sq }, () => this.executeSearch()), style: { padding: '4px 8px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: query.toLowerCase() === sq.toLowerCase() ? '#2dd4bf' : '#1e293b', color: query.toLowerCase() === sq.toLowerCase() ? '#0f172a' : '#cbd5e1', cursor: 'pointer', fontSize: '11px', fontWeight: 600 } }, sq))))),
            React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '11px' } },
                React.createElement("div", null,
                    React.createElement("label", { style: { fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' } }, "Country"),
                    React.createElement("select", { value: country, onChange: (e) => this.setState({ country: e.target.value }, () => this.executeSearch()), style: { width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' } },
                        React.createElement("option", { value: "all" },
                            "All Countries (",
                            metadata.countries ? metadata.countries.length : 0,
                            ")"),
                        metadata.countries && metadata.countries.map((c) => (React.createElement("option", { key: c.country, value: c.country }, c.country))))),
                React.createElement("div", null,
                    React.createElement("label", { style: { fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' } }, "Lab Type"),
                    React.createElement("select", { value: labType, onChange: (e) => this.setState({ labType: e.target.value }, () => this.executeSearch()), style: { width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' } },
                        React.createElement("option", { value: "all" }, "All Lab Types"),
                        React.createElement("option", { value: "Commercial Lab" }, "Commercial Lab"),
                        React.createElement("option", { value: "R&T Lab" }, "R&T Lab"))),
                React.createElement("div", null,
                    React.createElement("label", { style: { fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' } }, "Category"),
                    React.createElement("select", { value: category, onChange: (e) => this.setState({ category: e.target.value }, () => this.executeSearch()), style: { width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' } },
                        React.createElement("option", { value: "all" },
                            "All Categories (",
                            metadata.categories ? metadata.categories.length : 0,
                            ")"),
                        metadata.categories && metadata.categories.map((cat) => (React.createElement("option", { key: cat.category, value: cat.category }, cat.category))))),
                React.createElement("div", null,
                    React.createElement("label", { style: { fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' } }, "Availability"),
                    React.createElement("select", { value: availability, onChange: (e) => this.setState({ availability: e.target.value }, () => this.executeSearch()), style: { width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' } },
                        React.createElement("option", { value: "all" }, "All Statuses"),
                        React.createElement("option", { value: "Available" }, "Available (X)"),
                        React.createElement("option", { value: "Conditional / Special" }, "Conditional ((X))")))),
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } },
                React.createElement("h3", { style: { fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 } },
                    "Results (",
                    results.total,
                    " matching capabilities across ",
                    results.grouped.length,
                    " countries)"),
                loading && React.createElement("span", { style: { fontSize: '11px', color: '#0d9488', fontWeight: 600 } }, "Searching API...")),
            results.grouped.length === 0 && !loading ? (React.createElement("div", { style: { backgroundColor: '#ffffff', padding: '32px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' } }, "No capabilities found matching your search. Try resetting filters.")) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, results.grouped.map((countryGroup) => (React.createElement("div", { key: countryGroup.country, style: { backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' } },
                React.createElement("div", { style: { backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 16px', fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' } },
                    React.createElement("span", null,
                        "\uD83C\uDF0D ",
                        countryGroup.country,
                        " (",
                        countryGroup.region,
                        ")"),
                    React.createElement("span", { style: { fontSize: '11px', fontWeight: 500, color: '#cbd5e1' } },
                        countryGroup.labs.length,
                        " labs supporting")),
                React.createElement("div", { style: { padding: '16px' } }, countryGroup.labs.map((lab) => (React.createElement("div", { key: lab.lab_id, style: { marginBottom: '16px' } },
                    React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' } },
                        React.createElement("span", { style: { fontWeight: 700, fontSize: '13px', color: '#0f172a' } },
                            "\uD83C\uDFE2 ",
                            lab.lab_name),
                        React.createElement("span", { style: { fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: lab.lab_type === 'Commercial Lab' ? '#eff6ff' : '#faf5ff', color: lab.lab_type === 'Commercial Lab' ? '#1d4ed8' : '#7e22ce', fontWeight: 600, border: '1px solid #bfdbfe' } }, lab.lab_type)),
                    React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' } }, lab.capabilities.map((cap) => (React.createElement("div", { key: cap.capability_id, style: { backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                        React.createElement("div", null,
                            React.createElement("div", { style: { fontWeight: 700, color: '#0f172a', marginBottom: '4px' } }, cap.normalized_name),
                            React.createElement("div", { style: { color: '#0d9488', fontWeight: 600, marginBottom: '2px' } },
                                "Category: ",
                                cap.category),
                            cap.standard && React.createElement("div", { style: { color: '#475569' } },
                                "Norm: ",
                                cap.standard)),
                        React.createElement("div", { style: { marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                            React.createElement("span", { style: { color: '#64748b' } }, cap.source_count && cap.source_count > 1 ? `Confirmed in ${cap.source_count} workbooks` : `Source: ${cap.source_file.replace('.xlsx', '')}`),
                            React.createElement("button", { onClick: () => this.setState({ selectedRecord: cap }), style: { color: '#0d9488', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', fontSize: '11px' } }, "View details \u00BB"))))))))))))))),
            selectedRecord && (React.createElement(ProvenanceModal, { record: selectedRecord, onClose: () => this.setState({ selectedRecord: null }) }))));
    }
}
//# sourceMappingURL=LabCapabilityFinder.js.map