import { useEffect, useRef } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'

interface BlogPostContentProps {
  content: string
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Process markdown content
    const processContent = async () => {
      const result = await remark()
        .use(gfm) // GitHub Flavored Markdown
        .use(html, { sanitize: false })
        .process(content)

      if (contentRef.current) {
        contentRef.current.innerHTML = result.toString()
      }
    }

    processContent()
  }, [content])

  return (
    <div 
      ref={contentRef}
      className="prose prose-xl max-w-none
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
        
        /* Code */
        prose-code:text-primary-700 prose-code:bg-primary-100 
        prose-code:px-2 prose-code:py-1 prose-code:rounded-md 
        prose-code:font-mono prose-code:font-medium prose-code:text-sm
        prose-code:before:content-none prose-code:after:content-none
        
        /* Code blocks */
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