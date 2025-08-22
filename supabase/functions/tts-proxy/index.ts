// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    // JWT verification
    const auth = req.headers.get('authorization');
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { 
        status: 401, 
        headers: cors 
      });
    }

    // Get ElevenLabs API key from environment
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      console.error('❌ ELEVENLABS_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'TTS service not configured' }), { 
        status: 500, 
        headers: cors 
      });
    }

    const body = await req.json();
    const { text, voiceId = 'BlgEcC0TfWpBak7FmvHW' } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), { 
        status: 400, 
        headers: cors 
      });
    }

    console.log('🎤 Generating TTS for text length:', text.length);

    // Call ElevenLabs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ ElevenLabs API error:', response.status, error);
      return new Response(JSON.stringify({ 
        error: `TTS service error: ${response.status}` 
      }), { status: 502, headers: cors });
    }

    // Convert audio to base64
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('✅ TTS generated successfully');
    
    return new Response(JSON.stringify({ 
      audioContent: audioBase64,
      contentType: 'audio/mpeg'
    }), { 
      status: 200, 
      headers: cors 
    });

  } catch (error: any) {
    console.error('❌ TTS proxy error:', error);
    return new Response(JSON.stringify({ 
      error: String(error?.message ?? error) 
    }), { status: 500, headers: cors });
  }
});