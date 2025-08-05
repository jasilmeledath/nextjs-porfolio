/**
 * @fileoverview Advanced Markdown Editor with Live Preview
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-08-05
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  FiEdit3,
  FiEye,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiType,
  FiLink,
  FiList,
  FiCode,
  FiImage,
  FiBookOpen
} from 'react-icons/fi';

/**
 * Markdown Editor Component with Live Preview
 * @param {Object} props - Component props
 * @param {string} props.value - Current markdown content
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.rows - Number of rows for textarea
 * @param {number} props.maxLength - Maximum character length
 * @param {string} props.label - Field label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Markdown editor component
 */
export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Enter your markdown content...',
  rows = 8,
  maxLength = 5000,
  label = 'Description',
  error = '',
  required = false,
  className = ''
}) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSyntaxHints, setShowSyntaxHints] = useState(false);

  // Memoized markdown rendering for performance
  const renderedMarkdown = useMemo(() => {
    if (!value.trim()) return null;
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Code syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !bg-black/60 !text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-700/50 text-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-600" {...props}>
                {children}
              </code>
            );
          },
          // Enhanced headings with better visibility
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 border-b border-green-500/30 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-gray-100 mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium text-gray-200 mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium text-gray-200 mb-2 mt-3">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-medium text-gray-300 mb-2 mt-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium text-gray-300 mb-2 mt-2">
              {children}
            </h6>
          ),
          // Enhanced paragraphs with better contrast
          p: ({ children }) => (
            <p className="text-gray-200 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          // Enhanced lists with better visibility
          ul: ({ children }) => (
            <ul className="text-gray-200 mb-4 space-y-2 pl-6 list-disc">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="text-gray-200 mb-4 space-y-2 pl-6 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative text-gray-200 leading-relaxed">
              {children}
            </li>
          ),
          // Enhanced links with better contrast
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/50 hover:decoration-blue-400 transition-colors duration-200 font-medium"
            >
              {children}
            </a>
          ),
          // Enhanced blockquotes with better visibility
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/70 pl-4 py-3 bg-blue-500/10 text-gray-200 italic mb-4 rounded-r-lg">
              {children}
            </blockquote>
          ),
          // Enhanced tables with better visibility
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-600 rounded-lg bg-gray-800/30">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 px-4 py-3 bg-gray-700/50 text-white font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-4 py-3 text-gray-200">
              {children}
            </td>
          ),
          // Enhanced images with better styling
          img: ({ src, alt }) => (
            <div className="mb-6">
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto border border-gray-600 shadow-lg mx-auto"
              />
              {alt && (
                <p className="text-gray-400 text-sm mt-3 text-center italic">
                  {alt}
                </p>
              )}
            </div>
          ),
          // Enhanced horizontal rules
          hr: () => (
            <hr className="my-6 border-t border-gray-600" />
          ),
          // Enhanced strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-white">
              {children}
            </strong>
          ),
          // Enhanced emphasis/italic text  
          em: ({ children }) => (
            <em className="italic text-gray-200">
              {children}
            </em>
          ),
        }}
        className="prose prose-green max-w-none"
      >
        {value}
      </ReactMarkdown>
    );
  }, [value]);

  const syntaxHints = [
    { icon: FiType, syntax: '**bold** or *italic*', description: 'Text formatting' },
    { icon: FiBookOpen, syntax: '# Heading 1\n## Heading 2\n### Heading 3', description: 'Headers' },
    { icon: FiLink, syntax: '[Link text](URL)', description: 'Links' },
    { icon: FiList, syntax: '- Item 1\n- Item 2', description: 'Lists' },
    { icon: FiCode, syntax: '`code` or ```js\\ncode block\\n```', description: 'Code' },
    { icon: FiImage, syntax: '![Alt text](image-url)', description: 'Images' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label and Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-mono font-medium text-green-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        
        <div className="flex items-center space-x-2">
          {/* Syntax Hints Toggle */}
          <button
            type="button"
            onClick={() => setShowSyntaxHints(!showSyntaxHints)}
            className="flex items-center space-x-1 px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-mono hover:bg-green-500/20 transition-colors duration-200"
          >
            <FiInfo className="w-3 h-3" />
            <span>Syntax</span>
            {showSyntaxHints ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
          </button>

          {/* Mode Toggle */}
          <div className="flex bg-black/40 rounded-lg p-1 border border-green-500/30">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-mono transition-all duration-200 ${
                !isPreviewMode
                  ? 'bg-green-500 text-black'
                  : 'text-green-400 hover:text-green-300'
              }`}
            >
              <FiEdit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-mono transition-all duration-200 ${
                isPreviewMode
                  ? 'bg-green-500 text-black'
                  : 'text-green-400 hover:text-green-300'
              }`}
            >
              <FiEye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Syntax Hints */}
      <AnimatePresence>
        {showSyntaxHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-500/5 border border-green-500/20 rounded-lg p-4"
          >
            <h4 className="text-green-300 font-mono text-sm mb-3 font-medium">
              Markdown Syntax Guide:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {syntaxHints.map((hint, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <hint.icon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <code className="text-green-300 font-mono text-xs bg-black/30 px-2 py-1 rounded block mb-1 whitespace-pre-line">
                      {hint.syntax}
                    </code>
                    <p className="text-green-600 text-xs">{hint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor/Preview Container */}
      <div className="relative">
        <div className={`rounded-lg border transition-all duration-300 ${
          error ? 'border-red-500' : 'border-green-500/30 focus-within:border-green-500'
        }`}>
          
          {!isPreviewMode ? (
            /* Edit Mode */
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={rows}
              maxLength={maxLength}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-black/40 rounded-lg text-green-100 font-mono placeholder-green-700 focus:outline-none resize-none"
              style={{ minHeight: `${rows * 1.5}rem` }}
            />
          ) : (
            /* Preview Mode */
            <div className="min-h-[12rem] px-4 py-3 bg-black/20 rounded-lg">
              {value.trim() ? (
                <div className="prose prose-green max-w-none">
                  {renderedMarkdown}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-green-600 font-mono text-sm">
                  <div className="text-center">
                    <FiBookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Start typing to see your markdown preview</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Character Count & Error */}
        <div className="flex justify-between items-center mt-2">
          {error && (
            <p className="text-red-400 text-xs font-mono flex items-center">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          <div className="text-green-700 font-mono text-xs ml-auto">
            {value.length}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}