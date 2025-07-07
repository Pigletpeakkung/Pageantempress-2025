/* ==========================================================================
   UTILS.JS - PageantEmpress 2025
   Utility Functions and Helper Methods
   ========================================================================== */

/**
 * PageantEmpress Utility Library
 * Comprehensive collection of utility functions for the application
 */
class PageantUtils {
    constructor() {
        this.cache = new Map();
        this.observers = new Map();
        this.debounceTimers = new Map();
        this.throttleLastCall = new Map();
        this.formatters = this.initializeFormatters();
        this.validators = this.initializeValidators();
    }

    // ========================================================================
    // DOM UTILITIES
    // ========================================================================

    /**
     * Safe querySelector with error handling
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (optional)
     * @returns {Element|null} - Found element or null
     */
    $(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (error) {
            console.error('Invalid selector:', selector, error);
            return null;
        }
    }

    /**
     * Safe querySelectorAll with error handling
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (optional)
     * @returns {NodeList} - Found elements
     */
    $$(selector, parent = document) {
        try {
            return parent.querySelectorAll(selector);
        } catch (error) {
            console.error('Invalid selector:', selector, error);
            return [];
        }
    }

    /**
     * Create element with attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string|Element} content - Element content
     * @returns {Element} - Created element
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });

        // Set content
        if (content) {
            if (typeof content === 'string') {
                element.innerHTML = content;
            } else if (content instanceof Element) {
                element.appendChild(content);
            }
        }

        return element;
    }

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @param {number} threshold - Visibility threshold (0-1)
     * @returns {boolean} - Whether element is visible
     */
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
        
        const visibleArea = visibleHeight * visibleWidth;
        const totalArea = rect.height * rect.width;
        
