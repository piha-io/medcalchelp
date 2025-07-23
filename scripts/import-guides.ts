import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import slugify from 'slugify'
import readingTime from 'reading-time'

const prisma = new PrismaClient()

interface FrontMatter {
  title: string
  description: string
  category: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  concepts?: string[]
  prerequisites?: string[]
  learningOutcomes?: string[]
  practiceProblems?: any
  order?: number
  featuredImage?: string
  publishedAt?: string
  isDraft?: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
}

async function importGuides() {
  console.log('🚀 Starting guide import...\n')

  // Get all markdown files from both directories
  const draftFiles = await getMarkdownFiles('guide-content/drafts')
  const publishedFiles = await getMarkdownFiles('guide-content/published')

  const allFiles = [
    ...draftFiles.map(f => ({ path: f, isDraft: true })),
    ...publishedFiles.map(f => ({ path: f, isDraft: false }))
  ]

  if (allFiles.length === 0) {
    console.log('❌ No markdown files found in guide-content/drafts or guide-content/published')
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
  if (!metadata.description) {
    throw new Error('Missing required field: description')
  }
  if (!metadata.category) {
    throw new Error('Missing required field: category')
  }

  // Generate slug from title or filename
  const baseSlug = slugify(metadata.title, { lower: true, strict: true })
  let slug = baseSlug
  let counter = 1

  // Check if guide with this slug already exists
  let existingGuide = await prisma.guide.findUnique({ where: { slug } })
  
  // If it exists and has the same title, update it
  if (existingGuide && existingGuide.title === metadata.title) {
    console.log(`  📝 Updating existing guide: ${slug}`)
    await updateGuide(existingGuide.id, metadata, markdownContent)
    return
  }

  // Otherwise, ensure unique slug
  while (existingGuide) {
    slug = `${baseSlug}-${counter}`
    counter++
    existingGuide = await prisma.guide.findUnique({ where: { slug } })
  }

  // Create new guide
  console.log(`  ✨ Creating new guide: ${slug}`)
  await createGuide(slug, metadata, markdownContent, defaultIsDraft)
}

async function createGuide(slug: string, metadata: FrontMatter, content: string, defaultIsDraft: boolean) {
  // Calculate reading time
  const stats = readingTime(content)
  const readingTimeMinutes = Math.ceil(stats.minutes)

  // Find or create category
  const category = await findOrCreateCategory(metadata.category)

  // Find or create concepts
  const concepts = metadata.concepts ? await findOrCreateConcepts(metadata.concepts) : []

  // Create the guide
  await prisma.guide.create({
    data: {
      slug,
      title: metadata.title,
      description: metadata.description,
      content,
      featuredImage: metadata.featuredImage,
      categoryId: category.id,
      difficulty: metadata.difficulty || 'BEGINNER',
      prerequisites: metadata.prerequisites || [],
      learningOutcomes: metadata.learningOutcomes || [],
      practiceProblems: metadata.practiceProblems || null,
      order: metadata.order || 0,
      concepts: {
        connect: concepts.map(concept => ({ id: concept.id }))
      },
      isPublished: !(metadata.isDraft ?? defaultIsDraft),
      readingTime: readingTimeMinutes,
      metaTitle: metadata.metaTitle || metadata.title,
      metaDescription: metadata.metaDescription || metadata.description,
      metaKeywords: metadata.metaKeywords || []
    }
  })

  console.log(`  ✅ Created successfully!`)
}

async function updateGuide(guideId: string, metadata: FrontMatter, content: string) {
  // Calculate reading time
  const stats = readingTime(content)
  const readingTimeMinutes = Math.ceil(stats.minutes)

  // Find or create category
  const category = await findOrCreateCategory(metadata.category)

  // Find or create concepts
  const concepts = metadata.concepts ? await findOrCreateConcepts(metadata.concepts) : []

  // Update the guide
  await prisma.guide.update({
    where: { id: guideId },
    data: {
      title: metadata.title,
      description: metadata.description,
      content,
      featuredImage: metadata.featuredImage,
      categoryId: category.id,
      difficulty: metadata.difficulty || 'BEGINNER',
      prerequisites: metadata.prerequisites || [],
      learningOutcomes: metadata.learningOutcomes || [],
      practiceProblems: metadata.practiceProblems || null,
      order: metadata.order,
      concepts: {
        set: [], // Clear existing concepts
        connect: concepts.map(concept => ({ id: concept.id }))
      },
      isPublished: !metadata.isDraft,
      readingTime: readingTimeMinutes,
      metaTitle: metadata.metaTitle || metadata.title,
      metaDescription: metadata.metaDescription || metadata.description,
      metaKeywords: metadata.metaKeywords || []
    }
  })

  console.log(`  ✅ Updated successfully!`)
}

async function findOrCreateCategory(name: string) {
  const slug = slugify(name, { lower: true, strict: true })
  
  let category = await prisma.guideCategory.findUnique({ where: { slug } })
  
  if (!category) {
    // Define icons for common categories
    const categoryIcons: Record<string, string> = {
      'dosage': '💊',
      'iv': '💧',
      'conversions': '🔄',
      'pediatric': '👶',
      'critical-care': '🚨',
      'pharmacology': '💉',
      'lab-values': '🧪',
      'nutrition': '🍎'
    }
    
    category = await prisma.guideCategory.create({
      data: { 
        name, 
        slug,
        icon: categoryIcons[slug] || '📚'
      }
    })
    console.log(`  📁 Created new category: ${name}`)
  }
  
  return category
}

async function findOrCreateConcepts(conceptNames: string[]) {
  const concepts = []
  
  for (const name of conceptNames) {
    const slug = slugify(name, { lower: true, strict: true })
    
    let concept = await prisma.guideConcept.findUnique({ where: { slug } })
    
    if (!concept) {
      concept = await prisma.guideConcept.create({
        data: { name, slug }
      })
      console.log(`  💡 Created new concept: ${name}`)
    }
    
    concepts.push(concept)
  }
  
  return concepts
}

// Removed findPrerequisiteGuides function as prerequisites are stored as strings

// Run the import
importGuides()
  .catch(error => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })