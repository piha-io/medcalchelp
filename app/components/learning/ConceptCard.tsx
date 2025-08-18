import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Lightbulb, AlertCircle, CheckCircle2, Play, HelpCircle } from 'lucide-react';

export interface ConceptCardProps {
  title: string;
  description: string;
  keyPoints: string[];
  examples?: Example[];
  tips?: string[];
  warnings?: string[];
  terminology?: TermDefinition[];
  visualAid?: {
    type: 'diagram' | 'animation' | 'table';
    content: React.ReactNode;
  };
  onComplete?: () => void;
  isCompleted?: boolean;
}

interface TermDefinition {
  term: string;
  definition: string;
  example?: string;
}

interface Example {
  problem: string;
  solution: string;
  explanation: string;
  steps?: string[];
}

export function ConceptCard({
  title,
  description,
  keyPoints,
  examples = [],
  tips = [],
  warnings = [],
  terminology = [],
  visualAid,
  onComplete,
  isCompleted = false
}: ConceptCardProps) {
  const [expandedExample, setExpandedExample] = useState<number | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showTerminology, setShowTerminology] = useState(false);

  const scrollToPractice = () => {
    const practiceSection = document.getElementById('practice');
    if (practiceSection) {
      practiceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Reset expanded states when title changes (new concept)
  useEffect(() => {
    setExpandedExample(null);
    setShowTips(false);
    setShowWarnings(false);
    setShowTerminology(false);
  }, [title]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Key Points */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Concepts</h3>
          <div className="space-y-3">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Aid */}
        {visualAid && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {visualAid.type === 'diagram' && 'Visual Diagram'}
              {visualAid.type === 'animation' && 'Interactive Animation'}
              {visualAid.type === 'table' && 'Reference Table'}
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              {visualAid.content}
            </div>
          </div>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedExample(expandedExample === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">Example {index + 1}</h4>
                      <p className="text-gray-600 text-sm mt-1">{example.problem}</p>
                    </div>
                    {expandedExample === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedExample === index && (
                    <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Solution:</p>
                          <p className="text-primary-700 font-mono bg-white rounded px-3 py-2 border">
                            {example.solution}
                          </p>
                        </div>
                        
                        {example.steps && example.steps.length > 0 && (
                          <div>
                            <p className="font-medium text-gray-900 mb-2">Step by Step:</p>
                            <ol className="list-decimal list-inside space-y-1 text-sm">
                              {example.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-gray-700">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Explanation:</p>
                          <p className="text-gray-700 text-sm leading-relaxed">{example.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terminology */}
        {terminology.length > 0 && (
          <div>
            <button
              onClick={() => setShowTerminology(!showTerminology)}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Key Terms ({terminology.length})</span>
              {showTerminology ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {showTerminology && (
              <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-3">
                {terminology.map((term, index) => (
                  <div key={index} className="border-b border-blue-100 last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 text-sm">{term.term}</h4>
                        <p className="text-blue-700 text-sm leading-relaxed mt-1">{term.definition}</p>
                        {term.example && (
                          <p className="text-blue-600 text-xs mt-1 italic">Example: {term.example}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <div>
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-2 text-amber-700 hover:text-amber-800 font-medium"
            >
              <Lightbulb className="w-5 h-5" />
              <span>Helpful Tips ({tips.length})</span>
              {showTips ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {showTips && (
              <div className="mt-3 bg-amber-50 rounded-lg p-4 space-y-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-800 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div>
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Common Mistakes ({warnings.length})</span>
              {showWarnings ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {showWarnings && (
              <div className="mt-3 bg-red-50 rounded-lg p-4 space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm leading-relaxed">{warning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
                Concept Mastered
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
    </div>
  );
}