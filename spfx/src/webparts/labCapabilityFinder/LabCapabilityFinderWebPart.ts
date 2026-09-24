import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import LabCapabilityFinder from './components/LabCapabilityFinder';
import { ILabCapabilityFinderProps } from './components/ILabCapabilityFinderProps';

export interface ILabCapabilityFinderWebPartProps {
  description: string;
  apiBaseUrl: string;
}

export default class LabCapabilityFinderWebPart extends BaseClientSideWebPart<ILabCapabilityFinderWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ILabCapabilityFinderProps> = React.createElement(
      LabCapabilityFinder,
      {
        description: this.properties.description,
        apiBaseUrl: this.properties.apiBaseUrl || 'http://localhost:3000',
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
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

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
