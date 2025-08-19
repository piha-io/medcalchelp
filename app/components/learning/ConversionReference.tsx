import { useState } from 'react';
import { Search, BookOpen, Star, AlertTriangle, Lightbulb, Copy, Check } from 'lucide-react';
import { conversionData, type ConversionCategory, type Conversion } from '../../lib/learning/conversions-data';

export interface ConversionReferenceProps {
  onPracticeConversion?: (conversion: Conversion) => void;
  searchable?: boolean;
  showMemoryTricks?: boolean;
  compact?: boolean;
}

export function ConversionReference({ 
  onPracticeConversion,
  searchable = true,
  showMemoryTricks = true,
  compact = false 
}: ConversionReferenceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copiedConversion, setCopiedConversion] = useState<string | null>(null);

  // Filter conversions based on search and category
  const filteredData = conversionData.map(category => ({
    ...category,
    conversions: category.conversions.filter(conversion => {
      const matchesSearch = !searchTerm || 
        conversion.fromUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversion.toUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversion.displayFactor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || category.id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.conversions.length > 0);

  const handleCopyConversion = (conversion: Conversion) => {
    navigator.clipboard.writeText(conversion.displayFactor);
    setCopiedConversion(conversion.id);
    setTimeout(() => setCopiedConversion(null), 2000);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'important':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'useful':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'important':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'useful':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Medical Conversion Reference
        </h2>
        <p className="text-gray-600">
          Essential unit conversions for healthcare professionals
        </p>
      </div>

      {/* Search and Filters */}
      {searchable && (
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversions (e.g., 'mg', 'lbs', 'tsp')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {conversionData.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Tables */}
      <div className="space-y-6">
        {filteredData.map(category => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.description}</p>
              
              {/* Category Memory Tricks */}
              {showMemoryTricks && category.memoryTricks && category.memoryTricks.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <strong>Memory Tricks:</strong>
                      <ul className="mt-1 space-y-1">
                        {category.memoryTricks.map((trick, index) => (
                          <li key={index} className="text-xs">• {trick}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Conversions Table */}
            <div className="p-4">
              <div className="space-y-3">
                {category.conversions.map(conversion => (
                  <div
                    key={conversion.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${getPriorityColor(conversion.priority)}`}
                    onClick={() => onPracticeConversion?.(conversion)}
                  >
                    <div className="flex items-center justify-between">
                      {/* Conversion Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getPriorityIcon(conversion.priority)}
                          <div className="text-lg font-semibold text-gray-900">
                            {conversion.displayFactor}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              conversion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              conversion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {conversion.difficulty}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 font-medium">
                              {conversion.priority}
                            </span>
                          </div>
                        </div>

                        {/* Memory Tricks */}
                        {showMemoryTricks && conversion.memoryTricks && conversion.memoryTricks.length > 0 && (
                          <div className="text-sm text-green-700 bg-green-50 rounded px-2 py-1 inline-block mb-2">
                            💡 {conversion.memoryTricks[0]}
                          </div>
                        )}

                        {/* Common Mistakes */}
                        {conversion.commonMistakes && conversion.commonMistakes.length > 0 && (
                          <div className="text-sm text-red-700 bg-red-50 rounded px-2 py-1 inline-block">
                            ⚠️ {conversion.commonMistakes[0]}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyConversion(conversion);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          title="Copy conversion"
                        >
                          {copiedConversion === conversion.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {onPracticeConversion && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPracticeConversion(conversion);
                            }}
                            className="px-3 py-1 text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors"
                          >
                            Practice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No conversions found matching your search.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="mt-2 text-primary-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Quick Reference Summary */}
      {!compact && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reference - Most Critical</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-900 mb-2">Weight Conversions:</div>
              <ul className="space-y-1 text-gray-700">
                <li>• 1 kg = 2.2 lbs</li>
                <li>• 1 g = 1000 mg</li>
                <li>• 1 mg = 1000 mcg</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-2">Volume Conversions:</div>
              <ul className="space-y-1 text-gray-700">
                <li>• 1 mL = 1 cc</li>
                <li>• 1 tsp = 5 mL</li>
                <li>• 1 Tbsp = 15 mL</li>
                <li>• 1 oz = 30 mL</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}