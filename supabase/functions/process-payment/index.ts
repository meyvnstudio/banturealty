import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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
    const { paymentMethod, amount, tenantId, description } = await req.json();

    // Validate payment method
    if (!['mobile_money', 'bank_transfer'].includes(paymentMethod)) {
      throw new Error('Invalid payment method');
    }

    // In a real implementation, you would:
    // 1. Integrate with MTN/Airtel Mobile Money API
    // 2. Integrate with bank payment gateway
    // 3. Handle webhook callbacks for payment confirmation

    // For demo purposes, we'll simulate a successful payment
    const { data: payment, error: paymentError } = await supabase
      .from('rent_payments')
      .insert({
        tenant_id: tenantId,
        amount,
        payment_date: new Date().toISOString(),
        payment_method: paymentMethod,
        status: 'completed',
        transaction_id: `DEMO-${Date.now()}`,
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    return new Response(
      JSON.stringify(payment),
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