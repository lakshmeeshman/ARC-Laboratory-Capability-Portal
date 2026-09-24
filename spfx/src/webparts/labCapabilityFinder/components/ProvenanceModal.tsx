import * as React from 'react';
import { CapabilityRecord } from './LabCapabilityFinder';

interface ProvenanceModalProps {
  record: CapabilityRecord;
  onClose: () => void;
}

export default class ProvenanceModal extends React.Component<ProvenanceModalProps> {
  public render(): React.ReactElement<ProvenanceModalProps> {
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

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyCenter: 'center', padding: '16px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', maxWidth: '540px', width: '100%', margin: 'auto', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontFamily: 'Segoe UI, sans-serif' }}>
          {/* Header */}
          <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Capability Source Provenance</h4>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px', fontSize: '12px', color: '#334155' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Capability</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{record.capability_name}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><span style={{ color: '#64748b' }}>Category:</span> <strong>{record.category}</strong></div>
              <div><span style={{ color: '#64748b' }}>Lab:</span> <strong>{record.lab_name} ({record.lab_type})</strong></div>
              <div><span style={{ color: '#64748b' }}>Country:</span> <strong>{record.country}</strong></div>
              {record.standard && <div><span style={{ color: '#64748b' }}>Standard:</span> <strong>{record.standard}</strong></div>}
            </div>

            {/* Sources List */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a', marginBottom: '6px' }}>
                Confirming Workbooks ({sources.length} files)
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                {sources.map((src, i) => (
                  <div key={i} style={{ padding: '6px', borderBottom: i < sources.length - 1 ? '1px solid #f1f5f9' : 'none', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>{src.source_file}</strong>
                      <div style={{ color: '#64748b', fontSize: '10px' }}>Sheet: {src.source_sheet} &bull; Row {src.source_row}</div>
                    </div>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 600 }}>
                      Value: &quot;{src.source_indicator}&quot;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
            <button onClick={onClose} style={{ padding: '6px 16px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
