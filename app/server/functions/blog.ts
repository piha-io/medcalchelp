import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'
import readingTime from 'reading-time'

const prisma = new PrismaClient()

interface GetPostsParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
}

export async function getBlogPosts(params: GetPostsParams) {
  const page = params.page || 1
  const limit = params.limit || 10
  const skip = (page - 1) * limit

  const where: any = {
    isDraft: false,
    publishedAt: {
      lte: new Date(),
    },
  }

  if (params.category) {
    where.category = {
      slug: params.category,
    }
  }

  if (params.tag) {
    where.tags = {
      some: {
        slug: params.tag,
      },
    }
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { excerpt: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        category: true,
        tags: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  return {
    posts,
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

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      isDraft: false,
      publishedAt: {
        lte: new Date(),
      },
    },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!post) {
    return null
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  // Get related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      isDraft: false,
      publishedAt: { lte: new Date() },
      OR: [
        { categoryId: post.categoryId },
        {
          tags: {
            some: {
              id: {
                in: post.tags.map(tag => tag.id),
              },
            },
          },
        },
      ],
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
      readingTime: true,
    },
  })

  return {
    post,
    relatedPosts,
  }
}

export async function getBlogCategories() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              isDraft: false,
              publishedAt: {
                lte: new Date(),
              },
            },
          },
        },
      },
    },
  })

  return categories
}

export async function getBlogTags() {
  const tags = await prisma.blogTag.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              isDraft: false,
              publishedAt: {
                lte: new Date(),
              },
            },
          },
        },
      },
    },
  })

  return tags
}

export async function getRecentPosts(limit = 5) {
  const posts = await prisma.blogPost.findMany({
    where: {
      isDraft: false,
      publishedAt: {
        lte: new Date(),
      },
    },
    take: limit,
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      publishedAt: true,
    },
  })

  return posts
}

export async function getPopularPosts(limit = 5) {
  const posts = await prisma.blogPost.findMany({
    where: {
      isDraft: false,
      publishedAt: {
        lte: new Date(),
      },
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
      publishedAt: true,
    },
  })

  return posts
}

