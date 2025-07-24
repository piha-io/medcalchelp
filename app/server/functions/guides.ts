import { prisma } from '../../lib/prisma'

interface GetGuidesParams {
  page?: number
  limit?: number
  category?: string
  concept?: string
  difficulty?: string
  search?: string
}

export async function getGuides(params: GetGuidesParams) {
  const page = params.page || 1
  const limit = params.limit || 10
  const skip = (page - 1) * limit

  const where: any = {
    isPublished: true,
  }

  if (params.category) {
    where.category = {
      slug: params.category,
    }
  }

  if (params.concept) {
    where.concepts = {
      some: {
        slug: params.concept,
      },
    }
  }

  if (params.difficulty) {
    where.difficulty = params.difficulty
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const [guides, totalCount] = await Promise.all([
    prisma.guide.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        category: true,
        concepts: true,
      },
    }),
    prisma.guide.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    guides,
    pagination: {
      page,
      limit,
      totalPages,
      totalCount,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export async function getGuideBySlug(slug: string) {
  const guide = await prisma.guide.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      category: true,
      concepts: true,
    },
  })

  if (!guide) {
    return null
  }

  // Increment view count
  await prisma.guide.update({
    where: { id: guide.id },
    data: { viewCount: { increment: 1 } },
  })

  // Get prerequisites
  let prerequisites: any[] = []
  if (guide.prerequisites && guide.prerequisites.length > 0) {
    prerequisites = await prisma.guide.findMany({
      where: {
        slug: {
          in: guide.prerequisites,
        },
        isPublished: true,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
      },
    })
  }

  // Get related guides
  const relatedGuides = await prisma.guide.findMany({
    where: {
      id: { not: guide.id },
      isPublished: true,
      OR: [
        { categoryId: guide.categoryId },
        {
          concepts: {
            some: {
              id: {
                in: guide.concepts.map(concept => concept.id),
              },
            },
          },
        },
      ],
    },
    take: 3,
    orderBy: {
      viewCount: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      featuredImage: true,
      readingTime: true,
      difficulty: true,
      viewCount: true,
    },
  })

  // Get next and previous guides in the same category
  const [previousGuide, nextGuide] = await Promise.all([
    prisma.guide.findFirst({
      where: {
        categoryId: guide.categoryId,
        isPublished: true,
        OR: [
          { order: { lt: guide.order } },
          {
            order: guide.order,
            createdAt: { lt: guide.createdAt },
          },
        ],
      },
      orderBy: [
        { order: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
      },
    }),
    prisma.guide.findFirst({
      where: {
        categoryId: guide.categoryId,
        isPublished: true,
        OR: [
          { order: { gt: guide.order } },
          {
            order: guide.order,
            createdAt: { gt: guide.createdAt },
          },
        ],
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
      select: {
        id: true,
        slug: true,
        title: true,
      },
    }),
  ])

  return {
    guide: {
      ...guide,
      prerequisites,
    },
    relatedGuides,
    previousGuide,
    nextGuide,
  }
}

export async function getGuideCategories() {
  const categories = await prisma.guideCategory.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      _count: {
        select: {
          guides: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  })

  return categories
}

export async function getGuideConcepts() {
  const concepts = await prisma.guideConcept.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          guides: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  })

  return concepts
}

export async function getRecentGuides(limit = 5) {
  const guides = await prisma.guide.findMany({
    where: {
      isPublished: true,
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      createdAt: true,
    },
  })

  return guides
}

export async function getPopularGuides(limit = 5) {
  const guides = await prisma.guide.findMany({
    where: {
      isPublished: true,
    },
    take: limit,
    orderBy: {
      viewCount: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      viewCount: true,
    },
  })

  return guides
}