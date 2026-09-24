import * as React from 'react';
import { CapabilityRecord } from './LabCapabilityFinder';
interface ProvenanceModalProps {
    record: CapabilityRecord;
    onClose: () => void;
}
export default class ProvenanceModal extends React.Component<ProvenanceModalProps> {
    render(): React.ReactElement<ProvenanceModalProps>;
}
export {};
