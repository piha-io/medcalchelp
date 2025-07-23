import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function seedBlog() {
  console.log('🌱 Seeding blog data...')

  // Clear existing blog data
  await prisma.blogPost.deleteMany()
  await prisma.blogTag.deleteMany()
  await prisma.blogCategory.deleteMany()
  console.log('🧹 Cleared existing blog data')

  // Create categories
  const categories = await Promise.all([
    prisma.blogCategory.create({
      data: {
        name: 'Dosage Calculations',
        slug: 'dosage-calculations',
        description: 'Master the fundamentals of medication dosage calculations',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'IV Therapy',
        slug: 'iv-therapy',
        description: 'Everything about intravenous medication administration',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Unit Conversions',
        slug: 'unit-conversions',
        description: 'Learn to convert between different measurement units',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Study Tips',
        slug: 'study-tips',
        description: 'Effective strategies for mastering medical math',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Clinical Practice',
        slug: 'clinical-practice',
        description: 'Real-world applications and case studies',
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} blog categories`)

  // Create tags
  const tags = await Promise.all([
    prisma.blogTag.create({ data: { name: 'beginner', slug: 'beginner' } }),
    prisma.blogTag.create({ data: { name: 'advanced', slug: 'advanced' } }),
    prisma.blogTag.create({ data: { name: 'tips', slug: 'tips' } }),
    prisma.blogTag.create({ data: { name: 'pediatric', slug: 'pediatric' } }),
    prisma.blogTag.create({ data: { name: 'critical-care', slug: 'critical-care' } }),
    prisma.blogTag.create({ data: { name: 'nclex', slug: 'nclex' } }),
    prisma.blogTag.create({ data: { name: 'practice', slug: 'practice' } }),
  ])

  console.log(`✅ Created ${tags.length} blog tags`)


  // Create blog posts
  const posts = [
    {
      title: 'Mastering Dosage Calculations: A Complete Guide',
      excerpt: 'Learn the essential formulas and techniques for accurate medication dosage calculations in nursing practice.',
      content: `# Mastering Dosage Calculations: A Complete Guide

Dosage calculations are fundamental to safe nursing practice. This comprehensive guide will walk you through everything you need to know.

## Why Dosage Calculations Matter

Accurate dosage calculations are critical for patient safety. A single calculation error can lead to:
- Medication overdose
- Therapeutic failure
- Patient harm
- Legal consequences

## The Basic Formula

The most fundamental formula in dosage calculations is:

**Dose = (Desired × Volume) / Have**

Where:
- **Desired** = The dose you want to give
- **Have** = The concentration available
- **Volume** = The volume the medication comes in

## Step-by-Step Process

1. **Read the order carefully**
2. **Identify what you have**
3. **Set up your calculation**
4. **Solve and verify**
5. **Double-check your work**

## Common Pitfalls to Avoid

- Misreading decimal points
- Confusing units
- Rushing calculations
- Not double-checking

## Practice Makes Perfect

The key to mastering dosage calculations is consistent practice. Start with simple problems and gradually increase complexity.

Remember: When in doubt, always verify with a colleague or pharmacist.`,
      categoryId: categories[0].id,
      tagIds: [tags[0].id, tags[5].id, tags[6].id],
      featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      readingTime: 8,
    },
    {
      title: '5 Essential Tips for IV Drip Rate Calculations',
      excerpt: 'Master IV drip rate calculations with these proven strategies used by experienced nurses.',
      content: `# 5 Essential Tips for IV Drip Rate Calculations

IV drip rate calculations can be challenging, but these tips will help you master them quickly.

## Tip 1: Know Your Drop Factors

Different IV tubing has different drop factors:
- Macrodrip: 10, 15, or 20 drops/mL
- Microdrip: 60 drops/mL

Always verify the drop factor before calculating!

## Tip 2: Use the Universal Formula

**Drops/min = (Volume in mL × Drop factor) / Time in minutes**

This formula works for all IV calculations.

## Tip 3: Create Mental Shortcuts

For common rates:
- 125 mL/hr with 15 drop factor = ~31 drops/min
- 100 mL/hr with 15 drop factor = 25 drops/min

## Tip 4: Practice with Real Scenarios

Use actual clinical scenarios to practice:
- Post-op hydration
- Antibiotic administration
- Blood transfusions

## Tip 5: Always Double-Check

Use these verification methods:
- Calculate backwards
- Use a different formula
- Have a colleague verify

Remember: Patient safety is always the priority!`,
      categoryId: categories[1].id,
      tagIds: [tags[0].id, tags[2].id],
      featuredImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
      readingTime: 5,
    },
    {
      title: 'Unit Conversions Made Simple: The Nursing Student Guide',
      excerpt: 'Struggling with metric conversions? This guide breaks down everything you need to know.',
      content: `# Unit Conversions Made Simple: The Nursing Student Guide

Unit conversions are essential in healthcare. This guide will make them second nature.

## The Metric System Basics

Remember the order:
- Kilo (1000)
- Hecto (100)
- Deka (10)
- Base unit (1)
- Deci (0.1)
- Centi (0.01)
- Milli (0.001)

## Common Conversions You Must Know

### Weight
- 1 kg = 1000 g
- 1 g = 1000 mg
- 1 mg = 1000 mcg

### Volume
- 1 L = 1000 mL
- 1 mL = 1 cc
- 1 tsp = 5 mL
- 1 tbsp = 15 mL

### Length
- 1 m = 100 cm
- 1 cm = 10 mm
- 1 inch = 2.54 cm

## Conversion Strategies

1. **Dimensional Analysis**: Set up fractions to cancel units
2. **Ratio and Proportion**: Use known relationships
3. **Decimal Movement**: For metric conversions

## Practice Problems

Try converting:
- 2.5 g to mg
- 750 mL to L
- 150 mcg to mg

Answers: 2500 mg, 0.75 L, 0.15 mg`,
      categoryId: categories[2].id,
      tagIds: [tags[0].id, tags[5].id],
      featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      readingTime: 6,
    },
    {
      title: 'How to Study Medical Math Effectively',
      excerpt: 'Evidence-based study techniques that will help you ace your medical math exams.',
      content: `# How to Study Medical Math Effectively

Success in medical math requires the right study strategies. Here's what works.

## Create a Study Schedule

- **Daily Practice**: 30 minutes minimum
- **Weekly Reviews**: 2-hour comprehensive session
- **Mock Exams**: Once per week

## Active Learning Techniques

### 1. Practice Problems
Don't just read—solve problems daily.

### 2. Teach Others
Explaining concepts reinforces your understanding.

### 3. Create Flashcards
Perfect for formulas and conversions.

### 4. Use Real Scenarios
Apply math to clinical situations.

## Memory Techniques

- **Mnemonics**: Create memorable phrases
- **Visual Aids**: Draw diagrams and charts
- **Chunking**: Break complex problems into steps

## Common Study Mistakes

- Cramming before exams
- Only practicing easy problems
- Ignoring weak areas
- Not seeking help when stuck

## Resources for Success

- Practice question banks
- Study groups
- Online calculators (for checking)
- Tutoring services

Remember: Consistency beats intensity every time!`,
      categoryId: categories[3].id,
      tagIds: [tags[2].id, tags[5].id],
      featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      readingTime: 7,
    },
    {
      title: 'Pediatric Dosing: Special Considerations',
      excerpt: 'Understanding the unique challenges and calculations involved in pediatric medication administration.',
      content: `# Pediatric Dosing: Special Considerations

Pediatric patients require special attention when calculating medication doses.

## Why Pediatric Dosing is Different

Children are not small adults. Consider:
- Developing organ systems
- Different metabolism rates
- Weight-based dosing requirements
- Limited margin for error

## Key Calculation Methods

### Weight-Based Dosing
**Formula: Dose = Weight (kg) × Dose per kg**

### Body Surface Area (BSA)
**Formula: Dose = BSA (m²) × Dose per m²**

## Safety Checks

1. **Always verify weight** in kg
2. **Check dosing limits** per age group
3. **Double-check decimal points**
4. **Use appropriate measuring devices**

## Common Medications

- Acetaminophen: 10-15 mg/kg/dose
- Ibuprofen: 5-10 mg/kg/dose
- Amoxicillin: 20-40 mg/kg/day

## Red Flags

Watch for:
- Doses exceeding adult maximum
- Decimal point errors
- Unit confusion (mg vs mL)

Always remember: When in doubt, consult pharmacy or pediatric references.`,
      categoryId: categories[4].id,
      tagIds: [tags[1].id, tags[3].id],
      featuredImage: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800',
      readingTime: 9,
    },
  ]

  // Create blog posts
  for (const postData of posts) {
    const { tagIds, ...data } = postData
    
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug: slugify(data.title, { lower: true, strict: true }),
        isDraft: false,
        publishedAt: new Date(),
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
    })
    
    console.log(`✅ Created post: ${post.title}`)
  }

  console.log('🎉 Blog seeding completed!')
}

seedBlog()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })