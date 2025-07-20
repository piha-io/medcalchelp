import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting expanded database seed...')

  // Clear existing data
  await prisma.userAttempt.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.score.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.questionTemplate.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create comprehensive question templates covering all combinations
  const questions = [
    // DOSAGE_CALCULATION - All difficulties
    // BEGINNER
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

    // INTERMEDIATE
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
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Suspension Reconstitution',
      templateText: 'After reconstitution, an antibiotic suspension contains {concentration}mg/{volume}mL. The prescribed dose is {dose}mg every {hours} hours. How many mL per dose?',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 250, max: 1000, step: 250 },
        concentration: { min: 125, max: 500, step: 125 },
        volume: { min: 5, max: 10, step: 5 },
        hours: { min: 6, max: 12, step: 6 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        hours: 'hours',
        answer: 'mL'
      },
      hints: [
        'Focus on the dose per administration',
        'Use the concentration to find volume needed'
      ],
      explanation: 'Volume per dose: {dose}mg ÷ ({concentration}mg/{volume}mL) = {answer} mL'
    },

    // ADVANCED
    {
      type: 'DOSAGE_CALCULATION',
      category: 'INJECTABLE_MEDICATION',
      difficulty: 'ADVANCED',
      title: 'Multi-vial Preparation',
      templateText: 'Prepare {totalDose}mg using vials containing {vialStrength}mg each. After reconstitution with {reconVolume}mL per vial, concentration is {vialStrength}mg/{reconVolume}mL. Total volume to draw?',
      formulaTemplate: '{totalDose} / {vialStrength} * {reconVolume}',
      variables: {
        totalDose: { min: 1000, max: 5000, step: 500 },
        vialStrength: { min: 500, max: 1000, step: 250 },
        reconVolume: { min: 5, max: 10, step: 5 }
      },
      units: {
        totalDose: 'mg',
        vialStrength: 'mg',
        reconVolume: 'mL',
        answer: 'mL'
      },
      hints: [
        'Calculate how many vials you need',
        'Each vial gives you a specific volume after reconstitution'
      ],
      explanation: 'Number of vials: {totalDose}mg ÷ {vialStrength}mg = vials needed. Total volume: vials × {reconVolume}mL = {answer} mL'
    },

    // EXPERT
    {
      type: 'DOSAGE_CALCULATION',
      category: 'ORAL_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex Oral Dosing Schedule',
      templateText: 'A patient needs {totalDaily}mg daily, divided into doses every {interval} hours. Available: {strength}mg tablets. How many tablets per dose? (Round to nearest 0.5)',
      formulaTemplate: '({totalDaily} / (24 / {interval})) / {strength}',
      variables: {
        totalDaily: { min: 1000, max: 4000, step: 500 },
        interval: { min: 4, max: 12, step: 4 },
        strength: { min: 250, max: 500, step: 125 }
      },
      units: {
        totalDaily: 'mg',
        interval: 'hours',
        strength: 'mg',
        answer: 'tablets'
      },
      hints: [
        'Calculate doses per day: 24 ÷ interval',
        'Find mg per dose: total daily ÷ doses per day',
        'Convert mg to tablets'
      ],
      explanation: 'Doses per day: 24 ÷ {interval} = doses. Per dose: {totalDaily}mg ÷ doses = mg. Tablets: mg ÷ {strength}mg = {answer} tablets'
    },

    // IV_DRIP_RATE - All difficulties
    // BEGINNER
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic IV Drip Rate',
      templateText: 'Infuse {volume}mL of IV fluid over {hours} hours. Calculate the flow rate in mL/hr.',
      formulaTemplate: '{volume} / {hours}',
      variables: {
        volume: { min: 500, max: 2000, step: 250 },
        hours: { min: 4, max: 24, step: 4 }
      },
      units: {
        volume: 'mL',
        hours: 'hours',
        answer: 'mL/hr'
      },
      hints: [
        'Divide total volume by time in hours',
        'This gives you mL per hour'
      ],
      explanation: 'Flow rate = Total volume ÷ Time = {volume}mL ÷ {hours} hours = {answer} mL/hr'
    },

    // INTERMEDIATE
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'IV Drip Rate with Drop Factor',
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

    // ADVANCED
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

    // EXPERT
    {
      type: 'IV_DRIP_RATE',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex Titrated Infusion',
      templateText: 'Nitroglycerin infusion: Start at {startDose} mcg/min, titrate by {titration} mcg/min q{interval}min. Max: {maxDose} mcg/min. Concentration: {concentration} mg in {volume} mL. What is the maximum infusion rate in mL/hr?',
      formulaTemplate: '({maxDose} * 60) / ({concentration} * 1000 / {volume})',
      variables: {
        startDose: { min: 5, max: 20, step: 5 },
        titration: { min: 5, max: 20, step: 5 },
        interval: { min: 3, max: 10, step: 1 },
        maxDose: { min: 100, max: 400, step: 50 },
        concentration: { min: 25, max: 100, step: 25 },
        volume: { min: 250, max: 500, step: 250 }
      },
      units: {
        startDose: 'mcg/min',
        titration: 'mcg/min',
        interval: 'min',
        maxDose: 'mcg/min',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL/hr'
      },
      hints: [
        'Focus on the maximum dose for this calculation',
        'Convert mcg/min to mg/hr',
        'Find concentration in mg/mL'
      ],
      explanation: 'Max dose: {maxDose} mcg/min × 60 min/hr ÷ 1000 = mg/hr. Concentration: {concentration}mg/{volume}mL. Max rate = mg/hr ÷ mg/mL = {answer} mL/hr'
    },

    // UNIT_CONVERSION - All difficulties
    // BEGINNER
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'BEGINNER',
      title: 'Basic Weight Conversion',
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

    // INTERMEDIATE
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'INTERMEDIATE',
      title: 'Temperature Conversion',
      templateText: 'Convert {value}°F to Celsius. Use the formula: C = (F - 32) × 5/9',
      formulaTemplate: '({value} - 32) * 5 / 9',
      variables: {
        value: { min: 97, max: 104, step: 0.5, decimal: 1 }
      },
      units: {
        value: '°F',
        answer: '°C'
      },
      hints: [
        'Subtract 32 from Fahrenheit first',
        'Then multiply by 5/9'
      ],
      explanation: 'To convert °F to °C: ({value} - 32) × 5/9 = {answer}°C'
    },
    {
      type: 'UNIT_CONVERSION',
      category: 'VOLUME_CONVERSION',
      difficulty: 'INTERMEDIATE',
      title: 'Complex Volume Conversion',
      templateText: 'Convert {value} fluid ounces to milliliters. Use 1 fl oz = 29.5735 mL (round to nearest mL).',
      formulaTemplate: '{value} * 29.5735',
      variables: {
        value: { min: 2, max: 32, step: 2 }
      },
      units: {
        value: 'fl oz',
        answer: 'mL'
      },
      hints: [
        '1 fluid ounce = 29.5735 mL',
        'Multiply fl oz by 29.5735'
      ],
      explanation: 'To convert fl oz to mL: {value} fl oz × 29.5735 = {answer} mL'
    },

    // ADVANCED
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'ADVANCED',
      title: 'Multi-step Weight Conversion',
      templateText: 'A patient weighs {pounds} lbs and {ounces} oz. Convert the total weight to kilograms. (1 lb = 16 oz, 1 kg = 2.2 lbs)',
      formulaTemplate: '({pounds} + {ounces} / 16) / 2.2',
      variables: {
        pounds: { min: 100, max: 250, step: 10 },
        ounces: { min: 0, max: 15, step: 1 }
      },
      units: {
        pounds: 'lbs',
        ounces: 'oz',
        answer: 'kg'
      },
      hints: [
        'Convert ounces to pounds first',
        'Add to get total pounds',
        'Then convert pounds to kg'
      ],
      explanation: 'Total pounds: {pounds} + ({ounces}/16) = total lbs. Convert to kg: total lbs ÷ 2.2 = {answer} kg'
    },

    // EXPERT
    {
      type: 'UNIT_CONVERSION',
      category: 'METRIC_CONVERSION',
      difficulty: 'EXPERT',
      title: 'BSA Calculation',
      templateText: 'Calculate BSA using Mosteller formula: BSA (m²) = √[(height × weight)/3600]. Height: {height} cm, Weight: {weight} kg.',
      formulaTemplate: 'Math.sqrt(({height} * {weight}) / 3600)',
      variables: {
        height: { min: 150, max: 190, step: 5 },
        weight: { min: 50, max: 100, step: 5 }
      },
      units: {
        height: 'cm',
        weight: 'kg',
        answer: 'm²'
      },
      hints: [
        'Multiply height by weight',
        'Divide by 3600',
        'Take the square root'
      ],
      explanation: 'BSA = √[({height} × {weight})/3600] = √[value/3600] = {answer} m²'
    },

    // PEDIATRIC_DOSING - All difficulties
    // BEGINNER
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      difficulty: 'BEGINNER',
      title: 'Simple Pediatric Dosing',
      templateText: 'A child weighs {weight} kg. The prescribed dose is {dosePerKg} mg/kg. What is the total dose?',
      formulaTemplate: '{weight} * {dosePerKg}',
      variables: {
        weight: { min: 10, max: 40, step: 5 },
        dosePerKg: { min: 5, max: 20, step: 5 }
      },
      units: {
        weight: 'kg',
        dosePerKg: 'mg/kg',
        answer: 'mg'
      },
      hints: [
        'Multiply weight by dose per kg',
        'This gives total mg needed'
      ],
      explanation: 'Total dose = Weight × Dose per kg = {weight} kg × {dosePerKg} mg/kg = {answer} mg'
    },

    // INTERMEDIATE
    {
      type: 'PEDIATRIC_DOSING',
      category: 'WEIGHT_BASED',
      difficulty: 'INTERMEDIATE',
      title: 'Divided Pediatric Doses',
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

    // ADVANCED
    {
      type: 'PEDIATRIC_DOSING',
      category: 'BSA_BASED',
      difficulty: 'ADVANCED',
      title: 'BSA-Based Pediatric Dosing',
      templateText: 'A child has a BSA of {bsa} m². The recommended dose is {dosePerBSA} mg/m². What is the total dose?',
      formulaTemplate: '{bsa} * {dosePerBSA}',
      variables: {
        bsa: { min: 0.5, max: 1.5, step: 0.1, decimal: 1 },
        dosePerBSA: { min: 50, max: 200, step: 25 }
      },
      units: {
        bsa: 'm²',
        dosePerBSA: 'mg/m²',
        answer: 'mg'
      },
      hints: [
        'Multiply BSA by dose per m²',
        'This gives total dose in mg'
      ],
      explanation: 'Total dose = BSA × Dose per m² = {bsa} m² × {dosePerBSA} mg/m² = {answer} mg'
    },

    // EXPERT
    {
      type: 'PEDIATRIC_DOSING',
      category: 'BSA_BASED',
      difficulty: 'EXPERT',
      title: 'Complex BSA Dosing',
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
    },

    // CONCENTRATION - All difficulties
    // BEGINNER
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic Concentration Calculation',
      templateText: 'You have {amount}mg of medication in {volume}mL of solution. What is the concentration in mg/mL?',
      formulaTemplate: '{amount} / {volume}',
      variables: {
        amount: { min: 100, max: 1000, step: 100 },
        volume: { min: 50, max: 250, step: 50 }
      },
      units: {
        amount: 'mg',
        volume: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Divide total mg by total mL',
        'This gives concentration per mL'
      ],
      explanation: 'Concentration = Amount ÷ Volume = {amount}mg ÷ {volume}mL = {answer} mg/mL'
    },

    // INTERMEDIATE
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

    // ADVANCED
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'ADVANCED',
      title: 'Concentration After Dilution',
      templateText: 'You have {volume1}mL of {conc1}mg/mL solution. You add {volume2}mL of diluent. What is the new concentration in mg/mL?',
      formulaTemplate: '({volume1} * {conc1}) / ({volume1} + {volume2})',
      variables: {
        volume1: { min: 5, max: 20, step: 5 },
        conc1: { min: 10, max: 100, step: 10 },
        volume2: { min: 10, max: 50, step: 10 }
      },
      units: {
        volume1: 'mL',
        conc1: 'mg/mL',
        volume2: 'mL',
        answer: 'mg/mL'
      },
      hints: [
        'Calculate total amount of medication (mg)',
        'Calculate new total volume',
        'Divide amount by new volume'
      ],
      explanation: 'Total medication: {volume1}mL × {conc1}mg/mL = total mg. New volume: {volume1}mL + {volume2}mL. New concentration: total mg ÷ new volume = {answer} mg/mL'
    },

    // EXPERT
    {
      type: 'CONCENTRATION',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Complex Admixture Calculation',
      templateText: 'Mix {volume1}mL of {conc1}% solution with {volume2}mL of {conc2}% solution. What is the final concentration percentage?',
      formulaTemplate: '(({volume1} * {conc1}) + ({volume2} * {conc2})) / ({volume1} + {volume2})',
      variables: {
        volume1: { min: 50, max: 200, step: 50 },
        conc1: { min: 5, max: 20, step: 5 },
        volume2: { min: 50, max: 200, step: 50 },
        conc2: { min: 10, max: 50, step: 10 }
      },
      units: {
        volume1: 'mL',
        conc1: '%',
        volume2: 'mL',
        conc2: '%',
        answer: '%'
      },
      hints: [
        'Calculate amount from each solution',
        'Add total amounts and total volumes',
        'Divide total amount by total volume'
      ],
      explanation: 'Amount 1: {volume1}mL × {conc1}% = amt1. Amount 2: {volume2}mL × {conc2}% = amt2. Final: (amt1 + amt2) ÷ ({volume1} + {volume2})mL = {answer}%'
    },

    // DILUTION - All difficulties
    // BEGINNER
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'BEGINNER',
      title: 'Basic Dilution',
      templateText: 'Dilute {volume}mL of medication with {diluent}mL of normal saline. What is the total volume?',
      formulaTemplate: '{volume} + {diluent}',
      variables: {
        volume: { min: 1, max: 10, step: 1 },
        diluent: { min: 10, max: 100, step: 10 }
      },
      units: {
        volume: 'mL',
        diluent: 'mL',
        answer: 'mL'
      },
      hints: [
        'Add medication volume to diluent volume',
        'This gives total volume'
      ],
      explanation: 'Total volume = Medication + Diluent = {volume}mL + {diluent}mL = {answer}mL'
    },

    // INTERMEDIATE
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'INTERMEDIATE',
      title: 'Dilution Ratio',
      templateText: 'Prepare a 1:{ratio} dilution using {volume}mL of concentrate. How much diluent is needed?',
      formulaTemplate: '{volume} * ({ratio} - 1)',
      variables: {
        ratio: { min: 2, max: 10, step: 1 },
        volume: { min: 5, max: 25, step: 5 }
      },
      units: {
        ratio: '',
        volume: 'mL',
        answer: 'mL'
      },
      hints: [
        'In 1:X dilution, 1 part concentrate needs X-1 parts diluent',
        'Multiply concentrate volume by (ratio - 1)'
      ],
      explanation: 'For 1:{ratio} dilution: {volume}mL concentrate needs {volume}mL × ({ratio} - 1) = {answer}mL diluent'
    },

    // ADVANCED
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'ADVANCED',
      title: 'Stock Solution Dilution',
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
      explanation: 'To find stock volume needed: {dose}mg ÷ {stockConc}mg/mL = {answer}mL of stock solution'
    },

    // EXPERT
    {
      type: 'DILUTION',
      category: 'IV_MEDICATION',
      difficulty: 'EXPERT',
      title: 'Serial Dilution',
      templateText: 'Prepare a 1:{finalRatio} dilution from a {stockConc}mg/mL stock solution using serial 1:{stepRatio} dilutions. How many dilution steps are needed?',
      formulaTemplate: 'Math.log({finalRatio}) / Math.log({stepRatio})',
      variables: {
        finalRatio: { min: 100, max: 10000, step: 100 },
        stepRatio: { min: 2, max: 10, step: 1 },
        stockConc: { min: 100, max: 1000, step: 100 }
      },
      units: {
        finalRatio: '',
        stepRatio: '',
        stockConc: 'mg/mL',
        answer: 'steps'
      },
      hints: [
        'Each step dilutes by the step ratio',
        'Use logarithms to find number of steps',
        'Steps = log(final ratio) ÷ log(step ratio)'
      ],
      explanation: 'Number of 1:{stepRatio} dilutions needed: log({finalRatio}) ÷ log({stepRatio}) = {answer} steps'
    },

    // DIMENSIONAL_ANALYSIS - All difficulties (already comprehensive in original)
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'BEGINNER',
      title: 'Basic Unit Conversion with Dimensional Analysis',
      templateText: 'Convert {value} mg to g using dimensional analysis. Show your work using the railroad track method.',
      formulaTemplate: '{value} / 1000',
      variables: {
        value: { min: 100, max: 5000, step: 100 }
      },
      units: {
        value: 'mg',
        answer: 'g'
      },
      conversionFactors: [
        { from: 'mg', to: 'g', factor: 0.001, display: '1 g = 1000 mg' }
      ],
      hints: [
        'Set up: mg × (1 g / 1000 mg)',
        'The mg units cancel out',
        'Multiply the numbers on top, divide by numbers on bottom'
      ],
      explanation: 'Using dimensional analysis: {value} mg × (1 g / 1000 mg) = {value} ÷ 1000 = {answer} g'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'BEGINNER',
      title: 'Volume Conversion with Dimensional Analysis',
      templateText: 'Convert {value} oz to mL using dimensional analysis. Use the conversion: 1 oz = 30 mL.',
      formulaTemplate: '{value} * 30',
      variables: {
        value: { min: 2, max: 16, step: 2 }
      },
      units: {
        value: 'oz',
        answer: 'mL'
      },
      conversionFactors: [
        { from: 'oz', to: 'mL', factor: 30, display: '1 oz = 30 mL' }
      ],
      hints: [
        'Set up: oz × (30 mL / 1 oz)',
        'The oz units cancel out',
        'Multiply: {value} × 30'
      ],
      explanation: 'Using dimensional analysis: {value} oz × (30 mL / 1 oz) = {value} × 30 = {answer} mL'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'INTERMEDIATE',
      title: 'Dosage Calculation with Dimensional Analysis',
      templateText: 'Order: {dose} mg. Available: {concentration} mg per {volume} mL. How many mL needed? Use dimensional analysis.',
      formulaTemplate: '{dose} / {concentration} * {volume}',
      variables: {
        dose: { min: 25, max: 200, step: 25 },
        concentration: { min: 50, max: 250, step: 50 },
        volume: { min: 1, max: 5, step: 1 }
      },
      units: {
        dose: 'mg',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL'
      },
      conversionFactors: [],
      hints: [
        'Set up: {dose} mg × ({volume} mL / {concentration} mg)',
        'The mg units cancel out',
        'Calculate: ({dose} × {volume}) ÷ {concentration}'
      ],
      explanation: 'Dimensional analysis: {dose} mg × ({volume} mL / {concentration} mg) = ({dose} × {volume}) ÷ {concentration} = {answer} mL'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'INTERMEDIATE',
      title: 'Weight-Based Dosing with Unit Conversion',
      templateText: 'Order: {dosePerKg} mg/kg. Patient weighs {weight} lbs. How many mg per dose? Use dimensional analysis with 1 kg = 2.2 lbs.',
      formulaTemplate: '{weight} / 2.2 * {dosePerKg}',
      variables: {
        dosePerKg: { min: 5, max: 25, step: 5 },
        weight: { min: 100, max: 220, step: 20 }
      },
      units: {
        dosePerKg: 'mg/kg',
        weight: 'lbs',
        answer: 'mg'
      },
      conversionFactors: [
        { from: 'lbs', to: 'kg', factor: 0.4545, display: '1 kg = 2.2 lbs' }
      ],
      hints: [
        'Convert lbs to kg: {weight} lbs × (1 kg / 2.2 lbs)',
        'Then multiply by dose: result × {dosePerKg} mg/kg',
        'Set up the full equation with all units'
      ],
      explanation: 'Step 1: {weight} lbs × (1 kg / 2.2 lbs) = {weight}/2.2 kg\nStep 2: ({weight}/2.2 kg) × {dosePerKg} mg/kg = {answer} mg'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'ADVANCED',
      title: 'IV Rate Calculation with Multiple Conversions',
      templateText: 'Order: {dose} mcg/min. Available: {concentration} mg in {volume} mL. Calculate mL/hr using dimensional analysis.',
      formulaTemplate: '({dose} * 60) / ({concentration} * 1000 / {volume})',
      variables: {
        dose: { min: 50, max: 400, step: 50 },
        concentration: { min: 100, max: 500, step: 100 },
        volume: { min: 50, max: 250, step: 50 }
      },
      units: {
        dose: 'mcg/min',
        concentration: 'mg',
        volume: 'mL',
        answer: 'mL/hr'
      },
      conversionFactors: [
        { from: 'mcg', to: 'mg', factor: 0.001, display: '1 mg = 1000 mcg' },
        { from: 'min', to: 'hr', factor: 60, display: '1 hr = 60 min' }
      ],
      hints: [
        'Convert mcg/min to mg/hr: × 60 ÷ 1000',
        'Find concentration in mg/mL: {concentration} mg ÷ {volume} mL',
        'Divide dose rate by concentration'
      ],
      explanation: 'Step 1: {dose} mcg/min × (1 mg/1000 mcg) × (60 min/1 hr) = {dose}×60÷1000 mg/hr\nStep 2: Concentration = {concentration} mg ÷ {volume} mL\nStep 3: Rate = dose ÷ concentration = {answer} mL/hr'
    },
    {
      type: 'DIMENSIONAL_ANALYSIS',
      category: 'DIMENSIONAL_ANALYSIS',
      difficulty: 'EXPERT',
      title: 'Complex Multi-Step Dimensional Analysis',
      templateText: 'Patient needs {dose} mg/kg/day divided q{hours}h. Patient weighs {weight} lbs. Available: {strength} mg/{tabletVolume} tablets. How many tablets per dose?',
      formulaTemplate: '(({weight} / 2.2 * {dose}) / (24 / {hours})) / {strength} * {tabletVolume}',
      variables: {
        dose: { min: 10, max: 50, step: 10 },
        weight: { min: 110, max: 198, step: 22 },
        hours: { min: 6, max: 12, step: 6 },
        strength: { min: 100, max: 500, step: 100 },
        tabletVolume: { min: 1, max: 2, step: 1 }
      },
      units: {
        dose: 'mg/kg/day',
        weight: 'lbs',
        hours: 'hours',
        strength: 'mg',
        tabletVolume: 'tablets',
        answer: 'tablets'
      },
      conversionFactors: [
        { from: 'lbs', to: 'kg', factor: 0.4545, display: '1 kg = 2.2 lbs' },
        { from: 'day', to: 'doses', factor: null, display: 'doses per day = 24 ÷ hours between doses' }
      ],
      hints: [
        'Step 1: Convert weight to kg',
        'Step 2: Calculate total daily dose',
        'Step 3: Divide by number of doses per day',
        'Step 4: Convert mg to tablets'
      ],
      explanation: 'Full dimensional analysis:\n1. Weight: {weight} lbs × (1 kg/2.2 lbs) = kg\n2. Daily dose: kg × {dose} mg/kg/day = mg/day\n3. Per dose: mg/day ÷ (24/{hours}) doses = mg/dose\n4. Tablets: mg/dose × ({tabletVolume} tablets/{strength} mg) = {answer} tablets'
    }
  ]

  // Create all questions
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
        explanation: question.explanation,
        conversionFactors: question.conversionFactors || null
      }
    })
  }

  console.log(`✅ Created ${questions.length} question templates`)
  
  // Log coverage summary
  const coverage = questions.reduce((acc, q) => {
    const key = `${q.type}-${q.difficulty}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\n📊 Coverage Summary:')
  Object.entries(coverage).sort().forEach(([key, count]) => {
    console.log(`  ${key}: ${count} questions`)
  })
  
  console.log('\n🌱 Expanded seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })