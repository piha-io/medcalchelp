import { Link } from '@tanstack/react-router'
import { formatDate } from '../../lib/utils/date'
import { DifficultyBadge } from './DifficultyBadge'

interface RelatedGuide {
  id: string
  slug: string
  title: string
  description: string
  featuredImage?: string
  publishedAt: string
  readingTime: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
}

interface RelatedGuidesProps {
  guides: RelatedGuide[]
}

export function RelatedGuides({ guides }: RelatedGuidesProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map(guide => (
          <article key={guide.id} className="group">
            <Link
              to="/guides/$slug"
              params={{ slug: guide.slug }}
              className="block"
            >
              {/* Featured Image */}
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-4 relative">
                {guide.featuredImage ? (
                  <img
                    src={guide.featuredImage}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                
                {/* Difficulty Badge Overlay */}
                <div className="absolute top-2 right-2">
                  <DifficultyBadge difficulty={guide.difficulty} size="sm" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {guide.description}
              </p>
              
              {/* Meta */}
              <div className="text-xs text-gray-500">
                <span>{formatDate(new Date(guide.publishedAt))}</span>
                <span className="mx-2">•</span>
                <span>{guide.readingTime} min read</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}