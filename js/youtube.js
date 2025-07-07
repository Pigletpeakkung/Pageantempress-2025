/* ===== YOUTUBE.JS - ENHANCED YOUTUBE INTEGRATION FOR LUXURY WEBSITE ===== */

// ===== YOUTUBE PLAYER CONFIGURATION =====
const YOUTUBE_CONFIG = {
    // API Configuration
    api: {
        key: 'YOUR_YOUTUBE_API_KEY', // Replace with your actual API key
        baseUrl: 'https://www.googleapis.com/youtube/v3',
        playerUrl: 'https://www.youtube.com/iframe_api'
    },
    
    // Default Player Settings
    defaultPlayerVars: {
        autoplay: 0,
        controls: 1,
        disablekb: 0,
        enablejsapi: 1,
        fs: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        origin: window.location.origin
    },
    
    // Player Dimensions
    dimensions: {
        default: { width: 560, height: 315 },
        small: { width: 320, height: 180 },
        medium: { width: 640, height: 360 },
        large: { width: 854, height: 480 },
        hd: { width: 1280, height: 720 }
    },
    
    // Quality Settings
    quality: {
        auto: 'default',
        low: 'small',
        medium: 'medium',
        high: 'large',
        hd: 'hd720',
        fullhd: 'hd1080'
    },
    
    // Playlist Configuration
    playlist: {
        maxResults: 50,
        defaultThumbnail: '/images/video-placeholder.jpg'
    },
    
    // Performance Settings
    performance: {
        lazyLoad: true,
        preloadThumbnails: true,
        cacheDuration: 3600000, // 1 hour
        retryAttempts: 3,
        retryDelay: 1000
    }
};

