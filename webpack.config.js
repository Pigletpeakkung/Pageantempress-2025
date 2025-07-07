// ==========================================================================
// WEBPACK CONFIGURATION - PageantEmpress 2025
// Build configuration for JavaScript bundling and optimization
// ==========================================================================

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyze = process.env.ANALYZE === 'true';

const config = {
  // Entry points
  entry: {
    main: './src/scripts/main.js',
    voting: './src/scripts/modules/voting.js',
    gallery: './src/scripts/modules/gallery.js',
    admin: './src/scripts/modules/admin.js',
    vendor: [
      'axios',
      'lodash',
      'intersection-observer',
      'web-vitals'
    ]
  },

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    chunkFilename: isDevelopment ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/assets/',
    clean: true,
    assetModuleFilename: 'images/[name].[hash][ext]'
  },

  // Mode
  mode: isDevelopment ? 'development' : 'production',

  // Development tool
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',

  // Module resolution
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/scripts/components'),
      '@modules': path.resolve(__dirname, 'src/scripts/modules'),
      '@utils': path.resolve(__dirname, 'src/scripts/utils'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts')
    }
  },

  // Module rules
  module: {
    rules: [
      // JavaScript/TypeScript
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not dead']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-syntax-dynamic-import'
            ]
          }
        }
      },

      // CSS/SCSS
      {
        test: /\.(css|scss|sass)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  ['autoprefixer', {
                    grid: true,
                    flexbox: true
                  }],
                  ['cssnano', {
                    preset: ['default', {
                      discardComments: { removeAll: true }
                    }]
                  }]
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src/styles')]
              }
            }
          }
        ]
      },

      // Images
      {
        test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8KB
          }
        },
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },

      // Videos
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[hash:8][ext]'
        }
      },

      // PHP files (for templating)
      {
        test: /\.php$/,
        type: 'asset/resource',
        generator: {
          filename: 'templates/[name][ext]'
        }
      }
    ]
  },

  // Plugins
  plugins: [
    // Clean output directory
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!.gitkeep'
      ]
    }),

    // Environment variables
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        APP_NAME: JSON.stringify(process.env.APP_NAME),
        APP_URL: JSON.stringify(process.env.APP_URL),
        GOOGLE_ANALYTICS_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_ID),
        FACEBOOK_PIXEL_ID: JSON.stringify(process.env.FACEBOOK_PIXEL_ID),
        GOOGLE_RECAPTCHA_SITE_KEY: JSON.stringify(process.env.GOOGLE_RECAPTCHA_SITE_KEY)
      }
    }),

    // Extract CSS
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
      chunkFilename: isDevelopment ? 'css/[name].chunk.css' : 'css/[name].[contenthash:8].chunk.css'
    }),

    // Copy static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/images'),
          to: path.resolve(__dirname, 'public/assets/images'),
          globOptions: {
            ignore: ['**/.DS_Store']
          }
        },
        {
          from: path.resolve(__dirname, 'src/assets/fonts'),
          to: path.resolve(__dirname, 'public/assets/fonts')
        },
        {
          from: path.resolve(__dirname, 'src/assets/videos'),
          to: path.resolve(__dirname, 'public/assets/videos')
        }
      ]
    }),

    // ESLint
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true,
      emitWarning: isDevelopment,
      emitError: isProduction,
      failOnError: isProduction
    }),

    // Stylelint
    new StylelintPlugin({
      extensions: ['css', 'scss', 'sass'],
      fix: true,
      emitWarning: isDevelopment,
      emitError: isProduction,
      failOnError: isProduction
    }),

    // Service Worker (PWA)
    isProduction && new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      swDest: path.resolve(__dirname, 'public/sw.js'),
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
        }
      ]
    }),

    // Bundle analyzer
    isAnalyze && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: path.resolve(__dirname, 'reports/bundle-analysis.html')
    })
  ].filter(Boolean),

  // Optimization
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
            drop_debugger: isProduction
          },
          mangle: {
            safari10: true
          },
          output: {
            comments: false,
            ascii_only: true
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['imagemin-mozjpeg', { quality: 85 }],
              ['imagemin-pngquant', { quality: [0.65, 0.8] }],
              ['imagemin-svgo', {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false
                  }
                ]
              }]
            ]
          }
        }
      })
    ],

    // Code splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },

    // Runtime chunk
    runtimeChunk: {
      name: 'runtime'
    }
  },

  // Performance
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },

  // Dev server
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public')
    },
    compress: true,
    port: 3001,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Stats
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false
  }
};

module.exports = config;
