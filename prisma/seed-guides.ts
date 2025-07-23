import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function seedGuides() {
  console.log('🌱 Seeding guides data...')

  // Clear existing guide data
  await prisma.guide.deleteMany()
  await prisma.guideConcept.deleteMany()
  await prisma.guideCategory.deleteMany()
  console.log('🧹 Cleared existing guide data')

  // Create guide categories
  const categories = await Promise.all([
    prisma.guideCategory.create({
      data: {
        name: 'Dosage Calculations',
        slug: 'dosage-calculations',
        description: 'Master fundamental medication dosage calculations',
        icon: 'calculator',
        order: 1,
      },
    }),
    prisma.guideCategory.create({
      data: {
        name: 'IV Therapy Calculations',
        slug: 'iv-therapy-calculations',
        description: 'Learn IV drip rates, infusion times, and flow calculations',
        icon: 'droplet',
        order: 2,
      },
    }),
    prisma.guideCategory.create({
      data: {
        name: 'Unit Conversions',
        slug: 'unit-conversions',
        description: 'Convert between metric, household, and apothecary systems',
        icon: 'refresh',
        order: 3,
      },
    }),
    prisma.guideCategory.create({
      data: {
        name: 'Pediatric Calculations',
        slug: 'pediatric-calculations',
        description: 'Specialized calculations for pediatric patients',
        icon: 'baby',
        order: 4,
      },
    }),
    prisma.guideCategory.create({
      data: {
        name: 'Critical Care Math',
        slug: 'critical-care-math',
        description: 'Advanced calculations for critical care settings',
        icon: 'heart',
        order: 5,
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} guide categories`)

  // Create guide concepts
  const concepts = await Promise.all([
    prisma.guideConcept.create({ data: { name: 'Basic Formula Method', slug: 'basic-formula-method', description: 'D/H × Q formula application' } }),
    prisma.guideConcept.create({ data: { name: 'Dimensional Analysis', slug: 'dimensional-analysis', description: 'Unit factor method for complex conversions' } }),
    prisma.guideConcept.create({ data: { name: 'Ratio and Proportion', slug: 'ratio-proportion', description: 'Cross-multiplication method' } }),
    prisma.guideConcept.create({ data: { name: 'Weight-Based Dosing', slug: 'weight-based-dosing', description: 'Calculations based on patient weight' } }),
    prisma.guideConcept.create({ data: { name: 'BSA Calculations', slug: 'bsa-calculations', description: 'Body Surface Area based dosing' } }),
    prisma.guideConcept.create({ data: { name: 'Drip Rate Formulas', slug: 'drip-rate-formulas', description: 'IV flow rate calculations' } }),
    prisma.guideConcept.create({ data: { name: 'Concentration Calculations', slug: 'concentration-calculations', description: 'Solution strength and dilution' } }),
    prisma.guideConcept.create({ data: { name: 'Insulin Management', slug: 'insulin-management', description: 'Insulin dosing and adjustments' } }),
    prisma.guideConcept.create({ data: { name: 'Heparin Protocols', slug: 'heparin-protocols', description: 'Anticoagulation calculations' } }),
    prisma.guideConcept.create({ data: { name: 'Reconstitution', slug: 'reconstitution', description: 'Powder medication preparation' } }),
  ])

  console.log(`✅ Created ${concepts.length} guide concepts`)

  // Create simplified guides content (avoiding template literal parsing issues)
  const guides = [
    {
      title: 'Mastering the Basic Dosage Formula: D/H × Q',
      slug: 'basic-dosage-formula',
      description: 'Learn the fundamental formula that forms the foundation of all medication calculations',
      content: '# Mastering the Basic Dosage Formula: D/H × Q\n\n## Introduction\n\nThe basic dosage formula is the cornerstone of medication calculations in nursing. This guide will teach you how to master this essential formula and apply it confidently in clinical practice.\n\n## The Formula Explained\n\nThe basic dosage formula is:\n\n**Dose = (Desired ÷ Have) × Quantity**\n\nOr more commonly written as: **D/H × Q**\n\nWhere:\n- **D (Desired)** = The dose ordered by the physician\n- **H (Have)** = The dose available (what\'s on hand)\n- **Q (Quantity)** = The form in which the drug comes (tablets, mL, etc.)\n\n## Step-by-Step Process\n\n### Step 1: Identify the Components\nFirst, extract the key information from the medication order:\n- What dose is ordered? (Desired)\n- What strength is available? (Have)\n- What form does it come in? (Quantity)\n\n### Step 2: Ensure Unit Consistency\n**Critical**: All units must match before calculating!\n- If ordered in mg and available in g, convert first\n- If ordered in mcg and available in mg, convert first\n\n### Step 3: Set Up the Formula\nWrite out: D/H × Q = ?\n\n### Step 4: Calculate\nPerform the division and multiplication\n\n### Step 5: Verify Your Answer\nDoes the answer make clinical sense?\n\n## Example Problems\n\n### Example 1: Tablet Calculation\n**Order**: Amoxicillin 500 mg PO\n**Available**: Amoxicillin 250 mg tablets\n\nSolution:\n- D = 500 mg\n- H = 250 mg\n- Q = 1 tablet\n\nD/H × Q = 500/250 × 1 = 2 tablets\n\n### Example 2: Liquid Medication\n**Order**: Acetaminophen 650 mg PO\n**Available**: Acetaminophen 325 mg/5 mL\n\nSolution:\n- D = 650 mg\n- H = 325 mg\n- Q = 5 mL\n\nD/H × Q = 650/325 × 5 = 2 × 5 = 10 mL\n\n## Summary\n\nThe D/H × Q formula is your foundation for safe medication administration. Master this formula through practice, and you\'ll build confidence in medication calculations. Remember: accuracy saves lives!',
      categoryId: categories[0].id,
      conceptIds: [concepts[0].id, concepts[2].id],
      difficulty: 'BEGINNER',
      readingTime: 12,
      prerequisites: [],
      learningOutcomes: [
        'Apply the D/H × Q formula correctly',
        'Convert units when necessary',
        'Verify calculation accuracy',
        'Recognize common errors'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'Order: Metformin 1000 mg PO. Available: Metformin 500 mg tablets. How many tablets?',
            answer: '2 tablets',
            solution: '1000 mg ÷ 500 mg × 1 tablet = 2 tablets'
          }
        ]
      },
      order: 1,
    },
    {
      title: 'IV Drip Rate Calculations: Complete Guide',
      slug: 'iv-drip-rate-calculations',
      description: 'Master IV flow rates, drip factors, and infusion time calculations',
      content: '# IV Drip Rate Calculations: Complete Guide\n\n## Introduction\n\nIntravenous (IV) therapy is a critical nursing skill. Accurate IV drip rate calculations ensure patients receive medications and fluids at the prescribed rate.\n\n## Understanding IV Equipment\n\n### Drop Factors (gtt/mL)\nDifferent IV tubing delivers different drop sizes:\n\n**Macrodrip tubing:**\n- 10 gtt/mL\n- 15 gtt/mL\n- 20 gtt/mL\n\n**Microdrip tubing:**\n- 60 gtt/mL (always)\n\n## Essential Formulas\n\n### Formula 1: Drops per Minute\n**gtt/min = (Volume in mL × Drop factor) ÷ Time in minutes**\n\n### Formula 2: mL per Hour\n**mL/hr = Total volume in mL ÷ Time in hours**\n\n## Example Calculation\n**Order**: 1000 mL Normal Saline over 8 hours\n**Tubing**: 15 gtt/mL\n\n**Solution**:\n1. Volume = 1000 mL\n2. Time = 8 hours = 480 minutes\n3. Drop factor = 15 gtt/mL\n\ngtt/min = (1000 × 15) ÷ 480 = 31 gtt/min\n\n## Summary\n\nIV drip rate calculations are essential for safe patient care. With practice, these calculations become second nature!',
      categoryId: categories[1].id,
      conceptIds: [concepts[5].id, concepts[0].id],
      difficulty: 'INTERMEDIATE',
      readingTime: 15,
      prerequisites: ['basic-dosage-formula'],
      learningOutcomes: [
        'Calculate IV drip rates in gtt/min',
        'Convert between gtt/min and mL/hr',
        'Determine infusion completion times',
        'Select appropriate drop factors'
      ],
      practiceProblems: {
        problems: [
          {
            question: '500 mL NS over 4 hours with 10 gtt/mL tubing. Calculate gtt/min.',
            answer: '21 gtt/min',
            solution: '(500 mL × 10 gtt/mL) ÷ (4 hr × 60 min/hr) = 21 gtt/min'
          }
        ]
      },
      order: 2,
    },
    {
      title: 'Medical Unit Conversions: Essential Guide',
      slug: 'medical-unit-conversions',
      description: 'Master all unit conversion systems used in healthcare',
      content: '# Medical Unit Conversions: Essential Guide\n\n## Introduction\n\nAccurate unit conversion is crucial for medication safety. This guide covers conversion systems you\'ll encounter in healthcare.\n\n## The Metric System\n\nThe metric system is the primary measurement system in healthcare.\n\n### Weight Conversions (Metric)\n\n**Essential conversions:**\n- 1 kg = 1,000 g\n- 1 g = 1,000 mg\n- 1 mg = 1,000 mcg\n\n### Volume Conversions (Metric)\n\n**Essential conversions:**\n- 1 L = 1,000 mL\n- 1 mL = 1 cc\n\n## Household Measurements\n\n### Volume (Household)\n\n- 1 teaspoon (tsp) = 5 mL\n- 1 tablespoon (tbsp) = 15 mL\n- 1 fluid ounce (fl oz) = 30 mL\n\n### Weight (Household)\n\n- 1 pound (lb) = 454 g\n- 2.2 pounds = 1 kg\n\n## Summary\n\nUnit conversion mastery requires memorizing key conversions, understanding conversion methods, and practicing regularly.',
      categoryId: categories[2].id,
      conceptIds: [concepts[1].id],
      difficulty: 'BEGINNER',
      readingTime: 18,
      prerequisites: [],
      learningOutcomes: [
        'Convert between metric units accurately',
        'Convert between metric and household measurements',
        'Apply dimensional analysis to complex conversions',
        'Recognize and avoid common conversion errors'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'Convert 2.4 g to mg',
            answer: '2,400 mg',
            solution: '2.4 g × 1,000 mg/g = 2,400 mg'
          }
        ]
      },
      order: 3,
    },
  ]

  // Create guides with proper relationships
  for (const guideData of guides) {
    const { conceptIds, categoryId, practiceProblems, ...data } = guideData
    
    await prisma.guide.create({
      data: {
        ...data,
        categoryId,
        isPublished: true,
        viewCount: Math.floor(Math.random() * 1000),
        featuredImage: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800`,
        practiceProblems,
        metaTitle: data.title,
        metaDescription: data.description,
        metaKeywords: ['medical math', 'nursing calculations', 'medication dosing'],
        concepts: {
          connect: conceptIds.map(id => ({ id })),
        },
      },
    })
    
    console.log(`✅ Created guide: ${data.title}`)
  }

  console.log('🎉 Guides seeding completed!')
}

seedGuides()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })