import { Link } from '@tanstack/react-router'
import { formatDate } from '../../lib/utils/date'

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage?: string
  publishedAt: string
  readingTime: number
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <article key={post.id} className="group">
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="block"
            >
              {/* Featured Image */}
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-4">
                {post.featuredImage ? (
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              
              {/* Meta */}
              <div className="text-xs text-gray-500">
                <span>{formatDate(new Date(post.publishedAt))}</span>
                <span className="mx-2">•</span>
                <span>{post.readingTime} min read</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}