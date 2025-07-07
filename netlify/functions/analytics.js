// ==========================================================================
// ANALYTICS TRACKING - PageantEmpress 2025
// Serverless function for custom analytics tracking
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
    const {
      event_type,
      page_url,
      page_title,
      contestant_id,
      event_id,
      user_agent,
      referrer,
      session_id,
      custom_data = {}
    } = JSON.parse(event.body);

    const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';

    // Track the event
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type,
        page_url,
        page_title,
        contestant_id,
        event_id,
        user_agent,
        referrer,
        session_id,
        ip_address: clientIP,
        custom_data,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Event tracked successfully' })
    };

  } catch (error) {
    console.error('Analytics error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to track event' })
    };
  }
};
