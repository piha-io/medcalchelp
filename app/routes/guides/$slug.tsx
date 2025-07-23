import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { GuideContent } from '../../components/guides/GuideContent'
import { GuideNavigation } from '../../components/guides/GuideNavigation'
import { RelatedGuides } from '../../components/guides/RelatedGuides'
import { GuideSEO } from '../../components/guides/GuideSEO'
import { DifficultyBadge } from '../../components/guides/DifficultyBadge'
import { useEffect } from 'react'

export const Route = createFileRoute('/guides/$slug')({
  component: GuidePage,
})

function GuidePage() {
  const { slug } = Route.useParams()

  // Fetch guide
  const { data, isLoading, error } = useQuery({
    queryKey: ['guide', slug],
    queryFn: async () => {
      const response = await fetch(`/api/guides/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Guide not found')
        }
        throw new Error('Failed to fetch guide')
      }
      return response.json()
    },
  })


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
            {error.message === 'Guide not found' ? 'Guide Not Found' : 'Error Loading Guide'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error.message === 'Guide not found' 
              ? 'The guide you\'re looking for doesn\'t exist.'
              : 'Something went wrong while loading the guide.'}
          </p>
          <Link to="/guides" className="btn btn-primary">
            Back to Guides
          </Link>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { guide, relatedGuides, nextGuide, previousGuide } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <GuideSEO guide={guide} />
      
      <div className="bg-white border-b">
        <div className="container-app py-6">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/guides" className="text-gray-600 hover:text-primary-600">
                  Guides
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link 
                  to="/guides" 
                  search={{ category: guide.category.slug }}
                  className="text-gray-600 hover:text-primary-600"
                >
                  {guide.category.name}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{guide.title}</li>
            </ol>
          </nav>

          {/* Guide Header */}
          <header>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                {guide.title}
              </h1>
              <DifficultyBadge difficulty={guide.difficulty} size="lg" />
            </div>

            <p className="text-lg text-gray-600 mb-6">
              {guide.description}
            </p>

            {/* Guide Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{guide.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{guide.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </header>
        </div>
      </div>

      <div className="container-app py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Prerequisites */}
          {guide.prerequisites && guide.prerequisites.length > 0 && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Prerequisites</h3>
              <p className="text-sm text-yellow-800 mb-3">
                We recommend completing these guides first:
              </p>
              <ul className="space-y-2">
                {guide.prerequisites.map((prereq: any) => (
                  <li key={prereq.slug}>
                    <Link
                      to="/guides/$slug"
                      params={{ slug: prereq.slug }}
                      className="text-sm text-yellow-700 hover:text-yellow-900 underline"
                    >
                      {prereq.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Outcomes */}
          {guide.learningOutcomes && guide.learningOutcomes.length > 0 && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">What You'll Learn</h3>
              <ul className="space-y-2">
                {guide.learningOutcomes.map((outcome: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Featured Image */}
          {guide.featuredImage && (
            <div className="mb-8 -mx-4 sm:mx-0">
              <img
                src={guide.featuredImage}
                alt={guide.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <GuideContent content={guide.content} />

          {/* Practice Problems */}
          {guide.practiceProblems && (
            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Practice Problems</h2>
              <p className="text-blue-800 mb-4">
                Test your understanding with these practice problems.
              </p>
              {/* Practice problems component would go here */}
            </div>
          )}

          {/* Concepts */}
          {guide.concepts.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Key concepts:</span>
                {guide.concepts.map((concept: any) => (
                  <Link
                    key={concept.id}
                    to="/guides"
                    search={{ concept: concept.slug }}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {concept.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <GuideNavigation previous={previousGuide} next={nextGuide} />
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <RelatedGuides guides={relatedGuides} />
          </div>
        )}
      </div>
    </div>
  )
}