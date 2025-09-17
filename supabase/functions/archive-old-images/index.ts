import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting to archive old generic adventure images...');

    // Step 1: Move old images to archive folder in storage
    const { data: files, error: listError } = await supabaseClient.storage
      .from('universe-images')
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) {
      throw listError;
    }

    let movedCount = 0;
    const archiveFolder = `archive-${Date.now()}`;

    if (files) {
      for (const file of files) {
        try {
          // Download the file
          const { data: fileData, error: downloadError } = await supabaseClient.storage
            .from('universe-images')
            .download(file.name);

          if (downloadError) {
            console.warn(`Could not download ${file.name}:`, downloadError);
            continue;
          }

          // Upload to archive folder
          const { error: archiveError } = await supabaseClient.storage
            .from('universe-images')
            .upload(`${archiveFolder}/${file.name}`, fileData, {
              contentType: file.metadata?.mimetype || 'image/webp',
              upsert: true
            });

          if (archiveError) {
            console.warn(`Could not archive ${file.name}:`, archiveError);
            continue;
          }

          // Delete original file
          const { error: deleteError } = await supabaseClient.storage
            .from('universe-images')
            .remove([file.name]);

          if (deleteError) {
            console.warn(`Could not delete original ${file.name}:`, deleteError);
            continue;
          }

          movedCount++;
          console.log(`Archived: ${file.name} -> ${archiveFolder}/${file.name}`);

        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
        }
      }
    }

    // Step 2: Reset adventure image generation flags
    const { error: resetError } = await supabaseClient
      .from('adventures')
      .update({
        image_generated_child: false,
        image_generated_teen: false,
        image_generated_adult: false,
        image_url_child: null,
        image_url_teen: null,
        image_url_adult: null
      })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

    if (resetError) {
      console.error('Error resetting adventure flags:', resetError);
      throw resetError;
    }

    console.log(`Archive completed: ${movedCount} images moved to ${archiveFolder}`);

    return new Response(
      JSON.stringify({
        success: true,
        archivedImages: movedCount,
        archiveFolder,
        message: 'All old images archived and adventure flags reset. Ready for new cinematic generation!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in archive-old-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});