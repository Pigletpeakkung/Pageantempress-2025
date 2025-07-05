<?php
function generateSchemaMarkup($type = 'organization', $data = []) {
    $baseUrl = 'https://pageantempress.com';
    
    switch ($type) {
        case 'organization':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Pageant Empress',
                'url' => $baseUrl,
                'logo' => $baseUrl . '/assets/images/logo.png',
                'description' => 'Professional pageant training, beauty coaching, and contest preparation services.',
                'sameAs' => [
                    'https://www.instagram.com/pageantempress',
                    'https://www.youtube.com/pageantempress',
                    'https://www.tiktok.com/@pageantempress',
                    'https://www.facebook.com/pageantempress'
                ],
                'contactPoint' => [
                    '@type' => 'ContactPoint',
                    'telephone' => '+1-555-PAGEANT',
                    'contactType' => 'Customer Service',
                    'availableLanguage' => 'English'
                ],
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressCountry' => 'US'
                ]
            ];
            
        case 'service':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Service',
                'name' => 'Pageant Training & Coaching',
                'description' => 'Professional pageant training services including interview preparation, runway coaching, beauty tips, and contest strategy.',
                'provider' => [
                    '@type' => 'Organization',
                    'name' => 'Pageant Empress',
                    'url' => $baseUrl
                ],
                'serviceType' => 'Beauty & Pageant Training',
                'areaServed' => 'United States',
                'availableChannel' => [
                    '@type' => 'ServiceChannel',
                    'serviceUrl' => $baseUrl . '/services',
                    'serviceSmsNumber' => '+1-555-PAGEANT'
                ]
            ];
            
        case 'person':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Person',
                'name' => $data['name'] ?? 'Pageant Empress Coach',
                'jobTitle' => 'Professional Pageant Coach',
                'worksFor' => [
                    '@type' => 'Organization',
                    'name' => 'Pageant Empress'
                ],
                'url' => $baseUrl . '/about',
                'image' => $baseUrl . '/assets/images/coach-profile.jpg',
                                'description' => 'Expert pageant coach with years of experience in beauty pageant training, interview preparation, and runway coaching.',
                'knowsAbout' => [
                    'Pageant Training',
                    'Beauty Coaching',
                    'Interview Preparation',
                    'Runway Walking',
                    'Beauty Tips',
                    'Fashion Styling'
                ],
                'sameAs' => [
                    'https://www.instagram.com/pageantempress',
                    'https://www.linkedin.com/in/thanattsitts'
                ]
            ];
            
        case 'course':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Course',
                'name' => $data['name'] ?? 'Complete Pageant Training Course',
                'description' => $data['description'] ?? 'Comprehensive pageant training program covering all aspects of beauty pageant preparation.',
                'provider' => [
                    '@type' => 'Organization',
                    'name' => 'Pageant Empress',
                    'url' => $baseUrl
                ],
                'courseCode' => $data['code'] ?? 'PGT-101',
                'educationalLevel' => 'Beginner to Advanced',
                'timeRequired' => $data['duration'] ?? 'P8W',
                'coursePrerequisites' => 'None',
                'offers' => [
                    '@type' => 'Offer',
                    'price' => $data['price'] ?? '299',
                    'priceCurrency' => 'USD',
                    'availability' => 'https://schema.org/InStock',
                    'url' => $baseUrl . '/services'
                ]
            ];
            
        case 'article':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $data['title'],
                'description' => $data['description'],
                'image' => $data['image'],
                'author' => [
                    '@type' => 'Person',
                    'name' => $data['author'] ?? 'Pageant Empress'
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Pageant Empress',
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => $baseUrl . '/assets/images/logo.png'
                    ]
                ],
                'datePublished' => $data['publishDate'],
                'dateModified' => $data['modifyDate'] ?? $data['publishDate'],
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => $data['url']
                ]
            ];
            
        case 'faq':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => array_map(function($faq) {
                    return [
                        '@type' => 'Question',
                        'name' => $faq['question'],
                        'acceptedAnswer' => [
                            '@type' => 'Answer',
                            'text' => $faq['answer']
                        ]
                    ];
                }, $data['faqs'] ?? [])
            ];
            
        case 'review':
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Review',
                'itemReviewed' => [
                    '@type' => 'Service',
                    'name' => 'Pageant Training Services'
                ],
                'reviewRating' => [
                    '@type' => 'Rating',
                    'ratingValue' => $data['rating'] ?? '5',
                    'bestRating' => '5'
                ],
                'author' => [
                    '@type' => 'Person',
                    'name' => $data['reviewer']
                ],
                'reviewBody' => $data['review']
            ];
    }
}
?>
