// ==========================================================================
// CONTACT FORM HANDLER - PageantEmpress 2025
// Serverless function for contact form submissions
// ==========================================================================

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, subject, message, type = 'general' } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, email, and message are required' })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Prepare email content
    const emailSubject = subject || `Contact Form: ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37; text-align: center;">PageantEmpress 2025 - Contact Form</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${emailSubject}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
          <p>Sent from PageantEmpress 2025 Contact Form</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Send email to admin
    const adminEmail = {
      to: process.env.CONTACT_EMAIL || 'admin@pageantempress.com',
      from: {
        email: 'noreply@pageantempress.com',
        name: 'PageantEmpress 2025'
      },
      subject: `[Contact Form] ${emailSubject}`,
      html: emailHtml,
      replyTo: email
    };

    await sgMail.send(adminEmail);

    // Send confirmation email to user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37; text-align: center;">Thank You for Contacting Us!</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to PageantEmpress 2025. We have received your message and will get back to you within 24-48 hours.</p>
          <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37;">
            <p><strong>Your Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>Best regards,<br>The PageantEmpress 2025 Team</p>
        </div>
      </div>
    `;

    const confirmationEmail = {
      to: email,
      from: {
        email: 'noreply@pageantempress.com',
        name: 'PageantEmpress 2025'
      },
      subject: 'Thank you for contacting PageantEmpress 2025',
      html: confirmationHtml
    };

    await sgMail.send(confirmationEmail);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Thank you for your message. We will get back to you soon!' 
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send message. Please try again.' })
    };
  }
};
