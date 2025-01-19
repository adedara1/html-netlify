import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PawapayDepositRequest {
  amount: number
  description: string
  country_code: string
  currency_code: string
  correspondent_code: string
  customer: {
    phone: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, country_code, currency_code, correspondent_code, customer } = await req.json() as PawapayDepositRequest

    const depositId = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const payload = {
      depositId,
      amount: amount.toString(),
      currency: currency_code,
      country: country_code,
      correspondent: correspondent_code,
      payer: {
        type: "MSISDN",
        address: {
          value: customer.phone.replace(/[^0-9]/g, '')
        }
      },
      customerTimestamp: timestamp,
      statementDescription: description.slice(0, 22),
      metadata: [
        {
          fieldName: "orderId",
          fieldValue: depositId
        }
      ]
    }

    console.log('Initiating PawaPay deposit:', payload)

    const response = await fetch('https://api.sandbox.pawapay.io/deposits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PAWAPAY_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log('PawaPay response:', data)

    if (!response.ok) {
      throw new Error(data.rejectionReason?.rejectionMessage || 'Failed to create deposit')
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})