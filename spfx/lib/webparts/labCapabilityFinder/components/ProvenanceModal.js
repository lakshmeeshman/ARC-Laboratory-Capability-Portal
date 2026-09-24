import * as React from 'react';
export default class ProvenanceModal extends React.Component {
    render() {
        const { record, onClose } = this.props;
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
        return (React.createElement("div", { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' } },
            React.createElement("div", { style: { backgroundColor: '#ffffff', borderRadius: '12px', maxWidth: '540px', width: '100%', margin: 'auto', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontFamily: 'Segoe UI, sans-serif' } },
                React.createElement("div", { style: { backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                    React.createElement("h4", { style: { margin: 0, fontSize: '14px', fontWeight: 700 } }, "Capability Source Provenance"),
                    React.createElement("button", { onClick: onClose, style: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', fontWeight: 700 } }, "\u00D7")),
                React.createElement("div", { style: { padding: '20px', fontSize: '12px', color: '#334155' } },
                    React.createElement("div", { style: { marginBottom: '12px' } },
                        React.createElement("div", { style: { fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' } }, "Capability"),
                        React.createElement("div", { style: { fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' } }, record.capability_name)),
                    React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#64748b' } }, "Category:"),
                            " ",
                            React.createElement("strong", null, record.category)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#64748b' } }, "Lab:"),
                            " ",
                            React.createElement("strong", null,
                                record.lab_name,
                                " (",
                                record.lab_type,
                                ")")),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: '#64748b' } }, "Country:"),
                            " ",
                            React.createElement("strong", null, record.country)),
                        record.standard && React.createElement("div", null,
                            React.createElement("span", { style: { color: '#64748b' } }, "Standard:"),
                            " ",
                            React.createElement("strong", null, record.standard))),
                    React.createElement("div", { style: { marginBottom: '12px' } },
                        React.createElement("div", { style: { fontWeight: 700, fontSize: '12px', color: '#0f172a', marginBottom: '6px' } },
                            "Confirming Workbooks (",
                            sources.length,
                            " files)"),
                        React.createElement("div", { style: { maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' } }, sources.map((src, i) => (React.createElement("div", { key: i, style: { padding: '6px', borderBottom: i < sources.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                            React.createElement("div", null,
                                React.createElement("strong", { style: { color: '#0f172a' } }, src.source_file),
                                React.createElement("div", { style: { color: '#64748b', fontSize: '10px' } },
                                    "Sheet: ",
                                    src.source_sheet,
                                    " \u2022 Row ",
                                    src.source_row)),
                            React.createElement("span", { style: { backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 600 } },
                                "Value: \"",
                                src.source_indicator,
                                "\""))))))),
                React.createElement("div", { style: { padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' } },
                    React.createElement("button", { onClick: onClose, style: { padding: '6px 16px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 } }, "Close")))));
    }
}
//# sourceMappingURL=ProvenanceModal.js.map