import { JulesMessage } from './jules';
import { sendToJules } from './julesMessenger';

export function handleMessage(event: MessageEvent) {
  const { data, origin } = event;
  console.log(`📨 Received message from ${origin}:`, data);

  const message = data as JulesMessage;
  switch (message.type) {
    case 'handshake-request':
      handleHandshakeRequest(message);
      break;
    case 'code-request':
      handleCodeRequest(message);
      break;
    case 'code-modification-request':
      handleCodeModificationRequest(message);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

function handleHandshakeRequest(message: JulesMessage) {
  const response = {
    type: 'handshake-response',
    payload: {
      version: '1.0.0',
      capabilities: ['code-request', 'code-modification-request'],
    },
  };
  sendToJules(response);
}

function handleCodeRequest(message: JulesMessage) {
  // In a real implementation, you would read the files from the file system.
  const response = {
    type: 'code-response',
    payload: {
      files: [
        {
          path: 'src/App.tsx',
          content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
`,
        },
      ],
    },
  };
  sendToJules(response);
}

function handleCodeModificationRequest(message: JulesMessage) {
  // In a real implementation, you would write the files to the file system.
  const response = {
    type: 'code-modification-response',
    payload: {
      success: true,
    },
  };
  sendToJules(response);
}
