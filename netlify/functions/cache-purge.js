// ==========================================================================
// CACHE PURGE - PageantEmpress 2025
// Serverless function for cache invalidation
// ==========================================================================

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    // Verify admin access
    const authHeader = event.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const { urls, type = 'specific' } = JSON.parse(event.body);

    // Cloudflare cache purge
    if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
      const purgeData = type === 'all' ? { purge_everything: true } : { files: urls };

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(purgeData)
        }
      );

      const result = await response.json();

      if (result.success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Cache purged successfully' })
        };
      } else {
        throw new Error('Cloudflare cache purge failed');
      }
    }

    // Manual cache invalidation (for local cache)
    // This would trigger your cache invalidation logic
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Cache purge initiated' })
    };

  } catch (error) {
    console.error('Cache purge error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to purge cache' })
    };
  }
};
