import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@14.19.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { propertyId, userId } = await req.json();

    // Verify the property exists and is approved
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('title, price')
      .eq('id', propertyId)
      .eq('approved', true)
      .single();

    if (propertyError || !property) {
      throw new Error('Property not found or not approved');
    }

    // Check if the user has already unlocked this property
    const { data: existingUnlock } = await supabase
      .from('property_unlocks')
      .select('id')
      .eq('property_id', propertyId)
      .eq('user_id', userId)
      .single();

    if (existingUnlock) {
      throw new Error('Property already unlocked');
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Unlock Property: ${property.title}`,
              description: 'Access to property contact details and exact location',
            },
            unit_amount: 200, // $2.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/properties/${propertyId}?unlock=success`,
      cancel_url: `${req.headers.get('origin')}/properties/${propertyId}`,
      metadata: {
        propertyId,
        userId,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});