exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': 'https://pageantempress.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
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
        const { email, name } = JSON.parse(event.body);
        
        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Email is required',
                    success: false 
                })
            };
        }

        // Here you would integrate with your email service (Mailchimp, ConvertKit, etc.)
        // For now, we'll just log and return success
        console.log('Newsletter signup:', { email, name });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Successfully subscribed to newsletter!' 
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to subscribe',
                success: false 
            })
        };
    }
};
