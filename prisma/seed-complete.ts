import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting complete database seed with ALL categories...')

  // Clear existing data
  await prisma.userAttempt.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.score.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.questionTemplate.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create comprehensive question templates for ALL categories
  const questions = [
    // INSULIN_DOSING Questions
    {
      type: 'INSULIN_DOSING',
      category: 'SLIDING_SCALE',
      difficulty: 'BEGINNER',
      title: 'Basic Sliding Scale Insulin',
      templateText: 'Patient blood glucose is {glucose} mg/dL. Using a sliding scale where {lowRange}-{highRange} mg/dL requires {units} units of insulin, how many units should be given?',
      formulaTemplate: '{units}',
      variables: {
        glucose: { min: 150, max: 400, step: 10 },
        lowRange: { min: 150, max: 200, step: 50 },
        highRange: { min: 200, max: 250, step: 50 },
        units: { min: 2, max: 8, step: 1 }
      },
      units: {
        glucose: 'mg/dL',
        answer: 'units'
      },
      hints: [
        'Check if the glucose level falls within the given range',
        'Use the corresponding insulin units for that range'
      ],
      explanation: 'For sliding scale insulin, match the patient\'s glucose level to the appropriate range and administer the corresponding units.'
    },
    {
      type: 'INSULIN_DOSING',
      category: 'CORRECTION_FACTOR',
      difficulty: 'INTERMEDIATE',
      title: 'Insulin Correction Factor',
      templateText: 'Patient blood glucose is {glucose} mg/dL with a target of {target} mg/dL. If correction factor is 1 unit per {factor} mg/dL, how many units of insulin are needed?',
      formulaTemplate: '({glucose} - {target}) / {factor}',
      variables: {
        glucose: { min: 180, max: 400, step: 10 },
        target: { min: 100, max: 140, step: 10 },
        factor: { min: 30, max: 60, step: 5 }
      },
      units: {
        glucose: 'mg/dL',
        target: 'mg/dL',
        factor: 'mg/dL',
        answer: 'units'
      },
      hints: [
        'Calculate the difference between current and target glucose',
        'Divide by the correction factor'
      ],
      explanation: 'Correction factor formula: (Current glucose - Target glucose) ÷ Correction factor = Units needed. ({glucose} - {target}) ÷ {factor} = {answer} units'
    },
    {
      type: 'INSULIN_DOSING',
      category: 'SLIDING_SCALE',
      difficulty: 'EXPERT',
      title: 'Complex Insulin Calculation',
      templateText: 'Patient needs {carbs}g carbs coverage (1:{ratio} ratio) plus correction for glucose {glucose} mg/dL (target {target} mg/dL, factor 1:{factor}). Total insulin needed?',
      formulaTemplate: '{carbs} / {ratio} + ({glucose} - {target}) / {factor}',
      variables: {
        carbs: { min: 30, max: 90, step: 5 },
        ratio: { min: 10, max: 20, step: 1 },
        glucose: { min: 180, max: 350, step: 10 },
        target: { min: 100, max: 120, step: 10 },
        factor: { min: 30, max: 50, step: 5 }
      },
      units: {
        carbs: 'g',
        glucose: 'mg/dL',
        target: 'mg/dL',
        answer: 'units'
      },
      hints: [
        'Calculate carb coverage first',
        'Then calculate correction dose',
        'Add both together for total'
      ],
      explanation: 'Total insulin = Carb coverage + Correction dose. Carb coverage: {carbs}g ÷ {ratio} = carb units. Correction: ({glucose} - {target}) ÷ {factor} = correction units. Total = {answer} units'
    },

    // HEPARIN_PROTOCOL Questions
    {
      type: 'HEPARIN_PROTOCOL',
      category: 'HEPARIN_CALCULATION',
      difficulty: 'BEGINNER',
      title: 'Basic Heparin Bolus',
      templateText: 'Patient weighs {weight} kg. Heparin protocol calls for {dose} units/kg bolus. How many units should be given?',
      formulaTemplate: '{weight} * {dose}',
      variables: {
        weight: { min: 50, max: 120, step: 5 },
        dose: { min: 60, max: 80, step: 5 }
      },
      units: {
        weight: 'kg',
        dose: 'units/kg',
        answer: 'units'
      },
      hints: [
        'Multiply weight by dose per kg',
        'Round to nearest 100 units if protocol requires'
      ],
      explanation: 'Heparin bolus = Weight × Dose per kg. {weight} kg × {dose} units/kg = {answer} units'
    },
    {
      type: 'HEPARIN_PROTOCOL',
      category: 'HEPARIN_CALCULATION',
      difficulty: 'INTERMEDIATE',
      title: 'Heparin Infusion Rate',
      templateText: 'Patient weighs {weight} kg. Start heparin at {rate} units/kg/hr. Heparin concentration is {concentration} units/mL. What is the infusion rate in mL/hr?',
      formulaTemplate: '({weight} * {rate}) / {concentration}',
      variables: {
        weight: { min: 60, max: 100, step: 5 },
        rate: { min: 12, max: 18, step: 1 },
        concentration: { min: 50, max: 100, step: 25 }
      },
      units: {
        weight: 'kg',
        rate: 'units/kg/hr',
        concentration: 'units/mL',
        answer: 'mL/hr'
      },
      hints: [
        'First calculate total units/hr',
        'Then divide by concentration to get mL/hr'
      ],
      explanation: 'Step 1: {weight} kg × {rate} units/kg/hr = total units/hr. Step 2: total units/hr ÷ {concentration} units/mL = {answer} mL/hr'
    },
    {
      type: 'HEPARIN_PROTOCOL',
      category: 'HEPARIN_CALCULATION',
      difficulty: 'EXPERT',
      title: 'Heparin Protocol Adjustment',
      templateText: 'aPTT is {aptt} seconds. Current rate is {current} mL/hr. Protocol: increase by {increase} units/kg/hr for aPTT < 60. Patient weighs {weight} kg, concentration {concentration} units/mL. New rate?',
      formulaTemplate: '{current} + ({weight} * {increase}) / {concentration}',
      variables: {
        aptt: { min: 40, max: 59, step: 1 },
        current: { min: 15, max: 25, step: 1 },
        increase: { min: 2, max: 4, step: 1 },
        weight: { min: 70, max: 90, step: 5 },
        concentration: { min: 50, max: 100, step: 50 }
      },
      units: {
        aptt: 'seconds',
        current: 'mL/hr',
        increase: 'units/kg/hr',
        weight: 'kg',
        concentration: 'units/mL',
        answer: 'mL/hr'
      },
      hints: [
        'Calculate the increase in units/hr',
        'Convert to mL/hr using concentration',
        'Add to current rate'
      ],
      explanation: 'Increase = {weight} kg × {increase} units/kg/hr = increase units/hr. Convert: increase units/hr ÷ {concentration} units/mL = increase mL/hr. New rate: {current} + increase = {answer} mL/hr'
    },

    // CRITICAL_CARE Questions
    {
      type: 'CRITICAL_CARE',
      category: 'CRITICAL_CALCULATION',
      difficulty: 'BEGINNER',
      title: 'Vasopressor Calculation',
      templateText: 'Norepinephrine {dose} mcg/min ordered. Concentration is {concentration} mcg/mL. What is the infusion rate in mL/hr?',
      formulaTemplate: '{dose} * 60 / {concentration}',
      variables: {
        dose: { min: 2, max: 20, step: 2 },
        concentration: { min: 4, max: 16, step: 4 }
      },
      units: {
        dose: 'mcg/min',
        concentration: 'mcg/mL',
        answer: 'mL/hr'
      },
      hints: [
        'Convert mcg/min to mcg/hr (multiply by 60)',
        'Divide by concentration'
      ],
      explanation: 'Convert rate: {dose} mcg/min × 60 min/hr = mcg/hr. Then: mcg/hr ÷ {concentration} mcg/mL = {answer} mL/hr'
    },
    {
      type: 'CRITICAL_CARE',
      category: 'CRITICAL_CALCULATION',
      difficulty: 'INTERMEDIATE',
      title: 'Dopamine Dosing',
      templateText: 'Patient weighs {weight} kg. Dopamine ordered at {dose} mcg/kg/min. Solution: {total}mg in {volume}mL. Calculate mL/hr.',
      formulaTemplate: '({weight} * {dose} * 60) / ({total} * 1000 / {volume})',
      variables: {
        weight: { min: 60, max: 100, step: 5 },
        dose: { min: 2, max: 10, step: 1 },
        total: { min: 200, max: 400, step: 100 },
        volume: { min: 250, max: 250, step: 0 }
      },
      units: {
        weight: 'kg',
        dose: 'mcg/kg/min',
        total: 'mg',
        volume: 'mL',
        answer: 'mL/hr'
      },
      hints: [
        'Calculate mcg/min needed',
        'Convert to mcg/hr',
        'Find concentration in mcg/mL',
        'Calculate mL/hr'
      ],
      explanation: 'Dose needed: {weight} kg × {dose} mcg/kg/min = mcg/min. Convert: mcg/min × 60 = mcg/hr. Concentration: {total} mg × 1000 ÷ {volume} mL = mcg/mL. Rate: mcg/hr ÷ mcg/mL = {answer} mL/hr'
    },
    {
      type: 'CRITICAL_CARE',
      category: 'CRITICAL_CALCULATION',
      difficulty: 'EXPERT',
      title: 'Titrating Vasoactive Drips',
      templateText: 'Current epinephrine at {current} mL/hr ({concentration} mcg/mL). Need to increase by {increase} mcg/min. New rate in mL/hr?',
      formulaTemplate: '{current} + ({increase} * 60 / {concentration})',
      variables: {
        current: { min: 5, max: 20, step: 1 },
        concentration: { min: 4, max: 8, step: 2 },
        increase: { min: 0.5, max: 2, step: 0.5 }
      },
      units: {
        current: 'mL/hr',
        concentration: 'mcg/mL',
        increase: 'mcg/min',
        answer: 'mL/hr'
      },
      hints: [
        'Convert increase from mcg/min to mcg/hr',
        'Calculate additional mL/hr needed',
        'Add to current rate'
      ],
      explanation: 'Increase in mcg/hr: {increase} mcg/min × 60 = mcg/hr. Additional mL/hr: mcg/hr ÷ {concentration} mcg/mL = additional mL/hr. New rate: {current} + additional = {answer} mL/hr'
    },

    // RECONSTITUTION Questions
    {
      type: 'RECONSTITUTION',
      category: 'POWDER_RECONSTITUTION',
      difficulty: 'BEGINNER',
      title: 'Basic Powder Reconstitution',
      templateText: 'Reconstitute {vial}mg vial with {diluent}mL sterile water. What is the final concentration in mg/mL?',
      formulaTemplate: '{vial} / {diluent}',
      variables: {
        vial: { min: 250, max: 1000, step: 250 },
        diluent: { min: 2, max: 10, step: 1 }
      },
      units: {
        vial: 'mg',
        diluent: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Divide total drug amount by total volume',
        'Concentration = Amount ÷ Volume'
      ],
      explanation: 'Final concentration = Total drug ÷ Total volume. {vial} mg ÷ {diluent} mL = {answer} mg/mL'
    },
    {
      type: 'RECONSTITUTION',
      category: 'POWDER_RECONSTITUTION',
      difficulty: 'INTERMEDIATE',
      title: 'Multi-step Reconstitution',
      templateText: 'Reconstitute {vial}mg vial to {concentration}mg/mL. How much diluent is needed? (Powder volume is {powder}mL)',
      formulaTemplate: '{vial} / {concentration} - {powder}',
      variables: {
        vial: { min: 500, max: 2000, step: 500 },
        concentration: { min: 50, max: 100, step: 10 },
        powder: { min: 0.5, max: 2, step: 0.5 }
      },
      units: {
        vial: 'mg',
        concentration: 'mg/mL',
        powder: 'mL',
        answer: 'mL'
      },
      hints: [
        'Calculate final volume needed',
        'Subtract powder volume from final volume',
        'This gives diluent volume needed'
      ],
      explanation: 'Final volume needed: {vial} mg ÷ {concentration} mg/mL = total mL. Diluent needed: total mL - {powder} mL powder = {answer} mL diluent'
    },
    {
      type: 'RECONSTITUTION',
      category: 'POWDER_RECONSTITUTION',
      difficulty: 'EXPERT',
      title: 'Complex Reconstitution for Dosing',
      templateText: 'Patient needs {dose}mg. Reconstitute {vial}mg vial with {diluent}mL (powder volume {powder}mL). How many mL to draw up?',
      formulaTemplate: '{dose} / ({vial} / ({diluent} + {powder}))',
      variables: {
        dose: { min: 75, max: 400, step: 25 },
        vial: { min: 500, max: 1000, step: 250 },
        diluent: { min: 5, max: 10, step: 1 },
        powder: { min: 0.5, max: 1.5, step: 0.5 }
      },
      units: {
        dose: 'mg',
        vial: 'mg',
        diluent: 'mL',
        powder: 'mL',
        answer: 'mL'
      },
      hints: [
        'Calculate total volume after reconstitution',
        'Find concentration',
        'Calculate volume for desired dose'
      ],
      explanation: 'Total volume: {diluent} mL + {powder} mL = total mL. Concentration: {vial} mg ÷ total mL = mg/mL. Volume to draw: {dose} mg ÷ concentration = {answer} mL'
    },

    // Also include all the existing questions from seed-expanded.ts
    // DOSAGE_CALCULATION - All difficulties
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic Tablet Dosage',
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
      title: 'Liquid Medication Volume',
      templateText: 'A patient needs {dose}mg of liquid medication. The medication comes as {concentration}mg/{volume}mL. How many mL should be given?',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 50, max: 500, step: 25 },
        concentration: { min: 25, max: 250, step: 25 },
        volume: { min: 5, max: 5, step: 0 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Set up a proportion',
        'Cross multiply to solve'
      ],
      explanation: 'Using proportion: {concentration}mg/{volume}mL = {dose}mg/x mL. Solving: x = {dose}mg × {volume}mL ÷ {concentration}mg = {answer}mL'
    },
    {
      type: 'DOSAGE_CALCULATION',
      category: 'INJECTABLE_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'IM Injection Dosage',
      templateText: 'Order: {dose}mg IM. Available: {concentration}mg/mL in a {vial}mL vial. How many mL should be drawn up?',
      formulaTemplate: '{dose} / {concentration}',
      variables: {
        dose: { min: 25, max: 150, step: 25 },
        concentration: { min: 50, max: 100, step: 10 },
        vial: { min: 2, max: 10, step: 1 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg/mL',
        vial: 'mL',
        answer: 'mL'
      },
      hints: [
        'Divide ordered dose by concentration',
        'Ensure the volume doesn\'t exceed vial size'
      ],
      explanation: 'Volume to draw = Ordered dose ÷ Concentration. {dose}mg ÷ {concentration}mg/mL = {answer}mL'
    },
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Weight-Based Oral Dosing',
      templateText: 'A child weighing {weight}kg needs {dosePer}mg/kg of medication. Suspension available: {concentration}mg/{volume}mL. How many mL?',
      formulaTemplate: '{weight} * {dosePer} / {concentration} * {volume}',
      variables: {
        weight: { min: 10, max: 40, step: 2 },
        dosePer: { min: 5, max: 15, step: 1 },
        concentration: { min: 100, max: 250, step: 50 },
        volume: { min: 5, max: 5, step: 0 }
      },
      units: {
        weight: 'kg',
        dosePer: 'mg/kg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'First calculate total dose needed',
        'Then calculate volume based on concentration'
      ],
      explanation: 'Total dose = {weight}kg × {dosePer}mg/kg = total mg. Volume = total mg ÷ ({concentration}mg/{volume}mL) × {volume}mL = {answer}mL'
    },
    {
      type: 'DOSAGE_CALCULATION',
      category: 'INJECTABLE_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex SubQ Calculation',
      templateText: 'Patient needs {dose}mcg SubQ. Vial: {vialContent}mg/{vialVolume}mL after reconstitution. How many mL to inject?',
      formulaTemplate: '{dose} / 1000 / ({vialContent} / {vialVolume})',
      variables: {
        dose: { min: 50, max: 500, step: 50 },
        vialContent: { min: 1, max: 5, step: 1 },
        vialVolume: { min: 1, max: 2, step: 0.5 }
      },
      units: {
        dose: 'mcg',
        vialContent: 'mg',
        vialVolume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Convert mcg to mg first',
        'Calculate concentration in mg/mL',
        'Divide dose by concentration'
      ],
      explanation: 'Convert: {dose}mcg = {dose}/1000 mg. Concentration: {vialContent}mg/{vialVolume}mL. Volume: dose in mg ÷ concentration = {answer}mL'
    },
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Multi-Dose Calculation',
      templateText: 'Prescription: {dose}mg PO q{hours}h for {days} days. Tablets are {strength}mg. How many tablets total?',
      formulaTemplate: '{dose} / {strength} * (24 / {hours}) * {days}',
      variables: {
        dose: { min: 250, max: 1000, step: 250 },
        hours: { min: 6, max: 12, step: 2 },
        days: { min: 5, max: 14, step: 1 },
        strength: { min: 250, max: 500, step: 250 }
      },
      units: {
        dose: 'mg',
        hours: 'hours',
        days: 'days',
        strength: 'mg',
        answer: 'tablets'
      },
      hints: [
        'Calculate tablets per dose',
        'Calculate doses per day',
        'Multiply by number of days'
      ],
      explanation: 'Tablets per dose: {dose}mg ÷ {strength}mg = tablets. Doses per day: 24 ÷ {hours} = doses. Total: tablets × doses × {days} days = {answer} tablets'
    },

    // IV_DRIP_RATE - All difficulties
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic IV Rate',
      templateText: 'Infuse {volume}mL over {hours} hours. What is the flow rate in mL/hr?',
      formulaTemplate: '{volume} / {hours}',
      variables: {
        volume: { min: 500, max: 1000, step: 50 },
        hours: { min: 4, max: 12, step: 1 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        answer: 'mL/hr'
      },
      hints: [
        'Divide total volume by time in hours',
        'Round to nearest whole number'
      ],
      explanation: 'IV flow rate = Total volume ÷ Time in hours. {volume}mL ÷ {hours} hours = {answer}mL/hr'
    },
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Drops per Minute',
      templateText: 'IV order: {volume}mL over {hours} hours using {dropFactor} gtt/mL tubing. Calculate drops/min.',
      formulaTemplate: '{volume} / ({hours} * 60) * {dropFactor}',
      variables: {
        volume: { min: 250, max: 1000, step: 250 },
        hours: { min: 2, max: 8, step: 1 },
        dropFactor: { min: 10, max: 20, step: 5 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        dropFactor: 'gtt/mL',
        answer: 'gtt/min'
      },
      hints: [
        'First find mL/min',
        'Then multiply by drop factor'
      ],
      explanation: 'Step 1: {volume}mL ÷ ({hours} × 60 min) = mL/min. Step 2: mL/min × {dropFactor} gtt/mL = {answer} gtt/min'
    },
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Medication Infusion Rate',
      templateText: 'Infuse {dose}mg in {volume}mL over {minutes} minutes. What is the mL/hr rate?',
      formulaTemplate: '{volume} / {minutes} * 60',
      variables: {
        dose: { min: 100, max: 500, step: 50 },
        volume: { min: 50, max: 250, step: 50 },
        minutes: { min: 30, max: 120, step: 15 }
      },
      units: {
        dose: 'mg',
        volume: 'mL',
        minutes: 'minutes',
        answer: 'mL/hr'
      },
      hints: [
        'Convert minutes to hours',
        'Or calculate mL/min then multiply by 60'
      ],
      explanation: 'Method: {volume}mL ÷ {minutes} min × 60 min/hr = {answer}mL/hr'
    },
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Micro-drip Calculation',
      templateText: 'Pediatric IV: {volume}mL over {hours} hours. Using micro-drip (60 gtt/mL). Calculate gtt/min.',
      formulaTemplate: '{volume} / {hours}',
      variables: {
        volume: { min: 100, max: 500, step: 50 },
        hours: { min: 4, max: 24, step: 2 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        answer: 'gtt/min'
      },
      hints: [
        'With micro-drip (60 gtt/mL), mL/hr = gtt/min',
        'Just calculate mL/hr'
      ],
      explanation: 'For micro-drip sets: mL/hr = gtt/min. {volume}mL ÷ {hours} hours = {answer} mL/hr = {answer} gtt/min'
    },
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex Dopamine Drip',
      templateText: 'Start dopamine at {dose}mcg/kg/min for {weight}kg patient. Concentration: {concentration}mg/{volume}mL. Calculate mL/hr.',
      formulaTemplate: '{dose} * {weight} * 60 / ({concentration} * 1000 / {volume})',
      variables: {
        dose: { min: 2, max: 10, step: 1 },
        weight: { min: 60, max: 100, step: 5 },
        concentration: { min: 400, max: 800, step: 200 },
        volume: { min: 250, max: 250, step: 0 }
      },
      units: {
        dose: 'mcg/kg/min',
        weight: 'kg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL/hr'
      },
      hints: [
        'Calculate mcg/min needed',
        'Convert to mcg/hr',
        'Calculate concentration in mcg/mL',
        'Divide to get mL/hr'
      ],
      explanation: 'Dose: {dose} × {weight} = mcg/min × 60 = mcg/hr. Concentration: {concentration}mg × 1000 ÷ {volume}mL = mcg/mL. Rate: mcg/hr ÷ mcg/mL = {answer}mL/hr'
    },

    // UNIT_CONVERSION - All difficulties
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'BEGINNER',
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
      category: 'VOLUME_CONVERSION',
      difficulty: 'BEGINNER',
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
      category: 'TIME_CONVERSION',
      difficulty: 'INTERMEDIATE',
      title: 'Hours to Minutes',
      templateText: 'Convert {hours} hours and {minutes} minutes to total minutes.',
      formulaTemplate: '{hours} * 60 + {minutes}',
      variables: {
        hours: { min: 1, max: 4, step: 1 },
        minutes: { min: 15, max: 45, step: 15 }
      },
      units: {
        hours: 'hours',
        minutes: 'minutes',
        answer: 'minutes'
      },
      hints: [
        'Convert hours to minutes first',
        'Then add the additional minutes'
      ],
      explanation: 'Total minutes = ({hours} hours × 60) + {minutes} minutes = {answer} minutes'
    },
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'INTERMEDIATE',
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
        '1 mg = 1000 mcg',
        'Divide by 1000'
      ],
      explanation: 'To convert mcg to mg, divide by 1000. {value}mcg ÷ 1000 = {answer}mg'
    },
    {
      type: 'UNIT_CONVERSION',
      category: 'VOLUME_CONVERSION',
      difficulty: 'EXPERT',
      title: 'Complex Volume Conversion',
      templateText: 'A patient receives {rate}mL/hr for {hours} hours. How many liters total?',
      formulaTemplate: '{rate} * {hours} / 1000',
      variables: {
        rate: { min: 50, max: 150, step: 25 },
        hours: { min: 8, max: 24, step: 4 }
      },
      units: {
        rate: 'mL/hr',
        hours: 'hours',
        answer: 'L'
      },
      hints: [
        'Calculate total mL first',
        'Then convert mL to L'
      ],
      explanation: 'Total volume = {rate}mL/hr × {hours} hours = total mL. Convert: total mL ÷ 1000 = {answer}L'
    },
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'EXPERT',
      title: 'Multi-Step Weight Conversion',
      templateText: 'Medication dosed at {dose}mg/kg. Patient weighs {pounds} lbs. How many grams for this patient? (1 kg = 2.2 lbs)',
      formulaTemplate: '{dose} * {pounds} / 2.2 / 1000',
      variables: {
        dose: { min: 5, max: 20, step: 5 },
        pounds: { min: 110, max: 220, step: 10 }
      },
      units: {
        dose: 'mg/kg',
        pounds: 'lbs',
        answer: 'g'
      },
      hints: [
        'Convert pounds to kg',
        'Calculate total mg dose',
        'Convert mg to g'
      ],
      explanation: 'Weight in kg = {pounds} lbs ÷ 2.2 = kg. Dose = kg × {dose}mg/kg = mg. Convert: mg ÷ 1000 = {answer}g'
    },

    // PEDIATRIC_DOSING - All difficulties
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      difficulty: 'BEGINNER',
      title: 'Basic Pediatric Dose',
      templateText: 'Child weighs {weight}kg. Medication dosed at {dose}mg/kg/day divided q8h. How many mg per dose?',
      formulaTemplate: '{weight} * {dose} / 3',
      variables: {
        weight: { min: 10, max: 30, step: 2 },
        dose: { min: 30, max: 60, step: 10 }
      },
      units: {
        weight: 'kg',
        dose: 'mg/kg/day',
        answer: 'mg'
      },
      hints: [
        'Calculate total daily dose first',
        'Divide by 3 for q8h dosing'
      ],
      explanation: 'Daily dose = {weight}kg × {dose}mg/kg/day = total mg/day. Per dose (q8h = 3 times/day): total ÷ 3 = {answer}mg'
    },
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      difficulty: 'INTERMEDIATE',
      title: 'Pediatric Liquid Medication',
      templateText: 'Child weighs {weight}kg. Needs {dose}mg/kg/dose. Liquid: {concentration}mg/{volume}mL. How many mL per dose?',
      formulaTemplate: '{weight} * {dose} / {concentration} * {volume}',
      variables: {
        weight: { min: 8, max: 25, step: 1 },
        dose: { min: 10, max: 15, step: 1 },
        concentration: { min: 100, max: 250, step: 50 },
        volume: { min: 5, max: 5, step: 0 }
      },
      units: {
        weight: 'kg',
        dose: 'mg/kg/dose',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Calculate mg dose needed',
        'Use concentration to find volume'
      ],
      explanation: 'Dose needed = {weight}kg × {dose}mg/kg = mg. Volume = dose ÷ ({concentration}mg/{volume}mL) × {volume}mL = {answer}mL'
    },
    {
      type: 'PEDIATRIC_DOSING',
      category: 'BSA_BASED',
      difficulty: 'EXPERT',
      title: 'BSA-Based Dosing',
      templateText: 'Child BSA is {bsa}m². Medication dosed at {dose}mg/m²/day divided BID. Suspension: {concentration}mg/mL. mL per dose?',
      formulaTemplate: '{bsa} * {dose} / 2 / {concentration}',
      variables: {
        bsa: { min: 0.4, max: 1.2, step: 0.1 },
        dose: { min: 100, max: 300, step: 50 },
        concentration: { min: 50, max: 100, step: 25 }
      },
      units: {
        bsa: 'm²',
        dose: 'mg/m²/day',
        concentration: 'mg/mL',
        answer: 'mL'
      },
      hints: [
        'Calculate total daily dose using BSA',
        'Divide by 2 for BID',
        'Convert mg to mL using concentration'
      ],
      explanation: 'Daily dose = {bsa}m² × {dose}mg/m²/day = mg/day. Per dose (BID): mg/day ÷ 2 = mg/dose. Volume: mg/dose ÷ {concentration}mg/mL = {answer}mL'
    },

    // CONCENTRATION - All difficulties
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic Solution Concentration',
      templateText: 'Mix {solute}mg of drug in {volume}mL of solution. What is the concentration in mg/mL?',
      formulaTemplate: '{solute} / {volume}',
      variables: {
        solute: { min: 100, max: 1000, step: 100 },
        volume: { min: 50, max: 250, step: 50 }
      },
      units: {
        solute: 'mg',
        volume: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Concentration = Amount of drug ÷ Total volume',
        'Units will be mg/mL'
      ],
      explanation: 'Concentration = {solute}mg ÷ {volume}mL = {answer}mg/mL'
    },
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Percent Concentration',
      templateText: 'A solution contains {solute}g of drug in {volume}mL. What is the percentage concentration (w/v)?',
      formulaTemplate: '{solute} / {volume} * 100',
      variables: {
        solute: { min: 1, max: 10, step: 1 },
        volume: { min: 100, max: 500, step: 100 }
      },
      units: {
        solute: 'g',
        volume: 'mL',
        answer: '%'
      },
      hints: [
        'Percent (w/v) = (grams/mL) × 100',
        'Make sure units match'
      ],
      explanation: 'Percent concentration = ({solute}g ÷ {volume}mL) × 100 = {answer}%'
    },
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex Concentration Calculation',
      templateText: 'Need {target}mcg/mL concentration. Have {vial}mg in {vialVol}mL vial. How much to add to {bag}mL bag?',
      formulaTemplate: '{target} * {bag} / 1000 / ({vial} / {vialVol})',
      variables: {
        target: { min: 4, max: 16, step: 4 },
        vial: { min: 10, max: 40, step: 10 },
        vialVol: { min: 1, max: 4, step: 1 },
        bag: { min: 250, max: 500, step: 250 }
      },
      units: {
        target: 'mcg/mL',
        vial: 'mg',
        vialVol: 'mL',
        bag: 'mL',
        answer: 'mL'
      },
      hints: [
        'Calculate total mcg needed',
        'Convert to mg',
        'Use vial concentration to find volume'
      ],
      explanation: 'Total needed: {target}mcg/mL × {bag}mL = mcg ÷ 1000 = mg. Vial concentration: {vial}mg/{vialVol}mL. Volume to add: mg needed ÷ concentration = {answer}mL'
    },

    // DILUTION - All difficulties
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Simple Dilution',
      templateText: 'Dilute {initial}mL of {ratio}:1 solution with normal saline. How much saline to add?',
      formulaTemplate: '{initial} * ({ratio} - 1)',
      variables: {
        initial: { min: 10, max: 50, step: 10 },
        ratio: { min: 2, max: 5, step: 1 }
      },
      units: {
        initial: 'mL',
        ratio: '',
        answer: 'mL'
      },
      hints: [
        'For X:1 dilution, add (X-1) parts diluent',
        'To 1 part of original solution'
      ],
      explanation: 'For {ratio}:1 dilution of {initial}mL, add {initial}mL × ({ratio} - 1) = {answer}mL saline'
    },
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Stock Solution Dilution',
      templateText: 'Stock solution is {stock}%. Need {volume}mL of {target}% solution. How much stock solution needed?',
      formulaTemplate: '{target} * {volume} / {stock}',
      variables: {
        stock: { min: 10, max: 50, step: 10 },
        volume: { min: 100, max: 500, step: 100 },
        target: { min: 0.5, max: 5, step: 0.5 }
      },
      units: {
        stock: '%',
        volume: 'mL',
        target: '%',
        answer: 'mL'
      },
      hints: [
        'Use C1V1 = C2V2',
        'Solve for V1 (volume of stock needed)'
      ],
      explanation: 'Using C1V1 = C2V2: {stock}% × V1 = {target}% × {volume}mL. V1 = ({target} × {volume}) ÷ {stock} = {answer}mL'
    },
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Serial Dilution',
      templateText: 'Start with {initial}mg/mL. Need {target}mg/mL. If diluting 1:{ratio} twice, what\'s the volume after adding {start}mL initially?',
      formulaTemplate: '{start} * {ratio} * {ratio}',
      variables: {
        initial: { min: 100, max: 1000, step: 100 },
        target: { min: 1, max: 10, step: 1 },
        ratio: { min: 10, max: 10, step: 0 },
        start: { min: 1, max: 5, step: 1 }
      },
      units: {
        initial: 'mg/mL',
        target: 'mg/mL',
        ratio: '',
        start: 'mL',
        answer: 'mL'
      },
      hints: [
        'Each 1:10 dilution multiplies volume by 10',
        'Two dilutions = 10 × 10 = 100× dilution'
      ],
      explanation: 'First dilution: {start}mL × {ratio} = mL. Second dilution: previous × {ratio} = {answer}mL total'
    },

    // DIMENSIONAL_ANALYSIS - All difficulties
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'BEGINNER',
      title: 'Basic Unit Chain',
      templateText: 'Convert {value} mg to g using dimensional analysis.',
      formulaTemplate: '{value} / 1000',
      variables: {
        value: { min: 2000, max: 8000, step: 1000 }
      },
      units: {
        value: 'mg',
        answer: 'g'
      },
      hints: [
        'Set up: mg × (1 g/1000 mg)',
        'Cancel units that appear in numerator and denominator'
      ],
      explanation: '{value} mg × (1 g/1000 mg) = {value}/1000 g = {answer} g'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'INTERMEDIATE',
      title: 'Multi-Step Conversion',
      templateText: 'Patient receives {rate} mcg/min. How many mg/hr is this?',
      formulaTemplate: '{rate} * 60 / 1000',
      variables: {
        rate: { min: 5, max: 25, step: 5 }
      },
      units: {
        rate: 'mcg/min',
        answer: 'mg/hr'
      },
      hints: [
        'Convert mcg to mg AND min to hr',
        'Set up two conversion factors'
      ],
      explanation: '{rate} mcg/min × (1 mg/1000 mcg) × (60 min/1 hr) = {answer} mg/hr'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'EXPERT',
      title: 'Complex Dimensional Analysis',
      templateText: 'Infusion: {dose} mg/kg/hr for {weight} lb patient. Stock: {conc} mg/mL. Find mL/hr. (1 kg = 2.2 lb)',
      formulaTemplate: '{dose} * {weight} / 2.2 / {conc}',
      variables: {
        dose: { min: 0.5, max: 2, step: 0.5 },
        weight: { min: 110, max: 220, step: 10 },
        conc: { min: 1, max: 4, step: 1 }
      },
      units: {
        dose: 'mg/kg/hr',
        weight: 'lb',
        conc: 'mg/mL',
        answer: 'mL/hr'
      },
      hints: [
        'Convert lb to kg first',
        'Calculate mg/hr needed',
        'Convert to mL/hr using concentration'
      ],
      explanation: '{dose} mg/kg/hr × ({weight} lb × 1 kg/2.2 lb) × (1 mL/{conc} mg) = {answer} mL/hr'
    }
  ]

  console.log(`📝 Creating ${questions.length} question templates...`)

  const createdQuestions = await prisma.questionTemplate.createMany({
    data: questions
  })

  console.log(`✅ Successfully created ${createdQuestions.count} questions covering ALL categories!`)
  
  // Show summary of questions by type
  const typeCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\n📊 Questions by type:')
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  - ${type}: ${count} questions`)
  })

  // Verify all UI categories now have questions
  const uiCategories = [
    'DOSAGE_CALCULATION',
    'IV_DRIP_RATE', 
    'UNIT_CONVERSION',
    'PEDIATRIC_DOSING',
    'CRITICAL_CARE',
    'INSULIN_DOSING',
    'HEPARIN_PROTOCOL',
    'RECONSTITUTION'
  ]

  console.log('\n✅ All UI categories now have questions:')
  uiCategories.forEach(cat => {
    const count = typeCounts[cat] || 0
    console.log(`  - ${cat}: ${count > 0 ? '✓' : '✗'} (${count} questions)`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })