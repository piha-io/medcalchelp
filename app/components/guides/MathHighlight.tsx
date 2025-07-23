import { useEffect, useRef } from 'react'

interface MathHighlightProps {
  content: string
}

export function MathHighlight({ content }: MathHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Process the content to highlight math expressions
    const processedContent = highlightMath(content)
    containerRef.current.innerHTML = processedContent
  }, [content])

  return <div ref={containerRef} className="math-content" />
}

function highlightMath(html: string): string {
  // Highlight inline math expressions (between backticks or in code blocks)
  let processed = html

  // Pattern 1: Math in code blocks
  processed = processed.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (match, code) => {
      const highlighted = highlightMathExpression(code)
      return `<pre class="math-block"><code>${highlighted}</code></pre>`
    }
  )

  // Pattern 2: Inline code with math
  processed = processed.replace(
    /<code>([^<]+)<\/code>/g,
    (match, code) => {
      // Check if this looks like a math expression
      if (isMathExpression(code)) {
        const highlighted = highlightMathExpression(code)
        return `<code class="math-inline">${highlighted}</code>`
      }
      return match
    }
  )

  // Pattern 3: Math in tables (for calculation examples)
  processed = processed.replace(
    /<td>([^<]*[\d\s\+\-\*\/\=\(\)\.]+[^<]*)<\/td>/g,
    (match, content) => {
      if (isMathExpression(content)) {
        const highlighted = highlightMathExpression(content)
        return `<td class="math-cell">${highlighted}</td>`
      }
      return match
    }
  )

  return processed
}

function isMathExpression(text: string): boolean {
  // Check if text contains mathematical operators or patterns
  const mathPatterns = [
    /[\+\-\*\/\=]/,           // Basic operators
    /\d+\.?\d*/,              // Numbers
    /\b(mg|mL|kg|hr|min|units?|mcg|g|L)\b/i, // Medical units
    /×|÷|→/,                  // Special math symbols
    /\^/,                     // Exponents
    /\(/,                     // Parentheses
  ]

  return mathPatterns.some(pattern => pattern.test(text))
}

function highlightMathExpression(expr: string): string {
  let highlighted = expr

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="math-number">$1</span>'
  )

  // Highlight operators
  highlighted = highlighted.replace(
    /([\+\-\*\/\=]|×|÷|→)/g,
    '<span class="math-operator">$1</span>'
  )

  // Highlight units
  highlighted = highlighted.replace(
    /\b(mg|mL|kg|hr|min|units?|mcg|g|L|cm|m²|IU|mEq|mmol|sec|day|tsp|tbsp|oz|lb|°C|°F)\b/gi,
    '<span class="math-unit">$1</span>'
  )

  // Highlight variables in formulas
  highlighted = highlighted.replace(
    /\b(BSA|TDD|ICR|CF|IBW|BMI|CrCl|GFR|INR|PTT|BG)\b/g,
    '<span class="math-variable">$1</span>'
  )

  // Highlight parentheses and brackets
  highlighted = highlighted.replace(
    /([\(\)\[\]])/g,
    '<span class="math-bracket">$1</span>'
  )

  // Highlight keywords in formulas
  highlighted = highlighted.replace(
    /\b(Weight|Height|Dose|Rate|Time|Volume|Concentration|Total|Initial|Final|Current|Target|Bolus)\b/gi,
    '<span class="math-keyword">$1</span>'
  )

  return highlighted
}