        return visibleArea / totalArea >= threshold;
    }

    /**
     * Smooth scroll to element
     * @param {Element|string} target - Target element or selector
     * @param {Object} options - Scroll options
     */
    smoothScrollTo(target, options = {}) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;

        const defaultOptions = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
            offset: 0
        };

        const scrollOptions = { ...defaultOptions, ...options };
        const elementRect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + elementRect.top - scrollOptions.offset;

        window.scrollTo({
            top: scrollTop,
            behavior: scrollOptions.behavior
        });
    }

    /**
     * Get element's offset position
     * @param {Element} element - Target element
     * @returns {Object} - Position object {top, left}
     */
    getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    }

    // ========================================================================
    // EVENT UTILITIES
    // ========================================================================

    /**
     * Add event listener with automatic cleanup
     * @param {Element} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        
        // Store for cleanup
        if (!element._eventListeners) {
            element._eventListeners = [];
        }
        element._eventListeners.push({ event, handler, options });
    }

    /**
     * Remove all event listeners from element
     * @param {Element} element - Target element
     */
    removeAllEventListeners(element) {
        if (element._eventListeners) {
            element._eventListeners.forEach(({ event, handler, options }) => {
                element.removeEventListener(event, handler, options);
            });
            element._eventListeners = [];
        }
    }

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {string} key - Unique key for the debounced function
     * @returns {Function} - Debounced function
     */
    debounce(func, wait, key = 'default') {
        return (...args) => {
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            const timeout = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, wait);
            
            this.debounceTimers.set(key, timeout);
        };
    }

    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @param {string} key - Unique key for the throttled function
     * @returns {Function} - Throttled function
     */
    throttle(func, limit, key = 'default') {
        return (...args) => {
            const lastCall = this.throttleLastCall.get(key) || 0;
            const now = Date.now();
            
            if (now - lastCall >= limit) {
                this.throttleLastCall.set(key, now);
                func.apply(this, args);
            }
        };
    }

    /**
     * Custom event dispatcher
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail data
     * @param {Element} target - Target element
     */
    dispatchEvent(eventName, detail = {}, target = document) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        target.dispatchEvent(event);
    }

    // ========================================================================
    // DATA UTILITIES
    // ========================================================================

    /**
     * Deep clone object
     * @param {*} obj - Object to clone
     * @returns {*} - Cloned object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
        return obj;
    }

    /**
     * Deep merge objects
     * @param {Object} target - Target object
     * @param {...Object} sources - Source objects
     * @returns {Object} - Merged object
     */
    deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.deepMerge(target, ...sources);
    }

    /**
     * Check if value is object
     * @param {*} item - Value to check
     * @returns {boolean} - Whether value is object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Generate unique ID
     * @param {string} prefix - ID prefix
     * @returns {string} - Unique ID
     */
    generateId(prefix = 'pageant') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get nested object property safely
     * @param {Object} obj - Source object
     * @param {string} path - Property path (dot notation)
     * @param {*} defaultValue - Default value if property doesn't exist
     * @returns {*} - Property value or default
     */
    getNestedProperty(obj, path, defaultValue = undefined) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : defaultValue;
        }, obj);
    }

    /**
     * Set nested object property
     * @param {Object} obj - Target object
     * @param {string} path - Property path (dot notation)
     * @param {*} value - Value to set
     */
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    // ========================================================================
    // STORAGE UTILITIES
    // ========================================================================

    /**
     * Enhanced localStorage with expiration
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @param {number} expiry - Expiry time in milliseconds
     */
    setStorage(key, value, expiry = null) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.error('Storage error:', error);
        }
    }

    /**
     * Get item from enhanced localStorage
     * @param {string} key - Storage key
     * @returns {*} - Stored value or null
     */
    getStorage(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsed = JSON.parse(item);
            
            // Check expiry
            if (parsed.expiry && Date.now() > parsed.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return parsed.value;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage error:', error);
        }
    }

    /**
     * Clear expired items from storage
     */
    clearExpiredStorage() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                const item = this.getStorage(key);
                // getStorage will automatically remove expired items
            });
        } catch (error) {
            console.error('Storage cleanup error:', error);
        }
    }

    // ========================================================================
    // NETWORK UTILITIES
    // ========================================================================

    /**
     * Enhanced fetch with retry and timeout
     * @param {string} url - Request URL
     * @param {Object} options - Fetch options
     * @returns {Promise} - Fetch promise
     */
    async fetchWithRetry(url, options = {}) {
        const defaultOptions = {
            timeout: 10000,
            retries: 3,
            retryDelay: 1000
        };

        const config = { ...defaultOptions, ...options };
        let lastError;

        for (let i = 0; i <= config.retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);

                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return response;
            } catch (error) {
                lastError = error;
                if (i < config.retries) {
                    await this.delay(config.retryDelay * Math.pow(2, i));
                }
            }
        }

        throw lastError;
    }

    /**
     * Check network connectivity
     * @returns {boolean} - Whether online
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * Get network information
     * @returns {Object} - Network information
     */
    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        return {
            online: navigator.onLine,
            effectiveType: connection?.effectiveType || 'unknown',
            downlink: connection?.downlink || 0,
            rtt: connection?.rtt || 0,
            saveData: connection?.saveData || false
        };
    }

    // ========================================================================
    // DEVICE UTILITIES
    // ========================================================================

    /**
     * Detect device type
     * @returns {string} - Device type (mobile, tablet, desktop)
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    /**
     * Check if device is mobile
     * @returns {boolean} - Whether device is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Check if device is iOS
     * @returns {boolean} - Whether device is iOS
     */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

    /**
     * Check if device is Android
     * @returns {boolean} - Whether device is Android
     */
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    /**
     * Get device capabilities
     * @returns {Object} - Device capabilities
     */
    getDeviceCapabilities() {
        return {
            deviceMemory: navigator.deviceMemory || 4,
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            userAgent: navigator.userAgent
        };
    }

    // ========================================================================
    // PERFORMANCE UTILITIES
    // ========================================================================

    /**
     * Measure function execution time
     * @param {Function} func - Function to measure
     * @param {string} label - Performance label
     * @returns {*} - Function result
     */
    measurePerformance(func, label = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${label} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Delay execution
     * @param {number} ms - Delay in milliseconds
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Request animation frame with fallback
     * @param {Function} callback - Animation callback
     * @returns {number} - Animation frame ID
     */
    requestAnimationFrame(callback) {
        return window.requestAnimationFrame || 
               window.webkitRequestAnimationFrame || 
               window.mozRequestAnimationFrame || 
               function(callback) { setTimeout(callback, 1000 / 60); };
    }

    /**
     * Cancel animation frame
     * @param {number} id - Animation frame ID
     */
    cancelAnimationFrame(id) {
        const cancel = window.cancelAnimationFrame || 
                      window.webkitCancelAnimationFrame || 
                      window.mozCancelAnimationFrame || 
                      clearTimeout;
        cancel(id);
    }

    // ========================================================================
    // VALIDATION UTILITIES
    // ========================================================================

    /**
     * Initialize validators
     * @returns {Object} - Validator functions
     */
    initializeValidators() {
        return {
            email: (value) => {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return pattern.test(value);
            },
            
            phone: (value) => {
                const pattern = /^[\+]?[1-9][\d]{0,15}$/;
                return pattern.test(value.replace(/\s/g, ''));
            },
            
            url: (value) => {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            
            required: (value) => {
                return value !== null && value !== undefined && value.toString().trim() !== '';
            },
            
            minLength: (value, min) => {
                return value && value.length >= min;
            },
            
            maxLength: (value, max) => {
                return value && value.length <= max;
            },
            
            pattern: (value, pattern) => {
                return new RegExp(pattern).test(value);
            },
            
            number: (value) => {
                return !isNaN(value) && isFinite(value);
            },
            
            integer: (value) => {
                return Number.isInteger(Number(value));
            },
            
            positive: (value) => {
                return Number(value) > 0;
            },
            
            range: (value, min, max) => {
                const num = Number(value);
                return num >= min && num <= max;
            }
        };
    }

    /**
     * Validate form data
     * @param {Object} data - Form data
     * @param {Object} rules - Validation rules
     * @returns {Object} - Validation result
     */
    validateForm(data, rules) {
        const errors = {};
        let isValid = true;

        Object.keys(rules).forEach(field => {
            const fieldRules = rules[field];
            const value = data[field];
            const fieldErrors = [];

            fieldRules.forEach(rule => {
                if (typeof rule === 'string') {
                    if (!this.validators[rule](value)) {
                        fieldErrors.push(`${field} ${rule} validation failed`);
                        isValid = false;
                    }
                } else if (typeof rule === 'object') {
                    const { type, ...params } = rule;
                    if (!this.validators[type](value, ...Object.values(params))) {
                        fieldErrors.push(rule.message || `${field} ${type} validation failed`);
                        isValid = false;
                    }
                }
            });

            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        });

        return { isValid, errors };
    }

    // ========================================================================
    // FORMATTING UTILITIES
    // ========================================================================

    /**
     * Initialize formatters
     * @returns {Object} - Formatter functions
     */
    initializeFormatters() {
        return {
            currency: (value, currency = 'USD', locale = 'en-US') => {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currency
                }).format(value);
            },
            
            number: (value, locale = 'en-US') => {
                return new Intl.NumberFormat(locale).format(value);
            },
            
            date: (value, options = {}, locale = 'en-US') => {
                const defaultOptions = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                };
                return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(value));
            },
            
            time: (value, options = {}, locale = 'en-US') => {
                const defaultOptions = {
                    hour: '2-digit',
                    minute: '2-digit'
                };
                return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(value));
            },
            
            relative: (value) => {
                const now = new Date();
                const date = new Date(value);
                const diff = now - date;
                
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes} minutes ago`;
                if (hours < 24) return `${hours} hours ago`;
                if (days < 30) return `${days} days ago`;
                
                return this.formatters.date(value);
            },
            
            fileSize: (bytes) => {
                const units = ['B', 'KB', 'MB', 'GB', 'TB'];
                let size = bytes;
                let unitIndex = 0;
                
                while (size >= 1024 && unitIndex < units.length - 1) {
                    size /= 1024;
                    unitIndex++;
                }
                
                return `${size.toFixed(1)} ${units[unitIndex]}`;
            },
            
            phone: (value) => {
                const cleaned = value.replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    return `(${match[1]}) ${match[2]}-${match[3]}`;
                }
                return value;
            },
            
            truncate: (text, length = 100, suffix = '...') => {
                if (text.length <= length) return text;
                return text.substring(0, length) + suffix;
            },
            
            capitalize: (text) => {
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            },
            
            titleCase: (text) => {
                return text.replace(/\w\S*/g, (txt) => {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            },
            
            camelCase: (text) => {
                return text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
            },
            
            kebabCase: (text) => {
                return text.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
            },
            
            percentage: (value, decimals = 1) => {
                return `${(value * 100).toFixed(decimals)}%`;
            }
        };
    }

    // ========================================================================
    // URL UTILITIES
    // ========================================================================

    /**
     * Parse URL parameters
     * @param {string} url - URL string
     * @returns {Object} - Parsed parameters
     */
    parseUrlParams(url = window.location.href) {
        const params = {};
        const urlObj = new URL(url);
        
        for (const [key, value] of urlObj.searchParams) {
            if (params[key]) {
                if (Array.isArray(params[key])) {
                    params[key].push(value);
                } else {
                    params[key] = [params[key], value];
                }
            } else {
                params[key] = value;
            }
        }
        
        return params;
    }

    /**
     * Build URL with parameters
     * @param {string} baseUrl - Base URL
     * @param {Object} params - Parameters object
     * @returns {string} - Built URL
     */
    buildUrl(baseUrl, params = {}) {
        const url = new URL(baseUrl);
        
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => url.searchParams.append(key, v));
            } else if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            }
        });
        
        return url.toString();
    }

    /**
     * Update URL parameters without reload
     * @param {Object} params - Parameters to update
     * @param {boolean} replace - Whether to replace history state
     */
    updateUrlParams(params, replace = false) {
        const url = new URL(window.location);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
        });
        
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', url);
    }

    // ========================================================================
    // ACCESSIBILITY UTILITIES
    // ========================================================================

    /**
     * Announce to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Announcement priority
     */
    announceToScreenReader(message, priority = 'polite') {
        const announcement = this.createElement('div', {
            'aria-live': priority,
            'aria-atomic': 'true',
            className: 'sr-only'
        });
        
        document.body.appendChild(announcement);
        announcement.textContent = message;
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Trap focus within element
     * @param {Element} element - Container element
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ========================================================================
    // CLEANUP UTILITIES
    // ========================================================================

    /**
     * Cleanup all utilities
     */
    cleanup() {
        // Clear all timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        this.throttleLastCall.clear();
        
        // Disconnect observers
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers.clear();
        
        // Clear cache
        this.cache.clear();
    }

    /**
     * Get utility statistics
     * @returns {Object} - Utility statistics
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            activeTimers: this.debounceTimers.size,
            activeObservers: this.observers.size,
            throttledFunctions: this.throttleLastCall.size
        };
    }
}

// Create global instance
const utils = new PageantUtils();

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
} else if (typeof window !== 'undefined') {
    window.utils = utils;
}

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    utils.cleanup();
});
