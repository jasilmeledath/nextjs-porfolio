/**
 * @fileoverview Blog Detail Page - Individual Blog Post Display
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiTag,
  FiArrowLeft,
  FiEye,
  FiMessageSquare,
  FiHeart,
  FiShare2,
  FiTwitter,
  FiLinkedin,
  FiFacebook
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import BlogService from '../../services/blog-service';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';
import SubscriptionForm from '../../components/SubscriptionForm';
import useSubscriptionModal from '../../hooks/useSubscriptionModal';

/**
 * Blog Detail Page Component
 * @function BlogDetailPage
 * @returns {JSX.Element} Blog detail component
 */
export default function BlogDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { isDark } = useTheme();
  const { showModal, closeModal } = useSubscriptionModal();
  
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Load blog data
  useEffect(() => {
    if (slug && typeof slug === 'string') {
      loadBlog();
    }
  }, [slug]);

  /**
   * Load blog by slug
   */
  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await BlogService.getBlogBySlug(slug);
      setBlog(response.data.blog);
      setRelatedBlogs(response.data.relatedBlogs || []);
    } catch (error) {
      console.error('[BlogDetail] Error loading blog:', error);
      setError('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Share functions
   */
  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-mono`}>Loading blog...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-mono text-xl mb-4`}>
            {error || 'Blog not found'}
          </div>
          <Link 
            href="/blog"
            className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-mono underline`}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.seo?.metaTitle || blog.title}</title>
        <meta name="description" content={blog.seo?.metaDescription || blog.excerpt} />
        <meta name="keywords" content={blog.seo?.keywords?.join(', ') || blog.tags?.join(', ')} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage?.url || '/placeholder.svg'} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.featuredImage?.url || '/placeholder.svg'} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`} />
      </Head>

      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              href="/blog"
              className={`inline-flex items-center space-x-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} font-mono text-sm transition-colors`}
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            {/* Category & Tags */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 mb-4">
              {blog.categories?.map((category) => (
                <span
                  key={category}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {category.toUpperCase()}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {blog.title}
            </motion.h1>

            {/* Meta Information */}
            <motion.div
              variants={fadeInUp}
              className={`flex flex-wrap items-center gap-4 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{blog.author?.firstName} {blog.author?.lastName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiClock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiEye className="w-4 h-4" />
                <span>{blog.views?.toLocaleString()} views</span>
              </div>
            </motion.div>
          </motion.header>

          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <img
                src={blog.featuredImage.url}
                alt={blog.featuredImage.alt || blog.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
              />
              {blog.featuredImage.caption && (
                <p className={`text-sm italic mt-2 text-center ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {blog.featuredImage.caption}
                </p>
              )}
            </motion.div>
          )}

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`prose prose-lg max-w-none mb-12 ${
              isDark 
                ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-green-400' 
                : 'prose-gray'
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
          </motion.article>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <FiTag className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded text-xs ${
                      isDark 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-colors cursor-pointer`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-4 mb-12 p-6 border rounded-lg"
            style={{
              borderColor: isDark ? '#374151' : '#e5e7eb',
              backgroundColor: isDark ? '#1f2937' : '#f9fafb'
            }}
          >
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Share this article:
            </span>
            <button
              onClick={shareOnTwitter}
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <FiTwitter className="w-4 h-4" />
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white transition-colors"
            >
              <FiLinkedin className="w-4 h-4" />
            </button>
            <button
              onClick={shareOnFacebook}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <FiFacebook className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Comments Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Comments
            </h3>

            {/* Comment Form */}
            <div className="mb-8">
              <CommentForm 
                blogId={blog._id}
                onSuccess={(message) => {
                  console.log('Comment submitted:', message);
                  // You can add a toast notification here
                  // Refresh the comments list
                  window.location.reload(); // Simple refresh for now
                }}
              />
            </div>

            {/* Comments List */}
            <CommentList blogId={blog._id} />
          </motion.section>

          {/* Newsletter Subscription */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Enjoyed this article?
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Subscribe to get notified when I publish new content
              </p>
            </div>
            <SubscriptionForm position="inline" />
          </motion.section>

          {/* Related Posts */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Related Posts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog._id}
                    href={`/blog/${relatedBlog.slug}`}
                    className={`block p-4 rounded-lg border transition-colors ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {relatedBlog.featuredImage?.url && (
                      <img
                        src={relatedBlog.featuredImage.url}
                        alt={relatedBlog.title}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {relatedBlog.title}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {relatedBlog.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Subscription Modal */}
        <SubscriptionForm 
          showModal={showModal} 
          onClose={closeModal} 
          position="modal" 
        />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  // For now, return empty paths since we don't have blogs yet
  // In production, you would fetch all blog slugs here
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  try {
    // In production, you would fetch the blog data here
    // const blog = await BlogService.getBlogBySlug(params.slug);
    
    return {
      props: {
        // blog: blog.data
      },
      revalidate: 60 // Revalidate every minute
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
