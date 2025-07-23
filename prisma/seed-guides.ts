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
      content: `# Mastering the Basic Dosage Formula: D/H × Q

## Introduction

The basic dosage formula is the cornerstone of medication calculations in nursing. This guide will teach you how to master this essential formula and apply it confidently in clinical practice.

## The Formula Explained

The basic dosage formula is:

**Dose = (Desired ÷ Have) × Quantity**

Or more commonly written as: **D/H × Q**

Where:
- **D (Desired)** = The dose ordered by the physician
- **H (Have)** = The dose available (what's on hand)  
- **Q (Quantity)** = The form in which the drug comes (tablets, mL, etc.)

## Step-by-Step Process

### Step 1: Identify the Components
First, extract the key information from the medication order:

- What dose is ordered? (Desired)
- What strength is available? (Have)
- What form does it come in? (Quantity)

### Step 2: Ensure Unit Consistency
**Critical**: All units must match before calculating!

- If ordered in mg and available in g, convert first
- If ordered in mcg and available in mg, convert first

### Step 3: Set Up the Formula
Write out: D/H × Q = ?

### Step 4: Calculate
Perform the division and multiplication

### Step 5: Verify Your Answer
Does the answer make clinical sense?

## Example Problems

### Example 1: Tablet Calculation
**Order**: Amoxicillin 500 mg PO  
**Available**: Amoxicillin 250 mg tablets

**Solution:**
- D = 500 mg
- H = 250 mg  
- Q = 1 tablet

**Calculation:** D/H × Q = 500/250 × 1 = 2 tablets

### Example 2: Liquid Medication
**Order**: Acetaminophen 650 mg PO  
**Available**: Acetaminophen 325 mg/5 mL

**Solution:**
- D = 650 mg
- H = 325 mg
- Q = 5 mL

**Calculation:** D/H × Q = 650/325 × 5 = 2 × 5 = 10 mL

## Key Clinical Tips

- **Always double-check**: Especially with high-alert medications
- **When in doubt**: Verify with pharmacy or a colleague
- **Document clearly**: Show your work for verification
- **Use calculators**: But understand the process first

## Summary

The D/H × Q formula is your foundation for safe medication administration. Master this formula through practice, and you'll build confidence in medication calculations. 

**Remember: accuracy saves lives!**`,
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
      content: `# IV Drip Rate Calculations: Complete Guide

## Introduction

Intravenous (IV) therapy is a critical nursing skill. Accurate IV drip rate calculations ensure patients receive medications and fluids at the prescribed rate. This guide covers everything from basic drip rates to complex infusion calculations.

## Understanding IV Equipment

### Drop Factors (gtt/mL)
Different IV tubing delivers different drop sizes:

**Macrodrip tubing:**
- 10 gtt/mL
- 15 gtt/mL  
- 20 gtt/mL

**Microdrip tubing:**
- 60 gtt/mL (always)

**Important Note:** Microdrip (60 gtt/mL) is typically used for:
- Pediatric patients
- Precise medication delivery
- When rate is ≤ 50 mL/hr

## Essential Formulas

### Formula 1: Drops per Minute
\`\`\`
gtt/min = (Volume in mL × Drop factor) ÷ Time in minutes
\`\`\`

### Formula 2: mL per Hour  
\`\`\`
mL/hr = Total volume in mL ÷ Time in hours
\`\`\`

### Formula 3: Infusion Time
\`\`\`
Time (hours) = Total volume (mL) ÷ Rate (mL/hr)
\`\`\`

## Step-by-Step Calculation Process

### For Drops per Minute:

1. **Identify the information:**
   - Total volume to infuse
   - Time for infusion  
   - Drop factor of tubing

2. **Convert time to minutes:**
   - 1 hour = 60 minutes
   - 30 minutes = 0.5 hours

3. **Apply the formula:**
   - Calculate step by step
   - Round appropriately

4. **Verify your answer:**
   - Does it seem reasonable?
   - Double-check math

## Detailed Examples

### Example 1: Basic Drip Rate
**Order**: 1000 mL Normal Saline over 8 hours  
**Tubing**: 15 gtt/mL

**Solution:**
1. Volume = 1000 mL
2. Time = 8 hours = 480 minutes
3. Drop factor = 15 gtt/mL

**Calculation:**  
gtt/min = (1000 × 15) ÷ 480 = 15,000 ÷ 480 = 31.25 ≈ **31 gtt/min**

### Example 2: Microdrip Calculation
**Order**: 250 mL D5W over 3 hours  
**Tubing**: Microdrip (60 gtt/mL)

**Solution:**
1. First find mL/hr: 250 mL ÷ 3 hr = 83.33 mL/hr
2. For microdrip: gtt/min = mL/hr (special property!)
3. Therefore: **83 gtt/min**

## Quick Reference Card

**Microdrip Shortcut:** gtt/min = mL/hr (for 60 gtt/mL only!)

**Time Conversions:**
- 15 min = 0.25 hr
- 30 min = 0.5 hr  
- 45 min = 0.75 hr

**Common Rates:**
- KVO (keep vein open): 10-30 mL/hr
- Maintenance fluids: 75-125 mL/hr
- Rapid resuscitation: Up to 999 mL/hr

## Safety Considerations

1. **Always verify calculations** with another nurse for:
   - High-alert medications
   - Pediatric patients
   - Unusual rates

2. **Document clearly:**
   - Start time
   - Rate
   - Any rate changes

3. **Monitor patients for:**
   - Fluid overload
   - Infiltration  
   - Adverse reactions

## Summary

IV drip rate calculations are essential for safe patient care. Remember to:

- Identify the correct drop factor
- Convert units appropriately  
- Double-check calculations
- Monitor patient response

**With practice, these calculations become second nature!**`,
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
      content: `# Medical Unit Conversions: Essential Guide

## Introduction

Accurate unit conversion is crucial for medication safety. This comprehensive guide covers all conversion systems you'll encounter in healthcare, with practical strategies for quick and accurate conversions.

## The Metric System

The metric system is the primary measurement system in healthcare. It's based on units of 10, making conversions straightforward.

### Metric Prefixes and Their Values

| Prefix | Symbol | Value | Relation to Base |
|--------|--------|-------|------------------|
| kilo | k | 1,000 | 1,000 × base |
| hecto | h | 100 | 100 × base |
| deka | da | 10 | 10 × base |
| **base** | - | 1 | gram, liter, meter |
| deci | d | 0.1 | 1/10 of base |
| centi | c | 0.01 | 1/100 of base |
| milli | m | 0.001 | 1/1000 of base |
| micro | mc/μ | 0.000001 | 1/1,000,000 of base |

### Weight Conversions (Metric)

**Essential conversions:**
- 1 kg = 1,000 g
- 1 g = 1,000 mg  
- 1 mg = 1,000 mcg (or μg)

**Memory trick:** "King Henry Died Monday Drinking Chocolate Milk"  
(Kilo, Hecto, Deka, Meter/Liter/Gram, Deci, Centi, Milli)

### Volume Conversions (Metric)

**Essential conversions:**
- 1 L = 1,000 mL
- 1 mL = 1 cc (cubic centimeter)
- 1 mL = 1 g (for water-based solutions)

## Household Measurements

Common in home healthcare and patient education:

### Volume (Household)

| Household | Metric Equivalent |
|-----------|------------------|
| 1 teaspoon (tsp) | 5 mL |
| 1 tablespoon (tbsp) | 15 mL |
| 1 fluid ounce (fl oz) | 30 mL |
| 1 cup | 240 mL |
| 1 pint (pt) | 480 mL |
| 1 quart (qt) | 960 mL |

### Weight (Household)

| Household | Metric Equivalent |
|-----------|------------------|
| 1 ounce (oz) | 28.35 g |
| 1 pound (lb) | 453.6 g (≈ 454 g) |
| 2.2 pounds | 1 kg |

## Conversion Strategies

### Method 1: Dimensional Analysis

Set up conversions as fractions that cancel units:

**Example:** Convert 2.5 g to mg
\`\`\`
2.5 g × (1000 mg / 1 g) = 2,500 mg
\`\`\`

### Method 2: Decimal Movement

For metric conversions, move decimal point:
- **Larger to smaller unit:** move right
- **Smaller to larger unit:** move left

**Example:** 0.75 g to mg
- mg is 1000× smaller than g  
- Move decimal 3 places right: 750 mg

### Method 3: Ratio and Proportion

Set up equation:
\`\`\`
Known ratio = Unknown ratio
1 g : 1000 mg = 2.5 g : x mg
\`\`\`

## Complex Conversion Examples

### Example 1: Multi-Step Conversion
**Convert:** 2 tablespoons to mg (for liquid medication with 250 mg/5 mL)

**Solution:**
1. Convert tbsp to mL: 2 tbsp × 15 mL/tbsp = 30 mL
2. Set up proportion: 250 mg/5 mL = x mg/30 mL  
3. Solve: x = (250 × 30) ÷ 5 = **1,500 mg**

### Example 2: Weight-Based Dosing  
**Order:** 15 mg/kg for patient weighing 176 lbs

**Solution:**
1. Convert lbs to kg: 176 lbs ÷ 2.2 = 80 kg
2. Calculate dose: 15 mg/kg × 80 kg = 1,200 mg
3. Convert if needed: 1,200 mg = **1.2 g**

## Quick Reference Tables

### Weight Quick Conversions
| From | To | Multiply by |
|------|-----|-------------|
| kg | g | 1,000 |
| g | mg | 1,000 |
| mg | mcg | 1,000 |
| lbs | kg | 0.454 |
| kg | lbs | 2.2 |

### Volume Quick Conversions  
| From | To | Multiply by |
|------|-----|-------------|
| L | mL | 1,000 |
| tsp | mL | 5 |
| tbsp | mL | 15 |
| oz | mL | 30 |

## Common Pitfalls

### 1. Decimal Point Errors
- **Wrong:** 2.5 g = 25 mg
- **Right:** 2.5 g = 2,500 mg

### 2. Using Wrong Conversion Factor
- **Wrong:** 1 kg = 2.2 lbs  
- **Right:** 1 kg = 2.2 lbs (but 1 lb = 0.454 kg)

### 3. Rounding Too Early
Calculate with full precision, round only final answer.

## Clinical Applications

### Medication Dosing
Always verify units match between order and available medication.

### Patient Education  
Convert medical measurements to familiar household units.

### International Patients
Be aware of measurement system differences.

## Summary

Unit conversion mastery requires:

1. **Memorizing key conversions**
2. **Understanding conversion methods**  
3. **Practicing regularly**
4. **Always double-checking work**

**Remember:** A small conversion error can have serious consequences. When in doubt, verify with references or colleagues.`,
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