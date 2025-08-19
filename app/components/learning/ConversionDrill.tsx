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

  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter conversions by difficulty
  const getFilteredConversions = useCallback(() => {
    if (difficulty === 'mixed') return conversions;
    return conversions.filter(conv => conv.difficulty === difficulty);
  }, [conversions, difficulty]);

  // Generate drill questions with better randomization
  const generateQuestions = useCallback(() => {
    const filteredConversions = getFilteredConversions();
    const questions: DrillQuestion[] = [];
    
    // Shuffle the conversions array for better distribution
    const shuffledConversions = [...filteredConversions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < questionCount; i++) {
      // Use modulo to ensure we cycle through all conversions if questionCount > conversions length
      const conversionIndex = i % shuffledConversions.length;
      const conversion = shuffledConversions[conversionIndex];
      const isReverse = Math.random() > 0.5;
      
      let questionText: string;
      let correctAnswer: string;

      if (isReverse) {
        // Ask reverse direction (e.g., "How many mg in 1000 mcg?")
        const amount = conversion.factor > 1 ? 1 : Math.round(1 / conversion.factor);
        questionText = `How many ${conversion.fromUnit} in ${amount} ${conversion.toUnit}?`;
        correctAnswer = conversion.factor > 1 ? conversion.factor.toString() : '1';
      } else {
        // Ask forward direction (e.g., "How many mcg in 1 mg?")
        questionText = `How many ${conversion.toUnit} in 1 ${conversion.fromUnit}?`;
        correctAnswer = conversion.factor > 1 ? conversion.factor.toString() : 
          conversion.factor === 1 ? '1' : Math.round(1 / conversion.factor).toString();
      }

      questions.push({
        id: `${conversion.id}-${i}-${Math.random().toString(36).substr(2, 9)}`,
        conversion,
        questionText,
        correctAnswer,
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
    setUserInput('');
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

  // Submit answer
  const submitAnswer = () => {
    if (!drillState.isActive || drillState.isPaused || drillState.currentQuestion >= drillState.questions.length) {
      return;
    }

    const currentQ = drillState.questions[drillState.currentQuestion];
    const isCorrect = userInput.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    
    const answeredQuestion: DrillQuestion = {
      ...currentQ,
      userAnswer: userInput.trim(),
      isCorrect,
      timeSpent: Date.now() - (drillState.startTime || 0)
    };

    setCurrentFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);

    // Update drill state
    setDrillState(prev => ({
      ...prev,
      answers: [...prev.answers, answeredQuestion]
    }));

    // Auto-advance after brief feedback
    setTimeout(() => {
      setShowFeedback(false);
      setCurrentFeedback(null);
      setUserInput('');
      
      setDrillState(prev => {
        const nextQuestion = prev.currentQuestion + 1;
        if (nextQuestion >= prev.questions.length) {
          // Drill complete
          completeDrill([...prev.answers, answeredQuestion]);
          return { ...prev, isActive: false };
        }
        return { ...prev, currentQuestion: nextQuestion };
      });
    }, 1500);
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

  // Timer countdown
  useEffect(() => {
    if (!drillState.isActive || drillState.isPaused) return;

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
  }, [drillState.isActive, drillState.isPaused]);

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim() && !showFeedback) {
      e.preventDefault();
      submitAnswer();
    }
  };

  // Auto-focus and select input when question changes or drill starts
  useEffect(() => {
    if (drillState.isActive && !drillState.isPaused && !showFeedback && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [drillState.currentQuestion, drillState.isActive, drillState.isPaused, showFeedback]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversion Speed Drill</h2>
          <p className="text-gray-600 mb-6">
            Answer as many conversion questions as you can in {formatTime(timeLimit)}
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
                drillState.timeRemaining <= 10 ? 'text-red-600' : 'text-gray-600'
              }`}>
                <Timer className="w-4 h-4" />
                {formatTime(drillState.timeRemaining)}
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
            
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer and press Enter..."
                className="w-full max-w-sm px-6 py-4 text-xl font-semibold text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                disabled={drillState.isPaused || showFeedback}
                autoFocus
              />
              
              {showFeedback && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    currentFeedback === 'correct' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {currentFeedback === 'correct' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                    {currentFeedback === 'correct' ? 'Correct!' : `Correct: ${currentQuestion.correctAnswer}`}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={submitAnswer}
              disabled={!userInput.trim() || drillState.isPaused || showFeedback}
              className="btn btn-primary btn-lg mt-6 px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
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