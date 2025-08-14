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
      title: 'Milligrams to Grams',
      templateText: 'Convert {value}mg to grams.',
      formulaTemplate: '{value} / 1000',
      variables: {
        value: { min: 250, max: 5000, step: 250 }
      },
      units: {
        value: 'mg',
        answer: 'g'
      },
      hints: [
        '1 gram = 1000 milligrams',
        'Divide by 1000'
      ],
      explanation: 'To convert mg to g, divide by 1000. {value}mg ÷ 1000 = {answer}g'
    },
    
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      title: 'Grams to Milligrams',
      templateText: 'Convert {value}g to milligrams.',
      formulaTemplate: '{value} * 1000',
      variables: {
        value: { min: 0.5, max: 10, step: 0.5 }
      },
      units: {
        value: 'g',
        answer: 'mg'
      },
      hints: [
        '1 gram = 1000 milligrams',
        'Multiply by 1000'
      ],
      explanation: 'To convert g to mg, multiply by 1000. {value}g × 1000 = {answer}mg'
    },
    
    {
      type: 'UNIT_CONVERSION',
      category: 'VOLUME_CONVERSION',
      title: 'Liters to Milliliters',
      templateText: 'Convert {value}L to milliliters.',
      formulaTemplate: '{value} * 1000',
      variables: {
        value: { min: 0.5, max: 3, step: 0.5 }
      },
      units: {
        value: 'L',
        answer: 'mL'
      },
      hints: [
        '1 liter = 1000 milliliters',
        'Multiply by 1000'
      ],
      explanation: 'To convert L to mL, multiply by 1000. {value}L × 1000 = {answer}mL'
    },
    
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      title: 'Kilograms to Grams',
      templateText: 'Convert {value}kg to grams.',
      formulaTemplate: '{value} * 1000',
      variables: {
        value: { min: 0.5, max: 5, step: 0.5 }
      },
      units: {
        value: 'kg',
        answer: 'g'
      },
      hints: [
        '1 kilogram = 1000 grams',
        'Multiply by 1000'
      ],
      explanation: 'To convert kg to g, multiply by 1000. {value}kg × 1000 = {answer}g'
    },
    
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      title: 'Micrograms to Milligrams',
      templateText: 'Convert {value}mcg to milligrams.',
      formulaTemplate: '{value} / 1000',
      variables: {
        value: { min: 250, max: 2000, step: 250 }
      },
      units: {
        value: 'mcg',
        answer: 'mg'
      },
      hints: [
        '1 milligram = 1000 micrograms',
        'Divide by 1000'
      ],
      explanation: 'To convert mcg to mg, divide by 1000. {value}mcg ÷ 1000 = {answer}mg'
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
    },

    // Dilution - Intermediate
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      title: 'Medication Dilution',
      templateText: 'You need to dilute {initialVolume}mL of {initialConcentration}% solution to a {finalConcentration}% solution. How much diluent should be added?',
      formulaTemplate: '({initialVolume} * {initialConcentration} / {finalConcentration}) - {initialVolume}',
      variables: {
        initialVolume: { min: 5, max: 50, step: 5 },
        initialConcentration: { min: 10, max: 50, step: 5 },
        finalConcentration: { min: 1, max: 10, step: 1 }
      },
      units: {
        initialVolume: 'mL',
        initialConcentration: '%',
        finalConcentration: '%',
        answer: 'mL'
      },
      hints: [
        'Use dilution formula: C1V1 = C2V2',
        'Amount of diluent = Final volume - Initial volume'
      ],
      explanation: 'Using C1V1 = C2V2: ({initialConcentration}% × {initialVolume}mL) ÷ {finalConcentration}% = Final volume. Diluent needed: Final volume - {initialVolume}mL = {answer}mL'
    },

    // Dimensional Analysis - Intermediate
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      title: 'Complex Unit Conversion',
      templateText: 'Convert {amount} {fromUnit} to {toUnit} using dimensional analysis.',
      formulaTemplate: '{amount} * {factor1} * {factor2}',
      variables: {
        amount: { min: 10, max: 100, step: 10 },
        conversion: [
          { from: 'mg/min', to: 'g/hr', factor1: 0.001, factor2: 60 },
          { from: 'mcg/kg/min', to: 'mg/kg/hr', factor1: 0.001, factor2: 60 },
          { from: 'L/day', to: 'mL/hr', factor1: 1000, factor2: 0.0417 }
        ]
      },
      units: {
        amount: 'varies',
        answer: 'varies'
      },
      hints: [
        'Set up conversion factors to cancel units systematically',
        'Check that all unwanted units cancel out'
      ],
      explanation: 'Dimensional analysis: {amount} {fromUnit} × conversion factors = {answer} {toUnit}'
    },

    // Heparin Protocol - Expert
    {
      type: 'HEPARIN_PROTOCOL',
      category: 'HEPARIN_CALCULATION',
      title: 'Heparin Infusion Rate',
      templateText: 'Patient weighs {weight}kg. Heparin protocol: {unitsPerKg} units/kg/hr. Concentration is {concentration} units/mL. What is the infusion rate in mL/hr?',
      formulaTemplate: '({weight} * {unitsPerKg}) / {concentration}',
      variables: {
        weight: { min: 60, max: 100, step: 5 },
        unitsPerKg: { min: 12, max: 20, step: 2 },
        concentration: { min: 1000, max: 25000, step: 5000 }
      },
      units: {
        weight: 'kg',
        unitsPerKg: 'units/kg/hr',
        concentration: 'units/mL',
        answer: 'mL/hr'
      },
      hints: [
        'Calculate total units/hr needed: weight × units/kg/hr',
        'Divide by concentration to get mL/hr'
      ],
      explanation: 'Heparin rate: ({weight}kg × {unitsPerKg} units/kg/hr) ÷ {concentration} units/mL = {answer} mL/hr'
    },

    // Reconstitution - Advanced
    {
      type: 'RECONSTITUTION',
      category: 'POWDER_RECONSTITUTION',
      title: 'Powder Reconstitution',
      templateText: 'You have a {vialSize}mg vial of powdered medication. After adding {diluentVolume}mL of diluent, the final volume is {finalVolume}mL. What is the concentration?',
      formulaTemplate: '{vialSize} / {finalVolume}',
      variables: {
        vialSize: { min: 250, max: 2000, step: 250 },
        diluentVolume: { min: 5, max: 20, step: 2.5 },
        finalVolume: { min: 5, max: 25, step: 2.5 }
      },
      units: {
        vialSize: 'mg',
        diluentVolume: 'mL',
        finalVolume: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Use the final volume, not the diluent volume, for concentration',
        'Concentration = Total drug amount ÷ Final volume'
      ],
      explanation: 'Concentration after reconstitution: {vialSize}mg ÷ {finalVolume}mL = {answer}mg/mL'
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
    },
    {
      title: 'Safe Medication Administration: The Rights and Calculations',
      slug: 'safe-medication-administration',
      description: 'Master the essential rights of medication administration and learn to prevent medication errors through accurate calculations',
      content: `# Safe Medication Administration: The Rights and Calculations

## Introduction

Safe medication administration is the cornerstone of nursing practice. This guide combines the essential rights of medication administration with the mathematical calculations needed to ensure patient safety.

## The 10 Rights of Medication Administration

### 1. Right Patient
- Always use two patient identifiers
- Check name band and ask patient to state name
- Verify with medical record number

### 2. Right Medication
- Check medication label three times
- Verify generic and brand names
- Be aware of look-alike/sound-alike medications

### 3. Right Dose
**This is where calculations are critical!**

#### Double-Check Method
Always perform calculations twice:
1. Initial calculation
2. Verification using a different method

#### Example Calculation Check
**Order**: Digoxin 0.25 mg PO daily  
**Available**: Digoxin 0.125 mg tablets

**Method 1 (Formula)**: 0.25 mg ÷ 0.125 mg = 2 tablets  
**Method 2 (Ratio)**: 0.125 mg : 1 tab = 0.25 mg : x tabs  
x = 2 tablets ✓

### 4. Right Route
- PO, IV, IM, SubQ, topical, etc.
- Never assume - verify the ordered route
- Some medications have different doses for different routes

### 5. Right Time
- Scheduled medications: within 30 minutes
- PRN medications: check last dose given
- Time-critical medications: exact timing required

### 6. Right Documentation
- Document immediately after administration
- Include time, dose, route, and site (if applicable)
- Document patient response

### 7. Right Reason
- Understand why the medication is prescribed
- Correlate with patient's diagnosis
- Question orders that don't match condition

### 8. Right Response
- Monitor for therapeutic effects
- Watch for adverse reactions
- Document patient's response

### 9. Right to Refuse
- Patients have the right to refuse medications
- Document refusal and notify prescriber
- Educate about consequences

### 10. Right Education
- Teach patient about medication
- Include purpose, side effects, and precautions
- Verify understanding

## High-Alert Medications

### Special Calculation Considerations

High-alert medications require extra vigilance:

1. **Insulin**
   - Always use insulin syringes
   - Never abbreviate "units"
   - Have second nurse verify

2. **Anticoagulants**
   - Double-check all calculations
   - Verify INR/PTT before administration
   - Use programmable pumps for heparin

3. **Narcotics**
   - Count controlled substances
   - Witness waste of partial doses
   - Monitor respiratory status

4. **Chemotherapy**
   - Verify BSA calculations
   - Check dose against protocol
   - Use appropriate PPE

## Preventing Calculation Errors

### Common Error Types and Prevention

1. **Decimal Point Errors**
   - Wrong: .5 mg → Could be read as 5 mg
   - Right: 0.5 mg → Clear leading zero
   - Wrong: 5.0 mg → Trailing zero can be missed
   - Right: 5 mg → No trailing zero

2. **Unit Confusion**
   - Always write out "units" (never "U")
   - Be careful with mcg vs mg
   - Watch mL vs L conversions

3. **Formula Errors**
   - Set up problems systematically
   - Label all numbers with units
   - Cancel units to verify setup

### The STAR Method for Calculations

**S** - Stop and read the order carefully  
**T** - Think about what makes sense  
**A** - Act by calculating carefully  
**R** - Review your work before administering

## Safe Calculation Practices

### Independent Double Check

For high-alert medications:
1. Nurse 1 calculates independently
2. Nurse 2 calculates independently
3. Compare results
4. Both verify the prepared dose

### Technology Integration

- Use smart pumps with drug libraries
- Utilize barcode scanning
- Employ computerized physician order entry (CPOE)
- But always verify technology is correct!

## Clinical Scenarios

### Scenario 1: Pediatric Dose Check
**Order**: Amoxicillin 45 mg/kg/day divided TID for 22 kg child  
**Available**: Amoxicillin 250 mg/5 mL

**Safe Dose Calculation**:
- Total daily dose: 45 mg/kg × 22 kg = 990 mg/day
- Per dose: 990 mg ÷ 3 = 330 mg
- Volume needed: (330 mg ÷ 250 mg) × 5 mL = 6.6 mL

**Safety Check**: Is 990 mg/day reasonable for a 22 kg child? Yes ✓

### Scenario 2: Critical Drip
**Order**: Dopamine 5 mcg/kg/min for 80 kg patient  
**Available**: Dopamine 400 mg in 250 mL

**Calculation with Safety Check**:
1. mcg/min needed: 5 × 80 = 400 mcg/min
2. mg/hr needed: 400 × 60 ÷ 1000 = 24 mg/hr
3. mL/hr rate: (24 mg ÷ 400 mg) × 250 mL = 15 mL/hr

**Verification**: Does 15 mL/hr for dopamine make sense? Check with drug reference ✓

## Summary

Safe medication administration requires:
- Knowledge of the 10 rights
- Accurate calculation skills
- Systematic verification processes
- Awareness of high-risk situations
- Commitment to double-checking

Remember: When in doubt, stop and verify. Patient safety always comes first!`,
      categoryId: categories[0].id,
      conceptIds: [concepts[0].id, concepts[2].id],
      difficulty: 'INTERMEDIATE',
      readingTime: 15,
      prerequisites: ['basic-dosage-formula'],
      learningOutcomes: [
        'Apply the 10 rights of medication administration',
        'Identify high-alert medications requiring special calculations',
        'Use the independent double-check method',
        'Prevent common calculation errors',
        'Integrate safety practices into calculations'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'A patient weighing 70 kg needs dopamine at 10 mcg/kg/min. Dopamine comes as 800 mg in 250 mL. What is the pump rate?',
            answer: '13.1 mL/hr',
            solution: '(10 mcg/kg/min × 70 kg × 60 min/hr) ÷ (800 mg × 1000 mcg/mg) × 250 mL = 13.1 mL/hr'
          }
        ]
      },
      order: 2,
    },
    {
      title: 'IV Pump Programming Mastery',
      slug: 'iv-pump-programming',
      description: 'Master the art of programming IV pumps for accurate medication delivery and patient safety',
      content: `# IV Pump Programming Mastery

## Introduction

Intravenous pumps are critical tools for precise medication delivery. This guide will help you master pump programming calculations and ensure safe IV therapy administration.

## Understanding IV Pump Basics

### Types of IV Pumps

1. **Volumetric Pumps**
   - Deliver fluids in mL/hr
   - Most common in hospitals
   - Used for large volume infusions

2. **Syringe Pumps**
   - Deliver in mL/hr or mcg/kg/min
   - Used for small volumes
   - Common in critical care

3. **Smart Pumps**
   - Drug library integration
   - Dose error reduction systems
   - Automatic calculations

## Essential IV Pump Calculations

### Basic Flow Rate (mL/hr)

**Formula**: Volume (mL) ÷ Time (hr) = Rate (mL/hr)

**Example 1**: 1000 mL over 8 hours
- Rate = 1000 mL ÷ 8 hr = 125 mL/hr

**Example 2**: 500 mL over 6 hours
- Rate = 500 mL ÷ 6 hr = 83.3 mL/hr

### Drug Concentration Calculations

When medications are added to IV fluids:

**Formula**: Amount of drug (mg) ÷ Volume (mL) = Concentration (mg/mL)

**Example**: Dopamine 400 mg in 250 mL
- Concentration = 400 mg ÷ 250 mL = 1.6 mg/mL

### Weight-Based Infusions

Common in critical care and pediatrics:

**Formula for mcg/kg/min drugs**:
1. Calculate mcg/min: Weight (kg) × Dose (mcg/kg/min)
2. Convert to mg/hr: mcg/min × 60 ÷ 1000
3. Calculate mL/hr: mg/hr ÷ concentration (mg/mL)

**Complete Example**:
- Patient: 75 kg
- Order: Dopamine 5 mcg/kg/min
- Supply: 400 mg in 250 mL

**Step 1**: 75 kg × 5 mcg/kg/min = 375 mcg/min
**Step 2**: 375 × 60 ÷ 1000 = 22.5 mg/hr
**Step 3**: 22.5 mg/hr ÷ 1.6 mg/mL = 14.1 mL/hr

## Programming Different Medication Types

### Continuous Infusions

**Heparin Protocol Example**:
- Order: Heparin 18 units/kg/hr
- Patient: 80 kg
- Supply: 25,000 units in 250 mL

**Calculation**:
1. Units/hr needed: 18 × 80 = 1,440 units/hr
2. Concentration: 25,000 ÷ 250 = 100 units/mL
3. Pump rate: 1,440 ÷ 100 = 14.4 mL/hr

### Intermittent Infusions (Piggyback)

**Antibiotic Example**:
- Order: Ceftriaxone 1 g IVPB over 30 minutes
- Supply: 1 g in 50 mL

**Calculation**:
- Time: 30 min = 0.5 hr
- Rate: 50 mL ÷ 0.5 hr = 100 mL/hr

### Titrated Infusions

Medications adjusted based on patient response:

**Nitroglycerin Titration**:
- Start: 5 mcg/min
- Increase: 5 mcg/min every 5 minutes
- Maximum: 200 mcg/min
- Supply: 50 mg in 250 mL

**Initial Rate Calculation**:
1. Concentration: 50 mg ÷ 250 mL = 0.2 mg/mL = 200 mcg/mL
2. Starting rate: 5 mcg/min × 60 min/hr ÷ 200 mcg/mL = 1.5 mL/hr

## Smart Pump Features

### Drug Library Benefits

- Pre-programmed drug concentrations
- Soft and hard dose limits
- Automatic unit conversions
- Clinical decision support

### Programming with Drug Libraries

1. Select drug from library
2. Enter patient weight (if required)
3. Enter prescribed dose
4. Pump calculates rate automatically
5. Verify calculated rate

### Overriding Limits

**When Override May Be Needed**:
- Non-standard concentrations
- Exceptional clinical situations
- Pharmacy-prepared special dilutions

**Override Protocol**:
1. Document reason
2. Independent double-check
3. Notify pharmacy
4. Monitor closely

## Safety Considerations

### Pre-Programming Checks

✓ Right patient (two identifiers)
✓ Right medication and concentration
✓ Right dose/rate calculation
✓ Right route (central vs peripheral)
✓ Right pump channel

### During Infusion

- Verify drip rate hourly
- Check IV site regularly
- Monitor pump alarms
- Track volume infused
- Document in medical record

### Common Programming Errors

1. **Wrong Units**
   - Entering mg/hr instead of mL/hr
   - Confusing mcg with mg
   - Prevention: Always verify units

2. **Decimal Errors**
   - 1.5 entered as 15
   - 0.5 entered as 5
   - Prevention: Use leading zeros

3. **Wrong Concentration**
   - Using standard instead of actual
   - Not updating after pharmacy change
   - Prevention: Verify with medication label

## Special Populations

### Pediatric Considerations

- Use pediatric drug libraries
- Weight-based limits more restrictive
- Smaller volume considerations
- More frequent weight updates needed

### Geriatric Considerations

- Start with lower doses
- More sensitive to fluid overload
- Consider renal/hepatic adjustments
- Monitor more frequently

## Practice Scenarios

### Scenario 1: Insulin Infusion
**Order**: Regular insulin 0.1 units/kg/hr for 70 kg patient
**Supply**: 100 units in 100 mL NS

**Solution**:
1. Units/hr: 0.1 × 70 = 7 units/hr
2. Concentration: 100 units ÷ 100 mL = 1 unit/mL
3. Pump rate: 7 units/hr ÷ 1 unit/mL = 7 mL/hr

### Scenario 2: Potassium Replacement
**Order**: KCl 10 mEq/hr (max rate for peripheral line)
**Supply**: 40 mEq in 100 mL

**Solution**:
1. Concentration: 40 mEq ÷ 100 mL = 0.4 mEq/mL
2. Pump rate: 10 mEq/hr ÷ 0.4 mEq/mL = 25 mL/hr

## Summary

Successful IV pump programming requires:
- Accurate calculations
- Understanding of pump features
- Adherence to safety protocols
- Regular monitoring
- Proper documentation

Remember: Technology assists but doesn't replace critical thinking!`,
      categoryId: categories[1].id,
      conceptIds: [concepts[5].id, concepts[6].id],
      difficulty: 'INTERMEDIATE',
      readingTime: 18,
      prerequisites: [],
      learningOutcomes: [
        'Calculate IV flow rates accurately',
        'Program weight-based infusions',
        'Use smart pump safety features',
        'Prevent common programming errors',
        'Apply safety checks systematically'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'Program a pump for norepinephrine 0.05 mcg/kg/min for an 85 kg patient. Supply: 4 mg in 250 mL.',
            answer: '15.9 mL/hr',
            solution: 'Dose: 0.05 × 85 = 4.25 mcg/min = 255 mcg/hr = 0.255 mg/hr. Concentration: 4÷250 = 0.016 mg/mL. Rate: 0.255÷0.016 = 15.9 mL/hr'
          }
        ]
      },
      order: 3,
    },
    {
      title: 'Metric System Mastery for Healthcare',
      slug: 'metric-system-mastery',
      description: 'Master metric conversions and avoid common pitfalls in healthcare calculations',
      content: `# Metric System Mastery for Healthcare

## Introduction

The metric system is the foundation of medical measurements. Mastering metric conversions is essential for safe medication administration and accurate patient care. This guide provides comprehensive coverage of metric conversions used in healthcare.

## The Metric System Hierarchy

### Base Units in Healthcare

- **Length**: meter (m) - used for height, wound measurements
- **Mass**: gram (g) - used for medication doses, patient weight
- **Volume**: liter (L) - used for fluids, medications
- **Temperature**: Celsius (°C) - used in most healthcare settings

### Metric Prefixes

Understanding prefixes is key to conversions:

| Prefix | Symbol | Factor | Example |
|--------|--------|--------|---------|
| kilo- | k | 1000 | 1 kg = 1000 g |
| (base) | - | 1 | 1 g = 1 g |
| milli- | m | 0.001 | 1 mg = 0.001 g |
| micro- | mc/μ | 0.000001 | 1 mcg = 0.000001 g |

### The Conversion Staircase

Visualize conversions as steps:

    kg (kilograms)
       ↓ × 1000
    g  (grams)
       ↓ × 1000
    mg (milligrams)
       ↓ × 1000
    mcg (micrograms)

Going down: multiply
Going up: divide

## Common Healthcare Conversions

### Weight Conversions

**Kilograms ↔ Pounds**
- 1 kg = 2.2 lbs
- 1 lb = 0.45 kg

**Quick Estimation**:
- kg to lbs: Double and add 10%
- lbs to kg: Divide by 2 and subtract 10%

**Example**: 70 kg patient
- Exact: 70 × 2.2 = 154 lbs
- Quick: 70 × 2 = 140, plus 14 = 154 lbs ✓

### Medication Weight Units

**Common Conversions**:
- 1 g = 1000 mg
- 1 mg = 1000 mcg
- 1 g = 1,000,000 mcg

**Memory Device**: "King Henry Died Monday Drinking Chocolate Milk"
(Kilo, Hecto, Deka, Main, Deci, Centi, Milli)

### Volume Conversions

**Metric Volume**:
- 1 L = 1000 mL
- 1 mL = 1 cc (cubic centimeter)
- 1 mL = 20 drops (standard IV set)
- 1 mL = 60 microdrops

**Household to Metric**:
- 1 teaspoon = 5 mL
- 1 tablespoon = 15 mL
- 1 fluid ounce = 30 mL
- 1 cup = 240 mL

## Temperature Conversions

### Celsius ↔ Fahrenheit

**Formulas**:
- °F to °C: (°F - 32) × 5/9
- °C to °F: (°C × 9/5) + 32

**Quick Reference Points**:
- 37°C = 98.6°F (normal body temp)
- 38°C = 100.4°F (low-grade fever)
- 39°C = 102.2°F (moderate fever)
- 40°C = 104°F (high fever)

**Memory Trick**: "Times 2 and add 30" for rough C to F
- 37°C × 2 + 30 = 104°F (actual: 98.6°F - close enough for estimation)

## Avoiding Common Conversion Errors

### Error Type 1: Decimal Point Mistakes

**Wrong**: 2.5 g = 250 mg
**Right**: 2.5 g = 2500 mg

**Prevention**: Count decimal moves
- g to mg: move decimal 3 places right
- 2.500 becomes 2500

### Error Type 2: Wrong Direction

**Wrong**: 500 mcg = 500 mg
**Right**: 500 mcg = 0.5 mg

**Prevention**: Remember the hierarchy
- mcg is smaller than mg
- Going from smaller to larger = smaller number

### Error Type 3: Mixing Systems

**Wrong**: 1 kg = 2.2 mg
**Right**: 1 kg = 1000 g or 1 kg = 2.2 lbs

**Prevention**: Keep metric with metric, household with household

## Clinical Applications

### Example 1: Pediatric Weight Conversion
**Scenario**: Parent reports child weighs 44 pounds

**Conversion**: 44 lbs ÷ 2.2 = 20 kg

**Verification**: 20 kg × 2.2 = 44 lbs ✓

**Clinical Use**: Medication dosing at 10 mg/kg = 200 mg

### Example 2: Complex Medication Conversion
**Order**: Levothyroxine 0.125 mg
**Available**: 125 mcg tablets

**Is this the same?**
- 0.125 mg × 1000 = 125 mcg ✓
- Yes, give 1 tablet

### Example 3: IV Fluid Calculation
**Order**: 2 liters of NS over 24 hours

**Conversions needed**:
- 2 L = 2000 mL
- Rate = 2000 mL ÷ 24 hr = 83.3 mL/hr

## Quick Conversion Techniques

### The Factor-Label Method

Set up conversions to cancel units:

**Example**: Convert 750 mg to grams

    750 mg × (1 g / 1000 mg) = 0.75 g
             ↑ units cancel ↑

### Mental Math Shortcuts

**For mg to g**: Move decimal 3 places left
- 500 mg = 0.500 g = 0.5 g

**For mL to L**: Move decimal 3 places left
- 750 mL = 0.750 L = 0.75 L

**For mcg to mg**: Move decimal 3 places left
- 250 mcg = 0.250 mg = 0.25 mg

## Practice with Real Orders

### Practice Set 1: Basic Conversions
1. 0.5 g = ___ mg (Answer: 500 mg)
2. 2500 mL = ___ L (Answer: 2.5 L)
3. 150 mcg = ___ mg (Answer: 0.15 mg)
4. 66 lbs = ___ kg (Answer: 30 kg)

### Practice Set 2: Clinical Scenarios
1. Order: Amoxicillin 0.75 g. Available: 250 mg capsules
   - Convert: 0.75 g = 750 mg
   - Give: 750 ÷ 250 = 3 capsules

2. Order: D5W 1.5 L over 12 hours
   - Convert: 1.5 L = 1500 mL
   - Rate: 1500 ÷ 12 = 125 mL/hr

## Special Considerations

### Neonatal/Pediatric

- Use kg for all weight-based calculations
- Double-check pound to kilogram conversions
- Be extra careful with decimal points
- Consider using different colored syringes for different concentrations

### International Variations

- Some countries use μg instead of mcg
- Always clarify abbreviations
- When in doubt, write out "micrograms"

## Summary

Metric mastery requires:
1. Understanding the hierarchy
2. Knowing common equivalents
3. Using systematic conversion methods
4. Double-checking your work
5. Recognizing common errors

**Golden Rule**: When converting, always ask "Does this make sense?" A 70 kg adult taking 70 g of medication should trigger a recheck!`,
      categoryId: categories[2].id,
      conceptIds: [concepts[1].id],
      difficulty: 'BEGINNER',
      readingTime: 16,
      prerequisites: [],
      learningOutcomes: [
        'Convert between metric units accurately',
        'Convert between metric and household measurements',
        'Apply temperature conversions',
        'Avoid common conversion errors',
        'Use shortcuts for mental math'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'A patient weighs 185 pounds. What is their weight in kilograms?',
            answer: '84.1 kg',
            solution: '185 lbs ÷ 2.2 = 84.1 kg'
          },
          {
            question: 'Convert 0.075 g to milligrams.',
            answer: '75 mg',
            solution: '0.075 g × 1000 = 75 mg'
          }
        ]
      },
      order: 4,
    },
    {
      title: 'Body Surface Area (BSA) Calculations',
      slug: 'bsa-calculations',
      description: 'Learn to calculate BSA for pediatric and oncology dosing using multiple formulas',
      content: `# Body Surface Area (BSA) Calculations

## Introduction

Body Surface Area (BSA) calculations are critical for:
- Chemotherapy dosing
- Pediatric medications
- Burn assessment
- Cardiac index calculations

This guide covers the major BSA formulas and their clinical applications.

## Why BSA Matters

### Advantages Over Weight-Based Dosing

1. **More accurate for extremes**
   - Very tall/short patients
   - Obese patients
   - Pediatric patients

2. **Better correlation with**
   - Metabolic rate
   - Cardiac output
   - Renal function

3. **Standard for**
   - Chemotherapy protocols
   - Clinical trials
   - International guidelines

## BSA Formulas

### 1. Mosteller Formula (Most Common)

**Formula**: BSA (m²) = √[(height (cm) × weight (kg)) / 3600]

**Why it's preferred**:
- Easiest to calculate
- Well-validated
- Minimal difference from other formulas

**Example Calculation**:
- Height: 170 cm
- Weight: 70 kg

BSA = √[(170 × 70) / 3600]
BSA = √[11,900 / 3600]
BSA = √3.31
BSA = 1.82 m²

### 2. DuBois & DuBois Formula

**Formula**: BSA (m²) = 0.007184 × height(cm)^0.725 × weight(kg)^0.425

**When used**:
- Older protocols
- Some cardiac calculations
- Historical data comparison

### 3. Haycock Formula (Pediatrics)

**Formula**: BSA (m²) = 0.024265 × height(cm)^0.3964 × weight(kg)^0.5378

**Best for**:
- Infants
- Small children
- When precision needed

### 4. Quick Estimation Method

**For adults**: BSA ≈ √(height × weight / 3600)

**For children**: BSA ≈ (4 × weight + 7) / (weight + 90)

## Clinical Applications

### Chemotherapy Dosing

**Example**: Carboplatin AUC Dosing
- Target AUC: 6
- Creatinine clearance: 90 mL/min
- BSA: 1.82 m²

**Calvert Formula**:
Dose (mg) = AUC × (GFR + 25)
Dose = 6 × (90 + 25) = 690 mg

### Pediatric Medications

**When BSA Preferred Over Weight**:
1. Chemotherapy agents
2. Some antibiotics in extremes
3. Immunosuppressants
4. High-alert medications

**Example**: Methotrexate
- Standard dose: 15 mg/m²
- Child's BSA: 0.85 m²
- Dose: 15 × 0.85 = 12.75 mg

### Cardiac Calculations

**Cardiac Index** = Cardiac Output / BSA

**Example**:
- Cardiac output: 5 L/min
- BSA: 1.82 m²
- Cardiac index: 5 / 1.82 = 2.75 L/min/m²

## Step-by-Step BSA Calculation

### Using Mosteller Formula

**Step 1**: Convert measurements if needed
- Pounds to kg: divide by 2.2
- Inches to cm: multiply by 2.54

**Step 2**: Multiply height × weight

**Step 3**: Divide by 3600

**Step 4**: Take square root

**Step 5**: Round appropriately
- Adults: 2 decimal places
- Pediatrics: 3 decimal places

### Practice Calculation

**Patient**: 5'8" (68 inches), 154 lbs

**Step 1**: Convert
- Height: 68 × 2.54 = 172.7 cm
- Weight: 154 / 2.2 = 70 kg

**Step 2**: 172.7 × 70 = 12,089

**Step 3**: 12,089 / 3600 = 3.36

**Step 4**: √3.36 = 1.83

**Step 5**: BSA = 1.83 m²

## Special Populations

### Obese Patients

**Considerations**:
- May overestimate with actual weight
- Some protocols use adjusted body weight
- Maximum BSA caps (often 2.0-2.5 m²)

**Adjusted BSA Calculation**:
- Use ideal body weight + 0.4(actual - ideal)

### Pediatric Patients

**Age-Based Normals**:
- Newborn: 0.25 m²
- 1 year: 0.45 m²
- 5 years: 0.75 m²
- 10 years: 1.15 m²
- 15 years: 1.60 m²

**Double-Check Method**:
- Calculate BSA
- Compare to age norms
- Investigate large discrepancies

### Amputees

**Adjustment Factors**:
- Hand: 2.5% of BSA
- Entire arm: 10% of BSA
- Foot: 3.5% of BSA
- Entire leg: 18% of BSA

**Example**: Below-knee amputation
- Calculate normal BSA
- Subtract 9% (half of leg)

## Common Errors and Prevention

### Error 1: Unit Confusion

**Wrong**: Using pounds and inches in formula
**Right**: Always convert to kg and cm first

### Error 2: Formula Confusion

**Wrong**: Using adult formula for infants
**Right**: Use pediatric-specific formulas when appropriate

### Error 3: Calculation Errors

**Wrong**: Forgetting square root
**Right**: Double-check with calculator or app

## Technology Integration

### BSA Calculators

**Advantages**:
- Reduce calculation errors
- Quick results
- Multiple formulas available

**Still Need To**:
- Verify input units
- Check reasonableness
- Document which formula used

### EMR Integration

Many systems auto-calculate but verify:
- Current height/weight used
- Appropriate formula selected
- Result makes clinical sense

## Practice Problems

### Problem 1: Adult Chemotherapy
**Patient**: 165 cm, 72 kg
**Drug**: Doxorubicin 60 mg/m²

**Solution**:
1. BSA = √[(165 × 72) / 3600] = 1.82 m²
2. Dose = 60 × 1.82 = 109.2 mg

### Problem 2: Pediatric Dosing
**Patient**: 3-year-old, 95 cm, 15 kg
**Drug**: Vincristine 1.5 mg/m²

**Solution**:
1. BSA = √[(95 × 15) / 3600] = 0.63 m²
2. Dose = 1.5 × 0.63 = 0.95 mg

### Problem 3: Maximum BSA
**Patient**: 195 cm, 140 kg
**Protocol**: Max BSA 2.0 m²
**Drug**: Cyclophosphamide 600 mg/m²

**Solution**:
1. Actual BSA = √[(195 × 140) / 3600] = 2.76 m²
2. Use max BSA: 2.0 m²
3. Dose = 600 × 2.0 = 1200 mg

## Clinical Pearls

1. **Always verify** height and weight are current
2. **Document** which formula was used
3. **Question** BSA >2.5 m² or very different from expected
4. **For chemotherapy**, check protocol for BSA caps
5. **In pediatrics**, compare to age-normal values

## Summary

BSA calculations are essential for:
- Safe chemotherapy dosing
- Pediatric precision
- Physiologic assessments

Master the Mosteller formula and understand when BSA dosing is preferred over weight-based dosing. Always double-check calculations for these high-stakes medications!`,
      categoryId: categories[3].id,
      conceptIds: [concepts[4].id],
      difficulty: 'ADVANCED',
      readingTime: 20,
      prerequisites: ['metric-system-mastery'],
      learningOutcomes: [
        'Calculate BSA using multiple formulas',
        'Apply BSA to chemotherapy dosing',
        'Adjust calculations for special populations',
        'Recognize when BSA dosing is preferred',
        'Verify BSA calculations for accuracy'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'Calculate BSA for a patient who is 6 feet tall (183 cm) and weighs 176 lbs (80 kg).',
            answer: '2.02 m²',
            solution: 'BSA = √[(183 × 80) / 3600] = √[14,640 / 3600] = √4.07 = 2.02 m²'
          }
        ]
      },
      order: 5,
    },
    {
      title: 'Vasoactive Drip Calculations',
      slug: 'vasoactive-drips',
      description: 'Master critical care calculations for vasoactive medications including dopamine, norepinephrine, and epinephrine',
      content: `# Vasoactive Drip Calculations

## Introduction

Vasoactive medications are life-saving drugs used in critical care to support blood pressure and cardiac output. Accurate calculation and titration of these high-alert medications is essential for patient safety and optimal outcomes.

## Understanding Vasoactive Medications

### Common Vasoactive Agents

1. **Norepinephrine (Levophed)**
   - First-line for septic shock
   - Dose: 0.01-3 mcg/kg/min
   - Primary: α-adrenergic (vasoconstriction)

2. **Epinephrine**
   - Anaphylaxis, cardiac arrest
   - Dose: 0.01-1 mcg/kg/min
   - Mixed α and β effects

3. **Dopamine**
   - Dose-dependent effects
   - 2-5 mcg/kg/min: Renal dose
   - 5-10 mcg/kg/min: Inotropic
   - >10 mcg/kg/min: Vasopressor

4. **Vasopressin**
   - Non-catecholamine vasopressor
   - Fixed dose: 0.01-0.04 units/min
   - No weight-based calculation

5. **Phenylephrine (Neo-Synephrine)**
   - Pure α-agonist
   - 0.5-5 mcg/kg/min
   - No cardiac effects

## The Universal Vasoactive Formula

### For mcg/kg/min Medications

**Pump Rate (mL/hr) = [Dose (mcg/kg/min) × Weight (kg) × 60] / Concentration (mcg/mL)**

### Breaking Down the Formula

1. **Dose × Weight** = mcg/min needed
2. **× 60** = converts to mcg/hr
3. **÷ Concentration** = mL/hr pump rate

### Memory Aid: "MAGIC 60"
- **M**ultiply dose by weight
- **A**dd conversion factor (60)
- **G**et hourly requirement
- **I**dentify concentration
- **C**alculate pump rate

## Standard Concentrations

### Why Standard Concentrations Matter

- Reduces calculation errors
- Allows quick titration
- Facilitates staff familiarity
- Enables pre-programmed pumps

### Common Standard Concentrations

**Norepinephrine**:
- Standard: 4 mg in 250 mL = 16 mcg/mL
- Double: 8 mg in 250 mL = 32 mcg/mL
- Max: 16 mg in 250 mL = 64 mcg/mL

**Epinephrine**:
- Standard: 4 mg in 250 mL = 16 mcg/mL
- Pediatric: 1 mg in 250 mL = 4 mcg/mL

**Dopamine**:
- Standard: 400 mg in 250 mL = 1600 mcg/mL
- Double: 800 mg in 250 mL = 3200 mcg/mL

## Step-by-Step Calculations

### Example 1: Starting Norepinephrine

**Scenario**:
- Patient: 80 kg
- Order: Start norepinephrine at 0.05 mcg/kg/min
- Supply: 4 mg in 250 mL

**Step 1**: Calculate concentration
- 4 mg = 4000 mcg
- 4000 mcg ÷ 250 mL = 16 mcg/mL

**Step 2**: Calculate mcg/min needed
- 0.05 mcg/kg/min × 80 kg = 4 mcg/min

**Step 3**: Convert to mcg/hr
- 4 mcg/min × 60 = 240 mcg/hr

**Step 4**: Calculate pump rate
- 240 mcg/hr ÷ 16 mcg/mL = 15 mL/hr

### Example 2: Titrating Dopamine

**Scenario**:
- Patient: 75 kg
- Current: Dopamine at 5 mcg/kg/min
- Order: Increase to 7.5 mcg/kg/min
- Supply: 400 mg in 250 mL

**Current Rate**:
- 5 × 75 × 60 ÷ 1600 = 14.1 mL/hr

**New Rate**:
- 7.5 × 75 × 60 ÷ 1600 = 21.1 mL/hr

**Increase pump by**: 7 mL/hr

## Quick Calculation Methods

### The Rule of 6 (Pediatrics)

For a 1 mcg/kg/min = 1 mL/hr rate:
- 6 × weight (kg) = mg of drug
- Add to 100 mL total volume

**Example**: 10 kg child
- 6 × 10 = 60 mg dopamine
- In 100 mL total volume
- 1 mL/hr = 1 mcg/kg/min

### Standard Concentration Quick Reference

**For 16 mcg/mL concentration**:
- 0.05 mcg/kg/min ≈ 0.2 × weight = mL/hr
- 0.1 mcg/kg/min ≈ 0.4 × weight = mL/hr

**For 1600 mcg/mL concentration**:
- 5 mcg/kg/min ≈ 0.2 × weight = mL/hr
- 10 mcg/kg/min ≈ 0.4 × weight = mL/hr

## Titration Strategies

### Starting and Maximum Doses

**Norepinephrine Titration**:
- Start: 0.05 mcg/kg/min
- Titrate: by 0.02-0.05 every 2-5 minutes
- Goal: MAP >65 mmHg
- Max: 3 mcg/kg/min (consider second agent)

**Dopamine Titration**:
- Start: 5 mcg/kg/min
- Titrate: by 2.5-5 mcg/kg/min every 5-10 minutes
- Max: 20 mcg/kg/min

### Weaning Protocol

1. Achieve stability for >2 hours
2. Decrease by 25% of current dose
3. Monitor for 15-30 minutes
4. Continue if stable
5. Consider slower wean <0.05 mcg/kg/min

## Safety Considerations

### Pre-Administration Checks

✓ Central line placement (preferred)
✓ Accurate current weight
✓ Baseline vital signs
✓ Cardiac monitoring active
✓ Arterial line (if available)

### During Administration

**Monitor**:
- Blood pressure q2-5 minutes during titration
- Heart rate and rhythm
- Urine output
- Peripheral perfusion
- IV site (if peripheral)

### Critical Safety Points

1. **Never bolus** vasoactive drips
2. **Label lines** clearly
3. **Use dedicated line** when possible
4. **Have emergency drugs** ready
5. **Know your concentrations**

## Special Situations

### Peripheral Administration

**If central access unavailable**:
- Use large bore IV (18G or larger)
- Proximal site preferred
- Lower concentrations
- Monitor site q30min
- Have phenylephrine ready for extravasation

### Switching Between Agents

**Overlap Method**:
1. Start new agent at low dose
2. Titrate up while first agent on
3. Wean first agent gradually
4. Avoid gaps in coverage

### Multiple Pressors

**Common Combinations**:
- Norepinephrine + Vasopressin
- Norepinephrine + Epinephrine
- Avoid Dopamine + Dobutamine via same line

## Practice Scenarios

### Scenario 1: Emergency Start
**Situation**: 90 kg patient, BP 70/40, start norepinephrine STAT
**Available**: 8 mg in 250 mL

**Quick Calculation**:
- Concentration: 32 mcg/mL
- Start at 0.1 mcg/kg/min
- Rate: 0.1 × 90 × 60 ÷ 32 = 16.9 mL/hr
- Round to 17 mL/hr

### Scenario 2: Complex Titration
**Current**: Norepinephrine 0.3 mcg/kg/min, Vasopressin 0.03 units/min
**Problem**: Still hypotensive
**Plan**: Add epinephrine

**Calculation for 70 kg patient**:
- Start epinephrine 0.05 mcg/kg/min
- Using 4 mg/250 mL = 16 mcg/mL
- Rate: 0.05 × 70 × 60 ÷ 16 = 13.1 mL/hr

## Quick Reference Card

### Norepinephrine (16 mcg/mL)
| Dose (mcg/kg/min) | 60 kg | 70 kg | 80 kg | 90 kg |
|-------------------|-------|-------|-------|-------|
| 0.05 | 11.3 | 13.1 | 15.0 | 16.9 |
| 0.1 | 22.5 | 26.3 | 30.0 | 33.8 |
| 0.2 | 45.0 | 52.5 | 60.0 | 67.5 |

### Dopamine (1600 mcg/mL)
| Dose (mcg/kg/min) | 60 kg | 70 kg | 80 kg | 90 kg |
|-------------------|-------|-------|-------|-------|
| 5 | 11.3 | 13.1 | 15.0 | 16.9 |
| 10 | 22.5 | 26.3 | 30.0 | 33.8 |
| 15 | 33.8 | 39.4 | 45.0 | 50.6 |

## Summary

Vasoactive drip calculations require:
- Accurate weight-based calculations
- Understanding of standard concentrations
- Systematic approach to titration
- Vigilant safety monitoring
- Clear communication during handoffs

**Remember**: These are life-saving medications with narrow therapeutic windows. Always double-check calculations and never hesitate to ask for verification!`,
      categoryId: categories[4].id,
      conceptIds: [concepts[5].id, concepts[8].id],
      difficulty: 'EXPERT',
      readingTime: 22,
      prerequisites: ['iv-pump-programming'],
      learningOutcomes: [
        'Calculate vasoactive drip rates accurately',
        'Convert between different concentration standards',
        'Apply safe titration strategies',
        'Recognize maximum doses and safety limits',
        'Manage multiple vasopressor combinations'
      ],
      practiceProblems: {
        problems: [
          {
            question: 'Start norepinephrine at 0.08 mcg/kg/min for a 85 kg patient. Supply: 4 mg in 250 mL.',
            answer: '25.5 mL/hr',
            solution: 'Concentration: 4mg/250mL = 16 mcg/mL. Rate: 0.08 × 85 × 60 ÷ 16 = 25.5 mL/hr'
          }
        ]
      },
      order: 6,
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

// Function removed - no fake users in production

seedProduction()
  .catch((e) => {
    console.error('❌ Production seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

