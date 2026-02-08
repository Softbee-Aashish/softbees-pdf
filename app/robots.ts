import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/private/'], // Example exclusions
        },
        sitemap: 'https://softbees.com/sitemap.xml', // Replace with actual domain
    };
}
