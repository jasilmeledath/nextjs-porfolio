/**
 * @fileoverview BlogPost Component - Renders markdown content with syntax highlighting
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from '../../context/ThemeContext';
import PropTypes from 'prop-types';

/**
 * Custom code block component with syntax highlighting
 * @param {Object} props - Component props
 * @returns {JSX.Element} Syntax highlighted code block
 */
const CodeBlock = memo(({ children, className, node, ...rest }) => {
  const { isDark } = useTheme();
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  
  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
      language={language}
      style={isDark ? vscDarkPlus : vs}
      customStyle={{
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        margin: '1.5rem 0',
        padding: '1rem 1.25rem',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      }}
      codeTagProps={{
        style: {
          fontSize: 'inherit',
          fontFamily: 'Fira Code, Monaco, Consolas, monospace',
        }
      }}
    />
  ) : (
    <code className={className} {...rest}>
      {children}
    </code>
  );
});

CodeBlock.displayName = 'CodeBlock';

/**
 * Custom heading component with anchor links
 * @param {Object} props - Component props
 * @returns {JSX.Element} Heading with anchor link
 */
const HeadingRenderer = memo(({ level, children, ...props }) => {
  const { isDark } = useTheme();
  const text = children?.toString() || '';
  const id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const Tag = `h${level}`;
  
  return (
    <Tag 
      id={id} 
      className={`group relative ${isDark ? 'text-white' : 'text-gray-900'}`}
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        className={`absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
        aria-label={`Link to ${text}`}
      >
        #
      </a>
    </Tag>
  );
});

HeadingRenderer.displayName = 'HeadingRenderer';

/**
 * Custom link component with external link handling
 * @param {Object} props - Component props
 * @returns {JSX.Element} Enhanced link component
 */
const LinkRenderer = memo(({ href, children, ...props }) => {
  const { isDark } = useTheme();
  const isExternal = href && (href.startsWith('http') || href.startsWith('https'));
  
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`font-medium underline underline-offset-2 transition-colors ${
        isDark 
          ? 'text-blue-400 hover:text-blue-300 decoration-blue-600 hover:decoration-blue-500'
          : 'text-blue-600 hover:text-blue-700 decoration-blue-200 hover:decoration-blue-400'
      }`}
      {...props}
    >
      {children}
      {isExternal && (
        <span className="ml-1 text-xs opacity-70">↗</span>
      )}
    </a>
  );
});

LinkRenderer.displayName = 'LinkRenderer';

/**
 * Custom blockquote component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Styled blockquote
 */
const BlockquoteRenderer = memo(({ children, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <blockquote
      className={`border-l-4 pl-4 italic my-6 ${
        isDark 
          ? 'border-gray-600 text-gray-400 bg-gray-800/50' 
          : 'border-gray-300 text-gray-600 bg-gray-50'
      } rounded-r-lg py-2 pr-4`}
      {...props}
    >
      {children}
    </blockquote>
  );
});

BlockquoteRenderer.displayName = 'BlockquoteRenderer';

/**
 * Custom table component with responsive wrapper
 * @param {Object} props - Component props
 * @returns {JSX.Element} Responsive table
 */
const TableRenderer = memo(({ children, ...props }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="overflow-x-auto my-6">
      <table
        className={`min-w-full divide-y rounded-lg overflow-hidden ${
          isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
        } shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

TableRenderer.displayName = 'TableRenderer';

/**
 * Custom image component with loading and error handling
 * @param {Object} props - Component props
 * @returns {JSX.Element} Enhanced image component
 */
const ImageRenderer = memo(({ src, alt, title, ...props }) => {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt || ''}
        title={title}
        className="rounded-lg shadow-md w-full h-auto"
        loading="lazy"
        {...props}
      />
      {(title || alt) && (
        <figcaption className="text-sm text-center mt-2 italic text-gray-600 dark:text-gray-400">
          {title || alt}
        </figcaption>
      )}
    </figure>
  );
});

ImageRenderer.displayName = 'ImageRenderer';

/**
 * Main BlogPost component
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.enableToc] - Enable table of contents
 * @returns {JSX.Element} Rendered blog post component
 */
const BlogPost = memo(({ content, className = '', enableToc = false }) => {
  const { isDark } = useTheme();
  
  if (!content) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p>No content available.</p>
      </div>
    );
  }

  // Custom components for react-markdown
  const components = {
    // Code and syntax highlighting
    code: CodeBlock,
    
    // Headings with anchor links
    h1: (props) => <HeadingRenderer level={1} {...props} />,
    h2: (props) => <HeadingRenderer level={2} {...props} />,
    h3: (props) => <HeadingRenderer level={3} {...props} />,
    h4: (props) => <HeadingRenderer level={4} {...props} />,
    h5: (props) => <HeadingRenderer level={5} {...props} />,
    h6: (props) => <HeadingRenderer level={6} {...props} />,
    
    // Enhanced links
    a: LinkRenderer,
    
    // Styled blockquotes
    blockquote: BlockquoteRenderer,
    
    // Responsive tables
    table: TableRenderer,
    
    // Enhanced images
    img: ImageRenderer,
    
    // Custom list styling
    ul: ({ children, ...props }) => (
      <ul className="space-y-2 ml-6 list-disc marker:text-blue-500" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="space-y-2 ml-6 list-decimal marker:text-blue-500" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    
    // Horizontal rule
    hr: ({ ...props }) => (
      <hr className={`my-8 border-t-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} {...props} />
    ),
  };

  return (
    <div className={`blog-post-content ${className}`}>
      <article
        className={`
          prose prose-lg max-w-none
          ${isDark ? 'prose-dark' : 'prose-gray'}
          prose-blog
          prose-headings:scroll-mt-20
          prose-a:no-underline
          focus:outline-none
        `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
          className="markdown-content"
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
});

BlogPost.displayName = 'BlogPost';

BlogPost.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  enableToc: PropTypes.bool,
};

export default BlogPost;