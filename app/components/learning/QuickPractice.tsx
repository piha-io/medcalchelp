import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, RotateCcw, Timer } from 'lucide-react';

export interface QuickPracticeProps {
  title: string;
  description?: string;
  questions: PracticeQuestion[];
  passingScore?: number; // percentage needed to pass (default 80)
  timeLimit?: number; // in seconds, optional
  showHints?: boolean;
  onComplete?: (score: number, passed: boolean) => void;
  isCompleted?: boolean;
}

interface PracticeQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'input' | 'true-false';
  options?: string[]; // for multiple-choice
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
  unit?: string; // for input questions
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number;
}

export function QuickPractice({
  title,
  description,
  questions,
  passingScore = 80,
  timeLimit,
  showHints = true,
  onComplete,
  isCompleted = false
}: QuickPracticeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | number }>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLimit && isTimerActive && timeRemaining && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            setIsTimerActive(false);
            handleFinishPractice();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, isTimerActive, timeRemaining, showResults]);

  const startPractice = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setResults([]);
    setTimeRemaining(timeLimit);
    setQuestionStartTime(Date.now());
    setShowHint(false);
    setIsTimerActive(!!timeLimit);
  };

  const handleAnswer = (answer: string | number) => {
    const questionId = questions[currentQuestion].id;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    const currentQuestionData = questions[currentQuestion];
    const userAnswer = userAnswers[currentQuestionData.id];
    const isCorrect = String(userAnswer) === String(currentQuestionData.correctAnswer);
    const timeSpent = Date.now() - questionStartTime;

    const result: QuestionResult = {
      questionId: currentQuestionData.id,
      userAnswer: userAnswer,
      isCorrect,
      timeSpent
    };

    setResults(prev => [...prev, result]);
    setShowHint(false);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleFinishPractice([...results, result]);
    }
  };

  const handleFinishPractice = (finalResults?: QuestionResult[]) => {
    setIsTimerActive(false);
    setShowResults(true);
    
    const resultsToUse = finalResults || results;
    const correctAnswers = resultsToUse.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= passingScore;

    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestionData = questions[currentQuestion];
  const userAnswer = userAnswers[currentQuestionData?.id];
  const canProceed = userAnswer !== undefined && userAnswer !== '';

  // Results view
  if (showResults) {
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= passingScore;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Results Header */}
        <div className={`p-6 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'}`}>
          <div className="text-center">
            {passed ? (
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">
              {passed ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-lg">
              You scored {correctAnswers} out of {questions.length} ({score}%)
            </p>
            {!passed && (
              <p className="text-sm mt-2 opacity-90">
                You need {passingScore}% to pass. Review the concepts and try again!
              </p>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const result = results[index];
              const isCorrect = result?.isCorrect || false;
              
              return (
                <div key={question.id} className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-gray-600">Your answer: </span>
                          <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            {result?.userAnswer || 'No answer'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">Correct answer: </span>
                            <span className="text-green-700">{question.correctAnswer}</span>
                          </p>
                        )}
                        <p className="text-gray-600 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={startPractice}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            
            {passed && onComplete && (
              <button
                onClick={() => onComplete(score, passed)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Continue Learning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Initial state - not started
  if (currentQuestion === 0 && Object.keys(userAnswers).length === 0 && !isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-blue-800">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{passingScore}%</div>
                <div className="text-sm text-blue-800">To Pass</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {timeLimit ? formatTime(timeLimit) : '∞'}
                </div>
                <div className="text-sm text-blue-800">Time Limit</div>
              </div>
            </div>
          </div>

          <button
            onClick={startPractice}
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  // Question view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Progress */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          {timeLimit && timeRemaining !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timeRemaining < 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              <Timer className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {currentQuestionData.question}
        </h3>

        {/* Answer Options */}
        <div className="space-y-4 mb-6">
          {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    userAnswer === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    userAnswer === option
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {userAnswer === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestionData.type === 'input' && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="any"
                value={userAnswer || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {currentQuestionData.unit && (
                <span className="text-gray-600 font-medium">{currentQuestionData.unit}</span>
              )}
            </div>
          )}

          {currentQuestionData.type === 'true-false' && (
            <div className="flex gap-4">
              {['True', 'False'].map((option) => (
                <label
                  key={option}
                  className={`flex-1 flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    userAnswer === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-medium">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Hint */}
        {showHints && currentQuestionData.hint && (
          <div className="mb-6">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                Show Hint
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800 mb-1">Hint:</p>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      {currentQuestionData.hint}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}