// ==========================================================================
// STATUS PAGE - PageantEmpress 2025
// Public status page for service availability monitoring
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
);

const checkServiceStatus = async (serviceName, checkFunction) => {
  const start = Date.now();
  try {
    await checkFunction();
    return {
      name: serviceName,
      status: 'operational',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: serviceName,
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: error.message
    };
  }
};

const getIncidentHistory = async () => {
  // You could store incidents in your database
  // For now, we'll return mock data
  return [
    {
      id: 1,
      title: 'Database Maintenance',
      status: 'resolved',
      impact: 'minor',
      started: '2024-12-20T10:00:00Z',
      resolved: '2024-12-20T10:30:00Z',
      description: 'Scheduled database maintenance completed successfully'
    }
  ];
};

const getSystemMetrics = async () => {
  try {
    // Get recent analytics data
    const { data: recentEvents } = await supabase
      .from('analytics_events')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { data: recentVotes } = await supabase
      .from('votes')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      pageViews24h: recentEvents?.length || 0,
      votes24h: recentVotes?.length || 0,
      uptime: '99.9%', // You'd calculate this from your monitoring data
      avgResponseTime: '245ms' // You'd calculate this from your monitoring data
    };
  } catch (error) {
    return {
      pageViews24h: 'N/A',
      votes24h: 'N/A',
      uptime: 'N/A',
      avgResponseTime: 'N/A'
    };
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=60' // 1 minute cache
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { format = 'json' } = event.queryStringParameters || {};

    // Define services to check
    const services = [
      {
        name: 'Website',
        check: async () => {
          const response = await fetch('https://pageantempress.com', {
            method: 'HEAD',
            timeout: 5000
          });
          if (!response.ok) throw new Error('Website not responding');
        }
      },
      {
        name: 'Database',
        check: async () => {
          const { error } = await supabase
            .from('contestants')
            .select('id')
            .limit(1);
          if (error) throw error;
        }
      },
      {
        name: 'Voting System',
        check: async () => {
          const { error } = await supabase
            .from('votes')
            .select('id')
            .limit(1);
          if (error) throw error;
        }
      },
      {
        name: 'API Functions',
        check: async () => {
          const response = await fetch('https://pageantempress.com/.netlify/functions/health-check', {
            timeout: 5000
          });
          if (!response.ok) throw new Error('API functions not responding');
        }
      }
    ];

    // Check all services
    const serviceChecks = await Promise.all(
      services.map(service => checkServiceStatus(service.name, service.check))
    );

    // Get additional data
    const [incidents, metrics] = await Promise.all([
      getIncidentHistory(),
      getSystemMetrics()
    ]);

    // Determine overall status
    const allOperational = serviceChecks.every(service => service.status === 'operational');
    const overallStatus = allOperational ? 'operational' : 'degraded';

    const statusData = {
      page: {
        id: 'pageantempress-2025',
        name: 'PageantEmpress 2025',
        url: 'https://pageantempress.com',
        time_zone: 'America/New_York',
        updated_at: new Date().toISOString()
      },
      status: {
        indicator: overallStatus,
        description: allOperational ? 'All systems operational' : 'Some systems experiencing issues'
      },
      components: serviceChecks.map(service => ({
        id: service.name.toLowerCase().replace(/\s+/g, '-'),
        name: service.name,
        status: service.status,
        description: service.status === 'operational' ? 'Operational' : 'Experiencing issues',
        response_time: service.responseTime,
        last_checked: service.lastChecked
      })),
      incidents: incidents.slice(0, 5), // Show latest 5 incidents
      metrics: metrics,
      summary: {
        total_services: serviceChecks.length,
        operational_services: serviceChecks.filter(s => s.status === 'operational').length,
        degraded_services: serviceChecks.filter(s => s.status === 'down').length,
        avg_response_time: Math.round(
          serviceChecks.reduce((sum, s) => sum + s.responseTime, 0) / serviceChecks.length
        )
      }
    };

    // Return HTML format for browser viewing
    if (format === 'html') {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PageantEmpress 2025 - Status</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
                .status-operational { color: #10b981; }
                .status-down { color: #ef4444; }
                .bg-operational { background-color: #d1fae5; }
                .bg-down { background-color: #fee2e2; }
            </style>
        </head>
        <body class="bg-gray-50">
            <div class="max-w-4xl mx-auto py-8 px-4">
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">PageantEmpress 2025</h1>
                    <p class="text-gray-600 mb-6">System Status</p>
                    
                    <div class="mb-8">
                        <div class="flex items-center mb-2">
                            <div class="w-3 h-3 rounded-full mr-2 ${overallStatus === 'operational' ? 'bg-green-500' : 'bg-red-500'}"></div>
                            <span class="text-lg font-semibold ${overallStatus === 'operational' ? 'status-operational' : 'status-down'}">
                                ${statusData.status.description}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500">Last updated: ${new Date().toLocaleString()}</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        ${serviceChecks.map(service => `
                            <div class="border rounded-lg p-4 ${service.status === 'operational' ? 'bg-operational' : 'bg-down'}">
                                <div class="flex items-center justify-between">
                                    <h3 class="font-semibold">${service.name}</h3>
                                    <span class="px-2 py-1 rounded text-xs font-medium ${service.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                        ${service.status}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 mt-1">Response: ${service.responseTime}ms</p>
                            </div>
                        `).join('')}
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">${metrics.uptime}</div>
                            <div class="text-sm text-gray-600">Uptime</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${metrics.avgResponseTime}</div>
                            <div class="text-sm text-gray-600">Avg Response</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${metrics.pageViews24h}</div>
                            <div class="text-sm text-gray-600">Page Views (24h)</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gold-600">${metrics.votes24h}</div>
                            <div class="text-sm text-gray-600">Votes (24h)</div>
                        </div>
                    </div>

                    <div class="text-center">
                        <a href="/.netlify/functions/status" class="text-blue-600 hover:underline">View JSON Status</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=60'
        },
        body: htmlContent
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(statusData, null, 2)
    };

  } catch (error) {
    console.error('Status page error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: {
          indicator: 'major',
          description: 'Status page experiencing issues'
        },
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
