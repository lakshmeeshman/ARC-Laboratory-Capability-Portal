import * as React from 'react';
import { ILabCapabilityFinderProps } from './ILabCapabilityFinderProps';
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
    results: {
        total: number;
        grouped: any[];
        records: CapabilityRecord[];
    };
    metadata: {
        labs: any[];
        countries: any[];
        categories: any[];
    };
    loading: boolean;
    selectedRecord: CapabilityRecord | null;
}
export default class LabCapabilityFinder extends React.Component<ILabCapabilityFinderProps, LabCapabilityFinderState> {
    private searchTimeout;
    constructor(props: ILabCapabilityFinderProps);
    componentDidMount(): void;
    private fetchMetadata;
    private executeSearch;
    private handleQueryChange;
    render(): React.ReactElement<ILabCapabilityFinderProps>;
}
