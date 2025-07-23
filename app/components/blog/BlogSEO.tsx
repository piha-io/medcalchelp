import { useEffect } from 'react'

interface BlogSEOProps {
  post: {
    title: string
    excerpt: string
    featuredImage?: string
    publishedAt: string
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
  }
}

export function BlogSEO({ post }: BlogSEOProps) {
  useEffect(() => {
    // Update document title
    const originalTitle = document.title
    document.title = post.metaTitle || `${post.title} | Learn Med Math Blog`

    // Update meta tags
    const metaTags = [
      { name: 'description', content: post.metaDescription || post.excerpt },
      { property: 'og:title', content: post.metaTitle || post.title },
      { property: 'og:description', content: post.metaDescription || post.excerpt },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: post.featuredImage || '/default-blog-image.jpg' },
      { property: 'article:published_time', content: post.publishedAt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: post.metaTitle || post.title },
      { name: 'twitter:description', content: post.metaDescription || post.excerpt },
      { name: 'twitter:image', content: post.featuredImage || '/default-blog-image.jpg' },
    ]

    if (post.metaKeywords && post.metaKeywords.length > 0) {
      metaTags.push({ name: 'keywords', content: post.metaKeywords.join(', ') })
    }

    // Add meta tags to head
    const addedTags: HTMLMetaElement[] = []
    metaTags.forEach(tag => {
      const meta = document.createElement('meta')
      if ('name' in tag && tag.name) {
        meta.name = tag.name
      } else if ('property' in tag && tag.property) {
        meta.setAttribute('property', tag.property)
      }
      meta.content = tag.content || ''
      document.head.appendChild(meta)
      addedTags.push(meta)
    })

    // Add structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage,
      datePublished: post.publishedAt,
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.innerHTML = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Cleanup
    return () => {
      document.title = originalTitle
      addedTags.forEach(tag => tag.remove())
      script.remove()
    }
  }, [post])

  return null
}