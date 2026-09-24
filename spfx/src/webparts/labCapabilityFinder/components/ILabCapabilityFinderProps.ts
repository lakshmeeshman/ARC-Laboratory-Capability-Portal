import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ILabCapabilityFinderProps {
  description: string;
  apiBaseUrl: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
}
