export interface JulesMessage {
  type: string;
  payload: any;
}

export interface JulesHandshakeRequest extends JulesMessage {
  type: 'handshake-request';
  payload: {
    version: string;
  };
}

export interface JulesHandshakeResponse extends JulesMessage {
  type: 'handshake-response';
  payload: {
    version: string;
    capabilities: string[];
  };
}

export interface JulesCodeRequest extends JulesMessage {
  type: 'code-request';
  payload: {
    filePaths: string[];
  };
}

export interface JulesCodeResponse extends JulesMessage {
  type: 'code-response';
  payload: {
    files: {
      path: string;
      content: string;
    }[];
  };
}

export interface JulesCodeModificationRequest extends JulesMessage {
  type: 'code-modification-request';
  payload: {
    filePaths: string[];
    code: string;
  };
}

export interface JulesCodeModificationResponse extends JulesMessage {
  type: 'code-modification-response';
  payload: {
    success: boolean;
    error?: string;
  };
}
