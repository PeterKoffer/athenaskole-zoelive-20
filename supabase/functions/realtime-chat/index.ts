
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  if (url.pathname === '/realtime-chat') {
    const upgrade = req.headers.get('upgrade') || '';
    if (upgrade.toLowerCase() !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    
    let openaiSocket: WebSocket | null = null;

    socket.addEventListener('open', () => {
      console.log('Client connected');
      
      // Connect to OpenAI Realtime API
      const openaiUrl = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
      openaiSocket = new WebSocket(openaiUrl, [], {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      });

      openaiSocket.addEventListener('open', () => {
        console.log('Connected to OpenAI Realtime API');
      });

      openaiSocket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log('OpenAI message:', data.type);
        
        // Send session.update after receiving session.created
        if (data.type === 'session.created') {
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: 'You are Nelie, a friendly AI tutor. You help students learn by explaining concepts clearly and encouraging them. Always be enthusiastic and supportive!',
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.8,
              max_response_output_tokens: 'inf'
            }
          };
          openaiSocket?.send(JSON.stringify(sessionUpdate));
        }
        
        // Forward all messages to client
        socket.send(event.data);
      });

      openaiSocket.addEventListener('error', (error) => {
        console.error('OpenAI WebSocket error:', error);
        socket.send(JSON.stringify({ type: 'error', message: 'Connection to AI failed' }));
      });

      openaiSocket.addEventListener('close', () => {
        console.log('OpenAI connection closed');
        socket.close();
      });
    });

    socket.addEventListener('message', (event) => {
      // Forward client messages to OpenAI
      if (openaiSocket && openaiSocket.readyState === WebSocket.OPEN) {
        openaiSocket.send(event.data);
      }
    });

    socket.addEventListener('close', () => {
      console.log('Client disconnected');
      openaiSocket?.close();
    });

    return response;
  }

  return new Response('Not found', { status: 404 });
});
