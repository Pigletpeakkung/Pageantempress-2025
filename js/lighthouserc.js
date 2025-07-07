// ==========================================================================
// LIGHTHOUSE CI CONFIGURATION - PageantEmpress 2025
// Performance and quality auditing configuration for CI/CD pipeline
// ==========================================================================

const { execSync } = require('child_process');

// Get environment variables
const CI_BUILD_URL = process.env.CI_BUILD_URL || 'http://localhost:3000';
const LIGHTHOUSE_CI_TOKEN = process.env.LIGHTHOUSE_CI_TOKEN;
const BRANCH_NAME = process.env.BRANCH_NAME || 'main';
const BUILD_ID = process.env.BUILD_ID || Date.now().toString();
const IS_CI = process.env.CI === 'true';

// Get git information
let gitHash, gitBranch, gitCommitMessage;
try {
  gitHash = execSync('git rev-parse HEAD').toString().trim();
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  gitCommitMessage = execSync('git log -1 --pretty=%B').toString().trim();
} catch (error) {
  console.warn('Git commands failed:', error.message);
  gitHash = 'unknown';
  gitBranch = 'unknown';
  gitCommitMessage = 'unknown';
}

module.exports = {
  // CI configuration
  ci: {
    // Build configuration
    build: {
      command: 'npm run build',
      outputDir: './public'
    },

    // Upload configuration
    upload: {
      target: 'lhci',
      token: LIGHTHOUSE_CI_TOKEN,
      serverBaseUrl: 'https://lighthouse-ci.pageantempress.com',
      githubAppToken: process.env.GITHUB_APP_TOKEN,
      githubToken: process.env.GITHUB_TOKEN,
      githubApiHost: 'api.github.com',
      githubStatusContext: 'lighthouse-ci/performance'
    },

    // Server configuration
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'postgres',
        sqlConnectionUrl: process.env.DATABASE_URL || 'postgres://localhost:5432/lighthouse_ci',
        sqlConnectionSsl: IS_CI
      }
    },

    // Wizard configuration
    wizard: {
      preset: 'perf-budget',
      budgetPath: './lighthouse-budget.json'
    },

    // Collect configuration
    collect: {
      // Number of runs per URL
      numberOfRuns: IS_CI ? 3 : 1,
      
      // Lighthouse settings
      settings: {
        chromeFlags: [
          '--headless',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ],
        
        // Audit configuration
        onlyAudits: [
          'first-contentful-paint',
          'largest-contentful-paint',
          'first-meaningful-paint',
          'speed-index',
          'cumulative-layout-shift',
          'total-blocking-time',
          'interactive',
          'server-response-time',
          'render-blocking-resources',
          'unused-css-rules',
          'unused-javascript',
          'uses-optimized-images',
          'uses-webp-images',
          'uses-responsive-images',
          'efficient-animated-content',
          'preload-lcp-image',
          'total-byte-weight',
          'uses-long-cache-ttl',
          'uses-text-compression',
          'redirects-http',
          'uses-rel-preconnect',
          'uses-rel-preload',
          'critical-request-chains',
          'user-timings',
          'viewport',
          'without-javascript',
          'first-contentful-paint-3g',
          'largest-contentful-paint-element',
          'layout-shift-elements',
          'uses-passive-event-listeners',
          'no-document-write',
          'dom-size',
          'critical-request-chains',
          'user-timings',
          'bootup-time',
          'mainthread-work-breakdown',
          'font-display',
          'performance-budget',
          'timing-budget',
          'resource-summary',
          'third-party-summary',
          'third-party-facades',
          'largest-contentful-paint-element',
          'lcp-lazy-loaded',
          'layout-shift-elements',
          'uses-optimized-images',
          'modern-image-formats',
          'uses-text-compression',
          'uses-responsive-images',
          'efficient-animated-content',
          'duplicate-id-active',
          'duplicate-id-aria',
          'form-field-multiple-labels',
          'frame-title',
          'image-alt',
          'input-image-alt',
          'label',
          'link-name',
          'meta-viewport',
          'object-alt',
          'tabindex',
          'td-headers-attr',
          'th-has-data-cells',
          'valid-lang',
          'video-caption',
          'custom-controls-labels',
          'custom-controls-roles',
          'focus-traps',
          'focusable-controls',
          'interactive-element-affordance',
          'logical-tab-order',
          'managed-focus',
          'offscreen-content-hidden',
          'use-landmarks',
          'visual-order-follows-dom',
          'uses-long-cache-ttl',
          'total-byte-weight',
          'offscreen-images',
          'render-blocking-resources',
          'unminified-css',
          'unminified-javascript',
          'unused-css-rules',
          'unused-javascript',
          'uses-webp-images',
          'uses-optimized-images',
          'uses-text-compression',
          'uses-responsive-images',
          'efficient-animated-content',
          'preload-lcp-image',
          'prioritize-lcp-image'
        ],

        // Emulation settings
        emulatedFormFactor: 'mobile',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },

        // Screen emulation
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false
        },

        // Locale
        locale: 'en-US',

        // Budget configuration
        budgets: [
          {
            path: '/*',
            timings: [
              {
                metric: 'first-contentful-paint',
                budget: 2000,
                tolerance: 500
              },
              {
                metric: 'largest-contentful-paint',
                budget: 3000,
                tolerance: 500
              },
              {
                metric: 'cumulative-layout-shift',
                budget: 0.1,
                tolerance: 0.05
              },
              {
                metric: 'total-blocking-time',
                budget: 300,
                tolerance: 100
              },
              {
                metric: 'speed-index',
                budget: 3000,
                tolerance: 500
              },
              {
                metric: 'interactive',
                budget: 4000,
                tolerance: 1000
              }
            ],
            resourceSizes: [
              {
                resourceType: 'document',
                budget: 50
              },
              {
                resourceType: 'stylesheet',
                budget: 100
              },
              {
                resourceType: 'script',
                budget: 200
              },
              {
                resourceType: 'image',
                budget: 500
              },
              {
                resourceType: 'font',
                budget: 100
              },
              {
                resourceType: 'other',
                budget: 50
              },
              {
                resourceType: 'total',
                budget: 1000
              }
            ],
            resourceCounts: [
              {
                resourceType: 'document',
                budget: 1
              },
              {
                resourceType: 'stylesheet',
                budget: 5
              },
              {
                resourceType: 'script',
                budget: 10
              },
              {
                resourceType: 'image',
                budget: 20
              },
              {
                resourceType: 'font',
                budget: 5
              },
              {
                resourceType: 'other',
                budget: 5
              },
              {
                resourceType: 'total',
                budget: 50
              }
            ]
          }
        ]
      },

      // URLs to test
      url: [
        `${CI_BUILD_URL}/`,
        `${CI_BUILD_URL}/contestants`,
        `${CI_BUILD_URL}/events`,
        `${CI_BUILD_URL}/gallery`,
        `${CI_BUILD_URL}/voting`,
        `${CI_BUILD_URL}/news`,
        `${CI_BUILD_URL}/about`,
        `${CI_BUILD_URL}/contact`,
        `${CI_BUILD_URL}/contestants/1`,
        `${CI_BUILD_URL}/events/upcoming`,
        `${CI_BUILD_URL}/gallery/evening-gown`,
        `${CI_BUILD_URL}/news/latest`
      ],

      // Start server before collecting
      startServerCommand: IS_CI ? 'npm run start:ci' : 'npm run start',
      startServerReadyPattern: 'Server is running',
      startServerReadyTimeout: 30000,

      // Puppeteer settings
      puppeteerScript: './scripts/lighthouse-setup.js',
      puppeteerLaunchOptions: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection'
        ]
      },

      // Headers
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36 Chrome-Lighthouse',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    },

    // Assert configuration
    assert: {
      // Assertion presets
      preset: 'lighthouse:no-pwa',
      
      // Custom assertions
      assertions: {
        // Performance assertions
        'first-contentful-paint': ['error', { minScore: 0.8 }],
        'largest-contentful-paint': ['error', { minScore: 0.8 }],
        'cumulative-layout-shift': ['error', { minScore: 0.9 }],
        'total-blocking-time': ['error', { minScore: 0.8 }],
        'speed-index': ['error', { minScore: 0.8 }],
        'interactive': ['error', { minScore: 0.8 }],
        'server-response-time': ['error', { minScore: 0.9 }],

        // Best practices
        'uses-https': 'error',
        'uses-http2': 'warn',
        'uses-text-compression': 'error',
        'uses-optimized-images': 'error',
        'uses-webp-images': 'warn',
        'uses-responsive-images': 'error',
        'efficient-animated-content': 'warn',
        'preload-lcp-image': 'warn',
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        'font-display': 'warn',
        'no-document-write': 'error',
        'uses-passive-event-listeners': 'warn',
        'no-vulnerable-libraries': 'error',
        'js-libraries': 'warn',
        'notification-on-start': 'error',
        'geolocation-on-start': 'error',
        'doctype': 'error',
        'charset': 'error',
        'dom-size': 'warn',
        'external-anchors-use-rel-noopener': 'warn',
        'no-unsafe-inline-styles': 'error',

        // Accessibility
        'accesskeys': 'error',
        'aria-allowed-attr': 'error',
        'aria-hidden-body': 'error',
        'aria-hidden-focus': 'error',
        'aria-input-field-name': 'error',
        'aria-required-attr': 'error',
        'aria-required-children': 'error',
        'aria-required-parent': 'error',
        'aria-roles': 'error',
        'aria-toggle-field-name': 'error',
        'aria-valid-attr': 'error',
        'aria-valid-attr-value': 'error',
        'button-name': 'error',
        'bypass': 'error',
        'color-contrast': 'error',
        'definition-list': 'error',
        'dlitem': 'error',
        'document-title': 'error',
        'duplicate-id-active': 'error',
        'duplicate-id-aria': 'error',
        'form-field-multiple-labels': 'error',
        'frame-title': 'error',
        'heading-order': 'warn',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        'input-image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'list': 'error',
        'listitem': 'error',
        'meta-refresh': 'error',
        'meta-viewport': 'error',
        'object-alt': 'error',
        'tabindex': 'error',
        'table-fake-caption': 'error',
        'td-headers-attr': 'error',
        'th-has-data-cells': 'error',
        'valid-lang': 'error',
        'video-caption': 'error',

        // SEO
        'document-title': 'error',
        'meta-description': 'error',
        'http-status-code': 'error',
        'link-text': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'image-alt': 'error',
        'hreflang': 'warn',
        'canonical': 'warn',
        'font-size': 'error',
        'tap-targets': 'error',

        // Custom budgets
        'performance-budget': 'error',
        'timing-budget': 'error',

        // Categories
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    }
  },

  // Custom configuration
  pageantEmpress: {
    // Build information
    build: {
      id: BUILD_ID,
      branch: gitBranch,
      commit: gitHash,
      commitMessage: gitCommitMessage,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },

    // Notification settings
    notifications: {
      slack: {
        enabled: IS_CI,
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#lighthouse-reports',
        username: 'Lighthouse CI',
        icon: '🏆'
      },
      email: {
        enabled: IS_CI,
        to: process.env.LIGHTHOUSE_EMAIL_TO,
        from: process.env.LIGHTHOUSE_EMAIL_FROM,
        subject: 'Lighthouse CI Report - PageantEmpress 2025'
      }
    },

    // Custom thresholds for different page types
    thresholds: {
      homepage: {
        performance: 90,
        accessibility: 95,
        bestPractices: 85,
        seo: 95,
        fcp: 1.5,
        lcp: 2.5,
        cls: 0.1,
        tbt: 200,
        si: 2.5,
        tti: 3.5
      },
      contestants: {
        performance: 85,
        accessibility: 95,
        bestPractices: 85,
        seo: 90,
        fcp: 2.0,
        lcp: 3.0,
        cls: 0.1,
        tbt: 300,
        si: 3.0,
        tti: 4.0
      },
      gallery: {
        performance: 80,
        accessibility: 90,
        bestPractices: 85,
        seo: 85,
        fcp: 2.5,
        lcp: 4.0,
        cls: 0.15,
        tbt: 400,
        si: 4.0,
        tti: 5.0
      },
      voting: {
        performance: 88,
        accessibility: 95,
        bestPractices: 90,
        seo: 90,
        fcp: 1.8,
        lcp: 2.8,
        cls: 0.05,
        tbt: 250,
        si: 2.8,
        tti: 3.8
      }
    },

    // Reporting configuration
    reporting: {
      formats: ['html', 'json', 'csv'],
      outputDir: './reports/lighthouse',
      includeScreenshots: true,
      includeTraces: IS_CI,
      compareWithBaseline: true,
      sendToSlack: IS_CI,
      sendToEmail: IS_CI,
      generateTrends: true,
      retainReports: IS_CI ? 30 : 7 // days
    }
  }
};

