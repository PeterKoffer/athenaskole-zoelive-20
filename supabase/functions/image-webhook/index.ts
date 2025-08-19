import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

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

// Helper to extract image URL from Replicate output
function firstImageRef(val: any): string | null {
  if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('data:'))) {
    return val
  }
  if (Array.isArray(val)) {
    for (const item of val) {
      const ref = firstImageRef(item)
      if (ref) return ref
    }
  }
  if (val && typeof val === 'object') {
    for (const key of Object.keys(val)) {
      const ref = firstImageRef(val[key])
      if (ref) return ref
    }
  }
  return null
}

// Convert data URL to bytes
function dataUrlToBytes(dataUrl: string): Uint8Array {
  const [, data] = dataUrl.split(',')
  const bytes = new Uint8Array(
    atob(data)
      .split('')
      .map(char => char.charCodeAt(0))
  )
  return bytes
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const webhookToken = Deno.env.get('REPLICATE_WEBHOOK_TOKEN')!

    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const rowId = url.searchParams.get('rowId')

    // Verify webhook token
    if (token !== webhookToken) {
      return bad('Invalid webhook token', 401)
    }

    if (!rowId) {
      return bad('Missing rowId parameter')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const payload = await req.json()

    console.log('🪝 Webhook received:', { rowId, status: payload.status })

    // Get the AI image record
    const { data: imageRecord } = await supabase
      .from('ai_images')
      .select('*')
      .eq('id', rowId)
      .single()

    if (!imageRecord) {
      return bad('Image record not found')
    }

    // Handle failed prediction
    if (payload.status === 'failed') {
      await supabase
        .from('ai_images')
        .update({
          status: 'failed',
          error_message: payload.error || 'Prediction failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', rowId)

      return ok({ status: 'failed', rowId })
    }

    // Handle successful prediction
    if (payload.status === 'succeeded' && payload.output) {
      const imageRef = firstImageRef(payload.output)
      
      if (!imageRef) {
        await supabase
          .from('ai_images')
          .update({
            status: 'failed',
            error_message: 'No image found in output',
            completed_at: new Date().toISOString()
          })
          .eq('id', rowId)

        return bad('No image found in prediction output')
      }

      let imageBytes: Uint8Array
      let contentType = 'image/webp'

      if (imageRef.startsWith('data:')) {
        // Handle data URL
        imageBytes = dataUrlToBytes(imageRef)
        contentType = imageRef.split(';')[0].split(':')[1] || 'image/webp'
      } else {
        // Download from URL
        const response = await fetch(imageRef)
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`)
        }
        imageBytes = new Uint8Array(await response.arrayBuffer())
        contentType = response.headers.get('content-type') || 'image/webp'
      }

      // Create storage path: universe-images/{universeId}/{gradeBand}/{variant}.webp
      const extension = contentType.includes('png') ? 'png' : 'webp'
      const storagePath = `${imageRecord.universe_id}/${imageRecord.grade_band}/${imageRecord.variant}.${extension}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('universe-images')
        .upload(storagePath, imageBytes, {
          contentType,
          upsert: true
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        await supabase
          .from('ai_images')
          .update({
            status: 'failed',
            error_message: `Storage upload failed: ${uploadError.message}`,
            completed_at: new Date().toISOString()
          })
          .eq('id', rowId)

        return bad('Failed to upload to storage')
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('universe-images')
        .getPublicUrl(storagePath)

      // Update AI image record
      await supabase
        .from('ai_images')
        .update({
          status: 'completed',
          storage_path: storagePath,
          public_url: publicUrl,
          completed_at: new Date().toISOString()
        })
        .eq('id', rowId)

      console.log(`✅ Image completed for ${imageRecord.universe_id}:${imageRecord.variant}:${imageRecord.grade_band}`)

      return ok({ 
        status: 'completed', 
        rowId, 
        imageUrl: publicUrl,
        storagePath 
      })
    }

    return ok({ status: 'processing', rowId })

  } catch (error) {
    console.error('Webhook error:', error)
    return bad('Internal server error', 500)
  }
})