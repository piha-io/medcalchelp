import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

async function seedProduction() {
  console.log('🌱 Starting production database seed...')

  // Clear existing data in proper order (respecting foreign keys)
  await prisma.userAttempt.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.score.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.guideConcept.deleteMany()
  await prisma.guideCategory.deleteMany()
  await prisma.questionTemplate.deleteMany()
  await prisma.verificationCode.deleteMany()

  console.log('🧹 Cleared existing data')

  // 1. Seed Question Templates
  console.log('📚 Seeding question templates...')
  await seedQuestionTemplates()

  // 2. Seed Guide System
  console.log('📖 Seeding guides system...')
  await seedGuidesSystem()

  // 3. Seed Fake Users with Realistic Data
  console.log('👥 Seeding fake users...')
  await seedFakeUsers()

  console.log('🎉 Production seeding completed!')
}

async function seedQuestionTemplates() {
  const questions = [
    // Dosage Calculations - Beginner
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      title: 'Basic Oral Dosage',
      templateText: 'A patient needs {dose}mg of medication. Available tablets are {strength}mg each. How many tablets should be given?',
      formulaTemplate: '{dose} / {strength}',
      variables: {
        dose: { min: 100, max: 1000, step: 50 },
        strength: { min: 50, max: 500, step: 50 }
      },
      units: {
        dose: 'mg',
        strength: 'mg',
        answer: 'tablets'
      },
      hints: [
        'Divide the required dose by the tablet strength',
        'Round to the nearest half tablet if necessary'
      ],
      explanation: 'To find the number of tablets: Required dose ÷ Tablet strength = Number of tablets. {dose}mg ÷ {strength}mg = {answer} tablets'
    },
    
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      title: 'Liquid Medication Dosage',
      templateText: 'A patient needs {dose}mg of liquid medication. The medication comes as {concentration}mg/{volume}mL. How many mL should be given?',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 50, max: 500, step: 25 },
        concentration: { min: 10, max: 100, step: 5 },
        volume: { min: 1, max: 10, step: 1 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Use the ratio: dose needed / concentration = volume needed',
        'Multiply by the volume the concentration is dissolved in'
      ],
      explanation: 'Calculation: {dose}mg ÷ {concentration}mg × {volume}mL = {answer}mL'
    },

    // IV Drip Rate Calculations - Intermediate
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      title: 'Basic IV Drip Rate',
      templateText: 'An IV of {volume}mL needs to infuse over {hours} hours. The drop factor is {dropFactor} gtt/mL. Calculate the drip rate in gtt/min.',
      formulaTemplate: '({volume} * {dropFactor}) / ({hours} * 60)',
      variables: {
        volume: { min: 250, max: 1000, step: 250 },
        hours: { min: 4, max: 12, step: 2 },
        dropFactor: [10, 15, 20, 60]
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        dropFactor: 'gtt/mL',
        answer: 'gtt/min'
      },
      hints: [
        'Formula: (Volume × Drop Factor) ÷ (Time in minutes)',
        'Convert hours to minutes by multiplying by 60'
      ],
      explanation: 'Calculation: ({volume}mL × {dropFactor} gtt/mL) ÷ ({hours} × 60 min) = {answer} gtt/min'
    },

    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      title: 'IV Flow Rate in mL/hr',
      templateText: 'A patient needs {volume}mL of IV fluid over {hours} hours. What is the flow rate in mL/hr?',
      formulaTemplate: '{volume} / {hours}',
      variables: {
        volume: { min: 500, max: 2000, step: 250 },
        hours: { min: 6, max: 24, step: 2 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        answer: 'mL/hr'
      },
      hints: [
        'Formula: Total Volume ÷ Total Time = Flow Rate',
        'Make sure units match (mL and hours)'
      ],
      explanation: 'Flow Rate: {volume}mL ÷ {hours} hours = {answer} mL/hr'
    },

    // Unit Conversions - Beginner
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      title: 'Weight Unit Conversion',
      templateText: 'Convert {amount} {fromUnit} to {toUnit}.',
      formulaTemplate: '{amount} * {conversionFactor}',
      variables: {
        amount: { min: 0.5, max: 10, step: 0.5 },
        conversion: [
          { from: 'g', to: 'mg', factor: 1000 },
          { from: 'kg', to: 'g', factor: 1000 },
          { from: 'mg', to: 'mcg', factor: 1000 }
        ]
      },
      units: {
        amount: 'varies',
        answer: 'varies'
      },
      hints: [
        'Remember: 1g = 1000mg, 1kg = 1000g, 1mg = 1000mcg',
        'Moving from larger to smaller units: multiply'
      ],
      explanation: 'Conversion: {amount} {fromUnit} × {conversionFactor} = {answer} {toUnit}'
    },

    // Pediatric Dosing - Advanced
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      title: 'Weight-Based Pediatric Dosing',
      templateText: 'A child weighs {weight}kg and needs {dosePerKg}mg/kg of medication. What is the total dose needed?',
      formulaTemplate: '{weight} * {dosePerKg}',
      variables: {
        weight: { min: 5, max: 50, step: 2.5 },
        dosePerKg: { min: 5, max: 50, step: 5 }
      },
      units: {
        weight: 'kg',
        dosePerKg: 'mg/kg',
        answer: 'mg'
      },
      hints: [
        'Formula: Weight (kg) × Dose per kg = Total dose',
        'Make sure weight is in kg, not pounds'
      ],
      explanation: 'Total dose: {weight}kg × {dosePerKg}mg/kg = {answer}mg'
    },

    // Concentration Calculations - Intermediate
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      title: 'Solution Concentration',
      templateText: 'You have {amount}mg of medication in {volume}mL of solution. What is the concentration in mg/mL?',
      formulaTemplate: '{amount} / {volume}',
      variables: {
        amount: { min: 50, max: 500, step: 25 },
        volume: { min: 10, max: 100, step: 10 }
      },
      units: {
        amount: 'mg',
        volume: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Concentration = Amount of drug ÷ Volume of solution',
        'Express as mg/mL for medication concentrations'
      ],
      explanation: 'Concentration: {amount}mg ÷ {volume}mL = {answer}mg/mL'
    },

    // Critical Care - Expert
    {
      type: 'CRITICAL_CARE',
      category: 'CRITICAL_CALCULATION',
      title: 'Dopamine Drip Calculation',
      templateText: 'A {weight}kg patient needs dopamine at {mcgPerKgMin}mcg/kg/min. The concentration is {concentration}mg/250mL. What is the rate in mL/hr?',
      formulaTemplate: '({weight} * {mcgPerKgMin} * 60) / ({concentration} * 4)',
      variables: {
        weight: { min: 50, max: 100, step: 10 },
        mcgPerKgMin: { min: 5, max: 20, step: 2.5 },
        concentration: { min: 200, max: 800, step: 200 }
      },
      units: {
        weight: 'kg',
        mcgPerKgMin: 'mcg/kg/min',
        concentration: 'mg',
        answer: 'mL/hr'
      },
      hints: [
        'Convert mcg/kg/min to mcg/hr, then to mg/hr',
        'Use concentration to find mL/hr needed'
      ],
      explanation: 'Rate calculation: ({weight}kg × {mcgPerKgMin}mcg/kg/min × 60min/hr) ÷ ({concentration}mg/250mL × 4mg/mL) = {answer}mL/hr'
    },

    // Insulin Dosing - Expert
    {
      type: 'INSULIN_DOSING',
      category: 'SLIDING_SCALE',
      title: 'Insulin Sliding Scale',
      templateText: 'Patient glucose is {glucose}mg/dL. Sliding scale: 150-200 = {lowDose}units, 201-250 = {midDose}units, 251-300 = {highDose}units. How many units?',
      formulaTemplate: 'if({glucose} <= 200, {lowDose}, if({glucose} <= 250, {midDose}, {highDose}))',
      variables: {
        glucose: { min: 150, max: 300, step: 25 },
        lowDose: { min: 2, max: 6, step: 2 },
        midDose: { min: 4, max: 10, step: 2 },
        highDose: { min: 6, max: 15, step: 3 }
      },
      units: {
        glucose: 'mg/dL',
        answer: 'units'
      },
      hints: [
        'Check which glucose range the patient falls into',
        'Use the corresponding insulin dose for that range'
      ],
      explanation: 'Glucose {glucose}mg/dL falls in range requiring {answer} units of insulin'
    }
  ]

  for (const question of questions) {
    await prisma.questionTemplate.create({
      data: question as any
    })
  }

  console.log(`✅ Created ${questions.length} question templates`)
}

