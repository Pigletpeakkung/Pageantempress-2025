const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': 'https://pageantempress.com',
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
                    error: 'Missing required fields',
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

        // Configure email transporter (using environment variables)
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Email content
        const emailContent = {
            from: process.env.FROM_EMAIL || 'noreply@pageantempress.com',
            to: process.env.TO_EMAIL || 'info@pageantempress.com',
            subject: `New Contact Form: ${subject || 'Pageant Inquiry'}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Sent from Pageant Empress website</em></p>
            `
        };

        // Send email
        await transporter.sendMail(emailContent);

        // Send auto-reply
        const autoReply = {
            from: process.env.FROM_EMAIL || 'noreply@pageantempress.com',
            to: email,
            subject: 'Thank you for contacting Pageant Empress',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for contacting Pageant Empress. We've received your message and will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to explore our:</p>
                <ul>
                    <li><a href="https://pageantempress.com/blog">Latest pageant tips and advice</a></li>
                    <li><a href="https://pageantempress.com/services">Training services</a></li>
                    <li><a href="https://pageantempress.com/gallery">Success stories</a></li>
                </ul>
                <p>Best regards,<br>The Pageant Empress Team</p>
                <hr>
                <p><em>Follow us on social media:</em></p>
                <p>
                    <a href="https://www.instagram.com/pageantempress">Instagram</a> | 
                    <a href="https://www.youtube.com/pageantempress">YouTube</a> | 
                    <a href="https://www.tiktok.com/@pageantempress">TikTok</a>
                </p>
            `
        };

        await transporter.sendMail(autoReply);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Message sent successfully! We\'ll get back to you soon.' 
            })
        };

    } catch (error) {
        console.error('Contact form error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to send message. Please try again.',
                success: false 
            })
        };
    }
};
