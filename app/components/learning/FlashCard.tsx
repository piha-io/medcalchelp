import { useState, useEffect } from 'react';
import { RotateCcw, Check, X, Lightbulb, AlertTriangle, ChevronRight } from 'lucide-react';
import type { Conversion } from '../../lib/learning/conversions-data';

export interface FlashCardProps {
  conversion: Conversion;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  showHints?: boolean;
  autoFlip?: boolean;
}

interface CardState {
  isFlipped: boolean;
  showAnswer: boolean;
  userConfidence: 'easy' | 'medium' | 'hard' | null;
}

export function FlashCard({ 
  conversion, 
  onAnswer, 
  onNext, 
  showHints = true,
  autoFlip = false 
}: FlashCardProps) {
  const [cardState, setCardState] = useState<CardState>({
    isFlipped: false,
    showAnswer: false,
    userConfidence: null
  });

  // Reset card state when conversion changes
  useEffect(() => {
    setCardState({
      isFlipped: false,
      showAnswer: false,
      userConfidence: null
    });
  }, [conversion.id]);

  const handleFlip = () => {
    setCardState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped,
      showAnswer: !prev.isFlipped
    }));
  };

  const handleConfidence = (confidence: 'easy' | 'medium' | 'hard') => {
    setCardState(prev => ({ ...prev, userConfidence: confidence }));
    
    // Report accuracy based on confidence
    const correct = confidence === 'easy' || confidence === 'medium';
    onAnswer(correct);
  };

  const handleNext = () => {
    onNext();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'important': return 'border-yellow-200 bg-yellow-50';
      case 'useful': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(conversion.difficulty)}`}>
            {conversion.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(conversion.priority)}`}>
            {conversion.priority}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 capitalize">
          {conversion.category.replace('-', ' & ')}
        </div>
      </div>

      {/* Main Card */}
      <div 
        className={`relative w-full h-64 cursor-pointer transition-all duration-500 transform-gpu ${cardState.isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        {/* Front of Card */}
        <div 
          className={`absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg border-2 border-primary-200 flex flex-col items-center justify-center p-6 backface-hidden ${cardState.isFlipped ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: cardState.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Convert to {conversion.toUnit}
            </h2>
            <div className="text-4xl font-bold text-primary-600 mb-4">
              {conversion.displayFactor.split(' = ')[0]}
            </div>
            <div className="text-sm text-gray-500">
              Click to reveal answer
            </div>
          </div>

          {/* Hint Icon */}
          {showHints && conversion.memoryTricks && conversion.memoryTricks.length > 0 && (
            <div className="absolute top-4 right-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            </div>
          )}
        </div>

        {/* Back of Card */}
        <div 
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 flex flex-col items-center justify-center p-6 backface-hidden ${cardState.isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: cardState.isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)'
          }}
        >
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-green-700 mb-2">
              {conversion.displayFactor.split(' = ')[1]}
            </div>
            <div className="text-lg text-green-600">
              {conversion.displayFactor}
            </div>
          </div>

          {/* Memory Tricks */}
          {showHints && conversion.memoryTricks && conversion.memoryTricks.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Memory Trick:</strong> {conversion.memoryTricks[0]}
                </div>
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {conversion.commonMistakes && conversion.commonMistakes.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <strong>Watch out:</strong> {conversion.commonMistakes[0]}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Answer Confidence Buttons */}
      {cardState.showAnswer && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-4">How well did you know this?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleConfidence('hard')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Didn't Know
              </button>
              <button
                onClick={() => handleConfidence('medium')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Somewhat
              </button>
              <button
                onClick={() => handleConfidence('easy')}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Easy!
              </button>
            </div>
          </div>

          {cardState.userConfidence && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors mx-auto"
              >
                Next Card
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!cardState.isFlipped && !cardState.showAnswer && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Think of the answer, then click the card to check
        </div>
      )}
    </div>
  );
}

// Custom CSS for 3D flip effect (add to global styles)
const flipCardStyles = `
.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
`;