async function seedGuidesSystem() {
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

  // Create sample guides with proper mathematical content
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
    }
  ]

  // Create guides with proper relationships
  for (const guideData of guides) {
    const { conceptIds, categoryId, practiceProblems, ...data } = guideData
    
    await prisma.guide.create({
      data: {
        ...data,
        categoryId,
        isPublished: true,
        viewCount: Math.floor(Math.random() * 500) + 100,
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
  }

  console.log(`✅ Created ${guides.length} guides`)
}

async function seedFakeUsers() {
  // Generate 20 users with random usernames
  const randomUsernames = [
    'medstudent92', 'nursepro2024', 'clinicalace', 'rxmaster', 'nursingstar',
    'medcalcwiz', 'dosageguru', 'ivtherapist', 'pharmgenius', 'criticalcare23',
    'pediatricpro', 'emergencymed', 'surgicalskills', 'cardiacnurse', 'traumateam',
    'medsafety101', 'clinicalexpert', 'pharmtech22', 'icunurse', 'medmathninja'
  ]
  
  const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Drew', 'Blake', 'Avery', 'Quinn',
                      'Riley', 'Cameron', 'Jamie', 'Skyler', 'Reese', 'Dakota', 'Sage', 'River', 'Rowan', 'Finley']
  const lastNames = ['Chen', 'Patel', 'Kim', 'Singh', 'Lee', 'Wang', 'Zhang', 'Ali', 'Martin', 'Garcia',
                     'Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor']
  
  const users = []
  
  for (let i = 0; i < 20; i++) {
    const username = randomUsernames[i]
    const firstName = firstNames[i]
    const lastName = lastNames[i]
    const email = `${username}@medcalchelp.com`
    
    // Distribute user creation dates across last 60 days for variety
    const daysAgo = Math.floor(Math.random() * 60)
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - daysAgo)
    
    // Vary last active times - some very recent, some weeks ago
    const lastActiveDaysAgo = i < 5 ? Math.floor(Math.random() * 2) : // Top 5 users active in last 2 days
                              i < 10 ? Math.floor(Math.random() * 7) : // Next 5 active in last week
                              Math.floor(Math.random() * 30) // Rest active in last month
    
    const lastActiveDate = new Date()
    lastActiveDate.setDate(lastActiveDate.getDate() - lastActiveDaysAgo)
    
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        emailVerified: true,
        emailVerifiedAt: createdDate,
        lastActive: lastActiveDate,
        profile: {
          create: {
            displayName: `${firstName} ${lastName}`,
            bio: `${['Medical student', 'Nursing student', 'Pharmacy student', 'Healthcare professional', 'Clinical educator'][i % 5]} passionate about medical calculations`,
            totalPoints: 0, // Will be calculated from attempts
            currentStreak: i < 10 ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 5),
            longestStreak: Math.floor(Math.random() * 30) + 5,
            level: Math.floor(Math.random() * 8) + 1,
            experience: 0, // Will be calculated from attempts
          },
        },
      },
      include: {
        profile: true,
      },
    })
    
    users.push(user)
  }

  console.log(`✅ Created ${users.length} users with random usernames`)

  // Generate realistic user attempts and scores
  const questionTemplates = await prisma.questionTemplate.findMany()
  let totalAttempts = 0

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const user = users[userIndex]
    
    // Vary number of attempts based on user activity level
    // Top users have more attempts, bottom users have fewer
    const baseAttempts = userIndex < 5 ? 80 : userIndex < 10 ? 50 : userIndex < 15 ? 30 : 10
    const numAttempts = baseAttempts + Math.floor(Math.random() * 20)
    
    let userTotalPoints = 0
    let dailyPoints = 0
    let weeklyPoints = 0
    let monthlyPoints = 0
    
    for (let i = 0; i < numAttempts; i++) {
      const questionTemplate = questionTemplates[Math.floor(Math.random() * questionTemplates.length)]
      
      // Distribute attempts across different time periods
      let daysAgo
      if (userIndex < 5 && i > numAttempts * 0.7) {
        // Top 5 users: 70% of recent attempts in last 1 day (daily leaderboard)
        daysAgo = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 7)
      } else if (userIndex < 10 && i > numAttempts * 0.5) {
        // Next 5 users: 50% of recent attempts in last 7 days (weekly leaderboard)
        daysAgo = Math.floor(Math.random() * 7)
      } else if (userIndex < 15) {
        // Next 5 users: attempts spread across last 30 days (monthly leaderboard)
        daysAgo = Math.floor(Math.random() * 30)
      } else {
        // Remaining users: older attempts (30-60 days)
        daysAgo = Math.floor(Math.random() * 30) + 30
      }
      
      const attemptDate = new Date()
      attemptDate.setDate(attemptDate.getDate() - daysAgo)
      
      // Top users have higher accuracy
      const accuracyThreshold = userIndex < 5 ? 0.15 : userIndex < 10 ? 0.2 : 0.3
      const isCorrect = Math.random() > accuracyThreshold // 85%, 80%, or 70% accuracy
      
      const timeSpent = Math.floor(Math.random() * 270) + 30 // 30-300 seconds
      const hintsUsed = userIndex < 10 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 4) // Better users use fewer hints
      
      // Calculate points (similar to actual logic)
      let basePoints = 20 // Default
      if (questionTemplate.type === 'DOSAGE_CALCULATION' || questionTemplate.type === 'UNIT_CONVERSION') {
        basePoints = 15
      } else if (questionTemplate.type === 'CRITICAL_CARE' || questionTemplate.type === 'INSULIN_DOSING') {
        basePoints = 40
      }
      
      const pointsEarned = isCorrect ? Math.max(basePoints - (hintsUsed * 5), 5) : 0
      userTotalPoints += pointsEarned
      
      // Track points by time period
      if (daysAgo === 0) {
        dailyPoints += pointsEarned
      }
      if (daysAgo < 7) {
        weeklyPoints += pointsEarned
      }
      if (daysAgo < 30) {
        monthlyPoints += pointsEarned
      }
      
      await prisma.userAttempt.create({
        data: {
          userId: user.id,
          questionId: questionTemplate.id,
          generatedValues: { dose: 100, strength: 50 }, // Sample values
          userAnswer: Math.random() * 10 + 1,
          correctAnswer: Math.random() * 10 + 1,
          isCorrect,
          timeSpent,
          hintsUsed,
          pointsEarned,
          attemptedAt: attemptDate,
        },
      })
      
      totalAttempts++
    }

    // Create score records with actual calculated time-based scores
    const dailyScore = dailyPoints
    const weeklyScore = weeklyPoints
    const monthlyScore = monthlyPoints
    
    await prisma.score.create({
      data: {
        userId: user.id,
        dailyScore,
        weeklyScore,
        monthlyScore,
        allTimeScore: userTotalPoints,
        lastResetDaily: new Date(),
        lastResetWeekly: new Date(),
        lastResetMonthly: new Date(),
      },
    })

    // Update user profile with total points
    await prisma.userProfile.update({
      where: { userId: user.id },
      data: {
        totalPoints: userTotalPoints,
        experience: userTotalPoints,
      },
    })

    // Generate some achievements for active users
    if (userTotalPoints > 100) {
      const achievementDate = new Date()
      achievementDate.setDate(achievementDate.getDate() - Math.floor(Math.random() * 20))
      
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: 'FIRST_CORRECT',
          unlockedAt: achievementDate,
        },
      })
    }

    if (userTotalPoints > 500) {
      const achievementDate = new Date()
      achievementDate.setDate(achievementDate.getDate() - Math.floor(Math.random() * 15))
      
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: 'QUESTIONS_10',
          unlockedAt: achievementDate,
        },
      })
    }

    if (userTotalPoints > 1000) {
      const achievementDate = new Date()
      achievementDate.setDate(achievementDate.getDate() - Math.floor(Math.random() * 10))
      
      await prisma.achievement.create({
        data: {
          userId: user.id,
          type: 'ACCURACY_80',
          unlockedAt: achievementDate,
        },
      })
    }
  }

  console.log(`✅ Generated ${totalAttempts} user attempts with realistic scoring`)
  
  // Show leaderboard preview
  console.log('\n📊 Leaderboard Distribution:')
  console.log('- Top 5 users: High daily scores (active today)')
  console.log('- Users 6-10: High weekly scores (active this week)')
  console.log('- Users 11-15: High monthly scores (active this month)')
  console.log('- Users 16-20: Historical players (less recent activity)')
}

seedProduction()
  .catch((e) => {
    console.error('❌ Production seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })