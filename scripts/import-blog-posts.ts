import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import slugify from 'slugify'
import readingTime from 'reading-time'

const prisma = new PrismaClient()

interface FrontMatter {
  title: string
  excerpt: string
  category: string
  tags?: string[]
  featuredImage?: string
  publishedAt?: string
  isDraft?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
}

async function importBlogPosts() {
  console.log('🚀 Starting blog post import...\n')

  // Get all markdown files from both directories
  const draftFiles = await getMarkdownFiles('blog-posts/drafts')
  const publishedFiles = await getMarkdownFiles('blog-posts/published')

  const allFiles = [
    ...draftFiles.map(f => ({ path: f, isDraft: true })),
    ...publishedFiles.map(f => ({ path: f, isDraft: false }))
  ]

  if (allFiles.length === 0) {
    console.log('❌ No markdown files found in blog-posts/drafts or blog-posts/published')
    return
  }

  console.log(`📁 Found ${allFiles.length} markdown files to process\n`)

  // Process each file
  for (const file of allFiles) {
    try {
      await processMarkdownFile(file.path, file.isDraft)
    } catch (error) {
      console.error(`❌ Error processing ${file.path}:`, error)
    }
  }

  console.log('\n✅ Import completed!')
}

async function getMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(file => path.join(dir, file))
  } catch (error) {
    // Directory might not exist
    return []
  }
}

async function processMarkdownFile(filePath: string, defaultIsDraft: boolean) {
  console.log(`📄 Processing: ${filePath}`)

  // Read file content
  const content = await fs.readFile(filePath, 'utf-8')
  
  // Parse frontmatter and content
  const { data: frontmatter, content: markdownContent } = matter(content)
  const metadata = frontmatter as FrontMatter

  // Validate required fields
  if (!metadata.title) {
    throw new Error('Missing required field: title')
  }
  if (!metadata.excerpt) {
    throw new Error('Missing required field: excerpt')
  }
  if (!metadata.category) {
    throw new Error('Missing required field: category')
  }

  // Generate slug from title or filename
  const baseSlug = slugify(metadata.title, { lower: true, strict: true })
  let slug = baseSlug
  let counter = 1

  // Check if post with this slug already exists
  let existingPost = await prisma.blogPost.findUnique({ where: { slug } })
  
  // If it exists and has the same title, update it
  if (existingPost && existingPost.title === metadata.title) {
    console.log(`  📝 Updating existing post: ${slug}`)
    await updatePost(existingPost.id, metadata, markdownContent)
    return
  }

  // Otherwise, ensure unique slug
  while (existingPost) {
    slug = `${baseSlug}-${counter}`
    counter++
    existingPost = await prisma.blogPost.findUnique({ where: { slug } })
  }

  // Create new post
  console.log(`  ✨ Creating new post: ${slug}`)
  await createPost(slug, metadata, markdownContent, defaultIsDraft)
}

async function createPost(slug: string, metadata: FrontMatter, content: string, defaultIsDraft: boolean) {
  // Calculate reading time
  const stats = readingTime(content)
  const readingTimeMinutes = Math.ceil(stats.minutes)

  // Find or create category
  const category = await findOrCreateCategory(metadata.category)

  // Find or create tags
  const tags = metadata.tags ? await findOrCreateTags(metadata.tags) : []

  // Create the post
  await prisma.blogPost.create({
    data: {
      slug,
      title: metadata.title,
      excerpt: metadata.excerpt,
      content,
      featuredImage: metadata.featuredImage,
      categoryId: category.id,
      tags: {
        connect: tags.map(tag => ({ id: tag.id }))
      },
      isDraft: metadata.isDraft ?? defaultIsDraft,
      publishedAt: metadata.publishedAt 
        ? new Date(metadata.publishedAt) 
        : (!metadata.isDraft && !defaultIsDraft) 
          ? new Date() 
          : null,
      readingTime: readingTimeMinutes,
      metaTitle: metadata.metaTitle || metadata.title,
      metaDescription: metadata.metaDescription || metadata.excerpt,
      metaKeywords: metadata.metaKeywords || []
    }
  })

  console.log(`  ✅ Created successfully!`)
}

async function updatePost(postId: string, metadata: FrontMatter, content: string) {
  // Calculate reading time
  const stats = readingTime(content)
  const readingTimeMinutes = Math.ceil(stats.minutes)

  // Find or create category
  const category = await findOrCreateCategory(metadata.category)

  // Find or create tags
  const tags = metadata.tags ? await findOrCreateTags(metadata.tags) : []

  // Update the post
  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title: metadata.title,
      excerpt: metadata.excerpt,
      content,
      featuredImage: metadata.featuredImage,
      categoryId: category.id,
      tags: {
        set: [], // Clear existing tags
        connect: tags.map(tag => ({ id: tag.id }))
      },
      isDraft: metadata.isDraft,
      publishedAt: metadata.publishedAt 
        ? new Date(metadata.publishedAt) 
        : undefined,
      readingTime: readingTimeMinutes,
      metaTitle: metadata.metaTitle || metadata.title,
      metaDescription: metadata.metaDescription || metadata.excerpt,
      metaKeywords: metadata.metaKeywords || []
    }
  })

  console.log(`  ✅ Updated successfully!`)
}

async function findOrCreateCategory(name: string) {
  const slug = slugify(name, { lower: true, strict: true })
  
  let category = await prisma.blogCategory.findUnique({ where: { slug } })
  
  if (!category) {
    category = await prisma.blogCategory.create({
      data: { name, slug }
    })
    console.log(`  📁 Created new category: ${name}`)
  }
  
  return category
}

async function findOrCreateTags(tagNames: string[]) {
  const tags = []
  
  for (const name of tagNames) {
    const slug = slugify(name, { lower: true, strict: true })
    
    let tag = await prisma.blogTag.findUnique({ where: { slug } })
    
    if (!tag) {
      tag = await prisma.blogTag.create({
        data: { name, slug }
      })
      console.log(`  🏷️  Created new tag: ${name}`)
    }
    
    tags.push(tag)
  }
  
  return tags
}

// Run the import
importBlogPosts()
  .catch(error => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })