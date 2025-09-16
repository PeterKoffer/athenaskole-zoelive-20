import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { adventures } = await req.json();

    if (!Array.isArray(adventures)) {
      return new Response(
        JSON.stringify({ error: 'Adventures must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting import of ${adventures.length} adventures`);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    // Process in batches of 10 to avoid overwhelming the database
    for (let i = 0; i < adventures.length; i += 10) {
      const batch = adventures.slice(i, i + 10);
      
      for (const adventure of batch) {
        try {
          const { universeId, gradeInt, title, prompt, description, subject } = adventure;
          
          if (!universeId || !gradeInt || !title) {
            console.warn('Skipping adventure with missing required fields:', adventure);
            skipped++;
            continue;
          }

          // Use upsert to handle duplicates gracefully
          const { error } = await supabaseClient
            .from('adventures')
            .upsert({
              universe_id: universeId,
              grade_int: gradeInt,
              title,
              prompt: prompt || null,
              description: description || null,
              subject: subject || null,
            }, {
              onConflict: 'universe_id,grade_int'
            });

          if (error) {
            console.error('Error inserting adventure:', error);
            errors++;
          } else {
            imported++;
          }
        } catch (err) {
          console.error('Error processing adventure:', err);
          errors++;
        }
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Import completed: ${imported} imported, ${skipped} skipped, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        imported,
        skipped,
        errors,
        total: adventures.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in import-adventures function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});