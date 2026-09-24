import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import LabCapabilityFinder from './components/LabCapabilityFinder';
export default class LabCapabilityFinderWebPart extends BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        this._isDarkTheme = false;
        this._environmentMessage = '';
    }
    render() {
        const element = React.createElement(LabCapabilityFinder, {
            description: this.properties.description,
            apiBaseUrl: this.properties.apiBaseUrl || 'http://localhost:3000',
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName,
            context: this.context
        });
        ReactDom.render(element, this.domElement);
    }
    onThemeChanged(currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        const { semanticColors } = currentTheme;
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return Version.parse('1.0');
    }
    getPropertyPaneConfiguration() {
        return {
            pages: [
                {
                    header: {
                        description: 'Archroma Lab Capability Finder Settings'
                    },
                    groups: [
                        {
                            groupName: 'API Configuration',
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: 'Web Part Title',
                                    value: 'Archroma Lab Capability Finder'
                                }),
                                PropertyPaneTextField('apiBaseUrl', {
                                    label: 'API Base URL',
                                    description: 'URL of the hosted Archroma API service (e.g. https://archroma-lab-api.company.com or http://localhost:3000)'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
//# sourceMappingURL=LabCapabilityFinderWebPart.js.map