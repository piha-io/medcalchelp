import { useEffect } from 'react'

interface GuideSEOProps {
  guide: {
    title: string
    description: string
    featuredImage?: string
    publishedAt: string
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    difficulty: string
    learningOutcomes?: string[]
    category: {
      name: string
      slug: string
    }
  }
}

export function GuideSEO({ guide }: GuideSEOProps) {
  useEffect(() => {
    // Update document title
    const originalTitle = document.title
    document.title = guide.metaTitle || `${guide.title} | Medical Math Guides`

    // Update meta tags
    const metaTags = [
      { name: 'description', content: guide.metaDescription || guide.description },
      { property: 'og:title', content: guide.metaTitle || guide.title },
      { property: 'og:description', content: guide.metaDescription || guide.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: guide.featuredImage || '/default-guide-image.jpg' },
      { property: 'article:published_time', content: guide.publishedAt },
      { property: 'article:section', content: guide.category.name },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: guide.metaTitle || guide.title },
      { name: 'twitter:description', content: guide.metaDescription || guide.description },
      { name: 'twitter:image', content: guide.featuredImage || '/default-guide-image.jpg' },
      { name: 'difficulty', content: guide.difficulty },
    ]

    if (guide.metaKeywords && guide.metaKeywords.length > 0) {
      metaTags.push({ name: 'keywords', content: guide.metaKeywords.join(', ') })
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

    // Add structured data for educational content
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: guide.title,
      description: guide.description,
      image: guide.featuredImage,
      datePublished: guide.publishedAt,
      educationalLevel: guide.difficulty,
      ...(guide.learningOutcomes && guide.learningOutcomes.length > 0 && {
        step: guide.learningOutcomes.map((outcome, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: outcome,
        })),
      }),
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
  }, [guide])

  return null
}