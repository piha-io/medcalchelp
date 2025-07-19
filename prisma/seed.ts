import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.userAttempt.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.score.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.questionTemplate.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create question templates
  const questions = [
    // Dosage Calculations - Beginner
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'BEGINNER',
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
      difficulty: 'BEGINNER',
      title: 'Liquid Medication Dosage',
      templateText: 'A patient needs {dose}mg of liquid medication. The medication comes as {concentration}mg/{volume}mL. How many mL should be given?',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 50, max: 500, step: 25 },
        concentration: { min: 50, max: 200, step: 25 },
        volume: { min: 1, max: 5, step: 1 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'First find mg per mL',
        'Then calculate how many mL needed for the dose'
      ],
      explanation: 'To find the volume needed: ({dose}mg) ÷ ({concentration}mg/{volume}mL) = {answer} mL'
    },
    
    // IV Drip Rate
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'IV Drip Rate Calculation',
      templateText: 'Infuse {volume}mL over {hours} hours. The drop factor is {dropFactor} drops/mL. Calculate the drip rate in drops per minute.',
      formulaTemplate: '({volume} * {dropFactor}) / ({hours} * 60)',
      variables: {
        volume: { min: 250, max: 1000, step: 250 },
        hours: { min: 1, max: 8, step: 1 },
        dropFactor: { min: 10, max: 60, step: 10 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        dropFactor: 'drops/mL',
        answer: 'drops/min'
      },
      hints: [
        'Convert hours to minutes first',
        'Use the formula: (Volume × Drop factor) ÷ Time in minutes'
      ],
      explanation: 'Drip rate = (Volume × Drop factor) ÷ Time in minutes. ({volume}mL × {dropFactor} drops/mL) ÷ ({hours} × 60 min) = {answer} drops/min'
    },

    // Unit Conversion
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'BEGINNER',
      title: 'Metric Weight Conversion',
      templateText: 'Convert {value} kg to pounds (lbs). Use 1 kg = 2.2 lbs.',
      formulaTemplate: '{value} * 2.2',
      variables: {
        value: { min: 40, max: 120, step: 5 }
      },
      units: {
        value: 'kg',
        answer: 'lbs'
      },
      hints: [
        'Multiply kg by 2.2 to get pounds',
        '1 kilogram = 2.2 pounds'
      ],
      explanation: 'To convert kg to lbs: multiply by 2.2. {value} kg × 2.2 = {answer} lbs'
    },

    // Pediatric Dosing
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      difficulty: 'INTERMEDIATE',
      title: 'Weight-Based Pediatric Dosing',
      templateText: 'A child weighs {weight} kg. The prescribed dose is {dosePerKg} mg/kg/day divided into {doses} doses. What is the dose per administration?',
      formulaTemplate: '({weight} * {dosePerKg}) / {doses}',
      variables: {
        weight: { min: 10, max: 40, step: 5 },
        dosePerKg: { min: 10, max: 50, step: 5 },
        doses: { min: 2, max: 4, step: 1 }
      },
      units: {
        weight: 'kg',
        dosePerKg: 'mg/kg/day',
        doses: 'doses/day',
        answer: 'mg'
      },
      hints: [
        'First calculate total daily dose',
        'Then divide by number of doses'
      ],
      explanation: 'Daily dose = Weight × Dose per kg. Single dose = Daily dose ÷ Number of doses. ({weight} kg × {dosePerKg} mg/kg) ÷ {doses} = {answer} mg per dose'
    },

    // Advanced IV Calculation
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'ADVANCED',
      title: 'Medication Infusion Rate',
      templateText: 'Start a dopamine infusion at {dose} mcg/kg/min for a patient weighing {weight} kg. The concentration is {concentration} mg in {volume} mL. Calculate the infusion rate in mL/hr.',
      formulaTemplate: '({dose} * {weight} * 60) / ({concentration} * 1000 / {volume})',
      variables: {
        dose: { min: 2, max: 20, step: 2 },
        weight: { min: 60, max: 100, step: 5 },
        concentration: { min: 200, max: 800, step: 200 },
        volume: { min: 250, max: 500, step: 250 }
      },
      units: {
        dose: 'mcg/kg/min',
        weight: 'kg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL/hr'
      },
      hints: [
        'Convert mcg/min to mg/hr',
        'Calculate concentration in mg/mL',
        'Use dimensional analysis'
      ],
      explanation: 'First find mcg/min: {dose} × {weight} = total mcg/min. Convert to mg/hr: × 60 ÷ 1000. Concentration: {concentration}mg/{volume}mL. Rate = mg/hr ÷ mg/mL = {answer} mL/hr'
    },

    // More Dosage Calculations
    {
      type: 'DOSAGE_CALCULATION',
      category: 'INJECTABLE_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Injectable Medication',
      templateText: 'A patient needs {dose}mg of medication IM. The vial contains {concentration}mg/{volume}mL. How many mL should you draw up?',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 25, max: 200, step: 25 },
        concentration: { min: 50, max: 250, step: 50 },
        volume: { min: 1, max: 2, step: 0.5 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Find the concentration per mL',
        'Divide the required dose by the concentration'
      ],
      explanation: 'To calculate the volume: {dose}mg ÷ ({concentration}mg/{volume}mL) = {answer} mL'
    },

    // Concentration calculations
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Solution Concentration',
      templateText: 'You have {volume1}mL of a {percent1}% solution. How many mL of sterile water should you add to make it a {percent2}% solution?',
      formulaTemplate: '({volume1} * {percent1} / {percent2}) - {volume1}',
      variables: {
        volume1: { min: 10, max: 50, step: 10 },
        percent1: { min: 10, max: 50, step: 10 },
        percent2: { min: 1, max: 5, step: 1 }
      },
      units: {
        volume1: 'mL',
        percent1: '%',
        percent2: '%',
        answer: 'mL'
      },
      hints: [
        'Calculate the amount of active ingredient',
        'Find the total volume needed for the new concentration'
      ],
      explanation: 'Active ingredient: {volume1}mL × {percent1}% = amount. New volume needed: amount ÷ {percent2}%. Water to add: new volume - {volume1}mL = {answer} mL'
    },

    // More unit conversions
    {
      type: 'UNIT_CONVERSION',
      category: 'VOLUME_CONVERSION',
      difficulty: 'BEGINNER',
      title: 'Volume Conversion',
      templateText: 'Convert {value} L to mL.',
      formulaTemplate: '{value} * 1000',
      variables: {
        value: { min: 0.5, max: 5, step: 0.5, decimal: 1 }
      },
      units: {
        value: 'L',
        answer: 'mL'
      },
      hints: [
        '1 L = 1000 mL',
        'Multiply liters by 1000'
      ],
      explanation: 'To convert L to mL: {value} L × 1000 = {answer} mL'
    },

    {
      type: 'UNIT_CONVERSION',
      category: 'TIME_CONVERSION',
      difficulty: 'BEGINNER',
      title: 'Time Conversion',
      templateText: 'Convert {value} hours to minutes.',
      formulaTemplate: '{value} * 60',
      variables: {
        value: { min: 0.5, max: 8, step: 0.5, decimal: 1 }
      },
      units: {
        value: 'hours',
        answer: 'minutes'
      },
      hints: [
        '1 hour = 60 minutes',
        'Multiply hours by 60'
      ],
      explanation: 'To convert hours to minutes: {value} hours × 60 = {answer} minutes'
    },

    // Dilution calculations
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'ADVANCED',
      title: 'Medication Dilution',
      templateText: 'You need to prepare {dose}mg of medication in {finalVolume}mL. The stock concentration is {stockConc}mg/mL. How many mL of the stock solution do you need?',
      formulaTemplate: '{dose} / {stockConc}',
      variables: {
        dose: { min: 50, max: 500, step: 50 },
        finalVolume: { min: 50, max: 250, step: 50 },
        stockConc: { min: 10, max: 100, step: 10 }
      },
      units: {
        dose: 'mg',
        finalVolume: 'mL',
        stockConc: 'mg/mL',
        answer: 'mL'
      },
      hints: [
        'Use C1V1 = C2V2 principle',
        'Volume needed = Dose ÷ Stock concentration'
      ],
      explanation: 'To find stock volume needed: {dose}mg ÷ {stockConc}mg/mL = {answer} mL of stock solution'
    },

    // BSA calculations
    {
      type: 'PEDIATRIC_DOSING',
      category: 'BSA_BASED',
      difficulty: 'EXPERT',
      title: 'BSA-Based Dosing',
      templateText: 'A child has a BSA of {bsa} m². The recommended dose is {dosePerBSA} mg/m²/day divided into {doses} doses. What is each dose?',
      formulaTemplate: '({bsa} * {dosePerBSA}) / {doses}',
      variables: {
        bsa: { min: 0.5, max: 1.5, step: 0.1, decimal: 1 },
        dosePerBSA: { min: 100, max: 500, step: 50 },
        doses: { min: 2, max: 4, step: 1 }
      },
      units: {
        bsa: 'm²',
        dosePerBSA: 'mg/m²/day',
        doses: 'doses/day',
        answer: 'mg'
      },
      hints: [
        'Calculate total daily dose first',
        'BSA × dose per m² = total daily dose'
      ],
      explanation: 'Daily dose: {bsa} m² × {dosePerBSA} mg/m² = total daily dose. Each dose: total ÷ {doses} = {answer} mg'
    }
  ]

  for (const question of questions) {
    await prisma.questionTemplate.create({
      data: {
        type: question.type as any,
        category: question.category as any,
        difficulty: question.difficulty as any,
        title: question.title,
        templateText: question.templateText,
        formulaTemplate: question.formulaTemplate,
        variables: question.variables,
        units: question.units,
        hints: question.hints,
        explanation: question.explanation
      }
    })
  }

  console.log(`✅ Created ${questions.length} question templates`)
  console.log('🌱 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })