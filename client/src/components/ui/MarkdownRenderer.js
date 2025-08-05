/**
 * @fileoverview Professional Markdown Renderer for Project Previews
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-05
 * @version 1.0.0
 */

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ExternalLink, Code, BookOpen } from 'lucide-react';

/**
 * Professional Markdown Renderer with Theme Support
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {boolean} props.isDark - Dark mode flag
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - Compact styling for short descriptions
 * @returns {JSX.Element} Rendered markdown content
 */
export default function MarkdownRenderer({ 
  content = '', 
  isDark = true, 
  className = '', 
  compact = false 
}) {
  // Memoized markdown rendering for performance
  const renderedContent = useMemo(() => {
    if (!content?.trim()) {
      return (
        <div className={`flex items-center justify-center py-8 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <div className="text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm italic">No description available</p>
          </div>
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Code syntax highlighting with theme support
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4">
                <SyntaxHighlighter
                  style={isDark ? vscDarkPlus : oneLight}
                  language={match[1]}
                  PreTag="div"
                  className={`rounded-lg !text-sm border ${
                    isDark 
                      ? '!bg-gray-900/80 border-gray-700' 
                      : '!bg-gray-50 border-gray-200'
                  }`}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code 
                className={`px-2 py-1 rounded text-sm font-mono border ${
                  isDark 
                    ? 'bg-gray-700/50 text-gray-100 border-gray-600' 
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }`} 
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Enhanced headings with better theme support
          h1: ({ children }) => (
            <h1 className={`font-bold mb-4 pb-2 border-b ${
              compact ? 'text-xl' : 'text-2xl md:text-3xl'
            } ${
              isDark 
                ? 'text-white border-gray-600' 
                : 'text-gray-900 border-gray-300'
            }`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`font-semibold mb-3 mt-6 ${
              compact ? 'text-lg' : 'text-xl md:text-2xl'
            } ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`font-medium mb-2 mt-4 ${
              compact ? 'text-base' : 'text-lg md:text-xl'
            } ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`font-medium mb-2 mt-3 ${
              compact ? 'text-sm' : 'text-base md:text-lg'
            } ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className={`font-medium mb-2 mt-2 ${
              compact ? 'text-xs' : 'text-sm md:text-base'
            } ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className={`font-medium mb-2 mt-2 ${
              compact ? 'text-xs' : 'text-sm'
            } ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {children}
            </h6>
          ),
          
          // Enhanced paragraphs with better contrast
          p: ({ children }) => (
            <p className={`mb-4 leading-relaxed ${
              compact ? 'text-sm' : 'text-base'
            } ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </p>
          ),
          
          // Enhanced lists with better visibility
          ul: ({ children }) => (
            <ul className={`mb-4 space-y-2 pl-6 list-disc ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`mb-4 space-y-2 pl-6 list-decimal ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={`relative leading-relaxed ${compact ? 'text-sm' : 'text-base'} ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </li>
          ),
          
          // Enhanced links with better contrast
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 font-medium underline transition-colors duration-200 ${
                isDark 
                  ? 'text-blue-300 hover:text-blue-200 decoration-blue-400/60 hover:decoration-blue-300' 
                  : 'text-blue-600 hover:text-blue-700 decoration-blue-600/60 hover:decoration-blue-700'
              }`}
            >
              {children}
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          ),
          
          // Enhanced blockquotes with better visibility
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 pl-4 py-3 my-4 italic rounded-r-lg ${
              isDark 
                ? 'border-blue-400/70 bg-blue-500/10 text-gray-200' 
                : 'border-blue-500 bg-blue-50 text-blue-800'
            }`}>
              {children}
            </blockquote>
          ),
          
          // Enhanced tables with better visibility
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className={`min-w-full border rounded-lg ${
                isDark ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-white'
              }`}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className={`border px-4 py-3 font-semibold text-left ${
              isDark 
                ? 'border-gray-600 bg-gray-700/50 text-white' 
                : 'border-gray-300 bg-gray-100 text-gray-900'
            }`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`border px-4 py-3 ${
              isDark 
                ? 'border-gray-600 text-gray-200' 
                : 'border-gray-300 text-gray-700'
            }`}>
              {children}
            </td>
          ),
          
          // Enhanced images with better styling
          img: ({ src, alt }) => (
            <div className="my-6">
              <img
                src={src}
                alt={alt}
                className={`rounded-lg max-w-full h-auto mx-auto border shadow-lg ${
                  isDark ? 'border-gray-600' : 'border-gray-300'
                }`}
              />
              {alt && (
                <p className={`text-center mt-3 italic ${
                  compact ? 'text-xs' : 'text-sm'
                } ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {alt}
                </p>
              )}
            </div>
          ),
          
          // Enhanced horizontal rules
          hr: () => (
            <hr className={`my-6 border-t ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`} />
          ),
          
          // Enhanced strong/bold text with better contrast
          strong: ({ children }) => (
            <strong className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {children}
            </strong>
          ),
          
          // Enhanced emphasis/italic text with better contrast
          em: ({ children }) => (
            <em className={`italic ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {children}
            </em>
          ),
        }}
        className={`prose max-w-none ${
          isDark ? 'prose-invert' : ''
        } ${compact ? 'prose-sm' : 'prose-base md:prose-lg'}`}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content, isDark, compact]);

  if (!content?.trim()) {
    return (
      <div className={`flex items-center justify-center py-8 ${
        isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <div className="text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm italic">No description available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`markdown-content ${className}`}>
      {renderedContent}
    </div>
  );
}