// ===== YOUTUBE MANAGER CLASS =====
class YouTubeManager {
    constructor() {
        this.players = new Map();
        this.playlists = new Map();
        this.apiReady = false;
        this.apiLoaded = false;
        this.cache = new Map();
        this.observers = new Map();
        this.eventListeners = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🎬 Initializing YouTube Manager...');
            
            // Load YouTube API
            await this.loadYouTubeAPI();
            
            // Initialize existing players
            this.initializeExistingPlayers();
            
            // Setup lazy loading
            this.setupLazyLoading();
            
            // Initialize playlists
            this.initializePlaylists();
            
            // Setup analytics
            this.setupAnalytics();
            
            console.log('✅ YouTube Manager initialized successfully!');
            
        } catch (error) {
            console.error('❌ YouTube Manager initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    // ===== API LOADING =====
    async loadYouTubeAPI() {
        if (this.apiLoaded) return;
        
        return new Promise((resolve, reject) => {
            // Check if API is already loaded
            if (window.YT && window.YT.Player) {
                this.apiReady = true;
                this.apiLoaded = true;
                resolve();
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = YOUTUBE_CONFIG.api.playerUrl;
            script.async = true;
            
            // Setup global callback
            window.onYouTubeIframeAPIReady = () => {
                this.apiReady = true;
                this.apiLoaded = true;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load YouTube API'));
            };
            
            // Add to document
            document.head.appendChild(script);
            
            // Timeout fallback
            setTimeout(() => {
                if (!this.apiReady) {
                    reject(new Error('YouTube API load timeout'));
                }
            }, 10000);
        });
    }
    
    // ===== PLAYER CREATION =====
    createPlayer(containerId, videoId, options = {}) {
        if (!this.apiReady) {
            console.error('YouTube API not ready');
            return null;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found`);
            return null;
        }
        
        const playerOptions = this.buildPlayerOptions(videoId, options);
        
        try {
            const player = new YT.Player(containerId, playerOptions);
            
            // Store player reference
            this.players.set(containerId, {
                player,
                videoId,
                options,
                container,
                state: 'created',
                analytics: {
                    playCount: 0,
                    totalWatchTime: 0,
                    lastPlayTime: 0
                }
            });
            
            // Setup player events
            this.setupPlayerEvents(containerId, player);
            
            return player;
            
        } catch (error) {
            console.error('Failed to create YouTube player:', error);
            return null;
        }
    }
    
    buildPlayerOptions(videoId, options) {
        const dimensions = YOUTUBE_CONFIG.dimensions[options.size] || YOUTUBE_CONFIG.dimensions.default;
        
        return {
            width: options.width || dimensions.width,
            height: options.height || dimensions.height,
            videoId: videoId,
            playerVars: {
                ...YOUTUBE_CONFIG.defaultPlayerVars,
                ...options.playerVars,
                autoplay: options.autoplay ? 1 : 0,
                mute: options.mute ? 1 : 0,
                loop: options.loop ? 1 : 0,
                start: options.start || 0,
                end: options.end || 0,
                cc_load_policy: options.captions ? 1 : 0,
                hl: options.language || 'en',
                playlist: options.loop ? videoId : undefined
            },
            events: {
                onReady: (event) => this.handlePlayerReady(event, options),
                onStateChange: (event) => this.handlePlayerStateChange(event, options),
                onError: (event) => this.handlePlayerError(event, options),
                onPlaybackQualityChange: (event) => this.handleQualityChange(event, options),
                onPlaybackRateChange: (event) => this.handleRateChange(event, options)
            }
        };
    }
    
    // ===== PLAYER EVENT HANDLERS =====
    handlePlayerReady(event, options) {
        const player = event.target;
        const containerId = this.getPlayerContainerId(player);
        
        if (containerId) {
            const playerData = this.players.get(containerId);
            if (playerData) {
                playerData.state = 'ready';
                
                // Set initial quality
                if (options.quality) {
                    player.setPlaybackQuality(YOUTUBE_CONFIG.quality[options.quality] || options.quality);
                }
                
                // Set initial volume
                if (options.volume !== undefined) {
                    player.setVolume(options.volume);
                }
                
                // Custom ready callback
                if (options.onReady) {
                    options.onReady(player, event);
                }
                
                // Dispatch custom event
                this.dispatchPlayerEvent('ready', containerId, { player, event });
            }
        }
    }
    
    handlePlayerStateChange(event, options) {
        const player = event.target;
        const containerId = this.getPlayerContainerId(player);
        const state = event.data;
        
        if (!containerId) return;
        
        const playerData = this.players.get(containerId);
        if (!playerData) return;
        
        const stateNames = {
            [-1]: 'unstarted',
            [0]: 'ended',
            [1]: 'playing',
            [2]: 'paused',
            [3]: 'buffering',
            [5]: 'cued'
        };
        
        const stateName = stateNames[state] || 'unknown';
        playerData.state = stateName;
        
        // Handle different states
        switch (state) {
            case YT.PlayerState.PLAYING:
                this.handlePlayStart(containerId, player, options);
                break;
            case YT.PlayerState.PAUSED:
                this.handlePlayPause(containerId, player, options);
                break;
            case YT.PlayerState.ENDED:
                this.handlePlayEnd(containerId, player, options);
                break;
            case YT.PlayerState.BUFFERING:
                this.handleBuffering(containerId, player, options);
                break;
        }
        
        // Custom state change callback
        if (options.onStateChange) {
            options.onStateChange(player, state, stateName, event);
        }
        
        // Dispatch custom event
        this.dispatchPlayerEvent('stateChange', containerId, { 
            player, 
            state, 
            stateName, 
            event 
        });
    }
    
    handlePlayerError(event, options) {
        const player = event.target;
        const containerId = this.getPlayerContainerId(player);
        const errorCode = event.data;
        
        const errorMessages = {
            2: 'Invalid video ID',
            5: 'HTML5 player error',
            100: 'Video not found or private',
            101: 'Video not allowed in embedded players',
            150: 'Video not allowed in embedded players'
        };
        
        const errorMessage = errorMessages[errorCode] || `Unknown error (${errorCode})`;
        
        console.error(`YouTube Player Error [${containerId}]:`, errorMessage);
        
        // Update player state
        if (containerId) {
            const playerData = this.players.get(containerId);
            if (playerData) {
                playerData.state = 'error';
                playerData.error = { code: errorCode, message: errorMessage };
            }
        }
        
        // Show error to user
        this.showPlayerError(containerId, errorMessage);
        
        // Custom error callback
        if (options.onError) {
            options.onError(player, errorCode, errorMessage, event);
        }
        
        // Dispatch custom event
        this.dispatchPlayerEvent('error', containerId, { 
            player, 
            errorCode, 
            errorMessage, 
            event 
        });
    }
    
    handleQualityChange(event, options) {
        const player = event.target;
        const containerId = this.getPlayerContainerId(player);
        const quality = event.data;
        
        console.log(`Quality changed [${containerId}]:`, quality);
        
        if (options.onQualityChange) {
            options.onQualityChange(player, quality, event);
        }
        
        this.dispatchPlayerEvent('qualityChange', containerId, { 
            player, 
            quality, 
            event 
        });
    }
    
    handleRateChange(event, options) {
        const player = event.target;
        const containerId = this.getPlayerContainerId(player);
        const rate = event.data;
        
        console.log(`Playback rate changed [${containerId}]:`, rate);
        
        if (options.onRateChange) {
            options.onRateChange(player, rate, event);
        }
        
        this.dispatchPlayerEvent('rateChange', containerId, { 
            player, 
            rate, 
            event 
        });
    }
    
    // ===== PLAYER STATE HANDLERS =====
    handlePlayStart(containerId, player, options) {
        const playerData = this.players.get(containerId);
        if (!playerData) return;
        
        // Update analytics
        playerData.analytics.playCount++;
        playerData.analytics.lastPlayTime = Date.now();
        
        // Hide thumbnail overlay
        this.hidePlayerThumbnail(containerId);
        
        // Update UI
        this.updatePlayerUI(containerId, 'playing');
        
        // Track analytics
        this.trackAnalytics('play', {
            containerId,
            videoId: playerData.videoId,
            currentTime: player.getCurrentTime?.() || 0
        });
        
        console.log(`Video started playing [${containerId}]`);
    }
    
    handlePlayPause(containerId, player, options) {
        const playerData = this.players.get(containerId);
        if (!playerData) return;
        
        // Update analytics
        const currentTime = Date.now();
        if (playerData.analytics.lastPlayTime) {
            playerData.analytics.totalWatchTime += currentTime - playerData.analytics.lastPlayTime;
        }
        
        // Update UI
        this.updatePlayerUI(containerId, 'paused');
        
        // Track analytics
        this.trackAnalytics('pause', {
            containerId,
            videoId: playerData.videoId,
            currentTime: player.getCurrentTime?.() || 0
        });
        
        console.log(`Video paused [${containerId}]`);
    }
    
    handlePlayEnd(containerId, player, options) {
        const playerData = this.players.get(containerId);
        if (!playerData) return;
        
        // Update analytics
        const currentTime = Date.now();
        if (playerData.analytics.lastPlayTime) {
            playerData.analytics.totalWatchTime += currentTime - playerData.analytics.lastPlayTime;
        }
        
        // Update UI
        this.updatePlayerUI(containerId, 'ended');
        
        // Show thumbnail overlay
        this.showPlayerThumbnail(containerId);
        
        // Handle autoplay next
        if (options.autoplayNext) {
            this.playNextVideo(containerId);
        }
        
        // Track analytics
        this.trackAnalytics('complete', {
            containerId,
            videoId: playerData.videoId,
            totalWatchTime: playerData.analytics.totalWatchTime
        });
        
        console.log(`Video ended [${containerId}]`);
    }
    
    handleBuffering(containerId, player, options) {
        // Update UI
        this.updatePlayerUI(containerId, 'buffering');
        
        console.log(`Video buffering [${containerId}]`);
    }
    
    // ===== PLAYER CONTROL METHODS =====
    playVideo(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.playVideo();
        }
    }
    
    pauseVideo(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.pauseVideo();
        }
    }
    
    stopVideo(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.stopVideo();
        }
    }
    
    seekTo(containerId, seconds, allowSeekAhead = true) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.seekTo(seconds, allowSeekAhead);
        }
    }
    
    setVolume(containerId, volume) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.setVolume(Math.max(0, Math.min(100, volume)));
        }
    }
    
    mute(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.mute();
        }
    }
    
    unmute(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.unMute();
        }
    }
    
    setPlaybackRate(containerId, rate) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.setPlaybackRate(rate);
        }
    }
    
    setPlaybackQuality(containerId, quality) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            const ytQuality = YOUTUBE_CONFIG.quality[quality] || quality;
            playerData.player.setPlaybackQuality(ytQuality);
        }
    }
    
    // ===== PLAYER INFORMATION METHODS =====
    getPlayerState(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getPlayerState();
        }
        return null;
    }
    
    getCurrentTime(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getCurrentTime();
        }
        return 0;
    }
    
    getDuration(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getDuration();
        }
        return 0;
    }
    
    getVolume(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getVolume();
        }
        return 0;
    }
    
    isMuted(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.isMuted();
        }
        return false;
    }
    
    getPlaybackRate(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getPlaybackRate();
        }
        return 1;
    }
    
    getPlaybackQuality(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            return playerData.player.getPlaybackQuality();
        }
        return null;
    }
    
    // ===== LAZY LOADING =====
    setupLazyLoading() {
        if (!YOUTUBE_CONFIG.performance.lazyLoad) return;
        
        const lazyPlayers = document.querySelectorAll('[data-youtube-lazy]');
        
        if (lazyPlayers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyPlayer(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyPlayers.forEach(player => {
            observer.observe(player);
            this.showPlayerThumbnail(player.id);
        });
        
        this.observers.set('lazyLoad', observer);
    }
    
    loadLazyPlayer(element) {
        const videoId = element.dataset.youtubeId;
        const options = this.parseDataAttributes(element);
        
        if (videoId) {
            element.removeAttribute('data-youtube-lazy');
            this.createPlayer(element.id, videoId, options);
        }
    }
    
    parseDataAttributes(element) {
        const options = {};
        
        // Parse common options from data attributes
        if (element.dataset.autoplay) options.autoplay = element.dataset.autoplay === 'true';
        if (element.dataset.mute) options.mute = element.dataset.mute === 'true';
        if (element.dataset.loop) options.loop = element.dataset.loop === 'true';
        if (element.dataset.controls) options.controls = element.dataset.controls === 'true';
        if (element.dataset.start) options.start = parseInt(element.dataset.start);
        if (element.dataset.end) options.end = parseInt(element.dataset.end);
        if (element.dataset.quality) options.quality = element.dataset.quality;
        if (element.dataset.volume) options.volume = parseInt(element.dataset.volume);
        if (element.dataset.size) options.size = element.dataset.size;
        if (element.dataset.language) options.language = element.dataset.language;
        if (element.dataset.captions) options.captions = element.dataset.captions === 'true';
        
        return options;
    }
    
    // ===== THUMBNAIL MANAGEMENT =====
    showPlayerThumbnail(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const playerData = this.players.get(containerId);
        if (!playerData) return;
        
        const thumbnail = container.querySelector('.youtube-thumbnail');
        if (thumbnail) {
            thumbnail.style.display = 'block';
            return;
        }
        
        // Create thumbnail overlay
        this.createPlayerThumbnail(containerId, playerData.videoId);
    }
    
    hidePlayerThumbnail(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const thumbnail = container.querySelector('.youtube-thumbnail');
        if (thumbnail) {
            thumbnail.style.display = 'none';
        }
    }
    
    createPlayerThumbnail(containerId, videoId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const thumbnail = document.createElement('div');
        thumbnail.className = 'youtube-thumbnail';
        thumbnail.innerHTML = `
            <div class="youtube-thumbnail-image">
                <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                     alt="Video thumbnail"
                     onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
            </div>
            <div class="youtube-thumbnail-overlay">
                <button class="youtube-play-button" aria-label="Play video">
                    <svg width="68" height="48" viewBox="0 0 68 48">
                        <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                    </svg>
                </button>
            </div>
        `;
        
        // Add click handler
        thumbnail.addEventListener('click', () => {
            this.playVideo(containerId);
        });
        
        // Style the thumbnail
        thumbnail.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
        `;
        
        container.style.position = 'relative';
        container.appendChild(thumbnail);
    }
    
    // ===== PLAYLIST MANAGEMENT =====
    async createPlaylist(containerId, playlistId, options = {}) {
        try {
            const playlistData = await this.getPlaylistData(playlistId);
            
            const playlist = {
                id: playlistId,
                data: playlistData,
                currentIndex: 0,
                shuffle: false,
                repeat: false,
                autoplay: options.autoplay || false,
                ...options
            };
            
            this.playlists.set(containerId, playlist);
            
            // Load first video
            if (playlistData.items && playlistData.items.length > 0) {
                const firstVideo = playlistData.items[0];
                this.createPlayer(containerId, firstVideo.snippet.resourceId.videoId, {
                    ...options,
                    playlist: true,
                    onStateChange: (player, state) => {
                        if (state === YT.PlayerState.ENDED && playlist.autoplay) {
                            this.playNextVideo(containerId);
                        }
                    }
                });
            }
            
            return playlist;
            
        } catch (error) {
            console.error('Failed to create playlist:', error);
            return null;
        }
    }
    
    async getPlaylistData(playlistId) {
        // Check cache first
        const cacheKey = `playlist_${playlistId}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < YOUTUBE_CONFIG.performance.cacheDuration) {
            return cached.data;
        }
        
        // Fetch from API
        const url = `${YOUTUBE_CONFIG.api.baseUrl}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${YOUTUBE_CONFIG.playlist.maxResults}&key=${YOUTUBE_CONFIG.api.key}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch playlist: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Cache the result
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    }
    
    playNextVideo(containerId) {
        const playlist = this.playlists.get(containerId);
        if (!playlist) return;
        
        const nextIndex = this.getNextVideoIndex(playlist);
        if (nextIndex === -1) return;
        
        playlist.currentIndex = nextIndex;
        const nextVideo = playlist.data.items[nextIndex];
        
        if (nextVideo) {
            this.loadVideo(containerId, nextVideo.snippet.resourceId.videoId);
        }
    }
    
    playPreviousVideo(containerId) {
        const playlist = this.playlists.get(containerId);
        if (!playlist) return;
        
        const prevIndex = this.getPreviousVideoIndex(playlist);
        if (prevIndex === -1) return;
        
        playlist.currentIndex = prevIndex;
        const prevVideo = playlist.data.items[prevIndex];
        
        if (prevVideo) {
            this.loadVideo(containerId, prevVideo.snippet.resourceId.videoId);
        }
    }
    
    getNextVideoIndex(playlist) {
        const totalVideos = playlist.data.items.length;
        
        if (playlist.shuffle) {
            return Math.floor(Math.random() * totalVideos);
        }
        
        const nextIndex = playlist.currentIndex + 1;
        
        if (nextIndex >= totalVideos) {
            return playlist.repeat ? 0 : -1;
        }
        
        return nextIndex;
    }
    
    getPreviousVideoIndex(playlist) {
        const totalVideos = playlist.data.items.length;
        
        if (playlist.shuffle) {
            return Math.floor(Math.random() * totalVideos);
        }
        
        const prevIndex = playlist.currentIndex - 1;
        
        if (prevIndex < 0) {
            return playlist.repeat ? totalVideos - 1 : -1;
        }
        
        return prevIndex;
    }
    
    loadVideo(containerId, videoId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            playerData.player.loadVideoById(videoId);
            playerData.videoId = videoId;
        }
    }
    
    // ===== GALLERY CREATION =====
    async createVideoGallery(containerId, channelId, options = {}) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container with ID '${containerId}' not found`);
            }
            
            const videos = await this.getChannelVideos(channelId, options.maxResults || 12);
            
            const gallery = document.createElement('div');
            gallery.className = 'youtube-gallery';
            
            videos.items.forEach((video, index) => {
                const videoCard = this.createVideoCard(video, {
                    ...options,
                    onClick: () => this.playVideoInModal(video.id.videoId, options)
                });
                
                gallery.appendChild(videoCard);
            });
            
            container.appendChild(gallery);
            
            return gallery;
            
        } catch (error) {
            console.error('Failed to create video gallery:', error);
            return null;
        }
    }
    
    async getChannelVideos(channelId, maxResults = 12) {
        const cacheKey = `channel_${channelId}_${maxResults}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < YOUTUBE_CONFIG.performance.cacheDuration) {
            return cached.data;
        }
        
        const url = `${YOUTUBE_CONFIG.api.baseUrl}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_CONFIG.api.key}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch channel videos: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    }
    
    createVideoCard(video, options = {}) {
        const card = document.createElement('div');
        card.className = 'youtube-video-card';
        
        const thumbnail = video.snippet.thumbnails.medium || video.snippet.thumbnails.default;
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${thumbnail.url}" alt="${video.snippet.title}" loading="lazy">
                <div class="video-overlay">
                    <button class="video-play-btn" aria-label="Play ${video.snippet.title}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.snippet.title}</h3>
                <p class="video-description">${this.truncateText(video.snippet.description, 100)}</p>
                <div class="video-meta">
                    <span class="video-channel">${video.snippet.channelTitle}</span>
                    <span class="video-date">${this.formatDate(video.snippet.publishedAt)}</span>
                </div>
            </div>
        `;
        
        // Add click handler
        card.addEventListener('click', () => {
            if (options.onClick) {
                options.onClick(video);
            }
        });
        
        return card;
    }
    
    playVideoInModal(videoId, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'youtube-modal';
        modal.innerHTML = `
            <div class="youtube-modal-content">
                <button class="youtube-modal-close" aria-label="Close video">
                    <i class="fas fa-times"></i>
                </button>
                <div class="youtube-modal-player" id="modal-player-${Date.now()}"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Create player in modal
        const playerId = modal.querySelector('.youtube-modal-player').id;
        this.createPlayer(playerId, videoId, {
            ...options,
            autoplay: true,
            width: '100%',
            height: '100%'
        });
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.youtube-modal-close');
        closeBtn.addEventListener('click', () => {
            this.destroyPlayer(playerId);
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.destroyPlayer(playerId);
                modal.remove();
            }
        });
        
        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.destroyPlayer(playerId);
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
        
        return modal;
    }
    
    // ===== PLAYER MANAGEMENT =====
    destroyPlayer(containerId) {
        const playerData = this.players.get(containerId);
        if (playerData && playerData.player) {
            try {
                playerData.player.destroy();
            } catch (error) {
                console.warn('Error destroying player:', error);
            }
            
            this.players.delete(containerId);
        }
    }
    
    destroyAllPlayers() {
        this.players.forEach((playerData, containerId) => {
            this.destroyPlayer(containerId);
        });
    }
    
    // ===== UTILITY METHODS =====
    getPlayerContainerId(player) {
        for (let [containerId, playerData] of this.players) {
            if (playerData.player === player) {
                return containerId;
            }
        }
        return null;
    }
    
    updatePlayerUI(containerId, state) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Update container classes
        container.classList.remove('youtube-playing', 'youtube-paused', 'youtube-ended', 'youtube-buffering');
        container.classList.add(`youtube-${state}`);
        
        // Update custom controls if they exist
        const customControls = container.querySelector('.youtube-custom-controls');
        if (customControls) {
            this.updateCustomControls(customControls, state);
        }
    }
    
    updateCustomControls(controls, state) {
        const playBtn = controls.querySelector('.youtube-play-btn');
        const pauseBtn = controls.querySelector('.youtube-pause-btn');
        
        if (playBtn && pauseBtn) {
            if (state === 'playing') {
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'block';
            } else {
                playBtn.style.display = 'block';
                pauseBtn.style.display = 'none';
            }
        }
    }
    
    showPlayerError(containerId, message) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'youtube-error';
        errorDiv.innerHTML = `
            <div class="youtube-error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Video Error</h3>
                <p>${message}</p>
                <button class="youtube-retry-btn">Retry</button>
            </div>
        `;
        
        // Add retry functionality
        errorDiv.querySelector('.youtube-retry-btn').addEventListener('click', () => {
            errorDiv.remove();
            const playerData = this.players.get(containerId);
            if (playerData) {
                this.createPlayer(containerId, playerData.videoId, playerData.options);
            }
        });
        
        container.appendChild(errorDiv);
    }
    
    dispatchPlayerEvent(eventType, containerId, data) {
        const event = new CustomEvent(`youtube${eventType}`, {
            detail: { containerId, ...data }
        });
        
        document.dispatchEvent(event);
    }
    
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // ===== ANALYTICS =====
    setupAnalytics() {
        // Track video interactions
        document.addEventListener('youtubeready', (e) => {
            this.trackAnalytics('playerReady', e.detail);
        });
        
        document.addEventListener('youtubeplay', (e) => {
            this.trackAnalytics('play', e.detail);
        });
        
        document.addEventListener('youtubepause', (e) => {
            this.trackAnalytics('pause', e.detail);
        });
        
        document.addEventListener('youtubeended', (e) => {
            this.trackAnalytics('complete', e.detail);
        });
    }
    
    trackAnalytics(action, data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'YouTube',
                event_label: data.videoId || data.containerId,
                custom_map: {
                    container_id: data.containerId
                }
            });
        }
        
       trackAnalytics(action, data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'YouTube',
                event_label: data.videoId || data.containerId,
                custom_map: {
                    container_id: data.containerId
                }
            });
        }
        
        // Google Analytics Universal
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'YouTube', action, data.videoId || data.containerId);
        }
        
        // Custom analytics
        if (window.luxuryAnalytics) {
            window.luxuryAnalytics.track('youtube_' + action, data);
        }
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('YouTube Analytics:', action, data);
        }
    }
    
    // ===== INITIALIZATION HELPERS =====
    initializeExistingPlayers() {
        // Find existing YouTube players on the page
        const existingPlayers = document.querySelectorAll('[data-youtube-id]');
        
        existingPlayers.forEach((element) => {
            const videoId = element.dataset.youtubeId;
            const options = this.parseDataAttributes(element);
            
            if (videoId && !element.dataset.youtubeLazy) {
                this.createPlayer(element.id, videoId, options);
            }
        });
    }
    
    initializePlaylists() {
        // Find existing playlists on the page
        const existingPlaylists = document.querySelectorAll('[data-youtube-playlist]');
        
        existingPlaylists.forEach((element) => {
            const playlistId = element.dataset.youtubePlaylist;
            const options = this.parseDataAttributes(element);
            
            if (playlistId) {
                this.createPlaylist(element.id, playlistId, options);
            }
        });
    }
    
    handleInitializationError(error) {
        console.error('YouTube initialization error:', error);
        
        // Show fallback message
        const fallbackMessage = document.createElement('div');
        fallbackMessage.className = 'youtube-fallback';
        fallbackMessage.innerHTML = `
            <div class="youtube-fallback-content">
                <i class="fab fa-youtube"></i>
                <h3>YouTube Not Available</h3>
                <p>YouTube videos could not be loaded. Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Reload Page</button>
            </div>
        `;
        
        // Replace any existing YouTube containers
        const youtubeContainers = document.querySelectorAll('[data-youtube-id], [data-youtube-playlist]');
        youtubeContainers.forEach(container => {
            const fallback = fallbackMessage.cloneNode(true);
            container.parentNode.replaceChild(fallback, container);
        });
    }
    
    // ===== RESPONSIVE HANDLING =====
    handleResponsiveResize() {
        this.players.forEach((playerData, containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const containerWidth = container.offsetWidth;
            const aspectRatio = 16 / 9; // Standard YouTube aspect ratio
            const newHeight = containerWidth / aspectRatio;
            
            if (playerData.player && playerData.player.setSize) {
                playerData.player.setSize(containerWidth, newHeight);
            }
        });
    }
    
    // ===== CLEANUP =====
    cleanup() {
        // Destroy all players
        this.destroyAllPlayers();
        
        // Clear observers
        this.observers.forEach(observer => {
            if (observer.disconnect) {
                observer.disconnect();
            }
        });
        
        // Clear cache
        this.cache.clear();
        
        // Clear event listeners
        this.eventListeners.forEach((listeners, event) => {
            listeners.forEach(listener => {
                document.removeEventListener(event, listener);
            });
        });
        
        console.log('YouTube Manager cleaned up');
    }
}

// ===== YOUTUBE CUSTOM CONTROLS =====
class YouTubeCustomControls {
    constructor(containerId, player) {
        this.containerId = containerId;
        this.player = player;
        this.container = document.getElementById(containerId);
        this.controls = null;
        this.isVisible = true;
        this.hideTimeout = null;
        
        this.init();
    }
    
    init() {
        this.createControls();
        this.bindEvents();
        this.startProgressUpdater();
    }
    
    createControls() {
        this.controls = document.createElement('div');
        this.controls.className = 'youtube-custom-controls';
        this.controls.innerHTML = `
            <div class="youtube-controls-overlay">
                <div class="youtube-controls-top">
                    <div class="youtube-video-title"></div>
                    <div class="youtube-controls-settings">
                        <button class="youtube-quality-btn" aria-label="Video quality">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="youtube-fullscreen-btn" aria-label="Fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                </div>
                
                <div class="youtube-controls-center">
                    <button class="youtube-play-pause-btn" aria-label="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                
                <div class="youtube-controls-bottom">
                    <div class="youtube-progress-container">
                        <div class="youtube-progress-bar">
                            <div class="youtube-progress-loaded"></div>
                            <div class="youtube-progress-played"></div>
                            <div class="youtube-progress-handle"></div>
                        </div>
                        <div class="youtube-time-display">
                            <span class="youtube-current    trackAnalytics(action, data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'YouTube',
                event_label: data.videoId || data.containerId,
                custom_map: {
                    container_id: data.containerId
                }
            });
        }
        
        // Google Analytics Universal
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'YouTube', action, data.videoId || data.containerId);
        }
        
        // Custom analytics
        if (window.luxuryAnalytics) {
            window.luxuryAnalytics.track('youtube_' + action, data);
        }
        
        // Console logging for development
        if (CONFIG?.debug) {
            console.log('📊 YouTube Analytics:', action, data);
        }
    }
    
    // ===== EXISTING PLAYER INITIALIZATION =====
    initializeExistingPlayers() {
        const existingPlayers = document.querySelectorAll('.youtube-player');
        
        existingPlayers.forEach(player => {
            const videoId = player.dataset.videoId || player.dataset.youtubeId;
            if (videoId && !player.dataset.youtubeLazy) {
                const options = this.parseDataAttributes(player);
                this.createPlayer(player.id, videoId, options);
            }
        });
    }
    
    initializePlaylists() {
        const playlists = document.querySelectorAll('.youtube-playlist');
        
        playlists.forEach(playlist => {
            const playlistId = playlist.dataset.playlistId;
            if (playlistId) {
                const options = this.parseDataAttributes(playlist);
                this.createPlaylist(playlist.id, playlistId, options);
            }
        });
    }
    
    // ===== ERROR HANDLING =====
    handleInitializationError(error) {
        console.error('YouTube Manager initialization failed:', error);
        
        // Show fallback message
        const fallbackMessage = document.createElement('div');
        fallbackMessage.className = 'youtube-error-fallback';
        fallbackMessage.innerHTML = `
            <div class="youtube-error-content">
                <i class="fas fa-video-slash"></i>
                <h3>Video Service Unavailable</h3>
                <p>Unable to load video content. Please refresh the page or try again later.</p>
                <button onclick="window.location.reload()" class="youtube-retry-btn">
                    Refresh Page
                </button>
            </div>
        `;
        
        // Replace all YouTube containers with error message
        const containers = document.querySelectorAll('.youtube-player, .youtube-playlist');
        containers.forEach(container => {
            container.appendChild(fallbackMessage.cloneNode(true));
        });
    }
}

