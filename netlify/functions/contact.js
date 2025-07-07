const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*', // Or specify your domain
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
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
        const { name, email, message, subject, phone } = JSON.parse(event.body);
        
        // Validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required fields: name, email, and message are required',
                    success: false 
                })
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid email format',
                    success: false 
                })
            };
        }

        // Basic spam protection
        if (message.length > 5000) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Message too long',
                    success: false 
                })
            };
        }

        // Configure email transporter
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection configuration
        await transporter.verify();

        // Email content to admin
        const adminEmail = {
            from: process.env.FROM_EMAIL || 'noreply@pageantempress.com',
            to: process.env.TO_EMAIL || 'info@pageantempress.com',
            subject: `New Contact Form: ${subject || 'Pageant Inquiry'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d4af37; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                    </div>
                    <div style="background: #fff; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
                        <p><strong>Message:</strong></p>
                        <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        <em>Sent from Pageant Empress website on ${new Date().toLocaleString()}</em>
                    </p>
                </div>
            `
        };

        // Send email to admin
        await transporter.sendMail(adminEmail);

        // Send auto-reply to user
        const autoReply = {
            from: process.env.FROM_EMAIL || 'noreply@pageantempress.com',
            to: email,
            subject: 'Thank you for contacting Pageant Empress 👑',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #d4af37, #f7e98e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">👑 Pageant Empress</h1>
                        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Empowering Beauty, Confidence & Success</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #d4af37; margin-top: 0;">Thank you for reaching out!</h2>
                        <p>Dear ${name},</p>
                        <p>Thank you for contacting Pageant Empress! We've received your message and our team will get back to you within 24 hours.</p>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Your Message Summary:</strong></p>
                            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                            <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
                        </div>
                        
                        <p>In the meantime, feel free to explore our:</p>
                        <ul style="line-height: 1.8;">
                            <li><a href="https://pageantempress.com/blog" style="color: #d4af37; text-decoration: none;">Latest pageant tips and advice</a></li>
                            <li><a href="https://pageantempress.com/services" style="color: #d4af37; text-decoration: none;">Training services and coaching</a></li>
                            <li><a href="https://pageantempress.com/gallery" style="color: #d4af37; text-decoration: none;">Success stories and gallery</a></li>
                            <li><a href="https://pageantempress.com/resources" style="color: #d4af37; text-decoration: none;">Free resources and guides</a></li>
                        </ul>
                        
                        <div style="background: #d4af37; color: white; padding: 20px; border-radius: 5px; margin: 30px 0; text-align: center;">
                            <p style="margin: 0; font-size: 16px;"><strong>Follow us on social media for daily inspiration!</strong></p>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://www.instagram.com/pageantempress" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #E4405F; color: white; text-decoration: none; border-radius: 5px;">Instagram</a>
                            <a href="https://www.youtube.com/pageantempress" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #FF0000; color: white; text-decoration: none; border-radius: 5px;">YouTube</a>
                            <a href="https://www.tiktok.com/@pageantempress" style="display: inline-block; margin: 0 10px; padding: 10px 20px; background: #000000; color: white; text-decoration: none; border-radius: 5px;">TikTok</a>
                        </div>
                        
                        <p style="margin-top: 30px;">Best regards,<br><strong>The Pageant Empress Team</strong></p>
                        
                        <hr style="border: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            <em>This is an automated response. Please do not reply to this email.</em><br>
                            <em>If you need immediate assistance, please call us at (555) 123-4567</em>
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(autoReply);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Message sent successfully! We\'ll get back to you within 24 hours.' 
            })
        };

    } catch (error) {
        console.error('Contact form error:', error);
        
        // More specific error handling
        let errorMessage = 'Failed to send message. Please try again.';
        
        if (error.code === 'EAUTH') {
            errorMessage = 'Email authentication failed. Please contact support.';
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            errorMessage = 'Connection failed. Please try again later.';
        } else if (error.code === 'EENVELOPE') {
            errorMessage = 'Invalid email configuration. Please contact support.';
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: errorMessage,
                success: false 
            })
        };
    }
};
