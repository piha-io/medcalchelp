import { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface StepByStepGuideProps {
  title: string;
  problem: string;
  steps: Step[];
  finalAnswer: string;
  explanation: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

interface Step {
  id: string;
  title: string;
  content: string;
  formula?: string;
  calculation?: string;
  result?: string;
  explanation?: string;
  highlight?: string; // Text to highlight in the calculation
}

export function StepByStepGuide({
  title,
  problem,
  steps,
  finalAnswer,
  explanation,
  onComplete,
  isCompleted = false
}: StepByStepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {isCompleted && (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          )}
        </div>
        
        {/* Problem Statement */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Problem:</h3>
          <p className="text-gray-800 text-lg">{problem}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Manual Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Previous</span>
            </button>
            
            <span className="text-sm text-gray-600 mx-2 font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="p-6">
        <div className="min-h-[300px]">
          {/* Step Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">{currentStep + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{currentStepData.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{currentStepData.content}</p>
          </div>

          {/* Formula */}
          {currentStepData.formula && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Formula:</h4>
              <div className="font-mono text-blue-800 text-lg bg-white rounded px-3 py-2 border border-blue-200">
                {currentStepData.formula}
              </div>
            </div>
          )}

          {/* Calculation */}
          {currentStepData.calculation && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Calculation:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-gray-800 text-lg whitespace-pre-line">
                  {currentStepData.highlight ? (
                    <HighlightedCalculation 
                      text={currentStepData.calculation} 
                      highlight={currentStepData.highlight}
                    />
                  ) : (
                    currentStepData.calculation
                  )}
                </div>
                {currentStepData.result && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Result: </span>
                    <span className="font-bold text-primary-700 text-lg">
                      {currentStepData.result}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step Explanation */}
          {currentStepData.explanation && (
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">Why this step?</h4>
              <p className="text-amber-800 text-sm leading-relaxed">
                {currentStepData.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Final Answer */}
      {currentStep === steps.length - 1 && (
        <div className="p-6 border-t border-gray-100 bg-green-50">
          <h3 className="font-bold text-green-900 mb-3 text-lg">Final Answer:</h3>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-800 mb-2">{finalAnswer}</div>
            <p className="text-green-700 text-sm leading-relaxed">{explanation}</p>
          </div>
        </div>
      )}

      {/* Action Footer */}
      {onComplete && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onComplete}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Tutorial Completed
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Mark as Complete
              </>
            )}
          </button>
        </div>
      )}

      {/* Step Navigation Dots */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStep 
                ? 'bg-primary-500' 
                : index < currentStep 
                  ? 'bg-green-400'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Helper component to highlight specific parts of calculations
function HighlightedCalculation({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  
  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <mark className="bg-yellow-200 px-1 rounded">{highlight}</mark>
          )}
        </span>
      ))}
    </span>
  );
}