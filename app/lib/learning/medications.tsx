import React from 'react';
import { ConceptCardProps, StepByStepGuideProps, QuickPracticeProps, MasteryCheckProps } from '../../components/learning';

// Medication Basics Level Learning Content
export const medicationsContent = {
  level: {
    id: 'medications',
    title: 'Medication Basics',
    description: 'Learn fundamental medication calculation principles',
    estimatedTime: '4-5 hours',
    topics: 8
  },
  
  topics: [
    {
      id: 'drug-concentrations',
      title: 'Understanding Drug Concentrations',
      description: 'Learn how medications are measured and expressed',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Understanding Drug Concentrations',
          description: 'Drug concentrations tell you how much active medication is in a given amount of solution or solid form. This is fundamental to all dosage calculations.',
          keyPoints: [
            'Concentration = amount of drug ÷ total volume/weight',
            'Common expressions: mg/mL, mg/tablet, units/mL, %',
            'Percentage concentrations: mg per 100mL (w/v)',
            'Read labels carefully - same drug, different concentrations',
            'Higher concentration = more drug in less volume'
          ],
          terminology: [
            {
              term: 'Concentration',
              definition: 'The amount of active drug in a specific volume or unit',
              example: '250 mg/5 mL means 250mg of drug in every 5mL of liquid'
            },
            {
              term: 'Strength',
              definition: 'Another term for concentration, often used on labels',
              example: 'Tablet strength: 25mg means each tablet contains 25mg'
            },
            {
              term: 'w/v (weight/volume)',
              definition: 'Weight of drug per volume of solution',
              example: '5% dextrose = 5g dextrose per 100mL solution'
            },
            {
              term: 'Stock Solution',
              definition: 'The concentration of medication as it comes from pharmacy',
              example: 'Morphine stock: 10mg/mL (what you have available)'
            },
            {
              term: 'Dilution',
              definition: 'Adding liquid to reduce the concentration',
              example: 'Diluting 10mg/mL to 1mg/mL by adding 9 parts diluent'
            }
          ],
          examples: [
            {
              problem: 'A vial contains 500mg in 10mL. What is the concentration?',
              solution: '50 mg/mL',
              explanation: 'Concentration = 500mg ÷ 10mL = 50mg/mL',
              steps: [
                'Identify total drug amount: 500mg',
                'Identify total volume: 10mL',
                'Divide: 500mg ÷ 10mL = 50mg/mL',
                'Answer: 50mg/mL concentration'
              ]
            },
            {
              problem: 'Normal saline is 0.9%. How much sodium chloride in 250mL?',
              solution: '2.25g',
              explanation: '0.9% = 0.9g per 100mL. For 250mL: (0.9/100) × 250 = 2.25g',
              steps: [
                '0.9% means 0.9g per 100mL',
                'Set up proportion: 0.9g/100mL = x/250mL',
                'Cross multiply: 100x = 0.9 × 250',
                'Solve: x = 225/100 = 2.25g'
              ]
            }
          ],
          tips: [
            'Always double-check the units on medication labels',
            'Be careful with look-alike concentrations (1mg/mL vs 10mg/mL)',
            'When in doubt, calculate the concentration yourself',
            'Remember: same drug can come in multiple concentrations'
          ],
          warnings: [
            'Never assume concentration - always read the label',
            'Mix-ups between mg and mL are common and dangerous',
            'High-alert medications often have multiple concentrations',
            'Always verify calculations with another nurse when possible'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'tablet-calculations',
      title: 'Tablet and Capsule Calculations',
      description: 'Calculate oral medication doses accurately',
      type: 'concept' as const,
      duration: '25 min',
      content: {
        concept: {
          title: 'Tablet and Capsule Calculations',
          description: 'Oral medications come in fixed doses. Learn to calculate how many tablets or capsules to give for any prescribed dose.',
          keyPoints: [
            'Use the formula: Desired dose ÷ Available dose = Number of tablets',
            'Always check if tablets can be split (scored tablets)',
            'Round to practical amounts (0.5, 1, 1.5, 2 tablets)',
            'Never break unscored tablets or capsules',
            'Consider alternative strengths if calculation is impractical'
          ],
          examples: [
            {
              problem: 'Order: 750mg. Available: 250mg tablets. How many tablets?',
              solution: '3 tablets',
              explanation: '750mg ÷ 250mg = 3 tablets',
              steps: [
                'Identify desired dose: 750mg',
                'Identify available dose: 250mg per tablet',
                'Calculate: 750mg ÷ 250mg = 3',
                'Answer: Give 3 tablets'
              ]
            },
            {
              problem: 'Order: 375mg. Available: 250mg scored tablets. How many tablets?',
              solution: '1.5 tablets',
              explanation: '375mg ÷ 250mg = 1.5 tablets (can split because scored)',
              steps: [
                'Identify desired dose: 375mg',
                'Identify available dose: 250mg per tablet (scored)',
                'Calculate: 375mg ÷ 250mg = 1.5',
                'Answer: Give 1.5 tablets (tablets can be split)'
              ]
            }
          ],
          tips: [
            'If answer is not practical (like 2.7 tablets), check your calculation',
            'Look for alternative tablet strengths that give whole numbers',
            'Scored tablets can be split, unscored cannot',
            'Contact pharmacy if dose requires impossible tablet splitting'
          ]
        } as ConceptCardProps,
        
        stepByStep: {
          title: 'Tablet Calculation Step-by-Step',
          problem: 'Doctor orders 150mg of medication. Available: 75mg tablets (scored). How many tablets should you give?',
          steps: [
            {
              id: 'identify',
              title: 'Identify the Information',
              content: 'Extract the key information from the order and available medication.',
              explanation: 'Always start by clearly identifying what you need and what you have.',
              calculation: `Ordered dose: 150mg
Available: 75mg per tablet (scored)
Need to find: Number of tablets`
            },
            {
              id: 'setup',
              title: 'Set Up the Formula',
              content: 'Use the basic tablet calculation formula.',
              formula: 'Number of tablets = Desired dose ÷ Available dose',
              calculation: 'Number of tablets = 150mg ÷ 75mg',
              explanation: 'This formula works for any oral solid medication'
            },
            {
              id: 'calculate',
              title: 'Perform the Calculation',
              content: 'Divide the desired dose by the available dose.',
              calculation: '150mg ÷ 75mg = 2',
              explanation: 'The mg units cancel out, leaving just the number of tablets'
            },
            {
              id: 'verify',
              title: 'Verify the Answer Makes Sense',
              content: 'Check that the answer is practical and safe.',
              calculation: '2 tablets × 75mg = 150mg ✓',
              result: '2 tablets',
              explanation: '2 tablets is a practical amount and gives the correct dose'
            }
          ],
          finalAnswer: '2 tablets',
          explanation: 'The patient should receive 2 tablets to get the ordered 150mg dose.'
        } as StepByStepGuideProps
      }
    },

    {
      id: 'liquid-medications',
      title: 'Liquid Medication Calculations',
      description: 'Calculate liquid doses and volumes accurately',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Liquid Medication Calculations',
          description: 'Liquid medications allow for precise dosing but require careful volume calculations. Learn to convert doses to volumes safely.',
          keyPoints: [
            'Use the formula: Volume = (Desired dose ÷ Concentration)',
            'Pay attention to concentration units (mg/mL, mg/5mL, etc.)',
            'Always use appropriate measuring devices',
            'Be extra careful with pediatric and high-potency medications',
            'Double-check decimal placement'
          ],
          terminology: [
            {
              term: 'Suspension',
              definition: 'Liquid with drug particles that settle (shake well)',
              example: 'Amoxicillin suspension: 250mg/5mL'
            },
            {
              term: 'Solution',
              definition: 'Liquid with drug completely dissolved (clear)',
              example: 'Acetaminophen solution: 160mg/5mL'
            },
            {
              term: 'Elixir',
              definition: 'Sweetened liquid medication (often alcohol-based)',
              example: 'Digoxin elixir: 0.05mg/mL'
            },
            {
              term: 'Syrup',
              definition: 'Thick, sweet liquid medication',
              example: 'Cough syrup: 15mg/5mL'
            }
          ],
          examples: [
            {
              problem: 'Order: 400mg. Available: 250mg/5mL. How much volume?',
              solution: '8 mL',
              explanation: 'Using proportion: 250mg/5mL = 400mg/x mL. Cross multiply: 250x = 2000, x = 8mL',
              steps: [
                'Set up proportion: 250mg/5mL = 400mg/x mL',
                'Cross multiply: 250mg × x = 400mg × 5mL',
                'Solve: 250x = 2000',
                'x = 2000/250 = 8mL'
              ]
            },
            {
              problem: 'Order: 0.125mg. Available: 0.05mg/mL. How much volume?',
              solution: '2.5 mL',
              explanation: '0.125mg ÷ 0.05mg/mL = 2.5mL',
              steps: [
                'Use formula: Volume = Desired dose ÷ Concentration',
                'Volume = 0.125mg ÷ 0.05mg/mL',
                'Volume = 2.5mL',
                'Verify: 2.5mL × 0.05mg/mL = 0.125mg ✓'
              ]
            }
          ],
          tips: [
            'Always shake suspensions before measuring',
            'Use oral syringes for volumes less than 10mL',
            'Check concentration carefully - some are per 1mL, others per 5mL',
            'Round to measurable amounts based on your equipment'
          ],
          warnings: [
            'Never use household teaspoons - use calibrated devices',
            'Be especially careful with pediatric concentrations',
            'Some medications come in multiple concentrations',
            'Always double-check decimal placement in calculations'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'injection-calculations',
      title: 'Injectable Medication Calculations',
      description: 'Calculate injection volumes and reconstitutions',
      type: 'concept' as const,
      duration: '35 min',
      content: {
        concept: {
          title: 'Injectable Medication Calculations',
          description: 'Injectable medications require precise calculations for both volume and concentration. Learn to handle reconstitutions and dilutions safely.',
          keyPoints: [
            'Use same formulas as liquids: Volume = Desired dose ÷ Concentration',
            'Reconstitution creates new concentration from powder',
            'Always follow manufacturer instructions for reconstitution',
            'Account for displacement volume in reconstitutions',
            'Use appropriate syringe size for accuracy'
          ],
          terminology: [
            {
              term: 'Reconstitution',
              definition: 'Adding liquid to powder to create injectable solution',
              example: 'Adding 10mL sterile water to 1g powder vial'
            },
            {
              term: 'Diluent',
              definition: 'The liquid added to powder (sterile water, normal saline)',
              example: 'Sterile water for injection is common diluent'
            },
            {
              term: 'Displacement Volume',
              definition: 'Space that powder takes up in final solution',
              example: '1g powder + 10mL diluent may = 10.5mL total'
            },
            {
              term: 'Final Volume',
              definition: 'Total volume after reconstitution including displacement',
              example: 'If displacement is 0.5mL, final volume is 10.5mL'
            }
          ],
          examples: [
            {
              problem: 'Reconstitute 1g vial with 9.2mL diluent for final concentration of 100mg/mL. Order: 250mg. How much to draw?',
              solution: '2.5 mL',
              explanation: 'After reconstitution: 100mg/mL. For 250mg: 250mg ÷ 100mg/mL = 2.5mL',
              steps: [
                'Identify final concentration: 100mg/mL',
                'Identify desired dose: 250mg',
                'Calculate volume: 250mg ÷ 100mg/mL = 2.5mL',
                'Draw up 2.5mL from reconstituted vial'
              ]
            },
            {
              problem: 'Order: 150mg IM. Available: 300mg/2mL vial. How much to draw?',
              solution: '1 mL',
              explanation: 'Concentration = 300mg/2mL = 150mg/mL. For 150mg: 150mg ÷ 150mg/mL = 1mL',
              steps: [
                'Calculate concentration: 300mg ÷ 2mL = 150mg/mL',
                'Use formula: Volume = 150mg ÷ 150mg/mL',
                'Volume = 1mL',
                'Draw up 1mL for injection'
              ]
            }
          ],
          tips: [
            'Always read reconstitution instructions on vial or package insert',
            'Mark reconstituted vials with concentration and date',
            'Check stability - some reconstituted drugs expire quickly',
            'Use tuberculin syringe for volumes less than 1mL'
          ],
          warnings: [
            'Never guess at reconstitution instructions',
            'Some powders have significant displacement volume',
            'Reconstituted medications may have short stability',
            'Always use sterile technique for reconstitution'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'pediatric-calculations',
      title: 'Pediatric Dosage Calculations',
      description: 'Safe medication calculations for children',
      type: 'concept' as const,
      duration: '40 min',
      content: {
        concept: {
          title: 'Pediatric Dosage Calculations',
          description: 'Children require weight-based dosing for safety. Learn to calculate pediatric doses accurately and verify they are within safe ranges.',
          keyPoints: [
            'Pediatric doses are usually based on body weight (mg/kg)',
            'Always verify dose is within safe range for child\'s weight',
            'Use child\'s current weight, not estimated weight',
            'Double-check all calculations - errors are more dangerous in children',
            'Consider body surface area (BSA) for some medications'
          ],
          terminology: [
            {
              term: 'mg/kg/dose',
              definition: 'Milligrams of drug per kilogram of body weight per dose',
              example: '10mg/kg/dose means 10mg for each kg the child weighs'
            },
            {
              term: 'mg/kg/day',
              definition: 'Total daily dose per kilogram, divided into multiple doses',
              example: '30mg/kg/day divided into 3 doses = 10mg/kg per dose'
            },
            {
              term: 'Safe Dose Range',
              definition: 'Minimum and maximum safe doses per kg',
              example: 'Safe range: 10-15mg/kg/dose (not less than 10, not more than 15)'
            },
            {
              term: 'BSA (Body Surface Area)',
              definition: 'Calculated from height and weight, used for some drugs',
              example: 'Chemotherapy doses often based on BSA (mg/m²)'
            }
          ],
          examples: [
            {
              problem: 'Child weighs 20kg. Order: acetaminophen 15mg/kg. Safe range: 10-15mg/kg. How much to give?',
              solution: '300mg',
              explanation: '20kg × 15mg/kg = 300mg. This is within safe range (10-15mg/kg).',
              steps: [
                'Calculate dose: 20kg × 15mg/kg = 300mg',
                'Check safe range: 10-15mg/kg for 20kg child',
                'Minimum safe: 20kg × 10mg/kg = 200mg',
                'Maximum safe: 20kg × 15mg/kg = 300mg',
                'Order of 300mg is safe (at maximum but within range)'
              ]
            },
            {
              problem: 'Infant weighs 8kg. Order: amoxicillin 25mg/kg/day divided q8h. What is each dose?',
              solution: '67mg per dose',
              explanation: 'Daily dose: 8kg × 25mg/kg = 200mg/day. q8h = 3 doses/day. 200mg ÷ 3 = 67mg per dose',
              steps: [
                'Calculate daily dose: 8kg × 25mg/kg = 200mg/day',
                'q8h means every 8 hours = 3 times per day',
                'Each dose: 200mg ÷ 3 = 66.7mg ≈ 67mg',
                'Give 67mg every 8 hours'
              ]
            }
          ],
          tips: [
            'Always weigh children before calculating doses',
            'Keep a pediatric drug reference handy for safe ranges',
            'When in doubt, verify with pharmacist or physician',
            'Use decimal points carefully - small errors have big effects'
          ],
          warnings: [
            'Never estimate a child\'s weight - always use actual weight',
            'Pediatric medication errors can be fatal',
            'Always verify dose is within safe range before giving',
            'Be extra careful with decimal points and calculations'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'medication-practice',
      title: 'Medication Calculation Practice',
      description: 'Practice essential medication calculations',
      type: 'concept' as const,
      duration: '35 min',
      content: {
        concept: {
          title: 'Medication Calculation Review',
          description: 'Before practicing, let\'s review the key formulas and strategies you\'ve learned for safe medication calculations.',
          keyPoints: [
            'Tablets: Desired dose ÷ Available dose = Number of tablets',
            'Liquids: Volume = Desired dose ÷ Concentration',
            'Pediatric: Total dose = Weight × mg/kg, then convert to volume',
            'Reconstitution: Follow label instructions, then use new concentration',
            'Always double-check calculations and include units'
          ],
          terminology: [
            {
              term: 'Desired Dose',
              definition: 'The amount of medication ordered by the physician',
              example: 'Order for 500mg is the desired dose'
            },
            {
              term: 'Available Dose',
              definition: 'The amount of medication in each tablet or per mL',
              example: '250mg tablets means 250mg is available per tablet'
            },
            {
              term: 'Weight-based Dosing',
              definition: 'Dose calculated using patient\'s weight (common in pediatrics)',
              example: '10mg/kg means 10mg for each kilogram the patient weighs'
            }
          ],
          examples: [
            {
              problem: 'Quick formula check: How to calculate tablets needed?',
              solution: 'Tablets = Desired dose ÷ Available dose',
              explanation: 'This basic formula works for any tablet calculation',
              steps: [
                'Identify what dose is ordered (desired)',
                'Identify what each tablet contains (available)',
                'Divide: desired ÷ available = number of tablets',
                'Check if answer is practical (can you give partial tablets?)'
              ]
            }
          ],
          tips: [
            'Read medication labels carefully - strength can vary',
            'Check if tablets are scored (can be split) or unscored',
            'For liquids, pay attention to concentration (mg/mL vs mg/5mL)',
            'Pediatric doses: calculate total dose first, then volume'
          ],
          warnings: [
            'Never guess at tablet splitting - check if tablets are scored',
            'Always verify pediatric calculations - errors are more dangerous',
            'Reconstitution instructions vary - always read the label',
            'When in doubt, ask pharmacist or another nurse to verify'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'insulin-calculations',
      title: 'Insulin Calculations',
      description: 'Special considerations for insulin dosing',
      type: 'concept' as const,
      duration: '30 min',
      content: {
        concept: {
          title: 'Insulin Calculations',
          description: 'Insulin requires special attention due to its high-alert nature and unique units. Learn safe insulin calculation and administration practices.',
          keyPoints: [
            'Insulin is measured in units, not mg',
            'Standard concentration: 100 units/mL (U-100)',
            'Always use insulin syringes for subcutaneous doses',
            'IV insulin requires special pumps and concentrations',
            'Double-check all insulin calculations with another nurse'
          ],
          terminology: [
            {
              term: 'Units',
              definition: 'Standardized measure of insulin potency (not weight)',
              example: '10 units of insulin (not 10mg or 10mL)'
            },
            {
              term: 'U-100',
              definition: 'Standard insulin concentration: 100 units per mL',
              example: 'Most insulin vials and pens are U-100'
            },
            {
              term: 'Insulin Syringe',
              definition: 'Special syringe marked in units for subcutaneous insulin',
              example: '0.3mL syringe holds 30 units, 1mL syringe holds 100 units'
            },
            {
              term: 'Sliding Scale',
              definition: 'Variable insulin doses based on blood glucose levels',
              example: 'BG 150-200: give 2 units, BG 201-250: give 4 units'
            }
          ],
          examples: [
            {
              problem: 'Order: 15 units insulin subcutaneous. Available: U-100 insulin. How much volume?',
              solution: '0.15 mL',
              explanation: 'U-100 = 100 units/mL. 15 units ÷ 100 units/mL = 0.15mL',
              steps: [
                'Identify concentration: U-100 = 100 units/mL',
                'Use formula: Volume = 15 units ÷ 100 units/mL',
                'Calculate: 15 ÷ 100 = 0.15mL',
                'Use insulin syringe marked in units, not tuberculin syringe'
              ]
            },
            {
              problem: 'Patient BG = 225. Sliding scale: BG 201-250 give 4 units. What do you give?',
              solution: '4 units',
              explanation: 'BG of 225 falls in range 201-250, so give 4 units per protocol',
              steps: [
                'Check blood glucose: 225 mg/dL',
                'Find corresponding range: 201-250',
                'Read protocol dose: 4 units',
                'Give 4 units subcutaneous insulin'
              ]
            }
          ],
          tips: [
            'Always use insulin syringes for subcutaneous insulin',
            'Have another nurse verify insulin doses before giving',
            'Never abbreviate "units" as "U" - write out completely',
            'Check blood glucose before giving sliding scale insulin'
          ],
          warnings: [
            'Insulin is a high-alert medication - double-check everything',
            'Never use tuberculin syringes for routine insulin',
            'Insulin overdose can cause fatal hypoglycemia',
            'Always verify patient identity before giving insulin'
          ]
        } as ConceptCardProps
      }
    },

    {
      id: 'medication-assessment',
      title: 'Medication Calculation Mastery',
      description: 'Comprehensive medication calculation assessment',
      type: 'assessment' as const,
      duration: '45 min',
      content: {
        assessment: {
          title: 'Medication Basics Mastery Assessment',
          description: 'Demonstrate mastery of fundamental medication calculations. You need 85% to pass and advance to clinical applications.',
          passingScore: 85,
          timeLimit: 45,
          maxAttempts: 3,
          questions: [
            {
              id: 'med-assess-1',
              question: 'Order: 750mg. Available: 500mg tablets (scored). How many tablets?',
              type: 'input' as const,
              correctAnswer: 1.5,
              explanation: '750mg ÷ 500mg = 1.5 tablets (can split because scored)',
              points: 5,
              difficulty: 'easy' as const,
              unit: 'tablets'
            },
            {
              id: 'med-assess-2',
              question: 'Order: 400mg. Available: 200mg/5mL. How much volume to give?',
              type: 'input' as const,
              correctAnswer: 10,
              explanation: 'Set up proportion: 200mg/5mL = 400mg/x mL. Cross multiply: 200x = 2000, x = 10mL',
              points: 6,
              difficulty: 'medium' as const,
              unit: 'mL'
            },
            {
              id: 'med-assess-3',
              question: 'Child weighs 22kg. Order: amoxicillin 20mg/kg/dose. Available: 250mg/5mL. How much volume per dose?',
              type: 'input' as const,
              correctAnswer: 8.8,
              explanation: 'Dose: 22kg × 20mg/kg = 440mg. Volume: 440mg ÷ (250mg/5mL) = 440 × 5/250 = 8.8mL',
              points: 8,
              difficulty: 'hard' as const,
              unit: 'mL'
            },
            {
              id: 'med-assess-4',
              question: 'Order: 25 units insulin. Available: U-100 insulin. What volume to draw in tuberculin syringe?',
              type: 'input' as const,
              correctAnswer: 0.25,
              explanation: 'U-100 = 100 units/mL. 25 units ÷ 100 units/mL = 0.25mL',
              points: 7,
              difficulty: 'medium' as const,
              unit: 'mL'
            },
            {
              id: 'med-assess-5',
              question: 'Reconstitute 1g vial: add 4.6mL to make 200mg/mL. Order: 350mg. How much to draw?',
              type: 'input' as const,
              correctAnswer: 1.75,
              explanation: '350mg ÷ 200mg/mL = 1.75mL',
              points: 8,
              difficulty: 'hard' as const,
              unit: 'mL'
            },
            {
              id: 'med-assess-6',
              question: 'Which is the safest dose for a 30kg child if the safe range is 5-10mg/kg/dose?',
              type: 'multiple-choice' as const,
              options: ['100mg', '200mg', '300mg', '400mg'],
              correctAnswer: '200mg',
              explanation: 'Safe range for 30kg: minimum = 30×5 = 150mg, maximum = 30×10 = 300mg. Only 200mg is clearly within range.',
              points: 6,
              difficulty: 'medium' as const
            }
          ]
        } as MasteryCheckProps
      }
    }
  ]
};

export default medicationsContent;