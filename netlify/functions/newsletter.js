// ==========================================================================
// NEWSLETTER SUBSCRIPTION - PageantEmpress 2025
// Serverless function for newsletter management
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod, queryStringParameters } = event;

    switch (httpMethod) {
      case 'POST':
        // Subscribe to newsletter
        const { email, firstName, lastName, interests = [] } = JSON.parse(event.body);

        if (!email) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email is required' })
          };
        }

        // Check if already subscribed
        const { data: existing } = await supabase
          .from('newsletter_subscribers')
          .select('id, status')
          .eq('email', email)
          .single();

        if (existing) {
          if (existing.status === 'active') {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Email already subscribed' })
            };
          } else {
            // Reactivate subscription
            const { error } = await supabase
              .from('newsletter_subscribers')
              .update({ 
                status: 'active',
                first_name: firstName,
                last_name: lastName,
                interests: interests,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);

            if (error) throw error;
          }
        } else {
          // New subscription
          const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{
              email,
              first_name: firstName,
              last_name: lastName,
              interests: interests,
              status: 'active',
              subscribed_at: new Date().toISOString()
            }]);

          if (error) throw error;
        }

        // Send welcome email
        const welcomeHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d4af37; text-align: center;">Welcome to PageantEmpress 2025!</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <p>Dear ${firstName || 'Subscriber'},</p>
              <p>Thank you for subscribing to our newsletter! You'll be the first to know about:</p>
              <ul>
                <li>🏆 Competition updates and results</li>
                <li>👑 Contestant spotlights and interviews</li>
                <li>📸 Exclusive behind-the-scenes content</li>
                <li>🎉 Special events and announcements</li>
                <li>💄 Beauty and pageant tips</li>
              </ul>
              <p>Get ready for an exciting journey with PageantEmpress 2025!</p>
              <p>Best regards,<br>The PageantEmpress 2025 Team</p>
            </div>
          </div>
        `;

        await sgMail.send({
          to: email,
          from: {
            email: 'newsletter@pageantempress.com',
            name: 'PageantEmpress 2025'
          },
          subject: 'Welcome to PageantEmpress 2025 Newsletter!',
          html: welcomeHtml
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Successfully subscribed to newsletter!' 
          })
        };

      case 'DELETE':
        // Unsubscribe from newsletter
        const { email: unsubEmail } = queryStringParameters;

        if (!unsubEmail) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email is required' })
          };
        }

        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString()
          })
          .eq('email', unsubEmail);

        if (error) throw error;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: 'Successfully unsubscribed from newsletter' 
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Newsletter error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
