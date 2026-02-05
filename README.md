This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Problem Context

This repository demonstrates an issue with Next.js's `robots.ts` metadata file where **non-standard directives are silently ignored** and not propagated to the generated `robots.txt` output.

### The Issue

When using the `robots.ts` file to generate a `robots.txt`, Next.js does not include non-standard properties in the output, even when using `@ts-expect-error` to suppress TypeScript errors.

For example, the following code in `app/robots.ts`:

```typescript
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
```

### Expected Behavior

The `Request-Rate` directive should be included in the generated `robots.txt`:

```
User-Agent: *
Allow: /

User-Agent: SeznamBot
Allow: /
Request-Rate: 10/1m
```

### Actual Behavior

The `Request-Rate` directive is **silently dropped** from the output, resulting in:

```
User-Agent: *
Allow: /

User-Agent: SeznamBot
Allow: /
```

### Why This Matters

The `Request-Rate` directive is used by certain crawlers like [SeznamBot](https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/#request-rate-directive) to control crawl frequency. Without support for non-standard directives, users are forced to create a static `robots.txt` file instead of using the TypeScript version.

### Reproduction Steps

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` or `npm run build`
4. Visit `http://localhost:3000/robots.txt`
5. Observe that the `Request-Rate` directive is missing from the output

### References

- [Seznam Bot Crawl Control Documentation](https://o-seznam.cz/napoveda/vyhledavani/en/crawling-control/#request-rate-directive)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.