/**
 * @fileoverview Markdown Test Page - Demonstrates BlogPost component with example content
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 1.0.0
 */

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEye, FiCode, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import BlogPost from '../../components/blog/BlogPost';

const EXAMPLE_MARKDOWN = `# Complete Markdown Guide for Blog Posts

This is an example markdown file demonstrating all the supported features in your blog system.

## Headers and Text Formatting

### This is a level 3 header
#### This is a level 4 header
##### This is a level 5 header
###### This is a level 6 header

**Bold text** and *italic text* work perfectly. You can also combine them: ***bold and italic***.

~~Strikethrough text~~ is also supported.

## Lists

### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists
1. First ordered item
2. Second ordered item
   1. Nested ordered item
   2. Another nested item
3. Third ordered item

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [ ] Another incomplete task

## Links and Images

Here's a [link to Google](https://google.com) and here's an [internal link](#code-examples).

![Example Image](https://via.placeholder.com/600x300/0099ff/ffffff?text=Example+Blog+Image "This is an example image")

## Blockquotes

> This is a blockquote. It can contain **bold text**, *italic text*, and even [links](https://example.com).
>
> This is the second paragraph in the blockquote.

## Code Examples

### Inline Code
Here's some \`inline code\` with syntax highlighting.

### JavaScript Code Block
\`\`\`javascript
// Example JavaScript function
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  
  const message = {
    greeting: \`Welcome to our blog, \${name}\`,
    timestamp: new Date().toISOString(),
    isVip: name.length > 10
  };
  
  return message;
}

// Usage
const user = "John Doe";
const welcome = greetUser(user);
console.log(welcome);
\`\`\`

### Python Code Block
\`\`\`python
# Example Python class
class BlogPost:
    def __init__(self, title, content, author):
        self.title = title
        self.content = content
        self.author = author
        self.created_at = datetime.now()
    
    def __str__(self):
        return f"{self.title} by {self.author}"
    
    def word_count(self):
        return len(self.content.split())

# Usage
post = BlogPost(
    title="My First Blog Post",
    content="This is the content of my blog post.",
    author="Jane Smith"
)
print(f"Post: {post}")
print(f"Word count: {post.word_count()}")
\`\`\`

### CSS Code Block
\`\`\`css
/* Modern blog post styling */
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.blog-post h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.blog-post p {
  margin-bottom: 1.5rem;
  color: #4a5568;
}

@media (max-width: 768px) {
  .blog-post {
    padding: 1rem;
  }
  
  .blog-post h1 {
    font-size: 2rem;
  }
}
\`\`\`

### JSON Code Block
\`\`\`json
{
  "blogPost": {
    "id": "64a7b8c9d12e3f4g5h6i7j8k",
    "title": "Getting Started with Markdown",
    "slug": "getting-started-with-markdown",
    "content": "# Welcome to Markdown\\n\\nThis is your first blog post...",
    "author": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tags": ["markdown", "blogging", "tutorial"],
    "publishedAt": "2024-01-15T10:30:00Z",
    "status": "published"
  }
}
\`\`\`

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 all work |
| **Bold** | ✅ | Double asterisks |
| *Italic* | ✅ | Single asterisks |
| \`Code\` | ✅ | Backticks |
| Links | ✅ | Internal and external |
| Images | ✅ | With captions |
| Tables | ✅ | GitHub Flavored Markdown |
| Lists | ✅ | Ordered, unordered, tasks |

## Horizontal Rules

---

Above and below this text are horizontal rules.

___

## Advanced Features

### Definition Lists
Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

## Escape Characters

You can escape markdown characters: \\*this is not italic\\* and \\\\`this is not code\\\\`.

## HTML in Markdown

<div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0066cc;">
  <strong>Note:</strong> You can also use HTML directly in markdown when needed.
</div>

## Conclusion

This markdown file demonstrates all the features supported by your blog system. The content will be:

- Properly styled with Tailwind Typography
- Syntax highlighted for code blocks
- Responsive and accessible
- Dark mode compatible
- SEO friendly with proper heading structure

**Happy blogging!** 🎉`;

/**
 * Markdown Test Page Component
 */
export default function MarkdownTestPage() {
  const { isDark, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' or 'source'

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Markdown Test - Blog System</title>
        <meta name="description" content="Test page demonstrating the markdown rendering capabilities of the blog system" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/blog"
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    isDark 
                      ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </Link>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Markdown Test Page
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Demonstrating BlogPost component capabilities
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'rendered' ? 'source' : 'rendered')}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                      isDark 
                        ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600' 
                        : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    {viewMode === 'rendered' ? (
                      <>
                        <FiCode className="w-4 h-4" />
                        <span>View Source</span>
                      </>
                    ) : (
                      <>
                        <FiEye className="w-4 h-4" />
                        <span>View Rendered</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    isDark 
                      ? 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600' 
                      : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
                  }`}
                >
                  {isDark ? (
                    <>
                      <FiToggleRight className="w-4 h-4" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <FiToggleLeft className="w-4 h-4" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className={`rounded-lg border ${
              isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
            } overflow-hidden`}
          >
            {viewMode === 'rendered' ? (
              <div className="p-6">
                <BlogPost 
                  content={EXAMPLE_MARKDOWN}
                  className="markdown-test-content"
                />
              </div>
            ) : (
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Raw Markdown Source
                </h3>
                <pre className={`whitespace-pre-wrap text-sm font-mono p-4 rounded border overflow-auto max-h-96 ${
                  isDark 
                    ? 'bg-gray-900 text-gray-300 border-gray-700' 
                    : 'bg-white text-gray-700 border-gray-200'
                }`}>
                  {EXAMPLE_MARKDOWN}
                </pre>
              </div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
            className={`mt-8 p-6 rounded-lg border ${
              isDark 
                ? 'border-blue-800 bg-blue-900/20 text-blue-200' 
                : 'border-blue-200 bg-blue-50 text-blue-800'
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">How to Use</h3>
            <div className="space-y-2 text-sm">
              <p>1. <strong>Storage:</strong> Store raw markdown as a string in MongoDB's <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-800">content</code> field</p>
              <p>2. <strong>Rendering:</strong> Pass the raw markdown to <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-800">&lt;BlogPost content={`{blog.content}`} /&gt;</code></p>
              <p>3. <strong>Styling:</strong> The component uses Tailwind Typography with custom blog-specific styles</p>
              <p>4. <strong>Features:</strong> Syntax highlighting, anchor links, responsive tables, dark mode support</p>
            </div>
            
            <div className={`mt-4 p-3 rounded border-l-4 ${
              isDark 
                ? 'border-green-500 bg-green-900/20' 
                : 'border-green-500 bg-green-50'
            }`}>
              <p className="text-sm">
                <strong>Success!</strong> Your blog now supports full Markdown with GitHub Flavored Markdown extensions, 
                syntax highlighting for 20+ languages, and professional styling that works in both light and dark modes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}