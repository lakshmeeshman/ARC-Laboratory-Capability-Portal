import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface ILabCapabilityFinderWebPartProps {
    description: string;
    apiBaseUrl: string;
}
export default class LabCapabilityFinderWebPart extends BaseClientSideWebPart<ILabCapabilityFinderWebPartProps> {
    private _isDarkTheme;
    private _environmentMessage;
    render(): void;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
