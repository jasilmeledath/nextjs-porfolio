# Complete Markdown Guide for Blog Posts

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
Here's some `inline code` with syntax highlighting.

### JavaScript Code Block
```javascript
// Example JavaScript function
function greetUser(name) {
  console.log(`Hello, ${name}!`);
  
  const message = {
    greeting: `Welcome to our blog, ${name}`,
    timestamp: new Date().toISOString(),
    isVip: name.length > 10
  };
  
  return message;
}

// Usage
const user = "John Doe";
const welcome = greetUser(user);
console.log(welcome);
```

### Python Code Block
```python
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
```

### CSS Code Block
```css
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
```

### JSON Code Block
```json
{
  "blogPost": {
    "id": "64a7b8c9d12e3f4g5h6i7j8k",
    "title": "Getting Started with Markdown",
    "slug": "getting-started-with-markdown",
    "content": "# Welcome to Markdown\n\nThis is your first blog post...",
    "author": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "tags": ["markdown", "blogging", "tutorial"],
    "publishedAt": "2024-01-15T10:30:00Z",
    "status": "published"
  }
}
```

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 all work |
| **Bold** | ✅ | Double asterisks |
| *Italic* | ✅ | Single asterisks |
| `Code` | ✅ | Backticks |
| Links | ✅ | Internal and external |
| Images | ✅ | With captions |
| Tables | ✅ | GitHub Flavored Markdown |
| Lists | ✅ | Ordered, unordered, tasks |

## Horizontal Rules

---

Above and below this text are horizontal rules.

___

## Advanced Features

### Math Expressions (if supported)
The quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$

### Footnotes
Here's a statement that needs a footnote[^1].

[^1]: This is the footnote content.

### Definition Lists
Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

## Escape Characters

You can escape markdown characters: \*this is not italic\* and \`this is not code\`.

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

**Happy blogging!** 🎉