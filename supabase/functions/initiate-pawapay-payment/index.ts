import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number;
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, customer } = await req.json() as PaymentRequest
    console.log('Initializing payment with PawaPay:', { amount, description, customer })

    const pawapayApiKey = Deno.env.get('PAWAPAY_API_KEY')
    if (!pawapayApiKey) {
      console.error('Missing PawaPay configuration')
      throw new Error('Configuration PawaPay manquante')
    }

    // Initialize payment with PawaPay API
    const pawapayResponse = await fetch('https://api.pawapay.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pawapayApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: "XOF",
        description: description,
        customer: customer
      })
    })

    if (!pawapayResponse.ok) {
      const errorData = await pawapayResponse.json()
      console.error('PawaPay error response:', errorData)
      throw new Error(`Erreur PawaPay: ${errorData.message || 'Erreur inconnue'}`)
    }

    const pawapayData = await pawapayResponse.json()
    console.log('PawaPay payment initialized:', pawapayData)

    return new Response(
      JSON.stringify(pawapayData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment initialization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})