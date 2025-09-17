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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting archive process...');

    // Create archive folder name with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const archiveFolder = `archive-${timestamp}`;
    
    let archivedImages = 0;

    // List all files in universe-images bucket
    const { data: files, error: listError } = await supabaseClient.storage
      .from('universe-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      console.error('Error listing files:', listError);
      throw listError;
    }

    console.log(`Found ${files?.length || 0} files to potentially archive`);

    // Filter out files that don't match adventure pattern or are already in archive folders
    const filesToArchive = files?.filter(file => 
      file.name && 
      !file.name.startsWith('archive-') &&
      file.name.includes('/') &&
      (file.name.endsWith('.webp') || file.name.endsWith('.png') || file.name.endsWith('.jpg'))
    ) || [];

    console.log(`Will archive ${filesToArchive.length} files`);

    // Move files to archive folder in batches
    for (const file of filesToArchive) {
      try {
        const newPath = `${archiveFolder}/${file.name}`;
        
        // Move the file
        const { error: moveError } = await supabaseClient.storage
          .from('universe-images')
          .move(file.name, newPath);

        if (moveError) {
          console.error(`Failed to move ${file.name}:`, moveError);
        } else {
          archivedImages++;
          console.log(`Moved ${file.name} to ${newPath}`);
        }
      } catch (error) {
        console.error(`Error moving file ${file.name}:`, error);
      }
    }

    // Reset generation flags in adventures table
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
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows

    if (resetError) {
      console.error('Error resetting generation flags:', resetError);
    } else {
      console.log('Reset all generation flags and URLs');
    }

    const result = {
      archivedImages,
      archiveFolder,
      message: `Successfully archived ${archivedImages} images to ${archiveFolder} and reset generation flags`
    };

    console.log('Archive complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Archive failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});