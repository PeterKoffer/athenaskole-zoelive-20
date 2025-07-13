
// Type definitions for Jules AI integration

export interface JulesMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface JulesModificationData {
  type: 'julesCodeModification';
  data: any;
}

export interface JulesAuthData {
  type: 'julesAuth';
  data: any;
}

export interface JulesProjectAccessData {
  type: 'julesProjectAccess';
  data: any;
}

export interface JulesCapabilities {
  capabilities: string[];
}

export interface ProjectInfo {
  name: string;
  framework: string;
  features: string[];
  lastModified: string;
}

export type JulesMessageHandler = (data: any) => void;
