import { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle2, XCircle, AlertTriangle, Star, Target, Award } from 'lucide-react';

export interface MasteryCheckProps {
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  passingScore: number; // percentage required to pass
  timeLimit: number; // in minutes
  maxAttempts?: number;
  currentAttempt?: number;
  prerequisites?: string[];
  onComplete?: (result: MasteryResult) => void;
  onRetake?: () => void;
  isCompleted?: boolean;
  lastScore?: number;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'input' | 'true-false';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  unit?: string;
}

interface MasteryResult {
  score: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  timeSpent: number;
  attempt: number;
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
  }[];
}

export function MasteryCheck({
  title,
  description,
  questions,
  passingScore,
  timeLimit,
  maxAttempts = 3,
  currentAttempt = 1,
  prerequisites = [],
  onComplete,
  onRetake,
  isCompleted = false,
  lastScore
}: MasteryCheckProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<MasteryResult | null>(null);
  const [showConfirmStart, setShowConfirmStart] = useState(true);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const timeInMinutes = Math.floor(timeRemaining / 60);
  const timeInSeconds = timeRemaining % 60;

  // Timer effect
  useEffect(() => {
    if (isActive && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isActive, timeRemaining, showResults]);

  const handleTimeUp = () => {
    setIsActive(false);
    finishAssessment();
  };

  const startAssessment = () => {
    setShowConfirmStart(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(timeLimit * 60);
    setIsActive(true);
    setShowResults(false);
    setResults(null);
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    setIsActive(false);
    
    const questionResults = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = String(userAnswer) === String(question.correctAnswer);
      return {
        questionId: question.id,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      };
    });

    const earnedPoints = questionResults.reduce((sum, r) => sum + r.pointsEarned, 0);
    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= passingScore;
    const timeSpent = (timeLimit * 60) - timeRemaining;

    const result: MasteryResult = {
      score,
      passed,
      totalPoints,
      earnedPoints,
      timeSpent,
      attempt: currentAttempt,
      questionResults
    };

    setResults(result);
    setShowResults(true);
    
    if (onComplete) {
      onComplete(result);
    }
  };

  // Pre-assessment view
  if (showConfirmStart && !isCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-purple-100">Mastery Assessment</p>
            </div>
          </div>
          <p className="text-purple-100 leading-relaxed">{description}</p>
        </div>

        {/* Assessment Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{timeLimit} min</div>
              <div className="text-sm text-gray-600">Time Limit</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{passingScore}%</div>
              <div className="text-sm text-gray-600">To Pass</div>
            </div>
          </div>

          {/* Prerequisites Check */}
          {prerequisites.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-2">Prerequisites Required</h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Attempt Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-800">Attempt {currentAttempt} of {maxAttempts}</h3>
                <p className="text-sm text-blue-600">
                  {maxAttempts - currentAttempt} attempts remaining after this one
                </p>
              </div>
              {lastScore && (
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-800">{lastScore}%</div>
                  <div className="text-xs text-blue-600">Previous best</div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-gray-900 mb-3">Important Instructions:</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                You have {timeLimit} minutes to complete all {questions.length} questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                You cannot go back to previous questions once submitted
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                You need {passingScore}% or higher to pass this assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Make sure you have a stable internet connection
              </li>
            </ul>
          </div>

          <button
            onClick={startAssessment}
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Start Mastery Assessment
          </button>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && results) {
    const passed = results.passed;
    const canRetake = currentAttempt < maxAttempts && !passed;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Results Header */}
        <div className={`p-6 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'}`}>
          <div className="text-center">
            {passed ? (
              <Award className="w-20 h-20 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold mb-2">
              {passed ? 'Mastery Achieved!' : 'Not Quite There'}
            </h2>
            <div className="text-xl mb-4">
              Score: <span className="font-bold">{results.score}%</span>
            </div>
            <p className="text-lg opacity-90">
              {passed 
                ? `Congratulations! You've mastered this concept with ${results.score}%.`
                : `You scored ${results.score}%. You need ${passingScore}% to pass.`
              }
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{results.earnedPoints}/{results.totalPoints}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.floor(results.timeSpent / 60)}:{(results.timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600">Time Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {results.questionResults.filter(r => r.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{results.attempt}</div>
              <div className="text-sm text-gray-600">Attempt</div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Question Breakdown</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const result = results.questionResults[index];
                return (
                  <div
                    key={question.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900">Question {index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.pointsEarned}/{question.points} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {canRetake && onRetake && (
              <button
                onClick={onRetake}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                Retake Assessment (Attempt {currentAttempt + 1}/{maxAttempts})
              </button>
            )}
            
            {!canRetake && !passed && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-600 mb-2">No more attempts remaining</p>
                <p className="text-sm text-gray-500">Review the material and try again later</p>
              </div>
            )}

            {passed && (
              <button
                onClick={() => onComplete?.(results)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Continue to Next Level
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question view
  if (isActive && !showResults) {
    const question = questions[currentQuestion];
    const userAnswer = answers[question.id];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              <div>
                <h2 className="font-bold">{title}</h2>
                <p className="text-sm text-purple-200">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${timeRemaining < 300 ? 'bg-red-500/20' : 'bg-white/20'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">
                {timeInMinutes}:{timeInSeconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 bg-white rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {question.question}
            </h3>
            <div className="flex items-center gap-2 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
              <span className="text-sm text-gray-500">{question.points} pts</span>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-4 mb-8">
            {question.type === 'multiple-choice' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
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
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {userAnswer === option && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'input' && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  autoFocus
                />
                {question.unit && (
                  <span className="text-gray-600 font-medium">{question.unit}</span>
                )}
              </div>
            )}

            {question.type === 'true-false' && (
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
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

          <button
            onClick={nextQuestion}
            disabled={!userAnswer}
            className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}