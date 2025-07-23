import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Code, InlineCode } from 'mdast'

export const remarkMathHighlight: Plugin = () => {
  return (tree: any) => {
    // Process code blocks
    visit(tree, 'code', (node: Code) => {
      if (isMathExpression(node.value)) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}
        node.data.hProperties.className = ['math-block']
      }
    })

    // Process inline code
    visit(tree, 'inlineCode', (node: InlineCode) => {
      if (isMathExpression(node.value)) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}
        node.data.hProperties.className = ['math-inline']
        
        // Transform the content to add highlighting
        const highlighted = highlightMathExpression(node.value)
        node.type = 'html' as any
        node.value = `<code class="math-inline">${highlighted}</code>`
      }
    })
  }
}

function isMathExpression(text: string): boolean {
  const mathPatterns = [
    /[\+\-\*\/\=]/,                      // Basic operators
    /\d+\.?\d*/,                         // Numbers
    /\b(mg|mL|kg|hr|min|units?|mcg|g|L)\b/i,  // Medical units
    /×|÷|→/,                             // Special math symbols
    /\^/,                                // Exponents
    /\(/,                                // Parentheses
  ]
  
  return mathPatterns.some(pattern => pattern.test(text))
}

function highlightMathExpression(expr: string): string {
  let highlighted = expr

  // Escape HTML first
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

  // Highlight common medical variables
  highlighted = highlighted.replace(
    /\b(BSA|TDD|ICR|CF|IBW|BMI|CrCl|GFR|INR|PTT|BG|Weight|Height|Dose|Rate)\b/g,
    '<span class="math-variable">$1</span>'
  )

  // Highlight parentheses and brackets
  highlighted = highlighted.replace(
    /([\(\)\[\]])/g,
    '<span class="math-bracket">$1</span>'
  )

  return highlighted
}