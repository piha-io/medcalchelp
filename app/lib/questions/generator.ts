import type { QuestionTemplate } from '@prisma/client'

export interface GeneratedQuestion {
  id: string
  type: string
  category: string
  title: string
  questionText: string
  generatedValues: Record<string, number>
  units: Record<string, string>
  hints: string[]
  conversionFactors?: any[]
  basePoints?: number
}

export function generateQuestion(template: QuestionTemplate): GeneratedQuestion {
  const generatedValues: Record<string, number> = {}
  const variables = template.variables as Record<string, any>

  // Generate random values for each variable
  for (const [key, range] of Object.entries(variables)) {
    const min = range.min
    const max = range.max
    const step = range.step || 1
    const decimal = range.decimal || 0

    // Generate value that's a multiple of step
    const steps = Math.floor((max - min) / step)
    const randomSteps = Math.floor(Math.random() * (steps + 1))
    let value = min + (randomSteps * step)

    // Round to specified decimal places
    if (decimal > 0) {
      value = Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal)
    }

    generatedValues[key] = value
  }

  // Replace placeholders in question text
  let questionText = template.templateText
  for (const [key, value] of Object.entries(generatedValues)) {
    // Format numbers nicely (remove trailing zeros)
    const formattedValue = formatNumber(value)
    questionText = questionText.replace(new RegExp(`{${key}}`, 'g'), formattedValue)
  }

  return {
    id: template.id,
    type: template.type,
    category: template.category,
    title: template.title,
    questionText,
    generatedValues,
    units: template.units as Record<string, string>,
    hints: template.hints,
    conversionFactors: template.conversionFactors as any[] || undefined,
  }
}

export function calculateAnswer(template: QuestionTemplate, values: Record<string, number>): number {
  const formula = template.formulaTemplate
  
  // Create a safe expression evaluator
  let expression = formula
  for (const [key, value] of Object.entries(values)) {
    expression = expression.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }

  try {
    // Use a safer evaluation method with Math functions available
    const result = evaluateExpression(expression)
    return Number(result)
  } catch (error) {
    console.error('Error calculating answer:', error)
    throw new Error('Failed to calculate answer')
  }
}

export function checkAnswer(userAnswer: number, correctAnswer: number, tolerance: number = 0.01): boolean {
  // Handle edge cases
  if (isNaN(userAnswer) || isNaN(correctAnswer)) {
    return false
  }

  // For very small answers, use absolute tolerance
  if (Math.abs(correctAnswer) < 1) {
    return Math.abs(userAnswer - correctAnswer) <= tolerance
  }

  // For larger answers, use percentage tolerance
  const percentDifference = Math.abs(userAnswer - correctAnswer) / Math.abs(correctAnswer)
  return percentDifference <= tolerance
}

// Safe expression evaluator
function evaluateExpression(expr: string): number {
  // Remove whitespace
  expr = expr.replace(/\s/g, '')

  // Validate expression contains only allowed characters
  if (!/^[\d+\-*/().,]+$/.test(expr)) {
    throw new Error('Invalid expression')
  }

  // Create a sandboxed function with Math utilities
  const func = new Function('Math', `
    'use strict';
    try {
      return (${expr});
    } catch (e) {
      throw new Error('Calculation error');
    }
  `)

  return func(Math)
}

// Format number for display
function formatNumber(num: number | undefined | null): string {
  // Handle undefined, null, or NaN
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  
  // Remove trailing zeros after decimal point
  if (num % 1 === 0) {
    return num.toString()
  }
  
  // Limit to 4 decimal places and remove trailing zeros
  return parseFloat(num.toFixed(4)).toString()
}

// Helper function to safely get value
function getValue(values: Record<string, number>, key: string, defaultValue: number = 0): number {
  return values[key] !== undefined && values[key] !== null && !isNaN(values[key]) 
    ? values[key] 
    : defaultValue
}

// Helper function to safely get unit
function getUnit(units: Record<string, string>, key: string, defaultUnit: string = ''): string {
  return units[key] || defaultUnit
}

