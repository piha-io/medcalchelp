import React from 'react';
import { ConceptCardProps, StepByStepGuideProps, QuickPracticeProps, MasteryCheckProps } from '../../components/learning';

// Unit Conversions Level Learning Content
export const conversionsContent = {
  level: {
    id: 'conversions',
    title: 'Unit Conversions',
    description: 'Master metric conversions and dimensional analysis techniques',
    estimatedTime: '3-4 hours',
    topics: 6
  },
  
  topics: [
    {
      id: 'metric-system',
      title: 'The Metric System',
      description: 'Understand the structure and logic of metric units',
      type: 'concept' as const,
      duration: '25 min',
      content: {
        concept: {
          title: 'The Metric System',
          description: 'The metric system is the universal language of medicine. Understanding its logical structure makes conversions straightforward and reduces errors.',
          keyPoints: [
            'Metric system is based on powers of 10 (decimal system)',
            'Basic units: gram (weight), liter (volume), meter (length)',
            'Prefixes indicate the power of 10: kilo = 1000, milli = 0.001',
            'Most medical calculations use grams, milligrams, liters, and milliliters',
            'Converting within metric is just moving decimal points'
          ],
          terminology: [
            {
              term: 'Base Unit',
              definition: 'The fundamental unit of measurement (gram, liter, meter)',
              example: 'Gram is the base unit for weight in medicine'
            },
            {
              term: 'Prefix',
              definition: 'Letters added before the base unit to indicate size',
              example: 'milli- means 1/1000, so 1 milligram = 0.001 grams'
            },
            {
              term: 'Kilo',
              definition: 'Prefix meaning 1000 times the base unit',
              example: '1 kilogram = 1000 grams'
            },
            {
              term: 'Milli',
              definition: 'Prefix meaning 1/1000 of the base unit',
              example: '1 milligram = 0.001 grams'
            },
            {
              term: 'Micro',
              definition: 'Prefix meaning 1/1,000,000 of the base unit',
              example: '1 microgram = 0.000001 grams'
            }
          ],
          examples: [
            {
              problem: 'How many milligrams are in 2.5 grams?',
              solution: '2500 mg',
              explanation: 'Since milli = 1/1000, there are 1000 mg in 1 g. So 2.5 g × 1000 = 2500 mg',
              steps: [
                'Identify the conversion: grams to milligrams',
                'Remember: 1 gram = 1000 milligrams',
                'Multiply: 2.5 × 1000 = 2500',
                'Answer: 2500 mg'
              ]
            },
            {
              problem: 'Convert 500 mL to liters',
              solution: '0.5 L',
              explanation: 'Since milli = 1/1000, divide by 1000: 500 ÷ 1000 = 0.5 L',
              steps: [
                'Identify the conversion: milliliters to liters',
                'Remember: 1000 mL = 1 L',
                'Divide: 500 ÷ 1000 = 0.5',
                'Answer: 0.5 L'
              ]
            }
          ],
          tips: [
            'Going from larger to smaller units = multiply',
            'Going from smaller to larger units = divide',
            'Remember the ladder: kg → g → mg → mcg (each step is ×1000 or ÷1000)',
            'When in doubt, set up a proportion'
          ],
          warnings: [
            'Never confuse mg (milligrams) with mcg (micrograms) - 1000× difference!',
            'Double-check decimal placement - errors can be deadly',
            'Always include units in your calculations',
            'Be especially careful with insulin and other high-potency drugs'
          ],
          visualAid: {
            type: 'diagram' as const,
            content: React.createElement('div', { className: 'space-y-6' },
              React.createElement('div', { className: 'text-center' },
                React.createElement('h4', { className: 'font-semibold mb-4' }, 'Metric Conversion Ladder'),
                React.createElement('div', { className: 'flex flex-col items-center space-y-2' },
                  React.createElement('div', { className: 'bg-blue-100 px-4 py-2 rounded font-semibold' }, 'Kilogram (kg)'),
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('span', { className: 'text-sm text-gray-600' }, '× 1000'),
                    React.createElement('div', { className: 'w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400 mx-2' })
                  ),
                  React.createElement('div', { className: 'bg-blue-100 px-4 py-2 rounded font-semibold' }, 'Gram (g)'),
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('span', { className: 'text-sm text-gray-600' }, '× 1000'),
                    React.createElement('div', { className: 'w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400 mx-2' })
                  ),
                  React.createElement('div', { className: 'bg-blue-100 px-4 py-2 rounded font-semibold' }, 'Milligram (mg)'),
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('span', { className: 'text-sm text-gray-600' }, '× 1000'),
                    React.createElement('div', { className: 'w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-gray-400 mx-2' })
                  ),
                  React.createElement('div', { className: 'bg-blue-100 px-4 py-2 rounded font-semibold' }, 'Microgram (mcg)')
                ),
                React.createElement('p', { className: 'text-sm text-gray-600 mt-4' }, 'Going down = multiply by 1000, Going up = divide by 1000')
              )
            )
          }
        } as ConceptCardProps
      }
    },

    {
      id: 'dimensional-analysis',
      title: 'Dimensional Analysis Method',
      description: 'Learn the systematic approach to unit conversion',
      type: 'concept' as const,
      duration: '35 min',
      content: {
        concept: {
          title: 'Dimensional Analysis Method',
          description: 'Dimensional analysis is the gold standard for medical calculations. This systematic method virtually eliminates conversion errors and works for any problem.',
          keyPoints: [
            'Set up conversion factors as fractions (ratios)',
            'Arrange factors so unwanted units cancel out',
            'Multiply straight across (numerator × numerator, denominator × denominator)',
            'The remaining unit should be what you want',
            'Always check that your answer makes sense'
          ],
          terminology: [
            {
              term: 'Conversion Factor',
              definition: 'A fraction showing the relationship between two units',
              example: '1000 mg/1 g or 1 g/1000 mg (same relationship, different forms)'
            },
            {
              term: 'Unit Cancellation',
              definition: 'When the same units appear in numerator and denominator, they cancel out',
              example: 'mg/mg = 1 (units cancel, leaving just numbers)'
            },
            {
              term: 'Given Quantity',
              definition: 'The amount you start with (what you know)',
              example: 'Patient weighs 70 kg (this is your given quantity)'
            },
            {
              term: 'Desired Quantity',
              definition: 'The amount you want to find (what you need)',
              example: 'Need to find weight in pounds (this is your desired quantity)'
            }
          ],
          examples: [
            {
              problem: 'Convert 1.5 g to mg using dimensional analysis',
              solution: '1500 mg',
              explanation: 'Set up: 1.5 g × (1000 mg/1 g) = 1500 mg. The grams cancel out.',
              steps: [
                'Write the given: 1.5 g',
                'Choose conversion factor: 1000 mg = 1 g',
                'Set up so grams cancel: 1.5 g × (1000 mg/1 g)',
                'Multiply: 1.5 × 1000 = 1500 mg'
              ]
            },
            {
              problem: 'Convert 2500 mcg to mg',
              solution: '2.5 mg',
              explanation: 'Set up: 2500 mcg × (1 mg/1000 mcg) = 2.5 mg',
              steps: [
                'Write the given: 2500 mcg',
                'Choose conversion factor: 1000 mcg = 1 mg',
                'Set up so mcg cancels: 2500 mcg × (1 mg/1000 mcg)',
                'Calculate: 2500 ÷ 1000 = 2.5 mg'
              ]
            }
          ],
          tips: [
            'Always write out units - they guide your setup',
            'If units don\'t cancel properly, flip your conversion factor',
            'For multi-step conversions, chain the factors together',
            'Double-check by estimating: does the answer make sense?',
            '💡 Struggling to remember conversion factors? Build instant recall with our Memorization Training at /memorize/conversions'
          ],
          warnings: [
            'Wrong conversion factor orientation is the #1 error',
            'Always verify units cancel to give you what you want',
            'Don\'t skip steps - write everything out',
            'If your answer seems way off, check your setup'
          ]
        } as ConceptCardProps,
        
        stepByStep: {
          title: 'Dimensional Analysis Step-by-Step',
          problem: 'A patient needs 0.25 mg of medication. The vial contains 500 mcg/mL. How many mL do you need?',
          steps: [
            {
              id: 'identify',
              title: 'Identify Given and Desired',
              content: 'Clearly identify what you have and what you need to find.',
              explanation: 'This step prevents setup errors and keeps you focused.',
              calculation: `Given: 0.25 mg needed
Vial concentration: 500 mcg/mL
Desired: volume in mL`
            },
            {
              id: 'plan',
              title: 'Plan Your Conversion Path',
              content: 'Determine what conversions are needed.',
              explanation: 'We need to convert mg to mcg first, then use the concentration.',
              calculation: `Path: mg → mcg → mL
Conversions needed:
• 0.25 mg to mcg
• mcg to mL using 500 mcg/mL`
            },
            {
              id: 'setup',
              title: 'Set Up Dimensional Analysis',
              content: 'Write the equation with conversion factors.',
              calculation: `0.25 mg × (1000 mcg/1 mg) × (1 mL/500 mcg) = ? mL`,
              explanation: 'Each fraction is set up so unwanted units cancel out'
            },
            {
              id: 'cancel',
              title: 'Cancel Units',
              content: 'Verify that units cancel properly.',
              calculation: `0.25 mg × (1000 mcg/1 mg) × (1 mL/500 mcg)
mg cancels with mg
mcg cancels with mcg
Only mL remains ✓`,
              explanation: 'Units must cancel to leave only the desired unit'
            },
            {
              id: 'calculate',
              title: 'Calculate the Answer',
              content: 'Multiply numerators and divide by denominators.',
              calculation: `(0.25 × 1000 × 1) ÷ (1 × 500) = 250 ÷ 500 = 0.5`,
              result: '0.5 mL',
              explanation: 'Patient needs 0.5 mL of the medication'
            },
            {
              id: 'verify',
              title: 'Verify Your Answer',
              content: 'Check if the answer makes logical sense.',
              calculation: `Check: 0.5 mL × 500 mcg/mL = 250 mcg = 0.25 mg ✓
Makes sense: small dose, small volume`,
              explanation: 'Always verify by working backwards or using logic'
            }
          ],
          finalAnswer: '0.5 mL',
          explanation: 'Using dimensional analysis ensures accuracy and provides a clear audit trail for complex conversions.'
        } as StepByStepGuideProps
      }
    },

    {
      id: 'basic-conversions',
      title: 'Basic Medical Conversions',
      description: 'Practice essential metric conversions',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Basic Medical Conversions',
          description: 'Before diving into practice, let\'s review the most common conversions you\'ll encounter in healthcare settings.',
          keyPoints: [
            'Weight conversions: kg ↔ g ↔ mg ↔ mcg',
            'Volume conversions: L ↔ mL',
            'Most medications use mg and mL units',
            'Always double-check decimal placement',
            'Use the "ladder method" or dimensional analysis'
          ],
          terminology: [
            {
              term: 'Common Medical Units',
              definition: 'The units you\'ll see most often in healthcare',
              example: 'kg (body weight), mg (drug doses), mL (liquid volumes)'
            },
            {
              term: 'Conversion Factor',
              definition: 'The number you multiply or divide by to convert units',
              example: '1000 is the conversion factor between g and mg'
            }
          ],
          examples: [
            {
              problem: 'Quick reference: What are the key conversion factors?',
              solution: '1 kg = 1000 g, 1 g = 1000 mg, 1 mg = 1000 mcg, 1 L = 1000 mL',
              explanation: 'Memorize these - they\'re used constantly in medical calculations',
              steps: [
                '1 kilogram = 1000 grams',
                '1 gram = 1000 milligrams', 
                '1 milligram = 1000 micrograms',
                '1 liter = 1000 milliliters'
              ]
            }
          ],
          tips: [
            'When going DOWN the scale (kg→g→mg→mcg), multiply by 1000',
            'When going UP the scale (mcg→mg→g→kg), divide by 1000',
            'Moving the decimal: 3 places right when multiplying by 1000',
            'Moving the decimal: 3 places left when dividing by 1000',
            '💡 Need to memorize these conversions? Try our focused Memorization Training at /memorize/conversions'
          ],
          warnings: [
            'Never confuse mg and mcg - there\'s a 1000× difference!',
            'Always write out units completely to avoid errors',
            'Double-check decimal placement - it\'s easy to be off by 10× or 100×',
            'When in doubt, set up a formal dimensional analysis'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'complex-conversions',
      title: 'Multi-Step Conversions', 
      description: 'Handle complex conversion chains',
      type: 'concept' as const,
      duration: '40 min',
      content: {
        concept: {
          title: 'Multi-Step Conversions',
          description: 'Real medical problems often require multiple conversions. Learn to chain conversion factors systematically.',
          keyPoints: [
            'Break complex problems into smaller conversion steps',
            'Chain conversion factors in one equation',
            'Each factor should cancel the previous unit',
            'Work left to right, checking unit cancellation',
            'Common chains: kg→g→mg→mcg or L→mL→drops'
          ],
          examples: [
            {
              problem: 'A patient weighs 70 kg. They need 15 mcg/kg of medication. The drug comes as 2 mg/mL. How many mL?',
              solution: '0.525 mL',
              explanation: 'Chain the conversions: 70 kg × 15 mcg/kg × 1 mg/1000 mcg × 1 mL/2 mg = 0.525 mL',
              steps: [
                'Calculate total dose: 70 kg × 15 mcg/kg = 1050 mcg',
                'Convert to mg: 1050 mcg × 1 mg/1000 mcg = 1.05 mg',
                'Convert to volume: 1.05 mg × 1 mL/2 mg = 0.525 mL',
                'Or in one equation: 70 × 15 × 1/1000 × 1/2 = 0.525 mL'
              ]
            }
          ],
          tips: [
            'Write out the entire equation before calculating',
            'Double-check that all units cancel except the desired one',
            'Break complex problems into steps if needed',
            'Use parentheses to group conversion factors clearly'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'conversion-practice',
      title: 'Advanced Conversion Practice',
      description: 'Master complex real-world conversion problems',
      type: 'concept' as const,
      duration: '45 min',
      content: {
        concept: {
          title: 'Advanced Conversion Strategies',
          description: 'Real-world medical scenarios often involve complex, multi-step conversions. Master the strategies that will help you tackle any conversion problem confidently.',
          keyPoints: [
            'Break complex problems into logical steps',
            'Identify all given information and what you need to find',
            'Look for weight-based dosing (mcg/kg/min, mg/kg/hr)',
            'Time conversions are often needed (min ↔ hr)',
            'Concentration calculations bridge dose and volume'
          ],
          terminology: [
            {
              term: 'mcg/kg/min',
              definition: 'Micrograms per kilogram per minute - common for weight-based drips',
              example: 'Dopamine 5 mcg/kg/min means 5 mcg for each kg of body weight every minute'
            },
            {
              term: 'mg/hr',
              definition: 'Milligrams per hour - how much drug per hour',
              example: 'Converting mcg/min to mg/hr requires × 60 ÷ 1000'
            },
            {
              term: 'Flow Rate',
              definition: 'Volume infused per unit time, usually mL/hr',
              example: 'Pump setting of 25 mL/hr means 25 mL infuses each hour'
            }
          ],
          examples: [
            {
              problem: 'Strategy: How to approach weight-based drip calculations?',
              solution: 'Step-by-step systematic approach',
              explanation: 'Always follow the same sequence to avoid errors',
              steps: [
                '1. Calculate dose per minute: weight × mcg/kg/min',
                '2. Convert to hourly dose: × 60 minutes/hour',
                '3. Convert units if needed: mcg → mg',
                '4. Calculate volume: dose ÷ concentration',
                '5. Verify units match what pump expects (mL/hr)'
              ]
            }
          ],
          tips: [
            'Draw out the conversion chain before starting',
            'Write all units clearly - they guide your calculations',
            'For drip calculations: dose/time → concentration → volume/time',
            'Double-check that your final answer makes clinical sense'
          ],
          warnings: [
            'IV medication errors can be rapidly fatal',
            'Always verify complex calculations with another nurse',
            'Watch for unit mix-ups: mcg vs mg, min vs hr',
            'If your answer seems way off, recheck your setup'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'conversion-assessment',
      title: 'Conversion Mastery Check',
      description: 'Prove your conversion skills',
      type: 'assessment' as const,
      duration: '35 min',
      content: {
        assessment: {
          title: 'Unit Conversion Mastery Assessment',
          description: 'Demonstrate mastery of metric conversions and dimensional analysis. You need 85% to pass.',
          passingScore: 85,
          timeLimit: 35,
          maxAttempts: 3,
          questions: [
            {
              id: 'assess-1',
              question: 'Convert 1.25 g to mcg',
              type: 'input' as const,
              correctAnswer: 1250000,
              explanation: '1.25 g × 1000 mg/g × 1000 mcg/mg = 1,250,000 mcg',
              points: 5,
              difficulty: 'medium' as const,
              unit: 'mcg'
            },
            {
              id: 'assess-2', 
              question: 'A solution is 0.9% sodium chloride. How many mg of NaCl in 100 mL?',
              type: 'input' as const,
              correctAnswer: 900,
              explanation: '0.9% means 0.9 g per 100 mL. 0.9 g × 1000 mg/g = 900 mg',
              points: 6,
              difficulty: 'medium' as const,
              unit: 'mg'
            },
            {
              id: 'assess-3',
              question: 'Using dimensional analysis: 75 kg patient needs 2.5 mg/kg of drug. Vial has 50 mg/mL. How many mL?',
              type: 'input' as const,
              correctAnswer: 3.75,
              explanation: '75 kg × 2.5 mg/kg × 1 mL/50 mg = 3.75 mL',
              points: 8,
              difficulty: 'hard' as const,
              unit: 'mL'
            },
            {
              id: 'assess-4',
              question: 'An IV drip delivers 20 gtts/min. The drop factor is 15 gtts/mL. What is the flow rate in mL/hr?',
              type: 'input' as const,
              correctAnswer: 80,
              explanation: '20 gtts/min × 1 mL/15 gtts × 60 min/hr = 80 mL/hr',
              points: 7,
              difficulty: 'hard' as const,
              unit: 'mL/hr'
            }
          ]
        } as MasteryCheckProps
      }
    }
  ]
};

export default conversionsContent;