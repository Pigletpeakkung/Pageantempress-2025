/* ==========================================================================
   SEO AUDIT - PageantEmpress 2025
   Comprehensive SEO analysis and optimization checks
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class SEOAudit {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.suggestions = [];
        this.score = 0;
        this.maxScore = 100;
        this.checkedUrls = new Set();
        this.results = {
            technical: {},
            content: {},
            performance: {},
            accessibility: {},
            mobile: {},
            structured: {}
        };
    }

    /**
     * Run complete SEO audit
     */
    async runAudit(htmlContent, url = '/') {
        console.log(`🔍 Starting SEO audit for: ${url}`);
        
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        // Run all audit checks
        await this.auditTechnicalSEO(document, url);
        await this.auditContentSEO(document, url);
        await this.auditMetaTags(document, url);
        await this.auditStructuredData(document, url);
        await this.auditImages(document, url);
        await this.auditLinks(document, url);
        await this.auditPerformance(document, url);
        await this.auditAccessibility(document, url);
        await this.auditMobile(document, url);
        await this.auditSecurity(document, url);
        
        // Calculate final score
        this.calculateScore();
        
        // Generate report
        return this.generateReport();
    }

    /**
     * Audit technical SEO elements
     */
    async auditTechnicalSEO(document, url) {
        const technical = this.results.technical;
        
        // Check title tag
        const title = document.querySelector('title');
        if (!title) {
            this.addIssue('Missing title tag', 'critical');
        } else {
            const titleText = title.textContent.trim();
            if (titleText.length < 30) {
                this.addWarning('Title tag is too short (< 30 characters)');
            } else if (titleText.length > 60) {
                this.addWarning('Title tag is too long (> 60 characters)');
            }
            technical.title = { text: titleText, length: titleText.length };
        }

        // Check meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            this.addIssue('Missing meta description', 'critical');
        } else {
            const descText = metaDesc.getAttribute('content').trim();
            if (descText.length < 120) {
                this.addWarning('Meta description is too short (< 120 characters)');
            } else if (descText.length > 160) {
                this.addWarning('Meta description is too long (> 160 characters)');
            }
            technical.metaDescription = { text: descText, length: descText.length };
        }

        // Check canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            this.addWarning('Missing canonical URL');
        } else {
            technical.canonical = canonical.getAttribute('href');
        }

        // Check robots meta
        const robots = document.querySelector('meta[name="robots"]');
        technical.robots = robots ? robots.getAttribute('content') : 'Not specified';

        // Check lang attribute
        const htmlLang = document.documentElement.getAttribute('lang');
        if (!htmlLang) {
            this.addWarning('Missing lang attribute on html element');
        } else {
            technical.lang = htmlLang;
        }

        // Check viewport meta
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            this.addIssue('Missing viewport meta tag', 'critical');
        } else {
            technical.viewport = viewport.getAttribute('content');
        }

        // Check charset
        const charset = document.querySelector('meta[charset]');
        if (!charset) {
            this.addWarning('Missing charset declaration');
        } else {
            technical.charset = charset.getAttribute('charset');
        }
    }

    /**
     * Audit content SEO
     */
    async auditContentSEO(document, url) {
        const content = this.results.content;
        
        // Check heading structure
        const headings = {
            h1: document.querySelectorAll('h1'),
            h2: document.querySelectorAll('h2'),
            h3: document.querySelectorAll('h3'),
            h4: document.querySelectorAll('h4'),
            h5: document.querySelectorAll('h5'),
            h6: document.querySelectorAll('h6')
        };

        // Check H1
        if (headings.h1.length === 0) {
            this.addIssue('Missing H1 tag', 'critical');
        } else if (headings.h1.length > 1) {
            this.addWarning('Multiple H1 tags found');
        } else {
            content.h1 = headings.h1[0].textContent.trim();
        }

        // Check heading hierarchy
        let previousLevel = 0;
        Object.keys(headings).forEach(level => {
            const currentLevel = parseInt(level.charAt(1));
            if (headings[level].length > 0 && currentLevel > previousLevel + 1) {
                this.addWarning(`Heading hierarchy skip detected: ${level} appears without proper sequence`);
            }
            if (headings[level].length > 0) {
                previousLevel = currentLevel;
            }
        });

        content.headingStructure = Object.keys(headings).map(level => ({
            level,
            count: headings[level].length,
            headings: Array.from(headings[level]).map(h => h.textContent.trim())
        }));

        // Check word count
        const bodyText = document.body.textContent.trim();
        const wordCount = bodyText.split(/\s+/).length;
        content.wordCount = wordCount;
        
        if (wordCount < 300) {
            this.addWarning('Content is too short (< 300 words)');
        }

        // Check for duplicate content indicators
        const paragraphs = document.querySelectorAll('p');
        const paragraphTexts = Array.from(paragraphs).map(p => p.textContent.trim());
        const duplicates = paragraphTexts.filter((text, index) => 
            paragraphTexts.indexOf(text) !== index && text.length > 50
        );
        
        if (duplicates.length > 0) {
            this.addWarning('Potential duplicate content detected');
        }

        // Check internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        content.internalLinks = internalLinks.length;

        // Check external links
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="pageantempress.com"])');
        content.externalLinks = externalLinks.length;

        // Check for rel="nofollow" on external links
        const externalLinksWithoutNofollow = Array.from(externalLinks).filter(link => 
            !link.getAttribute('rel') || !link.getAttribute('rel').includes('nofollow')
        );
        
        if (externalLinksWithoutNofollow.length > 0) {
            this.addSuggestion('Consider adding rel="nofollow" to external links');
        }
    }

    /**
     * Audit meta tags
     */
    async auditMetaTags(document, url) {
        const metaTags = {};
        
        // Check Open Graph tags
        const ogTags = {
            'og:title': document.querySelector('meta[property="og:title"]'),
            'og:description': document.querySelector('meta[property="og:description"]'),
            'og:image': document.querySelector('meta[property="og:image"]'),
            'og:url': document.querySelector('meta[property="og:url"]'),
            'og:type': document.querySelector('meta[property="og:type"]'),
            'og:site_name': document.querySelector('meta[property="og:site_name"]')
        };

        Object.keys(ogTags).forEach(tag => {
            if (!ogTags[tag]) {
                this.addWarning(`Missing Open Graph tag: ${tag}`);
            } else {
                metaTags[tag] = ogTags[tag].getAttribute('content');
            }
        });

        // Check Twitter Card tags
        const twitterTags = {
            'twitter:card': document.querySelector('meta[property="twitter:card"]'),
            'twitter:title': document.querySelector('meta[property="twitter:title"]'),
            'twitter:description': document.querySelector('meta[property="twitter:description"]'),
            'twitter:image': document.querySelector('meta[property="twitter:image"]'),
            'twitter:site': document.querySelector('meta[property="twitter:site"]')
        };

        Object.keys(twitterTags).forEach(tag => {
            if (!twitterTags[tag]) {
                this.addWarning(`Missing Twitter Card tag: ${tag}`);
            } else {
                metaTags[tag] = twitterTags[tag].getAttribute('content');
            }
        });

        // Check theme color
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            this.addSuggestion('Add theme-color meta tag for better mobile experience');
        } else {
            metaTags.themeColor = themeColor.getAttribute('content');
        }

        this.results.metaTags = metaTags;
    }

    /**
     * Audit structured data
     */
    async auditStructuredData(document, url) {
        const structured = this.results.structured;
        
        // Check JSON-LD scripts
        const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
        structured.jsonLdCount = jsonLdScripts.length;
        
        if (jsonLdScripts.length === 0) {
            this.addWarning('No structured data (JSON-LD) found');
        } else {
            structured.schemas = [];
            jsonLdScripts.forEach((script, index) => {
                try {
                    const data = JSON.parse(script.textContent);
                    structured.schemas.push({
                        type: data['@type'] || 'Unknown',
                        context: data['@context'] || 'Unknown',
                        valid: true
                    });
                } catch (error) {
                    structured.schemas.push({
                        type: 'Invalid',
                        error: error.message,
                        valid: false
                    });
                    this.addIssue(`Invalid JSON-LD structure in script ${index + 1}`, 'medium');
                }
            });
        }

        // Check microdata
        const microdataElements = document.querySelectorAll('[itemscope]');
        structured.microdataCount = microdataElements.length;
        
        if (microdataElements.length > 0) {
            this.addSuggestion('Consider migrating from microdata to JSON-LD for better maintenance');
        }
    }

    /**
     * Audit images
     */
    async auditImages(document, url) {
        const images = document.querySelectorAll('img');
        const imageAudit = {
            total: images.length,
            withoutAlt: 0,
            withEmptyAlt: 0,
            withoutTitle: 0,
            withoutOptimization: 0,
            formats: {}
        };

        images.forEach(img => {
            const alt = img.getAttribute('alt');
            const title = img.getAttribute('title');
            const src = img.getAttribute('src');
            
            // Check alt attribute
            if (!alt) {
                imageAudit.withoutAlt++;
            } else if (alt.trim() === '') {
                imageAudit.withEmptyAlt++;
            }

            // Check title attribute
            if (!title) {
                imageAudit.withoutTitle++;
            }

            // Check image format
            if (src) {
                const extension = src.split('.').pop().toLowerCase();
                imageAudit.formats[extension] = (imageAudit.formats[extension] || 0) + 1;
                
                // Check for modern formats
                if (!['webp', 'avif'].includes(extension)) {
                                        imageAudit.withoutOptimization++;
                }
            }

            // Check lazy loading
            const loading = img.getAttribute('loading');
            if (!loading || loading !== 'lazy') {
                imageAudit.withoutLazyLoading = (imageAudit.withoutLazyLoading || 0) + 1;
            }

            // Check responsive images
            const srcset = img.getAttribute('srcset');
            if (!srcset) {
                imageAudit.withoutSrcset = (imageAudit.withoutSrcset || 0) + 1;
            }
        });

        // Generate warnings
        if (imageAudit.withoutAlt > 0) {
            this.addIssue(`${imageAudit.withoutAlt} images missing alt attributes`, 'critical');
        }

        if (imageAudit.withEmptyAlt > 0) {
            this.addWarning(`${imageAudit.withEmptyAlt} images with empty alt attributes`);
        }

        if (imageAudit.withoutOptimization > 0) {
            this.addSuggestion(`${imageAudit.withoutOptimization} images could use modern formats (WebP, AVIF)`);
        }

        if (imageAudit.withoutLazyLoading > 0) {
            this.addSuggestion(`${imageAudit.withoutLazyLoading} images could benefit from lazy loading`);
        }

        if (imageAudit.withoutSrcset > 0) {
            this.addSuggestion(`${imageAudit.withoutSrcset} images missing responsive srcset attributes`);
        }

        this.results.images = imageAudit;
    }

    /**
     * Audit links
     */
    async auditLinks(document, url) {
        const links = document.querySelectorAll('a');
        const linkAudit = {
            total: links.length,
            internal: 0,
            external: 0,
            withoutText: 0,
            withoutTitle: 0,
            broken: 0,
            nofollow: 0
        };

        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            const title = link.getAttribute('title');
            const rel = link.getAttribute('rel');

            // Check link text
            if (!text || text.length === 0) {
                linkAudit.withoutText++;
            }

            // Check title attribute
            if (!title) {
                linkAudit.withoutTitle++;
            }

            // Check rel attribute
            if (rel && rel.includes('nofollow')) {
                linkAudit.nofollow++;
            }

            // Categorize links
            if (href) {
                if (href.startsWith('http') && !href.includes('pageantempress.com')) {
                    linkAudit.external++;
                } else if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
                    linkAudit.internal++;
                }
            }
        });

        // Generate warnings
        if (linkAudit.withoutText > 0) {
            this.addIssue(`${linkAudit.withoutText} links without descriptive text`, 'medium');
        }

        if (linkAudit.withoutTitle > 0) {
            this.addSuggestion(`${linkAudit.withoutTitle} links could benefit from title attributes`);
        }

        this.results.links = linkAudit;
    }

    /**
     * Audit performance factors
     */
    async auditPerformance(document, url) {
        const performance = this.results.performance;
        
        // Check CSS resources
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        performance.cssFiles = cssLinks.length;
        
                if (cssLinks.length > 3) {
            this.addSuggestion('Consider combining CSS files to reduce HTTP requests');
        }

        // Check JavaScript resources
        const jsScripts = document.querySelectorAll('script[src]');
        performance.jsFiles = jsScripts.length;
        
        if (jsScripts.length > 5) {
            this.addSuggestion('Consider bundling JavaScript files to improve performance');
        }

        // Check for render-blocking resources
        const renderBlockingCSS = document.querySelectorAll('link[rel="stylesheet"]:not([media="print"])');
        const renderBlockingJS = document.querySelectorAll('script[src]:not([async]):not([defer])');
        
        performance.renderBlockingResources = renderBlockingCSS.length + renderBlockingJS.length;
        
        if (performance.renderBlockingResources > 0) {
            this.addWarning(`${performance.renderBlockingResources} render-blocking resources detected`);
        }

        // Check for preload/prefetch hints
        const preloadHints = document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="preconnect"], link[rel="dns-prefetch"]');
        performance.resourceHints = preloadHints.length;
        
        if (preloadHints.length === 0) {
            this.addSuggestion('Add resource hints (preload, prefetch, preconnect) for better performance');
        }

        // Check for service worker
        const serviceWorkerScript = document.querySelector('script:not([src])');
        let hasServiceWorker = false;
        
        if (serviceWorkerScript && serviceWorkerScript.textContent.includes('serviceWorker')) {
            hasServiceWorker = true;
        }
        
        performance.serviceWorker = hasServiceWorker;
        
        if (!hasServiceWorker) {
            this.addSuggestion('Implement service worker for offline functionality and caching');
        }

        // Check for Web Font optimization
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]');
        performance.webFonts = fontLinks.length;
        
        fontLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('display=swap')) {
                this.addSuggestion('Add font-display: swap for better font loading performance');
            }
        });

        // Check for critical CSS
        const inlineStyles = document.querySelectorAll('style');
        performance.inlineStyles = inlineStyles.length;
        
        if (inlineStyles.length === 0) {
            this.addSuggestion('Consider inlining critical CSS for above-the-fold content');
        }
    }

    /**
     * Audit accessibility
     */
    async auditAccessibility(document, url) {
        const accessibility = this.results.accessibility;
        
        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"][class*="skip"], a[href^="#skip"]');
        accessibility.skipLinks = skipLinks.length;
        
        if (skipLinks.length === 0) {
            this.addWarning('Missing skip navigation links for accessibility');
        }

        // Check for ARIA landmarks
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
        const semanticLandmarks = document.querySelectorAll('main, nav, header, footer, aside');
        accessibility.landmarks = landmarks.length + semanticLandmarks.length;
        
        if (accessibility.landmarks === 0) {
            this.addWarning('Missing ARIA landmarks or semantic HTML5 elements');
        }

        // Check for proper heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        accessibility.headingCount = headings.length;
        
        // Check for form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        let unlabeledInputs = 0;
        
        inputs.forEach(input => {
            const id = input.getAttribute('id');
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');
            const label = id ? document.querySelector(`label[for="${id}"]`) : null;
            
            if (!label && !ariaLabel && !ariaLabelledBy) {
                unlabeledInputs++;
            }
        });
        
        accessibility.unlabeledInputs = unlabeledInputs;
        
        if (unlabeledInputs > 0) {
            this.addIssue(`${unlabeledInputs} form inputs without proper labels`, 'critical');
        }

        // Check for focus management
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
        accessibility.focusableElements = focusableElements.length;
        
        // Check for alt text on images
        const images = document.querySelectorAll('img');
        let imagesWithoutAlt = 0;
        
        images.forEach(img => {
            const alt = img.getAttribute('alt');
            if (!alt) {
                imagesWithoutAlt++;
            }
        });
        
        accessibility.imagesWithoutAlt = imagesWithoutAlt;

        // Check contrast (basic check for text color)
        const elementsWithColor = document.querySelectorAll('[style*="color"]');
        accessibility.elementsWithInlineColor = elementsWithColor.length;
        
        if (elementsWithInlineColor > 0) {
            this.addSuggestion('Review color contrast ratios for accessibility compliance');
        }

        // Check for proper button markup
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        let buttonsWithoutText = 0;
        
        buttons.forEach(button => {
            const text = button.textContent.trim();
            const ariaLabel = button.getAttribute('aria-label');
            const title = button.getAttribute('title');
            
            if (!text && !ariaLabel && !title) {
                buttonsWithoutText++;
            }
        });
        
        accessibility.buttonsWithoutText = buttonsWithoutText;
        
        if (buttonsWithoutText > 0) {
            this.addIssue(`${buttonsWithoutText} buttons without accessible text`, 'medium');
        }
    }

    /**
     * Audit mobile optimization
     */
    async auditMobile(document, url) {
        const mobile = this.results.mobile;
        
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            this.addIssue('Missing viewport meta tag for mobile optimization', 'critical');
            mobile.hasViewport = false;
        } else {
            const content = viewport.getAttribute('content');
            mobile.hasViewport = true;
            mobile.viewportContent = content;
            
            if (!content.includes('width=device-width')) {
                this.addWarning('Viewport should include width=device-width');
            }
            
            if (content.includes('user-scalable=no')) {
                this.addWarning('Avoid user-scalable=no for better accessibility');
            }
        }

        // Check for touch-friendly elements
        const touchElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
        mobile.touchElements = touchElements.length;
        
        // Check for mobile-specific optimizations
        const appleMetaTags = document.querySelectorAll('meta[name^="apple-"]');
        mobile.appleMetaTags = appleMetaTags.length;
        
        if (appleMetaTags.length === 0) {
            this.addSuggestion('Add Apple-specific meta tags for better iOS experience');
        }

        // Check for web app manifest
        const manifest = document.querySelector('link[rel="manifest"]');
        mobile.hasManifest = !!manifest;
        
        if (!manifest) {
            this.addSuggestion('Add web app manifest for PWA functionality');
        }

        // Check for app icons
        const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        mobile.hasAppleIcon = !!appleIcon;
        
        if (!appleIcon) {
            this.addSuggestion('Add Apple touch icon for better mobile bookmarking');
        }
    }

    /**
     * Audit security
     */
    async auditSecurity(document, url) {
        const security = this.results.security;
        
        // Check for HTTPS
        const isHTTPS = url.startsWith('https://') || url.startsWith('/');
        security.isHTTPS = isHTTPS;
        
        if (!isHTTPS) {
            this.addIssue('Site should use HTTPS for security', 'critical');
        }

        // Check for mixed content
        const insecureResources = document.querySelectorAll('img[src^="http://"], script[src^="http://"], link[href^="http://"]');
        security.insecureResources = insecureResources.length;
        
        if (insecureResources.length > 0) {
            this.addIssue(`${insecureResources.length} insecure resources detected`, 'medium');
        }

        // Check for external links with target="_blank"
        const externalLinksWithoutRel = document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])');
        security.unsafeExternalLinks = externalLinksWithoutRel.length;
        
        if (externalLinksWithoutRel.length > 0) {
            this.addWarning(`${externalLinksWithoutRel.length} external links missing rel="noopener"`);
        }

        // Check for inline scripts
        const inlineScripts = document.querySelectorAll('script:not([src])');
        security.inlineScripts = inlineScripts.length;
        
        if (inlineScripts.length > 0) {
            this.addSuggestion('Consider moving inline scripts to external files for better CSP');
        }

        // Check for inline styles
        const inlineStyles = document.querySelectorAll('[style]');
        security.inlineStyles = inlineStyles.length;
        
        if (inlineStyles.length > 10) {
            this.addSuggestion('Consider reducing inline styles for better CSP compliance');
        }
    }

    /**
     * Add issue to audit results
     */
    addIssue(message, severity = 'medium') {
        this.issues.push({ message, severity, type: 'issue' });
    }

    /**
     * Add warning to audit results
     */
    addWarning(message) {
        this.warnings.push({ message, type: 'warning' });
    }

    /**
     * Add suggestion to audit results
     */
    addSuggestion(message) {
        this.suggestions.push({ message, type: 'suggestion' });
    }

    /**
     * Calculate SEO score
     */
    calculateScore() {
        let score = 100;
        
        // Deduct points for issues
        this.issues.forEach(issue => {
            switch (issue.severity) {
                case 'critical':
                    score -= 20;
                    break;
                case 'high':
                    score -= 15;
                    break;
                case 'medium':
                    score -= 10;
                    break;
                case 'low':
                    score -= 5;
                    break;
            }
        });

        // Deduct points for warnings
        score -= this.warnings.length * 3;

        // Ensure score doesn't go below 0
        this.score = Math.max(0, score);
    }

    /**
     * Generate comprehensive audit report
     */
    generateReport() {
        const report = {
            overview: {
                score: this.score,
                maxScore: this.maxScore,
                grade: this.getGrade(),
                issues: this.issues.length,
                warnings: this.warnings.length,
                suggestions: this.suggestions.length
            },
            results: this.results,
            issues: this.issues,
            warnings: this.warnings,
            suggestions: this.suggestions,
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    /**
     * Get letter grade based on score
     */
    getGrade() {
        if (this.score >= 90) return 'A';
        if (this.score >= 80) return 'B';
        if (this.score >= 70) return 'C';
        if (this.score >= 60) return 'D';
        return 'F';
    }

    /**
     * Generate prioritized recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // High priority recommendations
        if (this.issues.some(issue => issue.severity === 'critical')) {
            recommendations.push({
                priority: 'high',
                category: 'Critical Issues',
                description: 'Fix critical SEO issues immediately',
                items: this.issues.filter(issue => issue.severity === 'critical')
            });
        }

        // Medium priority recommendations
        if (this.warnings.length > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'SEO Warnings',
                description: 'Address these warnings to improve SEO performance',
                items: this.warnings.slice(0, 5) // Top 5 warnings
            });
        }

        // Low priority recommendations
        if (this.suggestions.length > 0) {
            recommendations.push({
                priority: 'low',
                category: 'Performance Improvements',
                description: 'Implement these suggestions for better optimization',
                items: this.suggestions.slice(0, 5) // Top 5 suggestions
            });
        }

        return recommendations;
    }

    /**
     * Save audit report to file
     */
    saveReport(report, filename = 'seo-audit-report.json') {
        const reportDir = './reports';
        
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        const reportPath = path.join(reportDir, filename);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📊 SEO audit report saved to: ${reportPath}`);
        return reportPath;
    }

    /**
     * Generate HTML report
     */
    generateHTMLReport(report) {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Audit Report - PageantEmpress 2025</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: #d4af37; color: white; padding: 20px; border-radius: 8px; }
        .score { font-size: 48px; font-weight: bold; }
        .grade { font-size: 24px; margin-left: 10px; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .critical { color: #dc3545; }
        .warning { color: #ffc107; }
        .suggestion { color: #28a745; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .progress { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; background: ${report.overview.score >= 80 ? '#28a745' : report.overview.score >= 60 ? '#ffc107' : '#dc3545'}; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SEO Audit Report</h1>
        <div>
            <span class="score">${report.overview.score}</span>
            <span class="grade">Grade: ${report.overview.grade}</span>
        </div>
        <div class="progress">
            <div class="progress-bar" style="width: ${report.overview.score}%"></div>
        </div>
    </div>

    <div class="section">
        <h2>Overview</h2>
        <div class="metric">Issues: <strong class="critical">${report.overview.issues}</strong></div>
        <div class="metric">Warnings: <strong class="warning">${report.overview.warnings}</strong></div>
        <div class="metric">Suggestions: <strong class="suggestion">${report.overview.suggestions}</strong></div>
    </div>

    <div class="section">
        <h2>Technical SEO</h2>
        <table>
            <tr><th>Element</th><th>Status</th><th>Details</th></tr>
            <tr><td>Title</td><td>${report.results.technical.title ? '✅' : '❌'}</td><td>${report.results.technical.title?.text || 'Missing'}</td></tr>
            <tr><td>Meta Description</td><td>${report.results.technical.metaDescription ? '✅' : '❌'}</td><td>${report.results.technical.metaDescription?.text || 'Missing'}</td></tr>
            <tr><td>Canonical URL</td><td>${report.results.technical.canonical ? '✅' : '❌'}</td><td>${report.results.technical.canonical || 'Missing'}</td></tr>
            <tr><td>Robots Meta</td><td>ℹ️</td><td>${report.results.technical.robots}</td></tr>
            <tr><td>Language</td><td>${report.results.technical.lang ? '✅' : '❌'}</td><td>${report.results.technical.lang || 'Missing'}</td></tr>
            <tr><td>Viewport</td><td>${report.results.technical.viewport ? '✅' : '❌'}</td><td>${report.results.technical.viewport || 'Missing'}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Content Analysis</h2>
        <div class="metric">Word Count: <strong>${report.results.content.wordCount}</strong></div>
        <div class="metric">H1 Tags: <strong>${report.results.content.h1 ? '1' : '0'}</strong></div>
        <div class="metric">Internal Links: <strong>${report.results.content.internalLinks}</strong></div>
        <div class="metric">External Links: <strong>${report.results.content.externalLinks}</strong></div>
    </div>

    <div class="section">
        <h2>Images</h2>
        <div class="metric">Total Images: <strong>${report.results.images.total}</strong></div>
        <div class="metric">Missing Alt: <strong class="critical">${report.results.images.withoutAlt}</strong></div>
        <div class="metric">Without Optimization: <strong class="warning">${report.results.images.withoutOptimization}</strong></div>
    </div>

    ${report.issues.length > 0 ? `
    <div class="section">
        <h2>Critical Issues</h2>
        <ul>
            ${report.issues.map(issue => `<li class="critical">${issue.message}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${report.warnings.length > 0 ? `
    <div class="section">
        <h2>Warnings</h2>
        <ul>
            ${report.warnings.map(warning => `<li class="warning">${warning.message}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${report.suggestions.length > 0 ? `
    <div class="section">
        <h2>Suggestions</h2>
        <ul>
            ${report.suggestions.map(suggestion => `<li class="suggestion">${suggestion.message}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="section">
        <h2>Recommendations</h2>
        ${report.recommendations.map(rec => `
            <h3>${rec.category} (${rec.priority} priority)</h3>
            <p>${rec.description}</p>
            <ul>
                ${rec.items.map(item => `<li>${item.message}</li>`).join('')}
            </ul>
        `).join('')}
    </div>

    <div class="section">
        <p><small>Report generated on ${new Date().toLocaleString()}</small></p>
    </div>
</body>
</html>
        `;

        return html;
    }
}

// Export for use in other modules
module.exports = SEOAudit;

// Run if called directly
if (require.main === module) {
    const audit = new SEOAudit();
    
    // Example usage
    const sampleHTML = fs.readFileSync('./index.html', 'utf8');
    audit.runAudit(sampleHTML, '/').then(report => {
        console.log('🎉 SEO Audit completed!');
        console.log(`Score: ${report.overview.score}/100 (Grade: ${report.overview.grade})`);
        console.log(`Issues: ${report.overview.issues}, Warnings: ${report.overview.warnings}, Suggestions: ${report.overview.suggestions}`);
        
        // Save reports
        audit.saveReport(report);
        
        const htmlReport = audit.generateHTMLReport(report);
        fs.writeFileSync('./reports/seo-audit-report.html', htmlReport);
        
        console.log('📊 Reports saved to ./reports/ directory');
    }).catch(error => {
        console.error('❌ SEO Audit failed:', error);
    });
}