// Generate step-by-step solution
export function generateStepByStepSolution(
  template: QuestionTemplate, 
  values: Record<string, number>, 
  answer: number
): string[] {
  const steps: string[] = []
  const units = template.units as Record<string, string>

  switch (template.type) {
    case 'DOSAGE_CALCULATION':
      steps.push('Step 1: Identify the required dose and available strength')
      steps.push(`Required dose: ${formatNumber(getValue(values, 'dose'))} ${getUnit(units, 'dose', 'mg')}`)
      steps.push(`Available strength: ${formatNumber(getValue(values, 'strength'))} ${getUnit(units, 'strength', 'mg')}`)
      steps.push('Step 2: Apply the formula: Required dose ÷ Available strength')
      steps.push(`${formatNumber(getValue(values, 'dose'))} ÷ ${formatNumber(getValue(values, 'strength'))} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${getUnit(units, 'answer', 'mL')}`)
      break

    case 'IV_DRIP_RATE':
      steps.push('Step 1: Identify the volume, time, and drop factor')
      steps.push(`Volume: ${formatNumber(getValue(values, 'volume'))} ${getUnit(units, 'volume', 'mL')}`)
      steps.push(`Time: ${formatNumber(getValue(values, 'hours'))} ${getUnit(units, 'hours', 'hours')}`)
      steps.push(`Drop factor: ${formatNumber(getValue(values, 'dropFactor'))} ${getUnit(units, 'dropFactor', 'gtt/mL')}`)
      steps.push('Step 2: Convert time to minutes')
      steps.push(`${formatNumber(getValue(values, 'hours'))} hours × 60 = ${formatNumber(getValue(values, 'hours') * 60)} minutes`)
      steps.push('Step 3: Apply the formula: (Volume × Drop factor) ÷ Time in minutes')
      steps.push(`(${formatNumber(getValue(values, 'volume'))} × ${formatNumber(getValue(values, 'dropFactor'))}) ÷ ${formatNumber(getValue(values, 'hours') * 60)} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${getUnit(units, 'answer', 'gtt/min')}`)
      break

    case 'UNIT_CONVERSION':
      const valueToConvert = getValue(values, 'value', 1)
      const conversionFactor = valueToConvert !== 0 ? answer / valueToConvert : 1
      steps.push('Step 1: Identify the conversion factor')
      steps.push(`1 ${getUnit(units, 'value', 'unit')} = ${formatNumber(conversionFactor)} ${getUnit(units, 'answer', 'unit')}`)
      steps.push('Step 2: Multiply by the conversion factor')
      steps.push(`${formatNumber(valueToConvert)} × ${formatNumber(conversionFactor)} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${getUnit(units, 'answer', 'unit')}`)
      break

    case 'PEDIATRIC_DOSING':
      steps.push('Step 1: Calculate the total daily dose')
      steps.push(`Weight: ${formatNumber(getValue(values, 'weight'))} ${getUnit(units, 'weight', 'kg')}`)
      steps.push(`Dose per kg: ${formatNumber(getValue(values, 'dosePerKg'))} ${getUnit(units, 'dosePerKg', 'mg/kg')}`)
      const totalDailyDose = getValue(values, 'weight') * getValue(values, 'dosePerKg')
      steps.push(`Daily dose = ${formatNumber(getValue(values, 'weight'))} × ${formatNumber(getValue(values, 'dosePerKg'))} = ${formatNumber(totalDailyDose)} mg`)
      steps.push('Step 2: Divide by number of doses')
      steps.push(`Number of doses: ${formatNumber(getValue(values, 'doses'))} per day`)
      steps.push(`Single dose = ${formatNumber(totalDailyDose)} ÷ ${formatNumber(getValue(values, 'doses'))} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${getUnit(units, 'answer', 'mg')}`)
      break

    case 'CONCENTRATION':
      steps.push('Step 1: Identify the amount of drug and volume of solution')
      steps.push(`Amount of drug: ${formatNumber(getValue(values, 'solute', getValue(values, 'amount')))} ${getUnit(units, 'solute', getUnit(units, 'amount', 'mg'))}`)
      steps.push(`Volume of solution: ${formatNumber(getValue(values, 'volume'))} ${getUnit(units, 'volume', 'mL')}`)
      steps.push('Step 2: Apply the formula: Concentration = Amount ÷ Volume')
      const soluteValue = getValue(values, 'solute', getValue(values, 'amount'))
      const volumeValue = getValue(values, 'volume')
      steps.push(`${formatNumber(soluteValue)} ÷ ${formatNumber(volumeValue)} = ${formatNumber(answer)}`)
      steps.push(`Answer: ${formatNumber(answer)} ${getUnit(units, 'answer', 'mg/mL')}`)
      break

    case 'DILUTION':
      if (values.ratio) {
        // Simple dilution with ratio
        steps.push('Step 1: Identify the initial volume and dilution ratio')
        steps.push(`Initial volume: ${values.initial} ${units.initial}`)
        steps.push(`Dilution ratio: ${values.ratio}:1`)
        steps.push('Step 2: Calculate volume to add = Initial volume × (Ratio - 1)')
        steps.push(`${values.initial} × (${values.ratio} - 1) = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      } else {
        // Stock solution dilution
        steps.push('Step 1: Identify the concentrations and desired volume')
        steps.push(`Stock concentration: ${values.stock}${units.stock}`)
        steps.push(`Target concentration: ${values.target}${units.target}`)
        steps.push(`Desired volume: ${values.volume} ${units.volume}`)
        steps.push('Step 2: Use dilution formula: C1V1 = C2V2')
        steps.push(`V1 = (C2 × V2) ÷ C1 = (${values.target} × ${values.volume}) ÷ ${values.stock}`)
        steps.push(`V1 = ${formatNumber(answer)} ${units.answer}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer} of stock solution needed`)
      }
      break

    case 'DIMENSIONAL_ANALYSIS':
      steps.push('Step 1: Set up the problem with given information')
      // Since dimensional analysis can vary greatly, we'll show the conversion chain
      if (template.conversionFactors) {
        const factors = template.conversionFactors as any[]
        steps.push('Step 2: Apply conversion factors:')
        factors.forEach((factor, index) => {
          steps.push(`Conversion ${index + 1}: ${factor.from} → ${factor.to}`)
        })
      }
      steps.push('Step 3: Multiply/divide through the conversion chain')
      steps.push(`Result: ${formatNumber(answer)} ${units.answer}`)
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    case 'CRITICAL_CARE':
      // Critical care often involves complex drip calculations
      if (values.dose && values.weight && values.concentration) {
        steps.push('Step 1: Identify patient weight and medication parameters')
        steps.push(`Patient weight: ${values.weight} ${units.weight}`)
        steps.push(`Ordered dose: ${values.dose} ${units.dose}`)
        steps.push(`Drug concentration: ${values.concentration} ${units.concentration} in ${values.volume} ${units.volume}`)
        steps.push('Step 2: Calculate dose per minute')
        steps.push(`${values.dose} × ${values.weight} = ${values.dose * values.weight} mcg/min`)
        steps.push('Step 3: Convert to mL/hr')
        steps.push(`Concentration: ${values.concentration} mg ÷ ${values.volume} mL = ${values.concentration/values.volume} mg/mL`)
        steps.push(`Convert mcg/min to mg/hr: (${values.dose * values.weight} × 60) ÷ 1000 = ${(values.dose * values.weight * 60) / 1000} mg/hr`)
        steps.push(`Infusion rate: ${(values.dose * values.weight * 60) / 1000} ÷ ${values.concentration/values.volume} = ${formatNumber(answer)} mL/hr`)
      }
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      break

    case 'INSULIN_DOSING':
      if (values.glucose && values.target && values.factor) {
        // Correction factor calculation
        steps.push('Step 1: Calculate blood glucose above target')
        steps.push(`Current glucose: ${values.glucose} ${units.glucose}`)
        steps.push(`Target glucose: ${values.target} mg/dL`)
        steps.push(`Glucose above target: ${values.glucose} - ${values.target} = ${values.glucose - values.target} mg/dL`)
        steps.push('Step 2: Apply correction factor')
        steps.push(`Correction factor: 1 unit per ${values.factor} mg/dL`)
        steps.push(`Units needed: ${values.glucose - values.target} ÷ ${values.factor} = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      } else if (values.units) {
        // Sliding scale
        steps.push('Step 1: Check blood glucose level')
        steps.push(`Current glucose: ${values.glucose} ${units.glucose}`)
        steps.push('Step 2: Find appropriate range on sliding scale')
        steps.push(`Range: ${values.lowRange}-${values.highRange} mg/dL`)
        steps.push(`Insulin dose for this range: ${values.units} units`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      }
      break

    case 'HEPARIN_PROTOCOL':
      if (values.weight && values.dose && !values.rate) {
        // Bolus calculation
        steps.push('Step 1: Identify patient weight and bolus dose')
        steps.push(`Patient weight: ${values.weight} ${units.weight}`)
        steps.push(`Bolus dose: ${values.dose} ${units.dose}`)
        steps.push('Step 2: Calculate total units')
        steps.push(`${values.weight} × ${values.dose} = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      } else if (values.rate && values.concentration) {
        // Infusion rate calculation
        steps.push('Step 1: Calculate units per hour')
        steps.push(`Patient weight: ${values.weight} ${units.weight}`)
        steps.push(`Infusion rate: ${values.rate} ${units.rate}`)
        steps.push(`Units/hr: ${values.weight} × ${values.rate} = ${values.weight * values.rate} units/hr`)
        steps.push('Step 2: Convert to mL/hr using concentration')
        steps.push(`Heparin concentration: ${values.concentration} ${units.concentration}`)
        steps.push(`Infusion rate: ${values.weight * values.rate} ÷ ${values.concentration} = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      }
      break

    case 'RECONSTITUTION':
      if (values.powder !== undefined) {
        // Multi-step reconstitution with powder volume
        steps.push('Step 1: Calculate total volume needed for desired concentration')
        steps.push(`Drug amount: ${values.vial} ${units.vial}`)
        steps.push(`Desired concentration: ${values.concentration} ${units.concentration}`)
        steps.push(`Total volume needed: ${values.vial} ÷ ${values.concentration} = ${values.vial / values.concentration} mL`)
        steps.push('Step 2: Account for powder volume')
        steps.push(`Powder volume: ${values.powder} mL`)
        steps.push(`Diluent needed: ${values.vial / values.concentration} - ${values.powder} = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      } else {
        // Basic reconstitution
        steps.push('Step 1: Identify vial content and diluent volume')
        steps.push(`Vial content: ${values.vial} ${units.vial}`)
        steps.push(`Diluent volume: ${values.diluent} ${units.diluent}`)
        steps.push('Step 2: Calculate concentration')
        steps.push(`Concentration = ${values.vial} ÷ ${values.diluent} = ${formatNumber(answer)}`)
        steps.push(`Answer: ${formatNumber(answer)} ${units.answer}`)
      }
      break

    default:
      steps.push('Calculate using the given formula')
      steps.push(`Answer: ${formatNumber(answer)} ${units.answer || ''}`)
  }

  return steps
}