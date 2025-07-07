// ==========================================================================
// PERSONALIZATION ENGINE - PageantEmpress 2025
// Edge function for dynamic content personalization
// ==========================================================================

export default async (request, context) => {
  const { url } = context;
  const requestUrl = new URL(request.url);
  
  // Skip personalization for static assets
  if (requestUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf)$/)) {
    return;
  }
  
  try {
    // Get user data from cookies
    const cookies = new Map();
    const cookieHeader = request.headers.get('cookie');
    
    if (cookieHeader) {
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        cookies.set(name, decodeURIComponent(value));
      });
    }
    
    // Extract user preferences
    const userPreferences = {
      favoriteContestants: cookies.get('pe_favorites') ? JSON.parse(cookies.get('pe_favorites')) : [],
      votingHistory: cookies.get('pe_voting') ? JSON.parse(cookies.get('pe_voting')) : [],
      interests: cookies.get('pe_interests') ? JSON.parse(cookies.get('pe_interests')) : [],
      lastVisit: cookies.get('pe_last_visit') || null,
      returningUser: cookies.get('pe_returning') === 'true',
      preferredLanguage: cookies.get('pe_language') || 'en'
    };
    
    // Get the original response
    const response = await context.next();
    
    // Only process HTML responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return response;
    }
    
    // Process HTML content
    const html = await response.text();
    
    // Personalization logic
    const personalizationScript = `
      <script>
        window.pageantPersonalization = {
          user: ${JSON.stringify(userPreferences)},
          isReturningUser: ${userPreferences.returningUser},
          
          // Personalization functions
          personalizeContent: function() {
            this.showFavoriteContestants();
            this.customizeRecommendations();
            this.personalizeNavigation();
            this.showReturningUserContent();
            this.trackUserBehavior();
          },
          
          showFavoriteContestants: function() {
            if (this.user.favoriteContestants.length > 0) {
              const favoritesSection = document.querySelector('.favorites-section');
              if (favoritesSection) {
                favoritesSection.style.display = 'block';
                
                // Populate favorites
                const favoritesContainer = document.querySelector('.favorites-container');
                if (favoritesContainer) {
                  this.user.favoriteContestants.forEach(contestantId => {
                    const contestantCard = document.querySelector(\`[data-contestant-id="\${contestantId}"]\`);
                    if (contestantCard) {
                      const clone = contestantCard.cloneNode(true);
                      clone.classList.add('favorite-contestant');
                      favoritesContainer.appendChild(clone);
                    }
                  });
                }
              }
            }
          },
          
          customizeRecommendations: function() {
            const recommendationsSection = document.querySelector('.recommendations');
            if (recommendationsSection && this.user.interests.length > 0) {
              // Filter recommendations based on interests
              const allRecommendations = document.querySelectorAll('.recommendation-item');
              allRecommendations.forEach(item => {
                const itemInterests = item.dataset.interests ? item.dataset.interests.split(',') : [];
                const hasMatch = itemInterests.some(interest => this.user.interests.includes(interest));
                
                if (hasMatch) {
                  item.classList.add('recommended');
                  item.style.order = '1';
                } else {
                  item.style.order = '2';
                }
              });
            }
          },
          
          personalizeNavigation: function() {
            // Highlight frequently visited sections
            if (this.user.votingHistory.length > 0) {
              const votingNav = document.querySelector('nav a[href*="voting"]');
              if (votingNav) {
                votingNav.classList.add('frequently-used');
              }
            }
            
            if (this.user.favoriteContestants.length > 0) {
              const contestantsNav = document.querySelector('nav a[href*="contestants"]');
              if (contestantsNav) {
                contestantsNav.classList.add('frequently-used');
              }
            }
          },
          
          showReturningUserContent: function() {
            if (this.isReturningUser) {
              // Show welcome back message
              const welcomeMessage = document.querySelector('.welcome-back');
              if (welcomeMessage) {
                welcomeMessage.style.display = 'block';
              }
              
              // Show recent activity
              const recentActivity = document.querySelector('.recent-activity');
              if (recentActivity && this.user.lastVisit) {
                recentActivity.innerHTML = \`
                  <h3>Since your last visit</h3>
                  <p>Welcome back! Here's what's new since \${new Date(this.user.lastVisit).toLocaleDateString()}</p>
                \`;
                recentActivity.style.display = 'block';
              }
            } else {
              // Show first-time user content
              const firstTimeUser = document.querySelector('.first-time-user');
              if (firstTimeUser) {
                firstTimeUser.style.display = 'block';
              }
            }
          },
          
          trackUserBehavior: function() {
            // Track page views
            if (typeof gtag !== 'undefined') {
              gtag('event', 'personalized_view', {
                returning_user: this.isReturningUser,
                favorite_count: this.user.favoriteContestants.length,
                voting_history_count: this.user.votingHistory.length,
                interests: this.user.interests
              });
            }
            
            // Update last visit
            document.cookie = \`pe_last_visit=\${new Date().toISOString()}; path=/; max-age=2592000; secure; samesite=strict\`;
            document.cookie = \`pe_returning=true; path=/; max-age=2592000; secure; samesite=strict\`;
          }
        };
        
        // Initialize personalization when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
          window.pageantPersonalization.personalizeContent();
        });
      </script>
    `;
    
    // Add personalization styles
    const personalizationCSS = `
      <style>
        .favorites-section {
          display: none;
          background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
          padding: 2rem;
          margin: 2rem 0;
          border-radius: 12px;
          color: white;
        }
        
        .welcome-back {
          display: none;
          background: #e8f5e8;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #d4af37;
        }
        
        .first-time-user {
          display: none;
          background: #f0f8ff;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #4285f4;
        }
        
        .recent-activity {
          display: none;
          background: #fff3cd;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #ffc107;
        }
        
        .recommendation-item.recommended {
          border: 2px solid #d4af37;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        
        .frequently-used {
          position: relative;
        }
        
        .frequently-used::after {
          content: "★";
          position: absolute;
          top: -5px;
          right: -5px;
          color: #d4af37;
          font-size: 0.8rem;
        }
        
        .favorite-contestant {
          position: relative;
          overflow: hidden;
        }
        
        .favorite-contestant::before {
          content: "♥";
          position: absolute;
          top: 10px;
          right: 10px;
          color: #ff6b6b;
          font-size: 1.5rem;
          z-index: 10;
        }
        
        @media (max-width: 768px) {
          .favorites-section {
            padding: 1rem;
          }
        }
      </style>
    `;
    
    // Insert personalization code
    let modifiedHtml = html.replace('</head>', `${personalizationCSS}${personalizationScript}</head>`);
    
    // Add personalization placeholders to HTML
    const personalizationHTML = `
      <div class="personalization-container">
        <div class="welcome-back">
          <h3>Welcome back!</h3>
          <p>We've missed you at PageantEmpress 2025!</p>
        </div>
        
        <div class="first-time-user">
          <h3>Welcome to PageantEmpress 2025!</h3>
          <p>Discover amazing contestants, vote for your favorites, and join our community!</p>
        </div>
        
        <div class="recent-activity">
          <!-- Dynamic content will be inserted here -->
        </div>
        
        <div class="favorites-section">
          <h3>Your Favorite Contestants</h3>
          <div class="favorites-container">
            <!-- Favorite contestants will be populated here -->
          </div>
        </div>
      </div>
    `;
    
    // Insert personalization HTML after opening body tag
    modifiedHtml = modifiedHtml.replace('<body', `<body`).replace('>', `>${personalizationHTML}`);
    
    return new Response(modifiedHtml, {
      status: response.status,
      headers: response.headers
    });
    
  } catch (error) {
    console.error('Personalization error:', error);
    return context.next();
  }
};

export const config = {
  path: ["/*"],
  excludedPath: ["/api/*", "/admin/*", "/.netlify/*", "/assets/*"]
};
