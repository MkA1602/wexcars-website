import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, email, timestamp } = await req.json()

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get admin email template
    const { data: templateData, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('name', 'admin_notification')
      .eq('is_active', true)
      .single()

    if (templateError || !templateData) {
      return new Response(
        JSON.stringify({ error: 'Admin notification template not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Replace template variables
    let htmlContent = templateData.html_content
    let textContent = templateData.text_content
    let subject = templateData.subject

    // Replace common variables
    const variables = {
      subscriber_email: email,
      subscription_time: timestamp || new Date().toLocaleString(),
      source: 'website_footer',
      company_name: 'WexCars',
      notification_type: type
    }

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      htmlContent = htmlContent.replace(regex, value)
      textContent = textContent.replace(regex, value)
      subject = subject.replace(regex, value)
    })

    // Get admin email from environment variables
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@wexcars.com'

    // Send email to admin using Resend (you can replace with your preferred email service)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WexCars Notifications <notifications@wexcars.com>',
        to: [adminEmail],
        subject: `New Newsletter Subscriber - ${email}`,
        html: htmlContent,
        text: textContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Admin notification email error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send admin notification' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Admin notification sent successfully:', emailResult)

    // Log the notification in the database
    await supabaseClient
      .from('newsletter_analytics')
      .insert({
        event_type: 'sent',
        event_data: {
          type: 'admin_notification',
          subscriber_email: email,
          timestamp: timestamp
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin notification sent successfully',
        emailId: emailResult.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
