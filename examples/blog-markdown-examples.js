/**
 * @fileoverview MongoDB and API Examples for Markdown Blog Posts
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @version 1.0.0
 */

// ========================================================================================
// MONGODB DOCUMENT EXAMPLES
// ========================================================================================

/**
 * Example MongoDB Blog Document with Markdown Content
 */
const exampleBlogDocument = {
  _id: "64a7b8c9d12e3f4g5h6i7j8k",
  title: "Complete Guide to React Hooks",
  slug: "complete-guide-to-react-hooks",
  
  // MARKDOWN CONTENT - Store as raw markdown string
  content: `# Complete Guide to React Hooks

React Hooks revolutionized how we write React components. This comprehensive guide covers everything you need to know.

## What are React Hooks?

Hooks are functions that let you **"hook into"** React state and lifecycle features from function components.

### Key Benefits:
- Reuse stateful logic between components
- Split one component into smaller functions
- Use state without writing a class

## Most Common Hooks

### 1. useState

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### 2. useEffect

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

You can create your own hooks to share logic:

\`\`\`javascript
// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`

## Best Practices

> **Important:** Always follow the Rules of Hooks:
> 1. Only call hooks at the top level
> 2. Only call hooks from React functions

### Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|----------|
| Call hooks at top level | Call hooks inside loops |
| Use hooks in custom hooks | Call hooks conditionally |
| Follow naming convention | Call hooks in regular functions |

## Conclusion

React Hooks provide a powerful way to manage state and side effects in functional components. Start with **useState** and **useEffect**, then explore other hooks as needed.

Happy coding! 🚀`,
  
  excerpt: "React Hooks revolutionized how we write React components. Learn everything about useState, useEffect, and custom hooks with practical examples.",
  
  featuredImage: {
    url: "/uploads/blog/react-hooks-guide.jpg",
    alt: "React Hooks Complete Guide",
    caption: "Master React Hooks with this comprehensive tutorial"
  },
  
  author: "64a7b8c9d12e3f4g5h6i7j8k", // ObjectId reference
  status: "published",
  categories: ["react", "javascript", "tutorial"],
  tags: ["react", "hooks", "javascript", "frontend", "tutorial"],
  
  publishedAt: new Date("2024-01-27T10:00:00Z"),
  readTime: 8, // Auto-calculated based on content
  views: 1250,
  likes: 42,
  
  seo: {
    metaTitle: "Complete Guide to React Hooks - Tutorial & Examples",
    metaDescription: "Master React Hooks with this comprehensive guide. Learn useState, useEffect, custom hooks, and best practices with practical examples.",
    keywords: ["react hooks", "useState", "useEffect", "react tutorial", "javascript"],
    ogImage: "/uploads/blog/react-hooks-guide-og.jpg"
  },
  
  createdAt: new Date("2024-01-27T09:30:00Z"),
  updatedAt: new Date("2024-01-27T10:00:00Z")
};

// ========================================================================================
// SERVER-SIDE API EXAMPLES (Express.js)
// ========================================================================================

/**
 * Example Express.js route for creating a blog post with markdown
 */
const createBlogPostRoute = `
// POST /api/blogs
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      content, // Raw markdown content
      excerpt,
      categories,
      tags,
      featuredImage,
      seo
    } = req.body;

    // Validate markdown content
    if (!content || content.trim().length < 50) {
      return res.status(400).json({
        status: 'error',
        message: 'Content must be at least 50 characters long'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\\w\\s-]/g, '')
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create blog post
    const blogPost = new Blog({
      title,
      slug,
      content, // Store raw markdown
      excerpt,
      author: req.user._id,
      categories,
      tags,
      featuredImage,
      readTime,
      seo: {
        metaTitle: seo?.metaTitle || title.substring(0, 60),
        metaDescription: seo?.metaDescription || excerpt.substring(0, 160),
        keywords: seo?.keywords || tags,
        ogImage: seo?.ogImage || featuredImage?.url
      }
    });

    await blogPost.save();

    res.status(201).json({
      status: 'success',
      message: 'Blog post created successfully',
      data: { blog: blogPost }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create blog post'
    });
  }
});
`;

/**
 * Example Express.js route for getting a blog post by slug
 */
const getBlogBySlugRoute = \`
// GET /api/blogs/public/:slug
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Find blog by slug and populate author
    const blog = await Blog.findBySlug(slug);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    // Get related blogs
    const relatedBlogs = await Blog.getRelated(
      blog._id, 
      blog.categories, 
      blog.tags, 
      3
    );

    res.json({
      status: 'success',
      data: {
        blog: {
          ...blog,
          content: blog.content // Raw markdown content
        },
        relatedBlogs
      }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch blog post'
    });
  }
});
\`;

// ========================================================================================
// CLIENT-SIDE USAGE EXAMPLES (Next.js)
// ========================================================================================

/**
 * Example Next.js page component using the BlogPost component
 */
const NextjsPageExample = \`
// pages/blog/[slug].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BlogPost from '../../components/blog/BlogPost';
import BlogService from '../../services/blog-service';

export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogBySlug(slug);
      setBlog(response.data.blog);
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <>
      <Head>
        <title>{blog.seo?.metaTitle || blog.title}</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
      </Head>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="text-gray-600 mb-4">
            By {blog.author.firstName} {blog.author.lastName} • 
            {new Date(blog.publishedAt).toLocaleDateString()} • 
            {blog.readTime} min read
          </div>
          {blog.featuredImage?.url && (
            <img 
              src={blog.featuredImage.url} 
              alt={blog.featuredImage.alt}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
        </header>

        {/* This is where the magic happens - BlogPost renders markdown */}
        <BlogPost 
          content={blog.content} // Raw markdown from MongoDB
          className="blog-detail-content"
        />

        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </>
  );
}
\`;

// ========================================================================================
// MONGODB OPERATIONS EXAMPLES
// ========================================================================================

/**
 * Example MongoDB operations for blog posts with markdown
 */
const mongodbOperations = {
  
  // Create a new blog post with markdown content
  createBlogPost: async function(blogData) {
    const blog = new Blog({
      title: blogData.title,
      slug: generateSlug(blogData.title),
      content: blogData.content, // Raw markdown string
      excerpt: blogData.excerpt,
      author: blogData.authorId,
      categories: blogData.categories,
      tags: blogData.tags,
      status: 'draft' // Start as draft
    });
    
    return await blog.save();
  },

  // Update blog post content
  updateBlogContent: async function(blogId, newContent) {
    return await Blog.findByIdAndUpdate(
      blogId,
      { 
        content: newContent, // Raw markdown
        updatedAt: new Date()
      },
      { new: true }
    );
  },

  // Get blog with markdown content for editing
  getBlogForEditing: async function(blogId) {
    return await Blog.findById(blogId)
      .populate('author', 'firstName lastName email')
      .select('+content'); // Make sure content is included
  },

  // Search blogs by markdown content
  searchBlogs: async function(searchTerm) {
    return await Blog.find({
      $text: { $search: searchTerm },
      status: 'published'
    }).sort({ score: { $meta: 'textScore' } });
  },

  // Get blog statistics
  getBlogStats: async function() {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftBlogs: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          totalViews: { $sum: '$views' },
          totalWords: { 
            $sum: { 
              $size: { 
                $split: [{ $trim: { input: '$content' } }, ' '] 
              } 
            } 
          }
        }
      }
    ]);
    
    return stats[0] || {};
  }
};

// ========================================================================================
// TESTING EXAMPLES
// ========================================================================================

/**
 * Example test data for creating blog posts
 */
const testBlogPosts = [
  {
    title: "Getting Started with Next.js 14",
    content: \`# Getting Started with Next.js 14

Next.js 14 introduces exciting new features that make building React applications even better.

## New Features

### 1. Server Actions
\\\`\\\`\\\`javascript
'use server'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')
  
  // Save to database
  await db.posts.create({ title, content })
}
\\\`\\\`\\\`

### 2. Improved Performance
- Faster cold starts
- Better tree shaking
- Optimized bundling

## Migration Guide

If you're upgrading from Next.js 13:

1. Update your package.json
2. Run \\\`npm install\\\`
3. Update your configuration

> **Note:** Most applications will work without changes.

## Conclusion

Next.js 14 is a great update with meaningful performance improvements.\`,
    excerpt: "Learn about the new features in Next.js 14 and how to migrate your existing applications.",
    categories: ["nextjs", "react", "tutorial"],
    tags: ["nextjs", "react", "javascript", "tutorial", "migration"]
  },
  
  {
    title: "MongoDB Schema Design Best Practices",
    content: \`# MongoDB Schema Design Best Practices

Designing efficient MongoDB schemas is crucial for application performance.

## Key Principles

### 1. Embed vs Reference
- **Embed** when data is accessed together
- **Reference** when data is large or shared

### 2. Index Strategy
\\\`\\\`\\\`javascript
// Compound index for common queries
db.blogs.createIndex({ 
  "status": 1, 
  "publishedAt": -1 
})

// Text index for search
db.blogs.createIndex({ 
  "title": "text", 
  "content": "text" 
})
\\\`\\\`\\\`

## Schema Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Embedding | One-to-few | User profile |
| Referencing | One-to-many | Blog posts |
| Bucketing | Time series | Analytics data |

## Anti-Patterns to Avoid

- Massive arrays
- Deep nesting (>3 levels)
- Unnecessary indexes

**Remember:** Design for your queries, not your data structure.\`,
    excerpt: "Learn MongoDB schema design patterns and best practices for building scalable applications.",
    categories: ["mongodb", "database", "tutorial"],
    tags: ["mongodb", "database", "schema", "performance", "best-practices"]
  }
];

// ========================================================================================
// EXPORT EXAMPLES
// ========================================================================================

module.exports = {
  exampleBlogDocument,
  createBlogPostRoute,
  getBlogBySlugRoute,
  NextjsPageExample,
  mongodbOperations,
  testBlogPosts
};

console.log(\`
==============================================================================
MARKDOWN BLOG IMPLEMENTATION GUIDE
==============================================================================

1. STORAGE: Store raw markdown in MongoDB as a string in the 'content' field
2. RENDERING: Use the BlogPost component to render markdown with syntax highlighting
3. STYLING: Tailwind Typography with custom blog-specific styles
4. FEATURES: 
   - Syntax highlighting for 20+ languages
   - GitHub Flavored Markdown (tables, task lists, etc.)
   - Anchor links for headings
   - Responsive images with captions
   - External link indicators
   - Dark mode support

5. EXAMPLE USAGE:
   - Create: Store markdown string in database
   - Display: Pass raw markdown to <BlogPost content={blog.content} />
   - Edit: Use textarea or markdown editor for raw markdown

6. SEO BENEFITS:
   - Proper heading hierarchy (h1-h6)
   - Semantic HTML structure
   - Fast loading with syntax highlighting
   - Mobile responsive
==============================================================================
\`);