import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { format } from 'npm:date-fns@3.3.1';

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
    // Check for upcoming rent due dates
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select(`
        *,
        properties (
          title,
          owner_id,
          contact_details
        )
      `)
      .eq('status', 'active');

    if (tenantsError) throw tenantsError;

    const today = new Date();
    const notifications = [];

    // Process rent reminders
    for (const tenant of tenants) {
      const rentDueDate = new Date(tenant.lease_start_date);
      rentDueDate.setDate(rentDueDate.getDate() + 30); // Assuming rent is due monthly

      const daysUntilDue = Math.ceil((rentDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        notifications.push({
          type: 'rent_reminder',
          recipient_email: tenant.email,
          subject: `Rent Due Reminder - ${tenant.properties.title}`,
          message: `Your rent of $${tenant.rent_amount} is due on ${format(rentDueDate, 'PPP')}. Please ensure timely payment to avoid late fees.`,
        });
      }
    }

    // Check for maintenance updates
    const { data: tickets, error: ticketsError } = await supabase
      .from('maintenance_tickets')
      .select(`
        *,
        properties (
          title,
          owner_id,
          contact_details
        ),
        tenants (
          email,
          name
        )
      `)
      .in('status', ['open', 'in_progress']);

    if (ticketsError) throw ticketsError;

    // Process maintenance notifications
    for (const ticket of tickets) {
      if (ticket.updated_at === ticket.created_at) {
        // New ticket notification for owner
        notifications.push({
          type: 'maintenance_new',
          recipient_email: ticket.properties.contact_details.email,
          subject: `New Maintenance Request - ${ticket.properties.title}`,
          message: `A new ${ticket.priority} priority maintenance request has been submitted:\n\n${ticket.title}\n${ticket.description}`,
        });
      }
    }

    // Send notifications (in a real implementation, you would integrate with an email service)
    console.log('Notifications to send:', notifications);

    return new Response(
      JSON.stringify({ processed: notifications.length }),
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