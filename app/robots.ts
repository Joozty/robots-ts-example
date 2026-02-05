import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const rules: MetadataRoute.Robots['rules'] = [
        {
            allow: '/',
            userAgent: '*',
        },
        {
            'allow': '/',
            // See: https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/#request-rate-directive
            // @ts-expect-error not a standard property
            'Request-Rate': '10/1m', // ~10k requests/day
            'userAgent': 'SeznamBot',
        },
    ]

    return {
        rules,
    }
}
