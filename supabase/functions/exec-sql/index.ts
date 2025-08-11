// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sql } = await req.json()
    
    // Create supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Execute the SQL query
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select()
      .limit(1)

    if (error) {
      console.error('Database error:', error)
    }

    // For testing purposes, let's execute a simple query to verify the schema
    const { data: testData, error: testError } = await supabaseAdmin.rpc('exec_sql', {
      query: sql || 'SELECT current_timestamp as server_time'
    })

    if (testError) {
      // If the RPC function doesn't exist, fall back to a simple query
      const { data: fallbackData, error: fallbackError } = await supabaseAdmin
        .from('profiles')
        .select('user_id, overall_mastery, preferences, recent_performance')
        .limit(5)

      return new Response(
        JSON.stringify({ 
          data: fallbackData,
          message: 'Using fallback query - profiles table structure',
          error: fallbackError 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ data: testData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
