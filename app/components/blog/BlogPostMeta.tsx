import { formatDate } from '../../lib/utils/date'

interface BlogPostMetaProps {
  post: {
    publishedAt: string
    readingTime: number
    viewCount: number
  }
}

export function BlogPostMeta({ post }: BlogPostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-gray-600">

      {/* Date */}
      <time dateTime={post.publishedAt}>
        {formatDate(new Date(post.publishedAt), 'long')}
      </time>

      <span className="text-gray-400">•</span>

      {/* Reading Time */}
      <span>{post.readingTime} min read</span>

      <span className="text-gray-400">•</span>

      {/* View Count */}
      <span>{post.viewCount.toLocaleString()} views</span>
    </div>
  )
}