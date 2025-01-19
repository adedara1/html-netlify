import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, country_code, currency_code, correspondent_code } = await req.json()

    console.log('Received deposit request:', { amount, description, country_code, currency_code, correspondent_code })

    if (!amount || !country_code || !currency_code || !correspondent_code) {
      throw new Error('Missing required fields')
    }

    // Mock response for now - replace with actual PawaPay API call
    const depositResponse = {
      deposit_id: crypto.randomUUID(),
      status: 'pending',
      amount: amount,
      currency: currency_code
    }

    console.log('Created deposit:', depositResponse)

    return new Response(
      JSON.stringify(depositResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error creating deposit:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})