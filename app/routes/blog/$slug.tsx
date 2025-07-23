import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { BlogPostContent } from '../../components/blog/BlogPostContent'
import { BlogPostMeta } from '../../components/blog/BlogPostMeta'
import { RelatedPosts } from '../../components/blog/RelatedPosts'
import { BlogSEO } from '../../components/blog/BlogSEO'
import { useAnalytics } from '../../lib/analytics/analytics'
import { useEffect } from 'react'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const { track } = useAnalytics()

  // Fetch blog post
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post not found')
        }
        throw new Error('Failed to fetch post')
      }
      return response.json()
    },
  })

  // Track blog post view
  useEffect(() => {
    if (data?.post) {
      track('blog_post_view', {
        post_id: data.post.id,
        post_slug: data.post.slug,
        post_title: data.post.title,
        category: data.post.category.slug,
        reading_time: data.post.readingTime,
      })
    }
  }, [data, track])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-app py-8 lg:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error.message === 'Post not found' ? 'Post Not Found' : 'Error Loading Post'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error.message === 'Post not found' 
              ? 'The blog post you\'re looking for doesn\'t exist.'
              : 'Something went wrong while loading the post.'}
          </p>
          <a href="/blog" className="btn btn-primary">
            Back to Blog
          </a>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { post, relatedPosts } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogSEO post={post} />
      
      <article className="container-app py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            {/* Category */}
            <div className="mb-4">
              <a
                href={`/blog?category=${post.category.slug}`}
                className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                {post.category.name}
              </a>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <BlogPostMeta post={post} />
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 -mx-4 sm:mx-0">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <BlogPostContent content={post.content} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Tags:</span>
                {post.tags.map((tag: any) => (
                  <a
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </article>
    </div>
  )
}