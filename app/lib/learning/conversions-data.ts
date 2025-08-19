// Medical Unit Conversion Data for Memorization
// Based on standard medical dosage & calculations reference tables

export interface Conversion {
  id: string;
  category: string;
  fromUnit: string;
  toUnit: string;
  factor: number;
  displayFactor: string; // Human-readable format
  commonMistakes?: string[];
  memoryTricks?: string[];
  priority: 'critical' | 'important' | 'useful';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ConversionCategory {
  id: string;
  name: string;
  description: string;
  conversions: Conversion[];
  memoryTricks?: string[];
}

// Core conversion data extracted from medical reference tables
export const conversionData: ConversionCategory[] = [
  {
    id: 'weight-mass',
    name: 'Weight & Mass',
    description: 'Essential weight conversions for medication dosing',
    memoryTricks: [
      'Remember the ladder: kg → g → mg → mcg (each step ×1000)',
      'Milli = thousand, Micro = million (parts)',
      'King Henry Died By Drinking Chocolate Milk (kg, hg, dag, g, dg, cg, mg)'
    ],
    conversions: [
      {
        id: 'mcg-to-mg',
        category: 'weight-mass',
        fromUnit: 'mcg',
        toUnit: 'mg',
        factor: 0.001,
        displayFactor: '1000 mcg = 1 mg',
        memoryTricks: ['Micro is TINY - 1000 micrograms in 1 milligram'],
        commonMistakes: ['Confusing mcg with mg - 1000× difference!'],
        priority: 'critical',
        difficulty: 'hard'
      },
      {
        id: 'mg-to-g',
        category: 'weight-mass',
        fromUnit: 'mg',
        toUnit: 'g',
        factor: 0.001,
        displayFactor: '1000 mg = 1 g',
        memoryTricks: ['Milli = 1/1000, so 1000 mg = 1 g'],
        priority: 'critical',
        difficulty: 'easy'
      },
      {
        id: 'g-to-kg',
        category: 'weight-mass',
        fromUnit: 'g',
        toUnit: 'kg',
        factor: 0.001,
        displayFactor: '1000 g = 1 kg',
        memoryTricks: ['Kilo = 1000, like kilometer has 1000 meters'],
        priority: 'important',
        difficulty: 'easy'
      },
      {
        id: 'lbs-to-kg',
        category: 'weight-mass',
        fromUnit: 'lbs',
        toUnit: 'kg',
        factor: 0.4536,
        displayFactor: '2.2 lbs = 1 kg',
        memoryTricks: ['2.2 pounds per kilogram - remember "2 point 2"'],
        commonMistakes: ['Using 2.0 instead of 2.2'],
        priority: 'critical',
        difficulty: 'medium'
      }
    ]
  },
  
  {
    id: 'volume',
    name: 'Volume',
    description: 'Volume conversions for solutions and medications',
    memoryTricks: [
      'mL and cc are identical (1 mL = 1 cc)',
      'Household: 3 tsp = 1 Tbsp, 2 Tbsp = 1 oz'
    ],
    conversions: [
      {
        id: 'ml-to-cc',
        category: 'volume',
        fromUnit: 'mL',
        toUnit: 'cc',
        factor: 1,
        displayFactor: '1 mL = 1 cc',
        memoryTricks: ['mL and cc are exactly the same volume'],
        priority: 'critical',
        difficulty: 'easy'
      },
      {
        id: 'ml-to-l',
        category: 'volume',
        fromUnit: 'mL',
        toUnit: 'L',
        factor: 0.001,
        displayFactor: '1000 mL = 1 L',
        memoryTricks: ['Same pattern as mg to g - 1000 smaller = 1 larger'],
        priority: 'important',
        difficulty: 'easy'
      },
      {
        id: 'tsp-to-ml',
        category: 'volume',
        fromUnit: 'tsp',
        toUnit: 'mL',
        factor: 5,
        displayFactor: '1 tsp = 5 mL',
        memoryTricks: ['Remember 5: "Take 5" = teaspoon 5 mL'],
        priority: 'critical',
        difficulty: 'medium'
      },
      {
        id: 'tbsp-to-ml',
        category: 'volume',
        fromUnit: 'Tbsp',
        toUnit: 'mL',
        factor: 15,
        displayFactor: '1 Tbsp = 15 mL',
        memoryTricks: ['3 teaspoons = 1 tablespoon, so 3 × 5 = 15'],
        priority: 'important',
        difficulty: 'medium'
      },
      {
        id: 'tbsp-to-tsp',
        category: 'volume',
        fromUnit: 'Tbsp',
        toUnit: 'tsp',
        factor: 3,
        displayFactor: '1 Tbsp = 3 tsp',
        memoryTricks: ['Table is bigger than tea - 3 teaspoons fit in 1 tablespoon'],
        priority: 'important',
        difficulty: 'easy'
      },
      {
        id: 'oz-to-ml',
        category: 'volume',
        fromUnit: 'oz',
        toUnit: 'mL',
        factor: 30,
        displayFactor: '1 oz = 30 mL',
        memoryTricks: ['30 mL per ounce - remember "30"'],
        priority: 'critical',
        difficulty: 'medium'
      },
      {
        id: 'oz-to-tbsp',
        category: 'volume',
        fromUnit: 'oz',
        toUnit: 'Tbsp',
        factor: 2,
        displayFactor: '1 oz = 2 Tbsp',
        memoryTricks: ['2 tablespoons make 1 ounce'],
        priority: 'useful',
        difficulty: 'easy'
      }
    ]
  },

  {
    id: 'critical-pairs',
    name: 'Critical Pairs',
    description: 'Most commonly confused conversions that cause errors',
    memoryTricks: [
      'Never confuse mg and mcg - always write out "micrograms"',
      'When in doubt, draw the conversion ladder'
    ],
    conversions: [
      {
        id: 'mg-vs-mcg',
        category: 'critical-pairs',
        fromUnit: 'mg',
        toUnit: 'mcg',
        factor: 1000,
        displayFactor: '1 mg = 1000 mcg',
        memoryTricks: [
          'mg is 1000 times BIGGER than mcg',
          'Micro = tiny, Milli = small but bigger than micro'
        ],
        commonMistakes: [
          'Treating mg and mcg as the same',
          'Moving decimal the wrong direction'
        ],
        priority: 'critical',
        difficulty: 'hard'
      }
    ]
  }
];

// Helper functions for the memorization system
export function getConversionById(id: string): Conversion | undefined {
  return conversionData
    .flatMap(category => category.conversions)
    .find(conversion => conversion.id === id);
}

export function getConversionsByCategory(categoryId: string): Conversion[] {
  const category = conversionData.find(cat => cat.id === categoryId);
  return category ? category.conversions : [];
}

export function getCriticalConversions(): Conversion[] {
  return conversionData
    .flatMap(category => category.conversions)
    .filter(conversion => conversion.priority === 'critical');
}

export function getConversionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Conversion[] {
  return conversionData
    .flatMap(category => category.conversions)
    .filter(conversion => conversion.difficulty === difficulty);
}

// Generate reverse conversions automatically
export function getReverseConversion(conversion: Conversion): Conversion {
  return {
    ...conversion,
    id: `${conversion.id}-reverse`,
    fromUnit: conversion.toUnit,
    toUnit: conversion.fromUnit,
    factor: 1 / conversion.factor,
    displayFactor: `${conversion.displayFactor.split(' = ').reverse().join(' = ')}`
  };
}

export function getAllConversions(includeReverse = true): Conversion[] {
  const allConversions = conversionData.flatMap(category => category.conversions);
  
  if (includeReverse) {
    const reverseConversions = allConversions.map(getReverseConversion);
    return [...allConversions, ...reverseConversions];
  }
  
  return allConversions;
}