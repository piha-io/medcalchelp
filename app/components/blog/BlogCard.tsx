import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from '../../lib/utils/date'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage?: string
  publishedAt: string
  readingTime: number
  viewCount: number
  category: {
    id: string
    name: string
    slug: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Featured Image */}
      <Link 
        to="/blog/$slug" 
        params={{ slug: post.slug }}
        className="block aspect-[16/9] overflow-hidden bg-gray-100"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-3">
          <Link
            to="/blog"
            search={{ category: post.category.slug }}
            className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-100 transition-colors"
          >
            {post.category.name}
          </Link>
        </div>

        {/* Title */}
        <h2 className="mb-3 flex-1">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.publishedAt))}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{post.viewCount}</span>
          </div>
        </div>
      </div>
    </article>
  )
}