import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { adventures } = await req.json();
    
    if (!adventures || !Array.isArray(adventures)) {
      throw new Error('Invalid adventures data');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Starting import of ${adventures.length} adventures...`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const adventure of adventures) {
      try {
        // Check if adventure already exists
        const { data: existing } = await supabaseClient
          .from('adventures')
          .select('id')
          .eq('universe_id', adventure.universeId)
          .single();

        if (existing) {
          console.log(`Adventure ${adventure.universeId} already exists, skipping`);
          skipped++;
          continue;
        }

        // Insert new adventure
        const { error: insertError } = await supabaseClient
          .from('adventures')
          .insert({
            universe_id: adventure.universeId,
            grade_int: adventure.gradeInt,
            title: adventure.title,
            description: adventure.description || adventure.prompt,
            subject: adventure.subject,
            image_prompt: adventure.prompt,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`Failed to insert ${adventure.universeId}:`, insertError);
          errors++;
        } else {
          console.log(`Successfully imported ${adventure.universeId}`);
          imported++;
        }

      } catch (error) {
        console.error(`Error processing adventure ${adventure.universeId}:`, error);
        errors++;
      }
    }

    const result = {
      total: adventures.length,
      imported,
      skipped,
      errors
    };

    console.log('Import complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Import failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});