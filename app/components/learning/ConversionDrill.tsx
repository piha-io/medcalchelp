import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Target, Trophy, Zap, CheckCircle, X, Play, Pause, RotateCcw } from 'lucide-react';
import type { Conversion } from '../../lib/learning/conversions-data';

export interface ConversionDrillProps {
  conversions: Conversion[];
  timeLimit?: number; // in seconds
  questionCount?: number;
  onComplete?: (results: DrillResults) => void;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
}

export interface DrillResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeElapsed: number;
  accuracy: number;
  questionsPerMinute: number;
  mistakesByConversion: { [conversionId: string]: number };
}

interface DrillQuestion {
  id: string;
  conversion: Conversion;
  questionText: string;
  correctAnswer: string;
  correctAnswers: string[]; // All possible correct answers
  choices?: string[];
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent: number;
}

interface DrillState {
  isActive: boolean;
  isPaused: boolean;
  currentQuestion: number;
  questions: DrillQuestion[];
  startTime: number | null;
  timeRemaining: number;
  answers: DrillQuestion[];
}

export function ConversionDrill({ 
  conversions, 
  timeLimit = 60,
  questionCount = 20,
  onComplete,
  difficulty = 'mixed'
}: ConversionDrillProps) {
  const [drillState, setDrillState] = useState<DrillState>({
    isActive: false,
    isPaused: false,
    currentQuestion: 0,
    questions: [],
    startTime: null,
    timeRemaining: timeLimit,
    answers: []
  });

  const [selectedChoices, setSelectedChoices] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Filter conversions by difficulty
  const getFilteredConversions = useCallback(() => {
    if (difficulty === 'mixed') return conversions;
    return conversions.filter(conv => conv.difficulty === difficulty);
  }, [conversions, difficulty]);

  // Helper function to find all equivalent conversions for a given unit
  const findAllEquivalents = (targetUnit: string, allConversions: Conversion[]) => {
    const equivalents: string[] = [];
    
    // Find all conversions that involve this target unit
    allConversions.forEach(conv => {
      const { fromValue, toValue } = getConversionValues(conv);
      
      // If target matches the "from" unit, add the "to" unit as equivalent
      if (fromValue === targetUnit) {
        equivalents.push(toValue);
      }
      // If target matches the "to" unit, add the "from" unit as equivalent  
      if (toValue === targetUnit) {
        equivalents.push(fromValue);
      }
    });
    
    // Remove duplicates and return
    return [...new Set(equivalents)];
  };

  // Helper function to extract numerical values from conversion data
  const getConversionValues = (conversion: Conversion) => {
    // If units already have numbers (like "1000 mcg"), use them directly
    if (/\d/.test(conversion.fromUnit) && /\d/.test(conversion.toUnit)) {
      return {
        fromValue: conversion.fromUnit,
        toValue: conversion.toUnit
      };
    }
    
    // Otherwise, extract from displayFactor (like "1000 mcg = 1 mg")
    if (conversion.displayFactor) {
      const parts = conversion.displayFactor.split(' = ');
      if (parts.length === 2) {
        return {
          fromValue: parts[0].trim(),
          toValue: parts[1].trim()
        };
      }
    }
    
    // Fallback: add reasonable numbers based on common medical conversions
    const addNumber = (unit: string): string => {
      if (unit.includes('mcg')) return '1000 mcg';
      if (unit.includes('mg')) return '1 mg';
      if (unit.includes(' g') || unit === 'g') return '1 g';
      if (unit.includes('kg')) return '1 kg';
      if (unit.includes('lbs')) return '2.2 lbs';
      if (unit.includes('mL')) return '1 mL';
      if (unit.includes('cc')) return '1 cc';
      if (unit.includes('tsp')) return '1 tsp';
      if (unit.includes('Tbsp')) return '1 Tbsp';
      if (unit.includes('oz')) return '1 oz';
      if (unit.includes(' L') || unit === 'L') return '1 L';
      return `1 ${unit}`;
    };
    
    return {
      fromValue: addNumber(conversion.fromUnit),
      toValue: addNumber(conversion.toUnit)
    };
  };

  // Generate multiple choice drill questions
  const generateQuestions = useCallback(() => {
    const filteredConversions = getFilteredConversions();
    const allConversions = getFilteredConversions(); // For generating wrong choices
    const questions: DrillQuestion[] = [];
    
    // Shuffle the conversions array for better distribution
    const shuffledConversions = [...filteredConversions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < questionCount; i++) {
      // Use modulo to ensure we cycle through all conversions if questionCount > conversions length
      const conversionIndex = i % shuffledConversions.length;
      const conversion = shuffledConversions[conversionIndex];
      const isReverse = Math.random() > 0.5;
      
      const { fromValue, toValue } = getConversionValues(conversion);
      
      let questionText: string;
      let correctAnswer: string;
      let correctAnswers: string[] = [];
      let wrongChoices: string[] = [];

      // New format: "What else equals X?" with numerical values
      if (isReverse) {
        // Ask: "What else equals 1 mg?" Answer: "1000 mcg"
        questionText = `What else equals ${toValue}?`;
        correctAnswer = fromValue;
        // Find ALL possible correct answers for this unit
        correctAnswers = findAllEquivalents(toValue, allConversions);
        
        // Generate wrong choices from other conversions, prioritizing same category
        const otherConversions = allConversions.filter(c => c.id !== conversion.id);
        const sameCategoryChoices = otherConversions
          .filter(c => c.category === conversion.category)
          .map(c => {
            const values = getConversionValues(c);
            return Math.random() > 0.5 ? values.fromValue : values.toValue;
          })
          .filter(choice => !correctAnswers.includes(choice));
        const otherCategoryChoices = otherConversions
          .filter(c => c.category !== conversion.category)
          .map(c => {
            const values = getConversionValues(c);
            return Math.random() > 0.5 ? values.fromValue : values.toValue;
          })
          .filter(choice => !correctAnswers.includes(choice));
        
        // Combine with preference for same category choices
        wrongChoices = [...sameCategoryChoices, ...otherCategoryChoices]
          .filter((choice, index, arr) => arr.indexOf(choice) === index) // Remove duplicates
          .slice(0, 3);
      } else {
        // Ask: "What else equals 1000 mcg?" Answer: "1 mg"  
        questionText = `What else equals ${fromValue}?`;
        correctAnswer = toValue;
        // Find ALL possible correct answers for this unit
        correctAnswers = findAllEquivalents(fromValue, allConversions);
        
        // Generate wrong choices from other conversions, prioritizing same category
        const otherConversions = allConversions.filter(c => c.id !== conversion.id);
        const sameCategoryChoices = otherConversions
          .filter(c => c.category === conversion.category)
          .map(c => {
            const values = getConversionValues(c);
            return Math.random() > 0.5 ? values.toValue : values.fromValue;
          })
          .filter(choice => !correctAnswers.includes(choice));
        const otherCategoryChoices = otherConversions
          .filter(c => c.category !== conversion.category)
          .map(c => {
            const values = getConversionValues(c);
            return Math.random() > 0.5 ? values.toValue : values.fromValue;
          })
          .filter(choice => !correctAnswers.includes(choice));
        
        // Combine with preference for same category choices
        wrongChoices = [...sameCategoryChoices, ...otherCategoryChoices]
          .filter((choice, index, arr) => arr.indexOf(choice) === index) // Remove duplicates
          .slice(0, 3);
      }

      // Ensure we have enough wrong choices, add some realistic medical units if needed
      if (wrongChoices.length < 3) {
        const genericChoices = [
          '5 mL', '10 mg', '15 mL', '100 mcg', '30 mL', '3 tsp', '2 Tbsp', 
          '1 oz', '240 mL', '1000 g', '0.5 kg', '2.2 lbs', '1 L', '8 oz',
          '500 mg', '2 mg', '0.5 g', '1.5 tsp', '4 oz', '120 mL'
        ];
        const additionalChoices = genericChoices
          .filter(choice => !correctAnswers.includes(choice) && !wrongChoices.includes(choice))
          .slice(0, 3 - wrongChoices.length);
        wrongChoices.push(...additionalChoices);
      }

      // Create choices array: include ALL correct answers plus wrong choices, then shuffle
      // Ensure we have enough wrong choices to make 4 total options
      const maxWrongChoices = Math.max(0, 4 - correctAnswers.length);
      const finalWrongChoices = wrongChoices.slice(0, maxWrongChoices);
      
      const choices = [...correctAnswers, ...finalWrongChoices].sort(() => Math.random() - 0.5);

      questions.push({
        id: `${conversion.id}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        conversion,
        questionText,
        correctAnswer,
        correctAnswers,
        choices,
        timeSpent: 0
      });
    }

    // Final shuffle of the generated questions
    return questions.sort(() => Math.random() - 0.5);
  }, [getFilteredConversions, questionCount]);

  // Start drill
  const startDrill = () => {
    const questions = generateQuestions();
    setDrillState({
      isActive: true,
      isPaused: false,
      currentQuestion: 0,
      questions,
      startTime: Date.now(),
      timeRemaining: timeLimit,
      answers: []
    });
    setSelectedChoices(new Set());
    setShowFeedback(false);
    setCurrentFeedback(null);
  };

  // Pause/resume drill
  const togglePause = () => {
    setDrillState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  // Handle checkbox selection
  const toggleChoice = (choice: string) => {
    if (showFeedback) return;
    
    setSelectedChoices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(choice)) {
        newSet.delete(choice);
      } else {
        newSet.add(choice);
      }
      return newSet;
    });
  };

  // Submit answer (multiple select)
  const submitAnswer = () => {
    if (!drillState.isActive || drillState.isPaused || drillState.currentQuestion >= drillState.questions.length) {
      return;
    }

    const currentQ = drillState.questions[drillState.currentQuestion];
    // Check if user selected ALL correct answers and NO wrong answers
    const selectedArray = Array.from(selectedChoices);
    const correctSet = new Set(currentQ.correctAnswers);
    const selectedSet = new Set(selectedArray);
    
    // Must select all correct answers and nothing else
    const isCorrect = correctSet.size === selectedSet.size && 
                     [...correctSet].every(answer => selectedSet.has(answer));
    
    const answeredQuestion: DrillQuestion = {
      ...currentQ,
      userAnswer: selectedArray.join(', '),
      isCorrect,
      timeSpent: Date.now() - (drillState.startTime || 0)
    };

    setCurrentFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);

    // Update drill state - update current question with user answer and add to answers
    setDrillState(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentQuestion] = answeredQuestion;
      
      return {
        ...prev,
        questions: updatedQuestions,
        answers: [...prev.answers, answeredQuestion]
      };
    });
  };

  // Advance to next question manually
  const nextQuestion = () => {
    if (!showFeedback) return;
    
    setShowFeedback(false);
    setCurrentFeedback(null);
    setSelectedChoices(new Set());
    
    setDrillState(prev => {
      const nextQuestionIndex = prev.currentQuestion + 1;
      if (nextQuestionIndex >= prev.questions.length) {
        // Drill complete
        completeDrill(prev.answers);
        return { ...prev, isActive: false };
      }
      return { ...prev, currentQuestion: nextQuestionIndex };
    });
  };

  // Complete drill and calculate results
  const completeDrill = (answers: DrillQuestion[]) => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalTime = Date.now() - (drillState.startTime || 0);
    const timeElapsed = totalTime / 1000; // Convert to seconds
    
    const results: DrillResults = {
      score: Math.round((correctAnswers / answers.length) * 100),
      totalQuestions: answers.length,
      correctAnswers,
      timeElapsed,
      accuracy: correctAnswers / answers.length,
      questionsPerMinute: (answers.length / timeElapsed) * 60,
      mistakesByConversion: {}
    };

    // Track mistakes by conversion
    answers.forEach(answer => {
      if (!answer.isCorrect) {
        results.mistakesByConversion[answer.conversion.id] = 
          (results.mistakesByConversion[answer.conversion.id] || 0) + 1;
      }
    });

    onComplete?.(results);
  };

  // Timer countdown - pauses during feedback
  useEffect(() => {
    if (!drillState.isActive || drillState.isPaused || showFeedback) return;

    const timer = setInterval(() => {
      setDrillState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          completeDrill(prev.answers);
          return { ...prev, isActive: false, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [drillState.isActive, drillState.isPaused, showFeedback]);

  // Handle Enter key to advance to next question during feedback
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showFeedback) {
        e.preventDefault();
        nextQuestion();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = drillState.questions[drillState.currentQuestion];
  const progress = drillState.questions.length > 0 ? 
    ((drillState.currentQuestion + 1) / drillState.questions.length) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!drillState.isActive && drillState.answers.length === 0 && (
        // Start Screen
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unit Conversion Speed Drill</h2>
          <p className="text-gray-600 mb-6">
            Select ALL correct answers! Example: "What else equals 1 kg?" → Select both "1000 g" AND "2.2 lbs"
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-primary-600">{questionCount}</div>
              <div className="text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-primary-600">{formatTime(timeLimit)}</div>
              <div className="text-gray-600">Time Limit</div>
            </div>
          </div>

          <button
            onClick={startDrill}
            className="btn btn-primary btn-lg flex items-center gap-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            Start Drill
          </button>
        </div>
      )}

      {drillState.isActive && currentQuestion && (
        // Active Drill
        <div className="space-y-6">
          {/* Progress & Timer */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {drillState.currentQuestion + 1} / {drillState.questions.length}
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 text-sm font-medium ${
                drillState.timeRemaining <= 10 ? 'text-red-600' : 
                showFeedback ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                <Timer className="w-4 h-4" />
                {formatTime(drillState.timeRemaining)}
                {showFeedback && <span className="text-xs">(Paused)</span>}
              </div>
              
              <button
                onClick={togglePause}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {drillState.isPaused ? (
                  <Play className="w-4 h-4 text-gray-600" />
                ) : (
                  <Pause className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuestion.questionText}
            </h3>
            
            {/* Multiple Select Options */}
            <div className="space-y-4 max-w-md mx-auto">
              {currentQuestion.choices && currentQuestion.choices.map((choice, index) => {
                const isCorrectAnswer = currentQuestion.correctAnswers.includes(choice);
                const isSelected = selectedChoices.has(choice);
                
                // During feedback, use the submitted selection state, not current state
                const userSelectedArray = showFeedback 
                  ? (drillState.questions[drillState.currentQuestion]?.userAnswer?.split(', ') || [])
                  : [];
                const wasUserChoice = showFeedback ? userSelectedArray.includes(choice) : isSelected;
                
                // Determine the visual state during feedback
                let feedbackState = 'neutral';
                if (showFeedback) {
                  if (isCorrectAnswer && wasUserChoice) {
                    feedbackState = 'correct-selected'; // User selected correct answer
                  } else if (isCorrectAnswer && !wasUserChoice) {
                    feedbackState = 'correct-missed'; // User missed correct answer
                  } else if (!isCorrectAnswer && wasUserChoice) {
                    feedbackState = 'incorrect-selected'; // User selected wrong answer
                  } else {
                    feedbackState = 'neutral'; // Not selected, not correct
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => toggleChoice(choice)}
                    disabled={drillState.isPaused || showFeedback}
                    className={`w-full px-6 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                      showFeedback
                        ? feedbackState === 'correct-selected'
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : feedbackState === 'correct-missed'
                          ? 'bg-green-50 border-green-400 text-green-600'
                          : feedbackState === 'incorrect-selected'
                          ? 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-gray-50 border-gray-300 text-gray-500'
                        : isSelected
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    } disabled:cursor-not-allowed`}
                  >
                    {/* Enhanced Checkbox with Better Icons */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      showFeedback
                        ? feedbackState === 'correct-selected'
                          ? 'bg-green-500 border-green-500'
                          : feedbackState === 'correct-missed'
                          ? 'bg-green-400 border-green-400'
                          : feedbackState === 'incorrect-selected'
                          ? 'bg-red-500 border-red-500'
                          : 'border-gray-300'
                        : isSelected
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {/* Show appropriate icon based on state */}
                      {!showFeedback && isSelected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                      {showFeedback && feedbackState === 'correct-selected' && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                      {showFeedback && feedbackState === 'correct-missed' && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                      {showFeedback && feedbackState === 'incorrect-selected' && (
                        <X className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="flex-grow text-left">{choice}</span>
                    
                    {/* Status labels during feedback */}
                    {showFeedback && (
                      <span className="text-xs font-medium px-2 py-1 rounded">
                        {feedbackState === 'correct-selected' && (
                          <span className="bg-green-200 text-green-800 px-2 py-1 rounded">✓ Correct</span>
                        )}
                        {feedbackState === 'correct-missed' && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Missed</span>
                        )}
                        {feedbackState === 'incorrect-selected' && (
                          <span className="bg-red-200 text-red-800 px-2 py-1 rounded">✗ Wrong</span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!showFeedback && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={submitAnswer}
                  disabled={selectedChoices.size === 0 || drillState.isPaused}
                  className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer ({selectedChoices.size} selected)
                </button>
              </div>
            )}

            {/* Feedback Display */}
            {showFeedback && (
              <div className="mt-6 flex justify-center">
                <div className={`px-6 py-3 rounded-lg font-medium text-lg text-center max-w-lg ${
                  currentFeedback === 'correct' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {currentFeedback === 'correct' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                    <span className="font-bold">
                      {currentFeedback === 'correct' ? 'Perfect!' : 'Not Quite'}
                    </span>
                  </div>
                  
                  {currentFeedback === 'correct' ? (
                    <div>Perfect! You selected all correct equivalents!</div>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        const userSelected = new Set(drillState.questions[drillState.currentQuestion]?.userAnswer?.split(', ') || []);
                        const correctSet = new Set(currentQuestion.correctAnswers);
                        const correctlySelected = [...userSelected].filter(answer => correctSet.has(answer));
                        const missed = [...correctSet].filter(answer => !userSelected.has(answer));
                        const wrongPicks = [...userSelected].filter(answer => !correctSet.has(answer));
                        
                        return (
                          <div>
                            {/* Show what they got right first */}
                            {correctlySelected.length > 0 && (
                              <div className="text-green-700 bg-green-50 p-2 rounded">
                                <strong>✓ You got these right:</strong> {correctlySelected.join(', ')}
                              </div>
                            )}
                            
                            {/* Show what they missed */}
                            {missed.length > 0 && (
                              <div className="text-orange-700 bg-orange-50 p-2 rounded">
                                <strong>○ You missed:</strong> {missed.join(', ')}
                              </div>
                            )}
                            
                            {/* Show wrong selections */}
                            {wrongPicks.length > 0 && (
                              <div className="text-red-700 bg-red-50 p-2 rounded">
                                <strong>✗ Wrong selections:</strong> {wrongPicks.join(', ')}
                              </div>
                            )}
                            
                            {/* Summary */}
                            <div className="text-sm text-gray-600 pt-1">
                              <strong>All correct answers:</strong> {currentQuestion.correctAnswers.join(', ')}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next Question Button */}
            {showFeedback && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={nextQuestion}
                  className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold flex items-center gap-2"
                >
                  {drillState.currentQuestion + 1 >= drillState.questions.length ? 'Finish Drill' : 'Next Question'}
                  <span className="text-sm opacity-75">(Press Enter)</span>
                </button>
              </div>
            )}
          </div>

          {drillState.isPaused && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-medium">Drill Paused</p>
              <button
                onClick={togglePause}
                className="btn btn-primary btn-sm mt-2"
              >
                Resume
              </button>
            </div>
          )}
        </div>
      )}

      {!drillState.isActive && drillState.answers.length > 0 && (
        // Results Screen
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Drill Complete!</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round((drillState.answers.filter(a => a.isCorrect).length / drillState.answers.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {drillState.answers.filter(a => a.isCorrect).length}/{drillState.answers.length}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatTime(timeLimit - drillState.timeRemaining)}
              </div>
              <div className="text-sm text-gray-600">Time Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round((drillState.answers.length / (timeLimit - drillState.timeRemaining)) * 60)}
              </div>
              <div className="text-sm text-gray-600">Q/Min</div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}