import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create question templates
  const questions = [
    // Dosage Calculations
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