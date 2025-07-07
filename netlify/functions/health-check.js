// ==========================================================================
// HEALTH CHECK - PageantEmpress 2025
// Comprehensive health monitoring for all services and dependencies
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder-key'
);

// Health check functions
const checkDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from('contestants')
      .select('id')
      .limit(1);
    
    return {
      status: error ? 'error' : 'healthy',
      responseTime: Date.now(),
      error: error?.message || null
    };
  } catch (err) {
    return {
      status: 'error',
      responseTime: Date.now(),
      error: err.message
    };
  }
};

const checkExternalServices = async () => {
  const services = [];
  
  // Check Google reCAPTCHA
  if (process.env.GOOGLE_RECAPTCHA_SECRET_KEY) {
    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        timeout: 5000
      });
      services.push({
        name: 'Google reCAPTCHA',
        status: response.ok ? 'healthy' : 'error',
        responseTime: Date.now()
      });
    } catch (err) {
      services.push({
        name: 'Google reCAPTCHA',
        status: 'error',
        error: err.message
      });
    }
  }

  // Check SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
        },
        timeout: 5000
      });
      services.push({
        name: 'SendGrid',
        status: response.ok ? 'healthy' : 'error',
        responseTime: Date.now()
      });
    } catch (err) {
      services.push({
        name: 'SendGrid',
        status: 'error',
        error: err.message
      });
    }
  }

  // Check Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`,
        { timeout: 5000 }
      );
      services.push({
        name: 'Cloudinary',
        status: response.ok ? 'healthy' : 'error',
        responseTime: Date.now()
      });
    } catch (err) {
      services.push({
        name: 'Cloudinary',
        status: 'error',
        error: err.message
      });
    }
  }

  return services;
};

const checkMemoryUsage = () => {
  const usage = process.memoryUsage();
  return {
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
    arrayBuffers: Math.round(usage.arrayBuffers / 1024 / 1024 * 100) / 100 // MB
  };
};

const checkEnvironmentVariables = () => {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'GOOGLE_RECAPTCHA_SECRET_KEY',
    'SENDGRID_API_KEY'
  ];

  const optional = [
    'CLOUDINARY_CLOUD_NAME',
    'GOOGLE_ANALYTICS_ID',
    'FACEBOOK_PIXEL_ID',
    'AWS_ACCESS_KEY_ID',
    'STRIPE_SECRET_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  const present = requiredVars.filter(varName => process.env[varName]);
  const optionalPresent = optional.filter(varName => process.env[varName]);

  return {
    required: {
      present: present.length,
      missing: missing.length,
      missingVars: missing
    },
    optional: {
      present: optionalPresent.length,
      total: optional.length
    },
    status: missing.length === 0 ? 'healthy' : 'warning'
  };
};

const getSystemInfo = () => {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    pid: process.pid,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

const checkDiskSpace = async () => {
  // Note: In serverless environments, disk space is typically not a concern
  // but we can check temporary directory usage
  try {
    const fs = require('fs');
    const path = require('path');
    
    const tmpDir = '/tmp';
    const stats = fs.statSync(tmpDir);
    
    return {
      available: true,
      path: tmpDir,
      writable: fs.constants.W_OK
    };
  } catch (err) {
    return {
      available: false,
      error: err.message
    };
  }
};

const performanceTest = async () => {
  const start = Date.now();
  
  // Simple CPU test
  let sum = 0;
  for (let i = 0; i < 100000; i++) {
    sum += Math.random();
  }
  
  const cpuTime = Date.now() - start;
  
  // Memory allocation test
  const memStart = Date.now();
  const testArray = new Array(10000).fill(0).map(() => Math.random());
  const memTime = Date.now() - memStart;
  
  // Cleanup
  testArray.length = 0;
  
  return {
    cpuTest: {
      duration: cpuTime,
      status: cpuTime < 100 ? 'healthy' : 'slow'
    },
    memoryTest: {
      duration: memTime,
      status: memTime < 50 ? 'healthy' : 'slow'
    }
  };
};

exports.handler = async (event, context) => {
  const startTime = Date.now();
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { detailed = 'false' } = event.queryStringParameters || {};
    const isDetailed = detailed === 'true';

    // Basic health check
    const basicHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      domain: 'pageantempress.com',
      environment: process.env.NODE_ENV || 'production',
      version: process.env.npm_package_version || '1.0.0',
      region: process.env.AWS_REGION || 'us-east-1',
      functionName: context.functionName || 'health-check',
      requestId: context.awsRequestId || 'local'
    };

    // If not detailed, return basic health
    if (!isDetailed) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(basicHealth)
      };
    }

    // Detailed health check
    const healthChecks = await Promise.allSettled([
      checkDatabase(),
      checkExternalServices(),
      performanceTest()
    ]);

    const [dbResult, servicesResult, perfResult] = healthChecks;

    // Gather all health data
    const detailedHealth = {
      ...basicHealth,
      checks: {
        database: dbResult.status === 'fulfilled' ? dbResult.value : { 
          status: 'error', 
          error: dbResult.reason?.message 
        },
        externalServices: servicesResult.status === 'fulfilled' ? servicesResult.value : [],
        performance: perfResult.status === 'fulfilled' ? perfResult.value : {
          status: 'error',
          error: perfResult.reason?.message
        }
      },
      system: {
        memory: checkMemoryUsage(),
        environment: checkEnvironmentVariables(),
        info: getSystemInfo(),
        disk: await checkDiskSpace()
      },
      metrics: {
        responseTime: Date.now() - startTime,
        functionsDeployed: Object.keys(process.env).filter(key => key.startsWith('NETLIFY_')).length,
        lastDeployment: process.env.BUILD_ID || 'unknown',
        buildTime: process.env.BUILD_TIME || 'unknown'
      }
    };

    // Determine overall status
    let overallStatus = 'healthy';
    
    if (detailedHealth.checks.database.status === 'error') {
      overallStatus = 'error';
    } else if (detailedHealth.system.environment.status === 'warning') {
      overallStatus = 'warning';
    } else if (detailedHealth.checks.externalServices.some(s => s.status === 'error')) {
      overallStatus = 'warning';
    }

    detailedHealth.status = overallStatus;

    // Set appropriate HTTP status
    let httpStatus = 200;
    if (overallStatus === 'error') {
      httpStatus = 503; // Service Unavailable
    } else if (overallStatus === 'warning') {
      httpStatus = 200; // OK but with warnings
    }

    // Add health check summary
    detailedHealth.summary = {
      totalChecks: 3,
      passedChecks: healthChecks.filter(r => r.status === 'fulfilled').length,
      failedChecks: healthChecks.filter(r => r.status === 'rejected').length,
      warnings: detailedHealth.system.environment.status === 'warning' ? 1 : 0
    };

    // Log health check for monitoring
    if (overallStatus !== 'healthy') {
      console.warn('Health check warning/error:', {
        status: overallStatus,
        timestamp: detailedHealth.timestamp,
        issues: {
          database: detailedHealth.checks.database.status,
          environment: detailedHealth.system.environment.status
        }
      });
    }

    return {
      statusCode: httpStatus,
      headers: {
        ...headers,
        'X-Health-Status': overallStatus,
        'X-Response-Time': `${Date.now() - startTime}ms`
      },
      body: JSON.stringify(detailedHealth, null, 2)
    };

  } catch (error) {
    console.error('Health check error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        domain: 'pageantempress.com',
        environment: process.env.NODE_ENV || 'production',
        error: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        responseTime: Date.now() - startTime
      })
    };
  }
};
