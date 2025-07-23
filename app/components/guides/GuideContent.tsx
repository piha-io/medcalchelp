import { useEffect, useRef } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface GuideContentProps {
  content: string
}

export function GuideContent({ content }: GuideContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Process markdown content
    const processContent = async () => {
      const result = await remark()
        .use(gfm) // GitHub Flavored Markdown
        .use(html, { sanitize: false })
        .process(content)

      if (contentRef.current) {
        let processedHtml = result.toString()
        
        // Process KaTeX math expressions
        processedHtml = processKaTeXMath(processedHtml)
        
        contentRef.current.innerHTML = processedHtml
        
        // Render KaTeX expressions
        renderKaTeXMath(contentRef.current)
        
        // Apply remaining math highlighting for non-LaTeX expressions
        highlightMathInContent(contentRef.current)
      }
    }

    processContent()
  }, [content])

  // Function to highlight math expressions in the rendered content
  const highlightMathInContent = (container: HTMLElement) => {
    // Highlight code blocks that contain math
    const codeBlocks = container.querySelectorAll('pre code')
    codeBlocks.forEach(block => {
      const text = block.textContent || ''
      if (isMathExpression(text)) {
        block.parentElement?.classList.add('math-block')
        block.innerHTML = highlightMathExpression(text)
      }
    })

    // Highlight inline code that contains math
    const inlineCodes = container.querySelectorAll('code:not(pre code)')
    inlineCodes.forEach(code => {
      const text = code.textContent || ''
      if (isMathExpression(text)) {
        code.classList.add('math-inline')
        code.innerHTML = highlightMathExpression(text)
      }
    })

    // Highlight math in table cells
    const tableCells = container.querySelectorAll('td')
    tableCells.forEach(cell => {
      const text = cell.textContent || ''
      if (isMathExpression(text) && !cell.querySelector('code')) {
        cell.classList.add('math-cell')
        cell.innerHTML = highlightMathExpression(text)
      }
    })
  }

  const isMathExpression = (text: string): boolean => {
    // Be much more conservative - only highlight very specific patterns
    // that KaTeX won't handle automatically
    const mathPatterns = [
      // Only highlight isolated numbers with specific medical units
      // if they're not already processed by KaTeX
      /^\d+\s*(mg|mL|kg|hr|min|units?|mcg|g|L|gtt)$/i,
      // Simple ratios without operators
      /^\d+:\d+$/,
    ]
    
    // Don't highlight if it contains LaTeX markup or complex expressions
    if (text.includes('$$') || text.includes('\\') || text.includes('×') || text.includes('÷')) {
      return false
    }
    
    return mathPatterns.some(pattern => pattern.test(text))
  }

  const processKaTeXMath = (html: string): string => {
    // Convert mathematical expressions to KaTeX LaTeX format
    let processed = html
    
    // Replace common mathematical expressions with LaTeX
    processed = processed
      // Formulas like D/H × Q (most common in guides)
      .replace(/\b([A-Z])\/([A-Z])\s*×\s*([A-Z])\b/g, '$$\\frac{$1}{$2} \\times $3$$')
      .replace(/\b([A-Z])\/([A-Z])\s*\*\s*([A-Z])\b/g, '$$\\frac{$1}{$2} \\times $3$$')
      
      // Basic arithmetic with equals (like 500/250 × 1 = 2)
      .replace(/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/g, 
        '$$\\frac{$1}{$2} \\times $3 = $4$$')
      .replace(/(\d+(?:\.\d+)?)\s*÷\s*(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/g, 
        '$$\\frac{$1}{$2} \\times $3 = $4$$')
      
      // More complex formulas in parentheses
      .replace(/\((\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)\)\s*÷\s*(\d+(?:\.\d+)?)/g, 
        '$$\\frac{($1 \\times $2)}{$3}$$')
      
      // Flow rate formulas like (Volume × Drop factor) ÷ Time
      .replace(/\(([^)]+)\s*×\s*([^)]+)\)\s*÷\s*([^)]+)/g, 
        '$$\\frac{($1 \\times $2)}{$3}$$')
      
      // Simple division fractions
      .replace(/(\d+(?:\.\d+)?)\s*÷\s*(\d+(?:\.\d+)?)/g, '$$\\frac{$1}{$2}$$')
      
      // gtt/min format
      .replace(/(\d+(?:\.\d+)?)\s*gtt\/min/gi, '$$1\\text{ gtt/min}$$')
      .replace(/(\d+(?:\.\d+)?)\s*mL\/hr/gi, '$$1\\text{ mL/hr}$$')
      
      // Basic multiplication and division symbols
      .replace(/(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)/g, '$$1 \\times $2$$')
      .replace(/(\d+(?:\.\d+)?)\s*÷\s*(\d+(?:\.\d+)?)/g, '$$1 \\div $2$$')
    
    return processed
  }

  const renderKaTeXMath = (container: HTMLElement) => {
    // Import KaTeX dynamically to avoid SSR issues
    import('katex').then((katex) => {
      // Find all math expressions marked with $$...$$
      const mathExpressions = container.innerHTML.match(/\$\$([^$]+)\$\$/g)
      
      if (mathExpressions) {
        mathExpressions.forEach((mathExpr) => {
          const latex = mathExpr.replace(/\$\$/g, '')
          try {
            const rendered = katex.default.renderToString(latex, {
              displayMode: true,
              throwOnError: false,
              errorColor: '#cc0000',
              strict: false
            })
            container.innerHTML = container.innerHTML.replace(mathExpr, rendered)
          } catch (error) {
            console.warn('KaTeX rendering error:', error)
            // Fallback to original text without $$
            container.innerHTML = container.innerHTML.replace(mathExpr, latex)
          }
        })
      }
      
      // Handle inline math with $...$
      const inlineMath = container.innerHTML.match(/\$([^$]+)\$/g)
      if (inlineMath) {
        inlineMath.forEach((mathExpr) => {
          const latex = mathExpr.replace(/\$/g, '')
          try {
            const rendered = katex.default.renderToString(latex, {
              displayMode: false,
              throwOnError: false,
              errorColor: '#cc0000',
              strict: false
            })
            container.innerHTML = container.innerHTML.replace(mathExpr, rendered)
          } catch (error) {
            console.warn('KaTeX rendering error:', error)
            container.innerHTML = container.innerHTML.replace(mathExpr, latex)
          }
        })
      }
    }).catch((error) => {
      console.warn('Failed to load KaTeX:', error)
    })
  }

  const highlightMathExpression = (expr: string): string => {
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
      /\b(BSA|TDD|ICR|CF|IBW|BMI|CrCl|GFR|INR|PTT|BG|Weight|Height|Dose|Rate|Bolus)\b/g,
      '<span class="math-variable">$1</span>'
    )

    // Highlight parentheses and brackets
    highlighted = highlighted.replace(
      /([\(\)\[\]])/g,
      '<span class="math-bracket">$1</span>'
    )

    return highlighted
  }

  return (
    <div 
      ref={contentRef}
      className="prose prose-xl max-w-none math-content
        /* Typography */
        prose-headings:font-display prose-headings:text-gray-900 prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
        prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-primary-800
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gray-800
        prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
        
        /* Paragraphs */
        prose-p:text-gray-700 prose-p:leading-8 prose-p:text-lg prose-p:mb-6
        
        /* Links */
        prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700
        
        /* Text styles */
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-600
        
        /* Lists */
        prose-ul:my-6 prose-ol:my-6 prose-ul:space-y-2 prose-ol:space-y-2
        prose-li:text-gray-700 prose-li:text-lg prose-li:leading-7
        prose-li:marker:text-primary-500
        
        /* Blockquotes */
        prose-blockquote:border-l-4 prose-blockquote:border-primary-400 
        prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic 
        prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-lg
        prose-blockquote:text-primary-800
        
        /* Code - enhanced for math */
        prose-code:text-primary-700 prose-code:bg-primary-100 
        prose-code:px-2 prose-code:py-1 prose-code:rounded-md 
        prose-code:font-mono prose-code:font-medium prose-code:text-sm
        prose-code:before:content-none prose-code:after:content-none
        
        /* Code blocks - enhanced for math */
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl 
        prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg
        prose-pre:border prose-pre:border-gray-700
        
        /* Images */
        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
        
        /* Tables */
        prose-table:my-8 prose-table:border-collapse
        prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-semibold prose-th:p-3 prose-th:border
        prose-td:p-3 prose-td:border prose-td:text-gray-700
        
        /* HR */
        prose-hr:my-12 prose-hr:border-gray-300"
    />
  )
}