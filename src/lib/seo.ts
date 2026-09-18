import { useEffect } from 'react'
import { SITE_NAME, absoluteUrl } from './env'

export interface SeoInput {
  title: string
  description: string
  /** Route path, e.g. "/privacy" — used for canonical + og:url. */
  path: string
  /** Set false on 404 / legal print pages. */
  index?: boolean
  /** Absolute or root-relative OG image override. */
  image?: string
}

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value)
  }
}

/**
 * Per-route document metadata. Keeps <title>, description, canonical and
 * social tags in sync on every client-side navigation.
 */
export function useSeo({ title, description, path, index = true, image }: SeoInput): void {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
    const url = absoluteUrl(path)
    const ogImage = absoluteUrl(image ?? '/og-image.png')

    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: index ? 'index, follow' : 'noindex, nofollow',
    })

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: 'FoodLoop AI — closed-loop food redistribution platform',
    })

    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })
  }, [title, description, path, index, image])
}