// Export configuration with environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  module.exports.ci.collect.numberOfRuns = 1;
  module.exports.ci.collect.url = [`${CI_BUILD_URL}/`];
  module.exports.ci.assert.assertions['categories:performance'] = ['warn', { minScore: 0.5 }];
}

if (process.env.NODE_ENV === 'staging') {
  module.exports.ci.collect.numberOfRuns = 2;
  module.exports.ci.assert.assertions['categories:performance'] = ['warn', { minScore: 0.7 }];
}

// GitHub Pages specific configuration
if (process.env.GITHUB_PAGES === 'true') {
  module.exports.ci.collect.staticDistDir = './public';
  module.exports.ci.upload.target = 'filesystem';
  module.exports.ci.upload.outputDir = './lighthouse-reports';
}

// Netlify specific configuration
if (process.env.NETLIFY === 'true') {
  module.exports.ci.collect.url = [
    process.env.DEPLOY_PRIME_URL || process.env.URL,
    `${process.env.DEPLOY_PRIME_URL || process.env.URL}/contestants`,
    `${process.env.DEPLOY_PRIME_URL || process.env.URL}/events`,
    `${process.env.DEPLOY_PRIME_URL || process.env.URL}/gallery`,
    `${process.env.DEPLOY_PRIME_URL || process.env.URL}/voting`
  ];
}

// Vercel specific configuration
if (process.env.VERCEL === '1') {
  module.exports.ci.collect.url = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/contestants` : 'http://localhost:3000/contestants',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/events` : 'http://localhost:3000/events',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/gallery` : 'http://localhost:3000/gallery',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/voting` : 'http://localhost:3000/voting'
  ];
}