// ===== YOUTUBE PLAYER COMPONENT =====
class YouTubePlayerComponent {
    constructor(containerId, videoId, options = {}) {
        this.containerId = containerId;
        this.videoId = videoId;
        this.options = options;
        this.player = null;
        this.controls = null;
        this.progressBar = null;
        this.isReady = false;
        
        this.init();
    }
    
    init() {
        this.createContainer();
        this.createCustomControls();
        this.setupEventListeners();
        this.createPlayer();
    }
    
    createContainer() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.classList.add('youtube-player-component');
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'youtube-player-wrapper';
        
        // Create player container
        const playerContainer = document.createElement('div');
        playerContainer.className = 'youtube-player-container';
        playerContainer.id = this.containerId + '-player';
        
        wrapper.appendChild(playerContainer);
        container.appendChild(wrapper);
    }
    
    createCustomControls() {
        if (!this.options.customControls) return;
        
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const controls = document.createElement('div');
        controls.className = 'youtube-custom-controls';
        controls.innerHTML = `
            <div class="youtube-controls-left">
                <button class="youtube-control-btn youtube-play-btn" aria-label="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="youtube-control-btn youtube-pause-btn" style="display: none;" aria-label="Pause">
                    <i class="fas fa-pause"></i>
                </button>
                <button class="youtube-control-btn youtube-volume-btn" aria-label="Volume">
                    <i class="fas fa-volume-up"></i>
                </button>
                <div class="youtube-volume-slider">
                    <input type="range" min="0" max="100" value="100" class="youtube-volume-range">
                </div>
                <div class="youtube-time-display">
                    <span class="youtube-current-time">0:00</span>
                    <span class="youtube-time-separator">/</span>
                    <span class="youtube-total-time">0:00</span>
                </div>
            </div>
            <div class="youtube-controls-center">
                <div class="youtube-progress-container">
                    <div class="youtube-progress-bar">
                        <div class="youtube-progress-loaded"></div>
                        <div class="youtube-progress-played"></div>
                        <div class="youtube-progress-handle"></div>
                    </div>
                </div>
            </div>
            <div class="youtube-controls-right">
                <button class="youtube-control-btn youtube-quality-btn" aria-label="Quality">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="youtube-control-btn youtube-fullscreen-btn" aria-label="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;
        
        container.appendChild(controls);
        this.controls = controls;
        this.progressBar = controls.querySelector('.youtube-progress-bar');
        
        this.setupControlEvents();
    }
    
    setupControlEvents() {
        if (!this.controls) return;
        
        const playBtn = this.controls.querySelector('.youtube-play-btn');
        const pauseBtn = this.controls.querySelector('.youtube-pause-btn');
        const volumeBtn = this.controls.querySelector('.youtube-volume-btn');
        const volumeSlider = this.controls.querySelector('.youtube-volume-range');
        const qualityBtn = this.controls.querySelector('.youtube-quality-btn');
        const fullscreenBtn = this.controls.querySelector('.youtube-fullscreen-btn');
        
        // Play/Pause
        playBtn?.addEventListener('click', () => this.play());
        pauseBtn?.addEventListener('click', () => this.pause());
        
        // Volume
        volumeBtn?.addEventListener('click', () => this.toggleMute());
        volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Quality
        qualityBtn?.addEventListener('click', () => this.showQualityMenu());
        
        // Fullscreen
        fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
        
        // Progress bar
        this.progressBar?.addEventListener('click', (e) => this.handleProgressClick(e));
        
        // Progress bar dragging
        this.setupProgressBarDragging();
    }
    
    setupProgressBarDragging() {
        if (!this.progressBar) return;
        
        const handle = this.progressBar.querySelector('.youtube-progress-handle');
        if (!handle) return;
        
        let isDragging = false;
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const rect = this.progressBar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            
            this.updateProgressBar(percent);
            
            if (this.player && this.isReady) {
                const duration = this.player.getDuration();
                this.player.seekTo(duration * percent);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    createPlayer() {
        if (!youtubeManager.apiReady) {
            setTimeout(() => this.createPlayer(), 100);
            return;
        }
        
        const playerContainer = document.getElementById(this.containerId + '-player');
        if (!playerContainer) return;
        
        this.player = youtubeManager.createPlayer(playerContainer.id, this.videoId, {
            ...this.options,
            onReady: (player) => {
                this.isReady = true;
                this.onPlayerReady(player);
            },
            onStateChange: (player, state) => {
                this.onPlayerStateChange(player, state);
            }
        });
    }
    
    onPlayerReady(player) {
        // Update controls
        this.updateTimeDisplay();
        this.updateVolumeDisplay();
        
        // Start progress updates
        this.startProgressUpdates();
        
        // Custom ready callback
        if (this.options.onReady) {
            this.options.onReady(player);
        }
    }
    
    onPlayerStateChange(player, state) {
        // Update controls based on state
        this.updateControlsState(state);
        
        // Custom state change callback
        if (this.options.onStateChange) {
            this.options.onStateChange(player, state);
        }
    }
    
    updateControlsState(state) {
        if (!this.controls) return;
        
        const playBtn = this.controls.querySelector('.youtube-play-btn');
        const pauseBtn = this.controls.querySelector('.youtube-pause-btn');
        
        if (state === YT.PlayerState.PLAYING) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        } else {
            playBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }
    
    startProgressUpdates() {
        setInterval(() => {
            if (this.player && this.isReady) {
                this.updateTimeDisplay();
                this.updateProgressDisplay();
            }
        }, 1000);
    }
    
    updateTimeDisplay() {
        if (!this.controls || !this.player) return;
        
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        
        const currentTimeEl = this.controls.querySelector('.youtube-current-time');
        const totalTimeEl = this.controls.querySelector('.youtube-total-time');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(currentTime);
        }
        
        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(duration);
        }
    }
    
    updateProgressDisplay() {
        if (!this.progressBar || !this.player) return;
        
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        const loadedPercent = this.player.getVideoLoadedFraction();
        
        const playedPercent = duration > 0 ? currentTime / duration : 0;
        
        this.updateProgressBar(playedPercent, loadedPercent);
    }
    
    updateProgressBar(playedPercent, loadedPercent = 0) {
        if (!this.progressBar) return;
        
        const playedBar = this.progressBar.querySelector('.youtube-progress-played');
        const loadedBar = this.progressBar.querySelector('.youtube-progress-loaded');
        const handle = this.progressBar.querySelector('.youtube-progress-handle');
        
        if (playedBar) {
            playedBar.style.width = (playedPercent * 100) + '%';
        }
        
        if (loadedBar) {
            loadedBar.style.width = (loadedPercent * 100) + '%';
        }
        
        if (handle) {
            handle.style.left = (playedPercent * 100) + '%';
        }
    }
    
    updateVolumeDisplay() {
        if (!this.controls || !this.player) return;
        
        const volume = this.player.getVolume();
        const isMuted = this.player.isMuted();
        
        const volumeBtn = this.controls.querySelector('.youtube-volume-btn');
        const volumeSlider = this.controls.querySelector('.youtube-volume-range');
        
        if (volumeBtn) {
            const icon = volumeBtn.querySelector('i');
            if (icon) {
                icon.className = isMuted || volume === 0 ? 'fas fa-volume-mute' : 
                               volume < 50 ? 'fas fa-volume-down' : 'fas fa-volume-up';
            }
        }
        
        if (volumeSlider) {
            volumeSlider.value = isMuted ? 0 : volume;
        }
    }
    
    handleProgressClick(e) {
        if (!this.player || !this.isReady) return;
        
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const duration = this.player.getDuration();
        
        this.player.seekTo(duration * percent);
    }
    
    showQualityMenu() {
        const availableQualities = this.player.getAvailableQualityLevels();
        const currentQuality = this.player.getPlaybackQuality();
        
        const menu = document.createElement('div');
        menu.className = 'youtube-quality-menu';
        
        availableQualities.forEach(quality => {
            const item = document.createElement('div');
            item.className = 'youtube-quality-item';
            item.classList.toggle('active', quality === currentQuality);
            item.textContent = this.getQualityLabel(quality);
            
            item.addEventListener('click', () => {
                this.player.setPlaybackQuality(quality);
                menu.remove();
            });
            
            menu.appendChild(item);
        });
        
        // Position menu
        const qualityBtn = this.controls.querySelector('.youtube-quality-btn');
        const rect = qualityBtn.getBoundingClientRect();
        
        menu.style.position = 'absolute';
        menu.style.bottom = '50px';
        menu.style.right = '10px';
        
        this.controls.appendChild(menu);
        
        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }
    
    getQualityLabel(quality) {
        const labels = {
            'small': '240p',
            'medium': '360p',
            'large': '480p',
            'hd720': '720p',
            'hd1080': '1080p',
            'highres': '1440p+',
            'auto': 'Auto'
        };
        
        return labels[quality] || quality;
    }
    
    toggleFullscreen() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        if (!document.fullscreenElement) {
            container.requestFullscreen?.() || 
            container.webkitRequestFullscreen?.() || 
            container.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || 
            document.webkitExitFullscreen?.() || 
            document.msExitFullscreen?.();
        }
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Public API methods
    play() {
        if (this.player && this.isReady) {
            this.player.playVideo();
        }
    }
    
    pause() {
        if (this.player && this.isReady) {
            this.player.pauseVideo();
        }
    }
    
    stop() {
        if (this.player && this.isReady) {
            this.player.stopVideo();
        }
    }
    
    setVolume(volume) {
        if (this.player && this.isReady) {
            this.player.setVolume(Math.max(0, Math.min(100, volume)));
            this.updateVolumeDisplay();
        }
    }
    
    toggleMute() {
        if (this.player && this.isReady) {
            if (this.player.isMuted()) {
                this.player.unMute();
            } else {
                this.player.mute();
            }
            this.updateVolumeDisplay();
        }
    }
    
    seekTo(seconds) {
        if (this.player && this.isReady) {
            this.player.seekTo(seconds);
        }
    }
    
    destroy() {
        if (this.player) {
            this.player.destroy();
        }
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// ===== YOUTUBE GALLERY COMPONENT =====
class YouTubeGalleryComponent {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            layout: 'grid', // 'grid', 'list', 'carousel'
            itemsPerRow: 3,
            showInfo: true,
            showThumbnails: true,
            autoplay: false,
            lazyLoad: true,
            filterEnabled: true,
            searchEnabled: true,
            ...options
        };
        
        this.videos = [];
        this.filteredVideos = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        
        this.init();
    }
    
    async init() {
        await this.loadVideos();
        this.createGalleryStructure();
        this.setupEventListeners();
        this.renderVideos();
    }
    
    async loadVideos() {
        try {
            if (this.options.channelId) {
                const response = await youtubeManager.getChannelVideos(
                    this.options.channelId, 
                    this.options.maxResults || 50
                );
                this.videos = response.items;
            } else if (this.options.playlistId) {
                const response = await youtubeManager.getPlaylistData(this.options.playlistId);
                this.videos = response.items;
            } else if (this.options.videoIds) {
                // Load specific videos
                this.videos = await this.loadVideosByIds(this.options.videoIds);
            }
            
            this.filteredVideos = [...this.videos];
            
        } catch (error) {
            console.error('Failed to load videos:', error);
            this.showError('Failed to load videos. Please try again later.');
        }
    }
    
    async loadVideosByIds(videoIds) {
        const videos = [];
        
        for (const videoId of videoIds) {
            try {
                const videoData = await this.getVideoData(videoId);
                videos.push(videoData);
            } catch (error) {
                console.warn(`Failed to load video ${videoId}:`, error);
            }
        }
        
        return videos;
    }
    
    async getVideoData(videoId) {
        const cacheKey = `video_${videoId}`;
        const cached = youtubeManager.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < YOUTUBE_CONFIG.performance.cacheDuration) {
            return cached.data;
        }
        
        const url = `${YOUTUBE_CONFIG.api.baseUrl}/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_CONFIG.api.key}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch video data: ${response.statusText}`);
        }
        
        const data = await response.json();
        const videoData = data.items[0];
        
        youtubeManager.cache.set(cacheKey, {
            data: videoData,
            timestamp: Date.now()
        });
        
        return videoData;
    }
    
    createGalleryStructure() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.classList.add('youtube-gallery-component');
        
        const structure = `
            <div class="youtube-gallery-header">
                ${this.options.searchEnabled ? `
                    <div class="youtube-gallery-search">
                        <input type="text" placeholder="Search videos..." class="youtube-search-input">
                        <button class="youtube-search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                ` : ''}
                
                ${this.options.filterEnabled ? `
                    <div class="youtube-gallery-filters">
                        <button class="youtube-filter-btn active" data-filter="all">All</button>
                        <button class="youtube-filter-btn" data-filter="recent">Recent</button>
                        <button class="youtube-filter-btn" data-filter="popular">Popular</button>
                    </div>
                ` : ''}
                
                <div class="youtube-gallery-controls">
                    <button class="youtube-layout-btn" data-layout="grid" title="Grid View">
                        <i class="fas fa-th"></i>
                    </button>
                    <button class="youtube-layout-btn" data-layout="list" title="List View">
                        <i class="fas fa-list"></i>
                    </button>
                    <button class="youtube-layout-btn" data-layout="carousel" title="Carousel View">
                        <i class="fas fa-images"></i>
                    </button>
                </div>
            </div>
            
            <div class="youtube-gallery-content">
                <div class="youtube-gallery-grid" data-layout="${this.options.layout}">
                    <!-- Videos will be rendered here -->
                </div>
            </div>
            
            <div class="youtube-gallery-pagination">
                <!-- Pagination will be rendered here -->
            </div>
        `;
        
        container.innerHTML = structure;
    }
    
    setupEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Search functionality
        const searchInput = container.querySelector('.youtube-search-input');
        const searchBtn = container.querySelector('.youtube-search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.handleSearch(e.target.value);
            }, 300));
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
        }
        
        // Filter functionality
        const filterBtns = container.querySelectorAll('.youtube-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Layout switching
        const layoutBtns = container.querySelectorAll('.youtube-layout-btn');
        layoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeLayout(e.target.dataset.layout);
            });
        });
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.filteredVideos = [...this.videos];
        } else {
            this.filteredVideos = this.videos.filter(video => {
                const title = video.snippet.title.toLowerCase();
                const description = video.snippet.description.toLowerCase();
                const searchTerm = query.toLowerCase();
                
                return title.includes(searchTerm) || description.includes(searchTerm);
            });
        }
        
        this.currentPage = 1;
        this.renderVideos();
    }
    
    handleFilter(filter) {
        this.currentFilter = filter;
        
        switch (filter) {
            case 'recent':
                this.filteredVideos = [...this.videos].sort((a, b) => {
                    return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
                });
                break;
            case 'popular':
                this.filteredVideos = [...this.videos].sort((a, b) => {
                    const viewsA = parseInt(a.statistics?.viewCount || 0);
                    const viewsB = parseInt(b.statistics?.viewCount || 0);
                    return viewsB - viewsA;
                });
                break;
            default:
                this.filteredVideos = [...this.videos];
        }
        
        this.currentPage = 1;
        this.renderVideos();
    }
    
    changeLayout(layout) {
        this.options.layout = layout;
        
        const grid = document.querySelector(`#${this.containerId} .youtube-gallery-grid`);
        if (grid) {
            grid.setAttribute('data-layout', layout);
        }
        
        // Update layout buttons
        const layoutBtns = document.querySelectorAll(`#${this.containerId} .youtube-layout-btn`);
        layoutBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === layout);
        });
    }
    
    renderVideos() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const grid = container.querySelector('.youtube-gallery-grid');
        if (!grid) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageVideos = this.filteredVideos.slice(startIndex, endIndex);
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Render videos
        pageVideos.forEach(video => {
            const videoElement = this.createVideoElement(video);
            grid.appendChild(videoElement);
        });
        
        // Render pagination
        this.renderPagination();
        
        // Setup lazy loading
        if (this.options.lazyLoad) {
            this.setupLazyLoading();
        }
    }
    
    createVideoElement(video) {
        const videoId = video.id?.videoId || video.snippet?.resourceId?.videoId || video.id;
        const snippet = video.snippet;
        const statistics = video.statistics;
        
        const element = document.createElement('div');
        element.className = 'youtube-gallery-item';
        element.dataset.videoId = videoId;
        
        const thumbnail = snippet.thumbnails.medium || snippet.thumbnails.default;
        const publishedDate = this.formatDate(snippet.publishedAt);
        const viewCount = statistics ? this.formatNumber(statistics.viewCount) : '';
        
        element.innerHTML = `
            <div class="youtube-gallery-thumbnail">
                <img src="${thumbnail.url}" alt="${snippet.title}" ${this.options.lazyLoad ? 'loading="lazy"' : ''}>
                <div class="youtube-gallery-overlay">
                    <button class="youtube-gallery-play-btn" aria-label="Play ${snippet.title}">
                        <i class="fas fa-play"></i>
                    </button>
                    ${statistics ? `<div class="youtube-gallery-duration">${this.formatDuration(statistics.duration)}</div>` : ''}
                </div>
            </div>
            
            ${this.options.showInfo ? `
                <div class="youtube-gallery-info">
                    <h3 class="youtube-gallery-title">${snippet.title}</h3>
                    <p class="youtube-gallery-channel">${snippet.channelTitle}</p>
                    <div class="youtube-gallery-meta">
                        ${viewCount ? `<span class="youtube-gallery-views">${viewCount} views</span>` : ''}
                        <span class="youtube-gallery-date">${publishedDate}</span>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Add click handler
        element.addEventListener('click', () => {
            this.playVideo(videoId, snippet.title);
        });
        
        return element;
    }
    
    playVideo(videoId, title) {
        if (this.options.playInModal) {
            youtubeManager.playVideoInModal(videoId, {
                title: title,
                autoplay: this.options.autoplay
            });
        } else if (this.options.playInPlace) {
            this.playVideoInPlace(videoId, title);
        } else {
            // Open in new tab
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        }
    }
    
    playVideoInPlace(videoId, title) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Create player modal
        const playerModal = document.createElement('div');
        playerModal.className = 'youtube-gallery-player-modal';
        playerModal.innerHTML = `
            <div class="youtube-gallery-player-content">
                <div class="youtube-gallery-player-header">
                    <h3>${title}</h3>
                    <button class="youtube-gallery-player-close" aria-label="Close player">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="youtube-gallery-player-container" id="gallery-player-${Date.now()}"></div>
            </div>
        `;
        
        container.appendChild(playerModal);
        
        // Create player
        const playerId = playerModal.querySelector('.youtube-gallery-player-container').id;
        const player = new YouTubePlayerComponent(playerId, videoId, {
            autoplay: this.options.autoplay,
            customControls: true,
            size: 'large'
        });
        
        // Close functionality
        const closeBtn = playerModal.querySelector('.youtube-gallery-player-close');
        closeBtn.addEventListener('click', () => {
            player.destroy();
            playerModal.remove();
        });
        
        // Close on escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                player.destroy();
                playerModal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
    }
    
    renderPagination() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const pagination = container.querySelector('.youtube-gallery-pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredVideos.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'block';
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="youtube-pagination-btn" data-page="${this.currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="youtube-pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>`;
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="youtube-pagination-btn" data-page="${this.currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }
        
        pagination.innerHTML = paginationHTML;
        
        // Add click handlers
        pagination.querySelectorAll('.youtube-pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderVideos();
                }
            });
        });
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll(`#${this.containerId} img[loading="lazy"]`);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        images.forEach(img => observer.observe(img));
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            return `${Math.ceil(diffDays / 7)} weeks ago`;
        } else if (diffDays < 365) {
            return `${Math.ceil(diffDays / 30)} months ago`;
        } else {
            return `${Math.ceil(diffDays / 365)} years ago`;
        }
    }
    
    formatNumber(num) {
        if (!num) return '0';
        
        const number = parseInt(num);
        
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        } else {
            return number.toString();
        }
    }
    
    formatDuration(duration) {
        // YouTube API returns duration in ISO 8601 format (PT4M13S)
        if (!duration) return '';
        
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return '';
        
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        const seconds = parseInt(match[3]) || 0;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    showError(message) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="youtube-gallery-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Videos</h3>
                <p>${message}</p>
                <button class="youtube-retry-btn" onclick="window.location.reload()">
                    Retry
                </button>
            </div>
        `;
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===== GLOBAL INITIALIZATION =====
let youtubeManager;

// Initialize YouTube Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    youtubeManager = new YouTubeManager();
    
    // Make it globally available
    window.YouTubeManager = youtubeManager;
    window.YouTubePlayerComponent = YouTubePlayerComponent;
    window.YouTubeGalleryComponent = YouTubeGalleryComponent;
    
    // Initialize automatic components
    initializeAutoComponents();
});

function initializeAutoComponents() {
    // Auto-initialize players
    document.querySelectorAll('[data-youtube-auto]').forEach(element => {
        const videoId = element.dataset.youtubeId;
        if (videoId && element.id) {
            const options = parseAutoOptions(element);
            
            if (element.dataset.youtubeComponent === 'player') {
                new YouTubePlayerComponent(element.id, videoId, options);
            } else {
                youtubeManager.createPlayer(element.id, videoId, options);
            }
        }
    });
        // Auto-initialize galleries
    document.querySelectorAll('[data-youtube-gallery]').forEach(element => {
        if (element.id) {
            const options = parseAutoOptions(element);
            new YouTubeGalleryComponent(element.id, options);
        }
    });
}

function parseAutoOptions(element) {
    const options = {};
    
    // Parse data attributes
    Object.keys(element.dataset).forEach(key => {
        if (key.startsWith('youtube')) {
            const optionKey = key.replace('youtube', '').toLowerCase();
            const value = element.dataset[key];
            
            // Convert string values to appropriate types
            if (value === 'true') {
                options[optionKey] = true;
            } else if (value === 'false') {
                options[optionKey] = false;
            } else if (!isNaN(value)) {
                options[optionKey] = parseInt(value);
            } else {
                options[optionKey] = value;
            }
        }
    });
    
    return options;
}

// ===== YOUTUBE LIVESTREAM COMPONENT =====
class YouTubeLiveStreamComponent {
    constructor(containerId, channelId, options = {}) {
        this.containerId = containerId;
        this.channelId = channelId;
        this.options = {
            autoplay: false,
            showChat: true,
            showInfo: true,
            refreshInterval: 60000, // 1 minute
            ...options
        };
        
        this.isLive = false;
        this.liveVideoId = null;
        this.refreshTimer = null;
        this.player = null;
        
        this.init();
    }
    
    async init() {
        try {
            await this.checkLiveStatus();
            this.createInterface();
            this.startRefreshTimer();
        } catch (error) {
            console.error('Failed to initialize livestream:', error);
            this.showError('Failed to load livestream information.');
        }
    }
    
    async checkLiveStatus() {
        try {
            const response = await fetch(
                `${YOUTUBE_CONFIG.api.baseUrl}/search?part=snippet&channelId=${this.channelId}&type=video&eventType=live&key=${YOUTUBE_CONFIG.api.key}`
            );
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                this.isLive = true;
                this.liveVideoId = data.items[0].id.videoId;
                this.liveData = data.items[0];
            } else {
                this.isLive = false;
                this.liveVideoId = null;
            }
            
        } catch (error) {
            console.error('Error checking live status:', error);
            this.isLive = false;
        }
    }
    
    createInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.classList.add('youtube-livestream-component');
        
        if (this.isLive) {
            this.createLiveInterface();
        } else {
            this.createOfflineInterface();
        }
    }
    
    createLiveInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="youtube-livestream-header">
                <div class="youtube-livestream-status">
                    <span class="youtube-live-indicator">
                        <i class="fas fa-circle"></i>
                        LIVE
                    </span>
                    <h2 class="youtube-livestream-title">${this.liveData.snippet.title}</h2>
                </div>
                <div class="youtube-livestream-controls">
                    ${this.options.showChat ? `
                        <button class="youtube-chat-toggle" aria-label="Toggle chat">
                            <i class="fas fa-comments"></i>
                        </button>
                    ` : ''}
                    <button class="youtube-fullscreen-toggle" aria-label="Toggle fullscreen">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            
            <div class="youtube-livestream-content">
                <div class="youtube-livestream-player" id="${this.containerId}-player">
                    <!-- Player will be created here -->
                </div>
                
                ${this.options.showChat ? `
                    <div class="youtube-livestream-chat" id="${this.containerId}-chat">
                        <iframe src="https://www.youtube.com/live_chat?v=${this.liveVideoId}&embed_domain=${window.location.hostname}"
                                frameborder="0">
                        </iframe>
                    </div>
                ` : ''}
            </div>
            
            ${this.options.showInfo ? `
                <div class="youtube-livestream-info">
                    <p class="youtube-livestream-description">${this.liveData.snippet.description}</p>
                    <div class="youtube-livestream-meta">
                        <span class="youtube-livestream-channel">${this.liveData.snippet.channelTitle}</span>
                        <span class="youtube-livestream-date">Started: ${this.formatDate(this.liveData.snippet.publishedAt)}</span>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Create the player
        this.createPlayer();
        
        // Setup event listeners
        this.setupLiveEventListeners();
    }
    
    createOfflineInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="youtube-livestream-offline">
                <div class="youtube-offline-status">
                    <i class="fas fa-video-slash"></i>
                    <h3>Currently Offline</h3>
                    <p>No live stream is currently active on this channel.</p>
                </div>
                
                <div class="youtube-offline-actions">
                    <button class="youtube-refresh-btn" onclick="this.refreshLiveStatus()">
                        <i class="fas fa-refresh"></i>
                        Check Again
                    </button>
                    <button class="youtube-subscribe-btn" onclick="this.openChannelPage()">
                        <i class="fas fa-bell"></i>
                        Subscribe for Updates
                    </button>
                </div>
                
                <div class="youtube-offline-schedule">
                    <h4>Upcoming Streams</h4>
                    <div class="youtube-scheduled-streams" id="${this.containerId}-scheduled">
                        <!-- Scheduled streams will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        
        // Load scheduled streams
        this.loadScheduledStreams();
    }
    
    createPlayer() {
        if (!this.liveVideoId) return;
        
        const playerId = `${this.containerId}-player`;
        
        this.player = new YouTubePlayerComponent(playerId, this.liveVideoId, {
            autoplay: this.options.autoplay,
            customControls: true,
            size: 'large',
            onReady: () => {
                console.log('Live stream player ready');
            },
            onError: (player, errorCode) => {
                console.error('Live stream player error:', errorCode);
                this.handlePlayerError(errorCode);
            }
        });
    }
    
    setupLiveEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Chat toggle
        const chatToggle = container.querySelector('.youtube-chat-toggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                this.toggleChat();
            });
        }
        
        // Fullscreen toggle
        const fullscreenToggle = container.querySelector('.youtube-fullscreen-toggle');
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
    }
    
    toggleChat() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const chat = container.querySelector('.youtube-livestream-chat');
        const content = container.querySelector('.youtube-livestream-content');
        
        if (chat && content) {
            const isVisible = chat.style.display !== 'none';
            chat.style.display = isVisible ? 'none' : 'block';
            content.classList.toggle('chat-hidden', isVisible);
        }
    }
    
    toggleFullscreen() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        if (!document.fullscreenElement) {
            container.requestFullscreen?.() || 
            container.webkitRequestFullscreen?.() || 
            container.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || 
            document.webkitExitFullscreen?.() || 
            document.msExitFullscreen?.();
        }
    }
    
    async loadScheduledStreams() {
        try {
            const response = await fetch(
                `${YOUTUBE_CONFIG.api.baseUrl}/search?part=snippet&channelId=${this.channelId}&type=video&eventType=upcoming&key=${YOUTUBE_CONFIG.api.key}`
            );
            
            if (!response.ok) return;
            
            const data = await response.json();
            const scheduledContainer = document.getElementById(`${this.containerId}-scheduled`);
            
            if (!scheduledContainer) return;
            
            if (data.items && data.items.length > 0) {
                scheduledContainer.innerHTML = data.items.map(item => `
                    <div class="youtube-scheduled-item">
                        <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
                        <div class="youtube-scheduled-info">
                            <h5>${item.snippet.title}</h5>
                            <p>Scheduled: ${this.formatDate(item.snippet.publishedAt)}</p>
                        </div>
                    </div>
                `).join('');
            } else {
                scheduledContainer.innerHTML = '<p>No upcoming streams scheduled.</p>';
            }
            
        } catch (error) {
            console.error('Error loading scheduled streams:', error);
        }
    }
    
    startRefreshTimer() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            this.refreshLiveStatus();
        }, this.options.refreshInterval);
    }
    
    async refreshLiveStatus() {
        const wasLive = this.isLive;
        await this.checkLiveStatus();
        
        if (wasLive !== this.isLive) {
            // Status changed, recreate interface
            this.createInterface();
            
            // Dispatch status change event
            const event = new CustomEvent('liveStatusChanged', {
                detail: {
                    isLive: this.isLive,
                    videoId: this.liveVideoId,
                    containerId: this.containerId
                }
            });
            
            document.dispatchEvent(event);
        }
    }
    
    handlePlayerError(errorCode) {
        if (errorCode === 100 || errorCode === 150) {
            // Video unavailable or restricted
            this.showError('This live stream is not available for embedded viewing.');
        } else {
            this.showError('An error occurred while loading the live stream.');
        }
    }
    
    openChannelPage() {
        window.open(`https://www.youtube.com/channel/${this.channelId}`, '_blank');
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    showError(message) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'youtube-livestream-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Stream Error</h3>
            <p>${message}</p>
            <button onclick="this.refreshLiveStatus()" class="youtube-retry-btn">
                Try Again
            </button>
        `;
        
        container.appendChild(errorDiv);
    }
    
    destroy() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        if (this.player) {
            this.player.destroy();
        }
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// ===== YOUTUBE SHORTS COMPONENT =====
class YouTubeShortsComponent {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            channelId: null,
            maxResults: 10,
            autoplay: false,
            showInfo: true,
            vertical: true,
            ...options
        };
        
        this.shorts = [];
        this.currentIndex = 0;
        this.players = new Map();
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadShorts();
            this.createInterface();
            this.setupEventListeners();
            this.setupSwipeGestures();
        } catch (error) {
            console.error('Failed to initialize YouTube Shorts:', error);
            this.showError('Failed to load YouTube Shorts.');
        }
    }
    
    async loadShorts() {
        try {
            let url;
            
            if (this.options.channelId) {
                url = `${YOUTUBE_CONFIG.api.baseUrl}/search?part=snippet&channelId=${this.options.channelId}&type=video&videoDuration=short&maxResults=${this.options.maxResults}&key=${YOUTUBE_CONFIG.api.key}`;
            } else {
                // Search for trending shorts
                url = `${YOUTUBE_CONFIG.api.baseUrl}/search?part=snippet&type=video&videoDuration=short&order=viewCount&maxResults=${this.options.maxResults}&key=${YOUTUBE_CONFIG.api.key}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.shorts = data.items;
            
        } catch (error) {
            console.error('Error loading shorts:', error);
            throw error;
        }
    }
    
    createInterface() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.classList.add('youtube-shorts-component');
        
        container.innerHTML = `
            <div class="youtube-shorts-container">
                <div class="youtube-shorts-viewport">
                    <div class="youtube-shorts-list" id="${this.containerId}-list">
                        ${this.shorts.map((short, index) => this.createShortElement(short, index)).join('')}
                    </div>
                </div>
                
                <div class="youtube-shorts-controls">
                    <button class="youtube-shorts-prev" aria-label="Previous short">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button class="youtube-shorts-next" aria-label="Next short">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="youtube-shorts-indicators">
                    ${this.shorts.map((_, index) => `
                        <span class="youtube-shorts-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Load first short
        this.loadShort(0);
    }
    
    createShortElement(short, index) {
        const videoId = short.id.videoId;
        const snippet = short.snippet;
        
        return `
            <div class="youtube-short-item" data-index="${index}" data-video-id="${videoId}">
                <div class="youtube-short-player" id="${this.containerId}-short-${index}">
                    <!-- Player will be created here -->
                </div>
                
                ${this.options.showInfo ? `
                    <div class="youtube-short-info">
                        <h3 class="youtube-short-title">${snippet.title}</h3>
                        <p class="youtube-short-channel">${snippet.channelTitle}</p>
                        <div class="youtube-short-actions">
                            <button class="youtube-short-like" aria-label="Like">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="youtube-short-share" aria-label="Share">
                                <i class="fas fa-share"></i>
                            </button>
                            <button class="youtube-short-watch" aria-label="Watch on YouTube">
                                <i class="fab fa-youtube"></i>
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    setupEventListeners() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        // Navigation buttons
        const prevBtn = container.querySelector('.youtube-shorts-prev');
        const nextBtn = container.querySelector('.youtube-shorts-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.goToPrevious());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.goToNext());
        }
        
        // Indicators
        const indicators = container.querySelectorAll('.youtube-shorts-indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToShort(index);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (container.contains(document.activeElement)) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.goToPrevious();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.goToNext();
                }
            }
        });
        
        // Action buttons
        container.addEventListener('click', (e) => {
            if (e.target.closest('.youtube-short-like')) {
                this.likeShort(this.currentIndex);
            } else if (e.target.closest('.youtube-short-share')) {
                this.shareShort(this.currentIndex);
            } else if (e.target.closest('.youtube-short-watch')) {
                this.watchOnYouTube(this.currentIndex);
            }
        });
    }
    
    setupSwipeGestures() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        let startY = 0;
        let endY = 0;
        const minSwipeDistance = 50;
        
        container.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            endY = e.changedTouches[0].clientY;
            const swipeDistance = startY - endY;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe up - next short
                    this.goToNext();
                } else {
                    // Swipe down - previous short
                    this.goToPrevious();
                }
            }
        }, { passive: true });
    }
    
    loadShort(index) {
        if (index < 0 || index >= this.shorts.length) return;
        
        const short = this.shorts[index];
        const videoId = short.id.videoId;
        const playerId = `${this.containerId}-short-${index}`;
        
        // Create player if it doesn't exist
        if (!this.players.has(playerId)) {
            const player = new YouTubePlayerComponent(playerId, videoId, {
                autoplay: this.options.autoplay && index === this.currentIndex,
                customControls: false,
                size: 'medium',
                playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    loop: 1,
                    playlist: videoId
                }
            });
            
            this.players.set(playerId, player);
        }
    }
    
    goToShort(index) {
        if (index < 0 || index >= this.shorts.length || index === this.currentIndex) return;
        
        // Pause current short
        this.pauseCurrentShort();
        
        // Update current index
        this.currentIndex = index;
        
        // Load new short
        this.loadShort(index);
        
        // Update UI
        this.updateShortsDisplay();
        this.updateIndicators();
        
        // Auto-play if enabled
        if (this.options.autoplay) {
            setTimeout(() => this.playCurrentShort(), 100);
        }
    }
    
    goToNext() {
        const nextIndex = (this.currentIndex + 1) % this.shorts.length;
        this.goToShort(nextIndex);
    }
    
    goToPrevious() {
        const prevIndex = (this.currentIndex - 1 + this.shorts.length) % this.shorts.length;
        this.goToShort(prevIndex);
    }
    
    updateShortsDisplay() {
        const list = document.getElementById(`${this.containerId}-list`);
        if (!list) return;
        
        const translateY = -this.currentIndex * 100;
        list.style.transform = `translateY(${translateY}%)`;
    }
    
    updateIndicators() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const indicators = container.querySelectorAll('.youtube-shorts-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    playCurrentShort() {
        const playerId = `${this.containerId}-short-${this.currentIndex}`;
        const player = this.players.get(playerId);
        
        if (player) {
            player.play();
        }
    }
    
    pauseCurrentShort() {
        const playerId = `${this.containerId}-short-${this.currentIndex}`;
        const player = this.players.get(playerId);
        
        if (player) {
            player.pause();
        }
    }
    
    likeShort(index) {
        // Implement like functionality
        console.log('Like short:', this.shorts[index].id.videoId);
        
        // You could integrate with YouTube API or your own system
        // For now, just provide visual feedback
        const container = document.getElementById(this.containerId);
        const likeBtn = container.querySelector(`[data-index="${index}"] .youtube-short-like`);
        
        if (likeBtn) {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('i').classList.remove('far');
            likeBtn.querySelector('i').classList.add('fas');
        }
    }
    
    shareShort(index) {
        const short = this.shorts[index];
        const shareUrl = `https://www.youtube.com/watch?v=${short.id.videoId}`;
        
        if (navigator.share) {
            navigator.share({
                title: short.snippet.title,
                text: `Check out this YouTube Short: ${short.snippet.title}`,
                url: shareUrl
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                // Show notification
                if (window.showNotification) {
                    showNotification('Link copied to clipboard!', 'success');
                }
            });
        }
    }
    
    watchOnYouTube(index) {
        const short = this.shorts[index];
        const url = `https://www.youtube.com/watch?v=${short.id.videoId}`;
        window.open(url, '_blank');
    }
    
    showError(message) {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="youtube-shorts-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Shorts</h3>
                <p>${message}</p>
                <button onclick="this.init()" class="youtube-retry-btn">
                    Retry
                </button>
            </div>
        `;
    }
    
    destroy() {
        // Destroy all players
        this.players.forEach(player => {
            player.destroy();
        });
        
        this.players.clear();
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// ===== GLOBAL EXPORTS =====
window.YouTubeManager = YouTubeManager;
window.YouTubePlayerComponent = YouTubePlayerComponent;
window.YouTubeGalleryComponent = YouTubeGalleryComponent;
window.YouTubeLiveStreamComponent = YouTubeLiveStreamComponent;
window.YouTubeShortsComponent = YouTubeShortsComponent;
window.YOUTUBE_CONFIG = YOUTUBE_CONFIG;

// ===== INTEGRATION WITH MAIN WEBSITE =====
if (window.luxuryWebsite) {
    // Register YouTube components
    window.luxuryWebsite.registerComponent('youtube', {
        createPlayer: (containerId, videoId, options) => {
            return youtubeManager.createPlayer(containerId, videoId, options);
        },
        createPlayerComponent: (containerId, videoId, options) => {
            return new YouTubePlayerComponent(containerId, videoId, options);
        },
        createGallery: (containerId, options) => {
            return new YouTubeGalleryComponent(containerId, options);
        },
        createLiveStream: (containerId, channelId, options) => {
            return new YouTubeLiveStreamComponent(containerId, channelId, options);
        },
        createShorts: (containerId, options) => {
            return new YouTubeShortsComponent(containerId, options);
        },
        manager: youtubeManager
    });
}

console.log('🎬 YouTube.js loaded successfully!');
