import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'
import Replicate from 'https://esm.sh/replicate@0.30.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function ok(body: any) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const replicateApiToken = Deno.env.get('REPLICATE_API_TOKEN')!
    const replicateVersion = Deno.env.get('REPLICATE_VERSION')!
    const webhookToken = Deno.env.get('REPLICATE_WEBHOOK_TOKEN')!

    if (!replicateApiToken || !replicateVersion || !webhookToken) {
      return bad('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const replicate = new Replicate({ auth: replicateApiToken })

    const { universeId, variant = 'cover', grade = 7, prompt } = await req.json()

    if (!universeId) {
      return bad('universeId is required')
    }

    // Check if we already have a recent generation for this universe/variant/grade
    const gradeBand = `g${grade <= 2 ? '1-2' : grade <= 5 ? '3-5' : grade <= 8 ? '6-8' : grade <= 10 ? '9-10' : '11-12'}`
    const { data: existingImage } = await supabase
      .from('ai_images')
      .select('*')
      .eq('universe_id', universeId)
      .eq('variant', variant)
      .eq('grade_band', gradeBand)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existingImage) {
      return ok({ 
        status: 'exists', 
        imageUrl: existingImage.public_url,
        cached: true 
      })
    }

    // Check for running jobs to avoid duplicates
    const { data: runningJobs } = await supabase
      .from('ai_images')
      .select('*')
      .eq('universe_id', universeId)
      .eq('variant', variant)
      .eq('grade_band', gradeBand)
      .in('status', ['queued', 'processing'])

    if (runningJobs && runningJobs.length > 0) {
      return ok({ 
        status: 'queued', 
        message: 'Generation already in progress',
        jobId: runningJobs[0].replicate_prediction_id 
      })
    }

    // Create AI image record
    const { data: imageRecord, error: insertError } = await supabase
      .from('ai_images')
      .insert({
        universe_id: universeId,
        variant,
        grade_band: gradeBand,
        status: 'queued',
        prompt: prompt || `Grade ${grade} educational image for ${variant}`,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating image record:', insertError)
      return bad('Failed to create image record')
    }

    // Start Replicate prediction with webhook
    const webhookUrl = `${supabaseUrl}/functions/v1/image-webhook?token=${webhookToken}&rowId=${imageRecord.id}`
    
    const prediction = await replicate.predictions.create({
      version: replicateVersion,
      input: {
        prompt: imageRecord.prompt,
        width: grade <= 8 ? 1024 : 1280,
        height: grade <= 8 ? 1024 : 720,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
      webhook: webhookUrl,
      webhook_events_filter: ['completed', 'failed'],
    })

    // Update record with prediction ID
    await supabase
      .from('ai_images')
      .update({ 
        replicate_prediction_id: prediction.id,
        status: 'processing'
      })
      .eq('id', imageRecord.id)

    console.log(`✅ Image generation queued for ${universeId}:${variant}:${gradeBand}`, {
      predictionId: prediction.id,
      webhookUrl
    })

    return ok({
      status: 'queued',
      jobId: prediction.id,
      universeId,
      variant,
      gradeBand
    })

  } catch (error) {
    console.error('Error in image-ensure:', error)
    return bad('Internal server error', 500)
  }
})