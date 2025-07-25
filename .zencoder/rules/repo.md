### 4. Blog System - SEO-Optimized Content Platform (Light Theme)
```javascript
/**
 * Blog System Component IDs - ID: blog-platform-main-container
 * Professional blogging platform with comment system
 */
const BLOG_IDS = {
    // Main Blog Layout
    MAIN_CONTAINER: 'blog-platform-main-container',
    BLOG_HEADER: 'blog-platform-header-navigation',
    BREADCRUMB_NAV: 'blog-breadcrumb-navigation-trail',
    
    // Blog List Page
    BLOG_LIST_CONTAINER: 'blog-posts-listing-main-container',
    BLOG_LIST_HEADER: 'blog-listing-page-header-section',
    BLOG_SEARCH_BAR: 'blog-content-search-input-field',
    BLOG_SEARCH_BUTTON: 'blog-search-submit-button',
    BLOG_SEARCH_RESULTS: 'blog-search-results-container',
    
    // Filtering & Sorting
    FILTER_SIDEBAR: 'blog-category-filter-sidebar-panel',
    CATEGORY_FILTER: 'blog-posts-category-filter-dropdown',
    TAG_FILTER_CLOUD: 'blog-tags-filter-cloud-container',
    DATE_FILTER: 'blog-posts-date-range-filter',
    SORT_DROPDOWN: 'blog-posts-sort-options-dropdown',
    RESULTS_COUNT: 'blog-search-results-count-display',
    
    // Blog Post Cards
    POSTS_GRID: 'blog-posts-display-grid-container',
    POST_CARD: 'blog-post-preview-card-{post-slug}', // Dynamic ID
    POST_FEATURED_IMAGE: 'blog-post-featured-image-{post-slug}',
    POST_CATEGORY_BADGE: 'blog-post-category-badge-{post-slug}',
    POST_TITLE_LINK: 'blog-post-title-link-{post-slug}',
    POST_EXCERPT: 'blog-post-excerpt-preview-{post-slug}',
    POST_META_INFO: 'blog-post-metadata-info-{post-slug}',
    POST_AUTHOR_INFO: 'blog-post-author-information-{post-slug}',
    POST_PUBLISH_DATE: 'blog-post-publish-date-{post-slug}',
    POST_READ_TIME: 'blog-post-reading-time-estimate-{post-slug}',
    POST_TAGS_LIST: 'blog-post-tags-list-{post-slug}',
    POST_READ_MORE: 'blog-post-read-more-button-{post-slug}',
    
    // Featured Post Section
    FEATURED_POST_SECTION: 'blog-featured-post-highlight-section',
    FEATURED_POST_CONTAINER: 'blog-featured-post-main-container',
    FEATURED_POST_IMAGE: 'blog-featured-post-hero-image',
    FEATURED_POST_CONTENT: 'blog-featured-post-content-preview',
    FEATURED_POST_CTA: 'blog-featured-post-call-to-action',
    
    // Pagination
    PAGINATION_CONTAINER: 'blog-posts-pagination-navigation',
    PAGINATION_PREV: 'blog-pagination-previous-page-button',
    PAGINATION_NEXT: 'blog-pagination-next-page-button',
    PAGINATION_NUMBERS: 'blog-pagination-page-numbers-list',
    PAGINATION_INFO: 'blog-pagination-results-information',
    
    // Individual Blog Post Page
    POST_MAIN_CONTAINER: 'blog-post-main-content-container',
    POST_HEADER_SECTION: 'blog-post-header-section-container',
    POST_HERO_IMAGE: 'blog-post-hero-featured-image',
    POST_TITLE_HEADING: 'blog-post-main-title-heading',
    POST_SUBTITLE: 'blog-post-subtitle-description',
    POST_AUTHOR_CARD: 'blog-post-author-profile-card',
    POST_PUBLISH_INFO: 'blog-post-publication-information',
    POST_READING_PROGRESS: 'blog-post-reading-progress-indicator',
    
    // Post Content Area
    POST_CONTENT_AREA: 'blog-post-main-content-article',
    POST_CONTENT_TOC: 'blog-post-table-of-contents-sidebar',
    POST_CONTENT_SECTIONS: 'blog-post-content-sections-container',
    POST_CODE_BLOCKS: 'blog-post-syntax-highlighted-code-blocks',
    POST_IMAGES_GALLERY: 'blog-post-inline-images-gallery',
    POST_QUOTES_HIGHLIGHTS: 'blog-post-blockquotes-highlights',
    
    // Social Sharing
    SOCIAL_SHARING_BAR: 'blog-post-social-sharing-toolbar',
    SHARE_FACEBOOK: 'blog-post-facebook-share-button',
    SHARE_TWITTER: 'blog-post-twitter-share-button',
    SHARE_LINKEDIN: 'blog-post-linkedin-share-button',
    SHARE_COPY_LINK: 'blog-post-copy-link-button',
    SHARE_EMAIL: 'blog-post-email-share-button',
    
    // Tags & Categories
    POST_TAGS_SECTION: 'blog-post-tags-section-container',
    POST_TAG_ITEM: 'blog-post-tag-item-{tag-name}',
    POST_CATEGORY_SECTION: 'blog-post-category-section-container',
    RELATED_POSTS_SECTION: 'blog-related-posts-recommendations',
    RELATED_POST_CARD: 'blog-related-post-card-{related-slug}',
    
    // Author Bio Section
    AUTHOR_BIO_SECTION: 'blog-post-author-biography-section',
    AUTHOR_AVATAR: 'blog-post-author-profile-avatar',
    AUTHOR_NAME: 'blog-post-author-name-heading',
    AUTHOR_DESCRIPTION: 'blog-post-author-bio-description',
    AUTHOR_SOCIAL_LINKS: 'blog-post-author-social-media-links',
    
    // Comments System
    COMMENTS_MAIN_SECTION: 'blog-post-comments-main-section',
    COMMENTS_HEADER: 'blog-comments-section-header',
    COMMENTS_COUNT: 'blog-comments-total-count-display',
    COMMENTS_LIST: 'blog-comments-display-list-container',
    
    // Individual Comment
    COMMENT_ITEM: 'blog-comment-item-{comment-id}',
    COMMENT_AVATAR: 'blog-comment-author-avatar-{comment-id}',
    COMMENT_AUTHOR_NAME: 'blog-comment-author-name-{comment-id}',
    COMMENT_TIMESTAMP: 'blog-comment-publish-timestamp-{comment-id}',
    COMMENT_CONTENT: 'blog-comment-main-content-{comment-id}',
    COMMENT_REPLY_BUTTON: 'blog-comment-reply-button-{comment-id}',
    COMMENT_LIKE_BUTTON: 'blog-comment-like-button-{comment-id}',
    COMMENT_REPLIES_LIST: 'blog-comment-replies-list-{comment-id}',
    
    // Comment Form
    COMMENT_FORM_SECTION: 'blog-new-comment-form-section',
    COMMENT_FORM_CONTAINER: 'blog-comment-submission-form-container',
    COMMENT_FORM_HEADER: 'blog-comment-form-header-title',
    COMMENT_AUTHOR_INPUT: 'blog-comment-author-name-input',
    COMMENT_EMAIL_INPUT: 'blog-comment-author-email-input',
    COMMENT_WEBSITE_INPUT: 'blog-comment-author-website-input',
    COMMENT_CONTENT_TEXTAREA: 'blog-comment-content-textarea-field',
    COMMENT_SUBMIT_BUTTON: 'blog-comment-submit-button',
    COMMENT_PREVIEW_BUTTON: 'blog-comment-preview-button',
    COMMENT_GUIDELINES: 'blog-comment-submission-guidelines',
    
    // Comment Moderation (Admin View)
    COMMENT_MODERATION_PANEL: 'blog-admin-comment-moderation-panel',
    COMMENT_APPROVE_BUTTON: 'blog-admin-comment-approve-{comment-id}',
    COMMENT_REJECT_BUTTON: 'blog-admin-comment-reject-{comment-id}',
    COMMENT_SPAM_BUTTON: 'blog-admin-comment-mark-spam-{comment-id}',
    
    // Newsletter Subscription
    NEWSLETTER_SIGNUP_SECTION: 'blog-newsletter-subscription-section',
    NEWSLETTER_EMAIL_INPUT: 'blog-newsletter-email-input-field',
    NEWSLETTER_SUBSCRIBE_BUTTON: 'blog-newsletter-subscribe-button',
    
    // Blog Sidebar
    BLOG_SIDEBAR: 'blog-content-sidebar-container',
    RECENT_POSTS_WIDGET: 'blog-sidebar-recent-posts-widget',
    POPULAR_POSTS_WIDGET: 'blog-sidebar-popular-posts-widget',
    CATEGORIES_WIDGET: 'blog-sidebar-categories-widget',
    TAGS_CLOUD_WIDGET: 'blog-sidebar-tags-cloud-widget',
    SEARCH_WIDGET: 'blog-sidebar-search-widget',
    ARCHIVE_WIDGET: 'blog-sidebar-monthly-archive-widget'
};
```

**Blog System Features:**

#### 1. Blog Listing Page Features:
```javascript
const BLOG_LISTING_FEATURES = {
    ADVANCED_SEARCH: 'blog-advanced-search-functionality',
    REAL_TIME_FILTERING: 'blog-real-time-content-filtering',
    INFINITE_SCROLL: 'blog-infinite-scroll-pagination',
    READING_TIME_ESTIMATION: 'blog-automatic-reading-time-calculation',
    VIEW_COUNT_TRACKING: 'blog-post-view-count-analytics'
};
```

- **Advanced Search System**: 
  - Full-text search across titles, content, and tags
  - Search suggestions and autocomplete
  - Search result highlighting
  - Search history and saved searches

- **Smart Filtering Options**:
  - Filter by categories, tags, publish date
  - Multiple filter combinations
  - Real-time results updating
  - Filter state persistence in URL

- **Post Preview Cards**:
  - Featured image with lazy loading
  - Post excerpt with "Read More" expansion
  - Author information and avatar
  - Reading time estimation
  - Social sharing buttons
  - Category and tag badges

#### 2. Individual Blog Post Features:
```javascript
const BLOG_POST_FEATURES = {
    READING_PROGRESS_INDICATOR: 'blog-post-scroll-progress-bar',
    TABLE_OF_CONTENTS: 'blog-post-auto-generated-toc',
    SYNTAX_HIGHLIGHTING: 'blog-post-code-syntax-highlighting',
    IMAGE_LIGHTBOX: 'blog-post-image-lightbox-gallery',
    SOCIAL_SHARING_TRACKING: 'blog-post-social-share-analytics'
};
```

- **Enhanced Reading Experience**:
  - Reading progress indicator
  - Estimated reading time
  - Auto-generated table of contents
  - Print-friendly styling
  - Dark/light mode toggle

- **Rich Content Support**:
  - Markdown rendering with extensions
  - Syntax-highlighted code blocks
  - Embedded media support (YouTube, CodePen, etc.)
  - Image galleries with lightbox
  - Interactive elements and widgets

- **SEO Optimization**:
  - Dynamic meta tags for each post
  - Open Graph optimization
  - Structured data (Article schema)
  - Automatic sitemap generation
  - Social media card previews

#### 3. Comment System Features:
```javascript
const COMMENT_SYSTEM_FEATURES = {
    GUEST_COMMENTING: 'blog-guest-comment-no-registration-required',
    THREADED_REPLIES: 'blog-nested-comment-reply-system',
    SPAM_PROTECTION: 'blog-automatic-spam-detection',
    ADMIN_MODERATION: 'blog-admin-comment-approval-system',
    EMAIL_NOTIFICATIONS: 'blog-comment-email-notification-system'
};
```

- **Guest Comment System**:
  - No registration required
  - Name, email, and optional website
  - Comment preview before submission
  - Basic spam protection with rate limiting
  - IP tracking for moderation

- **Threaded Reply System**:
  - Nested replies up to 3 levels deep
  - Reply notifications to original commenter
  - Comment sorting options (newest, oldest, most liked)
  - Comment editing within time limit

- **Admin Moderation Panel**:
  - Approve/reject pending comments
  - Bulk moderation actions
  - Spam detection and filtering
  - Comment analytics and insights
  - Blacklist/whitelist management

### 5. Admin Panel - Comprehensive Management Interface
```javascript
/**
 * Admin Panel Component IDs - ID: admin-dashboard-main-container
 * Secure, feature-rich content management system
 */
const ADMIN_IDS = {
    // Authentication
    LOGIN_PAGE_CONTAINER: 'admin-authentication-login-page-container',
    LOGIN_FORM_WRAPPER: 'admin-login-form-wrapper-container',
    LOGIN_HEADER: 'admin-login-page-header-title',
    EMAIL_INPUT_FIELD: 'admin-login-email-input-field',
    PASSWORD_INPUT_FIELD: 'admin-login-password-input-field',
    LOGIN_SUBMIT_BUTTON: 'admin-login-submit-authentication-button',
    LOGIN_ERROR_MESSAGE: 'admin-login-error-message-display',
    FORGOT_PASSWORD_LINK: 'admin-forgot-password-recovery-link',
    
    // Main Dashboard Layout
    DASHBOARD_MAIN_CONTAINER: 'admin-main-dashboard-layout-container',
    DASHBOARD_HEADER: 'admin-dashboard-header-navigation-bar',
    USER_PROFILE_DROPDOWN: 'admin-user-profile-dropdown-menu',
    LOGOUT_BUTTON: 'admin-logout-session-button',
    
    // Sidebar Navigation
    SIDEBAR_NAVIGATION: 'admin-dashboard-sidebar-navigation-menu',
    NAV_DASHBOARD_LINK: 'admin-nav-dashboard-overview-link',
    NAV_PORTFOLIO_LINK: 'admin-nav-portfolio-management-link',
    NAV_BLOG_LINK: 'admin-nav-blog-content-management-link',
    NAV_COMMENTS_LINK: 'admin-nav-comments-moderation-link',
    NAV_MEDIA_LINK: 'admin-nav-media-library-management-link',
    NAV_ANALYTICS_LINK: 'admin-nav-analytics-dashboard-link',
    NAV_SETTINGS_LINK: 'admin-nav-system-settings-link',
    
    // Dashboard Overview
    DASHBOARD_OVERVIEW_CONTAINER: 'admin-dashboard-overview-main-container',
    STATS_CARDS_GRID: 'admin-dashboard-statistics-cards-grid',
    TOTAL_VIEWS_CARD: 'admin-stats-total-page-views-card',
    BLOG_POSTS_COUNT_CARD: 'admin-stats-blog-posts-count-card',
    COMMENTS_PENDING_CARD: 'admin-stats-pending-comments-card',
    RECENT_ACTIVITY_CARD: 'admin-stats-recent-activity-card',
    
    // Portfolio Management
    PORTFOLIO_MANAGEMENT_CONTAINER: 'admin-portfolio-management-main-container',
    PERSONAL_INFO_SECTION: 'admin-portfolio-personal-info-editor',
    PROFILE_IMAGE_UPLOADER: 'admin-portfolio-profile-image-uploader',
    RESUME_FILE_UPLOADER: 'admin-portfolio-resume-pdf-uploader',
    SOCIAL_MEDIA_MANAGER: 'admin-portfolio-social-media-links-manager',
    
    // Projects Management
    PROJECTS_MANAGEMENT_SECTION: 'admin-portfolio-projects-management-section',
    PROJECTS_LIST_TABLE: 'admin-projects-management-table',
    ADD_PROJECT_BUTTON: 'admin-add-new-project-button',
    PROJECT_EDITOR_MODAL: 'admin-project-editor-modal-container',
    PROJECT_TITLE_INPUT: 'admin-project-title-input-field',
    PROJECT_DESCRIPTION_TEXTAREA: 'admin-project-description-textarea',
    PROJECT_TECH_STACK_INPUT: 'admin-project-technologies-input',
    PROJECT_IMAGES_UPLOADER: 'admin-project-images-multi-uploader',
    PROJECT_LIVE_URL_INPUT: 'admin-project-live-demo-url-input',
    PROJECT_GITHUB_URL_INPUT: 'admin-project-github-repository-url-input',
    PROJECT_FEATURED_CHECKBOX: 'admin-project-featured-status-checkbox',
    PROJECT_SAVE_BUTTON: 'admin-project-save-changes-button',
    PROJECT_DELETE_BUTTON: 'admin-project-delete-confirmation-button',
    
    // Skills Management
    SKILLS_MANAGEMENT_SECTION: 'admin-portfolio-skills-management-section',
    SKILLS_MATRIX_EDITOR: 'admin-skills-matrix-editor-interface',
    ADD_SKILL_BUTTON: 'admin-add-new-skill-button',
    SKILL_NAME_INPUT: 'admin-skill-name-input-field',
    SKILL_CATEGORY_DROPDOWN: 'admin-skill-category-selection-dropdown',
    SKILL_PROFICIENCY_SLIDER: 'admin-skill-proficiency-level-slider',
    SKILL_ICON_UPLOADER: 'admin-skill-technology-icon-uploader',
    
    // Experience Management
    EXPERIENCE_MANAGEMENT_SECTION: 'admin-portfolio-experience-management-section',
    EXPERIENCE_TIMELINE_EDITOR: 'admin-experience-timeline-editor',
    ADD_EXPERIENCE_BUTTON: 'admin-add-work-experience-button',
    COMPANY_NAME_INPUT: 'admin-experience-company-name-input',
    JOB_POSITION_INPUT: 'admin-experience-job-position-input',
    EMPLOYMENT_START_DATE: 'admin-experience-start-date-picker',
    EMPLOYMENT_END_DATE: 'admin-experience-end-date-picker',
    CURRENT_POSITION_CHECKBOX: 'admin-experience-current-position-checkbox',
    JOB_DESCRIPTION_EDITOR: 'admin-experience-job-description-editor',
    ACHIEVEMENTS_LIST_EDITOR: 'admin-experience-achievements-list-editor',
    COMPANY_LOGO_UPLOADER: 'admin-experience-company-logo-uploader',
    
    // Blog Management
    BLOG_MANAGEMENT_CONTAINER: 'admin-blog-content-management-main-container',
    BLOG_POSTS_LIST_TABLE: 'admin-blog-posts-management-table',
    BLOG_POST_STATUS_FILTER: 'admin-blog-posts-status-filter-dropdown',
    CREATE_NEW_POST_BUTTON: 'admin-create-new-blog-post-button',
    
    // Blog Post Editor
    BLOG_POST_EDITOR_CONTAINER: 'admin-blog-post-editor-main-container',
    POST_TITLE_INPUT: 'admin-blog-post-title-input-field',
    POST_SLUG_INPUT: 'admin-blog-post-slug-url-input',
    POST_CONTENT_EDITOR: 'admin-blog-post-rich-text-editor',
    POST_EXCERPT_TEXTAREA: 'admin-blog-post-excerpt-textarea',
    POST_FEATURED_IMAGE_UPLOADER: 'admin-blog-post-featured-image-uploader',
    POST_CATEGORY_SELECTOR: 'admin-blog-post-category-multi-selector',
    POST_TAGS_INPUT: 'admin-blog-post-tags-input-field',
    POST_SEO_SECTION: 'admin-blog-post-seo-optimization-section',
    POST_META_TITLE_INPUT: 'admin-blog-post-meta-title-input',
    POST_META_DESCRIPTION_TEXTAREA: 'admin-blog-post-meta-description-textarea',
    POST_PUBLISH_STATUS_DROPDOWN: 'admin-blog-post-publish-status-dropdown',
    POST_PUBLISH_DATE_PICKER: 'admin-blog-post-publish-date-picker',
    POST_SAVE_DRAFT_BUTTON: 'admin-blog-post-save-draft-button',
    POST_PREVIEW_BUTTON: 'admin-blog-post-preview-button',
    POST_PUBLISH_BUTTON: 'admin-blog-post-publish-button',
    
    // Comments Moderation
    COMMENTS_MODERATION_CONTAINER: 'admin-comments-moderation-main-container',
    COMMENTS_FILTER_BAR: 'admin-comments-status-filter-bar',
    PENDING_COMMENTS_TAB: 'admin-pending-comments-tab-button',
    APPROVED_COMMENTS_TAB: 'admin-approved-comments-tab-button',
    SPAM_COMMENTS_TAB: 'admin-spam-comments-tab-button',
    COMMENTS_MODERATION_TABLE: 'admin-comments-moderation-data-table',
    COMMENT_APPROVE_BULK_BUTTON: 'admin-comments-bulk-approve-button',
    COMMENT_REJECT_BULK_BUTTON: 'admin-comments-bulk-reject-button',
    COMMENT_SPAM_BULK_BUTTON: 'admin-comments-bulk-spam-button',
    
    // Media Library
    MEDIA_LIBRARY_CONTAINER: 'admin-media-library-main-container',
    MEDIA_UPLOAD_DROPZONE: 'admin-media-file-upload-dropzone',
    MEDIA_FILES_GRID: 'admin-media-files-display-grid',
    MEDIA_FILE_ITEM: 'admin-media-file-item-{file-id}',
    MEDIA_FILE_PREVIEW: 'admin-media-file-preview-{file-id}',
    MEDIA_FILE_NAME: 'admin-media-file-name-{file-id}',
    MEDIA_FILE_SIZE: 'admin-media-file-size-{file-id}',
    MEDIA_FILE_ACTIONS: 'admin-media-file-actions-{file-id}',
    MEDIA_DELETE_BUTTON: 'admin-media-file-delete-{file-id}',
    MEDIA_EDIT_BUTTON: 'admin-media-file-edit-{file-id}',
    
    // Analytics Dashboard
    ANALYTICS_DASHBOARD_CONTAINER: 'admin-analytics-main-dashboard-container',
    ANALYTICS_DATE_RANGE_PICKER: 'admin-analytics-date-range-picker',
    PAGE_VIEWS_CHART: 'admin-analytics-page-views-chart',
    POPULAR_PAGES_TABLE: 'admin-analytics-popular-pages-table',
    TERMINAL_COMMANDS_CHART: 'admin-analytics-terminal-commands-usage-chart',
    TRAFFIC_SOURCES_CHART: 'admin-analytics-traffic-sources-pie-chart',
    USER_ENGAGEMENT_METRICS: 'admin-analytics-user-engagement-metrics',
    EXPORT_ANALYTICS_BUTTON: 'admin-analytics-export-data-button',
    
    // System Settings
    SETTINGS_CONTAINER: 'admin-system-settings-main-container',
    GENERAL_SETTINGS_TAB: 'admin-settings-general-configuration-tab',
    SEO_SETTINGS_TAB: 'admin-settings-seo-optimization-tab',
    SECURITY_SETTINGS_TAB: 'admin-settings-security-configuration-tab',
    BACKUP_SETTINGS_TAB: 'admin-settings-backup-management-tab',
    
    // File Upload Components
    FILE_UPLOAD_PROGRESS_BAR: 'admin-file-upload-progress-indicator',
    FILE_UPLOAD_SUCCESS_MESSAGE: 'admin-file-upload-success-notification',
    FILE_UPLOAD_ERROR_MESSAGE: 'admin-file-upload-error-notification',
    FILE_SIZE_VALIDATOR: 'admin-file-upload-size-validator',
    FILE_TYPE_VALIDATOR: 'admin-file-upload-type-validator'
};
```

**Admin Panel Features:**

#### 1. Dashboard Overview:
- **Statistics Cards**: Real-time metrics display
- **Recent Activity Feed**: Latest actions and changes
- **Quick Actions**: One-click access to common tasks
- **System Health Monitoring**: Server status and performance

#### 2. Portfolio Content Management:
- **Personal Information Editor**: Real-time preview updates
- **Project Management**: CRUD operations with image galleries
- **Skills Matrix Editor**: Drag-and-drop proficiency levels
- **Experience Timeline**: Visual timeline editor

#### 3. Blog Content Management:
- **Rich Text Editor**: WYSIWYG with markdown support
- **Media Library Integration**: Drag-and-drop image insertion
- **SEO Optimization Tools**: Meta tag management
- **Draft/Publish Workflow**: Scheduled publishing

#### 4. File Management System:
- **Multi-file Upload**: Drag-and-drop with progress indicators
- **Image Optimization**: Automatic compression and resizing
- **File Organization**: Folder structure and tagging
- **Security Validation**: File type and size restrictions

#### 5. Analytics & Insights:
- **Page View Tracking**: Real-time visitor analytics
- **Terminal Command Analytics**: Most used commands
- **Blog Performance**: Post views and engagement
- **Export Functionality**: CSV/PDF report generation# Enhanced Professional Single-User Portfolio Development Prompt for Cursor AI

Build a production-ready, server-side rendered personal portfolio web application following enterprise-level development standards and industry best practices.

## Tech Stack & Architecture
- **Backend**: Node.js with Express.js (MVC Pattern)
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React with Next.js (SSR/SSG)
- **File Upload**: Multer for image handling
- **Architecture**: Clean Architecture with Repository Pattern
- **Styling**: Tailwind CSS with dual theme system (light/dark)
- **Authentication**: JWT for admin-only access
- **Deployment**: Optimized for Vercel hosting
- **Testing**: Jest + Supertest (Backend), Jest + React Testing Library (Frontend)
- **Documentation**: JSDoc comments throughout codebase

## Professional Development Standards & Requirements

### 1. Code Quality & Standards
```javascript
/**
 * Enterprise-Level Code Documentation
 * Every function, class, and component must have JSDoc comments
 * @author Your Name
 * @version 1.0.0
 * @since 2025-07-25
 */
```

#### Naming Conventions (Strictly Enforce):
- **Variables**: `camelCase` (e.g., `userProfile`, `blogPostData`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)
- **Functions**: `camelCase` with verb prefix (e.g., `getUserProfile`, `validateEmailFormat`)
- **Classes**: `PascalCase` (e.g., `UserController`, `BlogRepository`)
- **Components**: `PascalCase` (e.g., `TerminalEmulator`, `BlogPostCard`)
- **Files**: `kebab-case` for utilities, `PascalCase` for components
- **Database Collections**: `PascalCase` singular (e.g., `User`, `BlogPost`)
- **API Routes**: `kebab-case` (e.g., `/api/blog-posts`, `/api/user-profile`)

#### Professional Code Structure:
```javascript
/**
 * File Header Template - Required for ALL files
 * @fileoverview Brief description of file purpose
 * @author Your Name <your.email@domain.com>
 * @created 2025-07-25
 * @lastModified 2025-07-25
 * @version 1.0.0
 */

/**
 * Function Documentation Template
 * @description Clear description of what the function does
 * @param {string} userId - The unique identifier for the user
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeDeleted - Whether to include deleted records
 * @returns {Promise<Object>} Promise resolving to user data
 * @throws {ValidationError} When userId is invalid
 * @example
 * const user = await getUserById('123', { includeDeleted: false });
 */
```

### 2. Global Error Handling System
```javascript
/**
 * Centralized Error Management
 * Custom error classes and global error handlers
 */

// Custom Error Classes (Required)
class ValidationError extends Error { }
class DatabaseError extends Error { }
class AuthenticationError extends Error { }
class AuthorizationError extends Error { }
class FileUploadError extends Error { }
class ExternalServiceError extends Error { }

// Global Error Handler Middleware
// Frontend Error Boundary Components
// Logging System with Winston
// Error Reporting Service Integration Ready
```

### 3. Status Code Management (Enum System)
```javascript
/**
 * HTTP Status Code Enums
 * Centralized status code management - NO HARDCODED STATUS CODES
 */
const HTTP_STATUS = {
    // Success Codes
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    
    // Client Error Codes
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    
    // Server Error Codes
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

// API Response Enums
const API_RESPONSE_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending',
    PROCESSING: 'processing'
};
```

### 4. Unique Component ID System
Every component, div, and interactive element must have a unique, descriptive ID following this pattern:

```javascript
/**
 * Component ID Naming Convention
 * Format: {section}-{component}-{element}-{modifier?}
 */

// Examples:
const COMPONENT_IDS = {
    // Landing Page
    LANDING_PAGE_CONTAINER: 'landing-page-container',
    LANDING_DEVELOPER_BUTTON: 'landing-developer-mode-btn',
    LANDING_VISITOR_BUTTON: 'landing-visitor-mode-btn',
    LANDING_BLOG_BUTTON: 'landing-blog-mode-btn',
    
    // Terminal Components
    TERMINAL_CONTAINER: 'terminal-emulator-container',
    TERMINAL_OUTPUT_AREA: 'terminal-output-display-area',
    TERMINAL_INPUT_FIELD: 'terminal-command-input-field',
    TERMINAL_COMMAND_SHORTCUTS: 'terminal-touch-shortcuts-bar',
    TERMINAL_HISTORY_PANEL: 'terminal-command-history-panel',
    
    // Portfolio Components
    PORTFOLIO_HERO_SECTION: 'portfolio-hero-section-container',
    PORTFOLIO_ABOUT_SECTION: 'portfolio-about-section-container',
    PORTFOLIO_PROJECTS_GRID: 'portfolio-projects-grid-container',
    PORTFOLIO_SKILLS_MATRIX: 'portfolio-skills-matrix-container',
    PORTFOLIO_RESUME_DOWNLOAD_BTN: 'portfolio-resume-download-button',
    
    // Blog Components
    BLOG_LIST_CONTAINER: 'blog-posts-list-container',
    BLOG_POST_CARD: 'blog-post-card-{slug}', // Dynamic ID pattern
    BLOG_SEARCH_INPUT: 'blog-search-input-field',
    BLOG_FILTER_DROPDOWN: 'blog-category-filter-dropdown',
    BLOG_COMMENT_FORM: 'blog-comment-submission-form',
    BLOG_COMMENT_LIST: 'blog-comments-display-list',
    
    // Admin Panel
    ADMIN_LOGIN_FORM: 'admin-authentication-login-form',
    ADMIN_DASHBOARD_SIDEBAR: 'admin-dashboard-navigation-sidebar',
    ADMIN_CONTENT_EDITOR: 'admin-content-rich-text-editor',
    ADMIN_FILE_UPLOAD_ZONE: 'admin-file-upload-drop-zone',
    ADMIN_ANALYTICS_CHART: 'admin-analytics-dashboard-chart',
    
    // Navigation & Layout
    MAIN_NAVIGATION_HEADER: 'main-navigation-header-container',
    THEME_TOGGLE_BUTTON: 'global-theme-toggle-button',
    MOBILE_MENU_TRIGGER: 'mobile-hamburger-menu-trigger',
    FOOTER_CONTAINER: 'site-footer-container',
    
    // Modals & Overlays
    MODAL_OVERLAY: 'modal-background-overlay',
    MODAL_CONTENT_CONTAINER: 'modal-content-container-{type}',
    LOADING_SPINNER: 'global-loading-spinner-overlay',
    
    // Form Elements
    CONTACT_FORM_CONTAINER: 'contact-form-submission-container',
    EMAIL_INPUT_FIELD: 'email-address-input-field',
    MESSAGE_TEXTAREA: 'contact-message-textarea-field',
    FORM_SUBMIT_BUTTON: 'form-submit-action-button',
    FORM_VALIDATION_ERROR: 'form-field-validation-error-{field}'
};
```

## Project Structure & Architecture

```
portfolio-app/
├── server/
│   ├── src/
│   │   ├── controllers/           # MVC Controllers
│   │   ├── services/              # Business Logic Layer
│   │   ├── repositories/          # Data Access Layer
│   │   ├── models/                # Database Models
│   │   ├── middleware/            # Custom Middleware
│   │   ├── routes/                # API Routes
│   │   ├── utils/                 # Utility Functions
│   │   ├── config/                # Configuration Files
│   │   ├── constants/             # Enums and Constants
│   │   │   ├── http-status.js     # HTTP Status Codes
│   │   │   ├── api-response.js    # API Response Types
│   │   │   ├── error-codes.js     # Custom Error Codes
│   │   │   └── component-ids.js   # UI Component IDs
│   │   ├── errors/                # Custom Error Classes
│   │   └── app.js                 # Express App Setup
│   └── server.js                  # Entry Point
├── client/
│   ├── src/
│   │   ├── components/            # UI Components
│   │   │   ├── common/            # Shared Components
│   │   │   ├── features/          # Feature Components
│   │   │   └── ui/                # Design System
│   │   ├── pages/                 # Next.js Pages
│   │   ├── hooks/                 # Custom React Hooks
│   │   ├── context/               # React Context
│   │   ├── services/              # API Services
│   │   ├── utils/                 # Frontend Utilities
│   │   ├── constants/             # Frontend Constants
│   │   │   ├── component-ids.js   # Component ID Constants
│   │   │   ├── api-endpoints.js   # API Endpoint Constants
│   │   │   └── theme-config.js    # Theme Configuration
│   │   └── styles/                # Global Styles
│   └── public/                    # Static Assets
├── shared/                        # Shared Constants
├── docs/                          # Documentation
│   ├── API.md                     # API Documentation
│   ├── COMPONENTS.md              # Component Library
│   ├── DEPLOYMENT.md              # Deployment Guide
│   └── DEVELOPMENT.md             # Development Workflow
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Core User-Facing Features & Components

### 1. Landing Page Gateway - Three-Way Navigation Hub
```javascript
/**
 * Landing Page Component - ID: landing-page-main-container
 * Professional gateway with user preference tracking
 */
const LANDING_PAGE_IDS = {
    MAIN_CONTAINER: 'landing-page-main-container',
    HERO_TITLE: 'landing-page-hero-title-heading',
    SUBTITLE_DESCRIPTION: 'landing-page-professional-subtitle',
    MODE_SELECTION_GRID: 'landing-page-mode-selection-grid',
    
    // Developer Mode Card
    DEVELOPER_CARD: 'landing-developer-mode-card-container',
    DEVELOPER_ICON: 'landing-developer-mode-terminal-icon',
    DEVELOPER_TITLE: 'landing-developer-mode-card-title',
    DEVELOPER_DESCRIPTION: 'landing-developer-mode-card-description',
    DEVELOPER_CTA_BUTTON: 'landing-developer-mode-cta-button',
    
    // Visitor Mode Card  
    VISITOR_CARD: 'landing-visitor-mode-card-container',
    VISITOR_ICON: 'landing-visitor-mode-portfolio-icon',
    VISITOR_TITLE: 'landing-visitor-mode-card-title',
    VISITOR_DESCRIPTION: 'landing-visitor-mode-card-description',
    VISITOR_CTA_BUTTON: 'landing-visitor-mode-cta-button',
    
    // Blog Mode Card
    BLOG_CARD: 'landing-blog-mode-card-container',
    BLOG_ICON: 'landing-blog-mode-articles-icon',
    BLOG_TITLE: 'landing-blog-mode-card-title',
    BLOG_DESCRIPTION: 'landing-blog-mode-card-description',
    BLOG_CTA_BUTTON: 'landing-blog-mode-cta-button',
    
    // Footer Elements
    PREFERENCE_TRACKER: 'landing-page-user-preference-tracker',
    ANALYTICS_TRACKER: 'landing-page-analytics-tracker',
    THEME_PREVIEW: 'landing-page-theme-preview-indicator'
};
```

**Landing Page Features:**
- **Hero Section**: Professional introduction with animated text
- **Three Mode Cards**: Interactive cards with hover effects and descriptions
- **User Preference Memory**: Remembers last selected mode
- **Analytics Tracking**: Track which mode users prefer
- **Smooth Transitions**: Animated transitions to selected modes
- **Responsive Design**: Mobile-first responsive layout
- **SEO Optimized**: Meta tags and structured data

### 2. Developer Mode - Professional Terminal Interface (Dark Theme)
```javascript
/**
 * Terminal System Component IDs - ID: terminal-emulator-main-container
 * Feature-rich command-line interface with mobile optimization
 */
const TERMINAL_IDS = {
    // Main Terminal Container
    MAIN_CONTAINER: 'terminal-emulator-main-container',
    TERMINAL_WRAPPER: 'terminal-screen-wrapper-container',
    TERMINAL_HEADER: 'terminal-window-header-bar',
    TERMINAL_CONTROLS: 'terminal-window-control-buttons',
    
    // Display & Output
    SCREEN_DISPLAY: 'terminal-screen-output-display',
    OUTPUT_HISTORY: 'terminal-command-output-history',
    CURRENT_LINE: 'terminal-current-command-line',
    CURSOR_ELEMENT: 'terminal-blinking-cursor-element',
    COMMAND_PROMPT: 'terminal-command-prompt-prefix',
    
    // Input System
    INPUT_FIELD: 'terminal-hidden-input-field',
    INPUT_DISPLAY: 'terminal-visible-input-display',
    AUTOCOMPLETE_DROPDOWN: 'terminal-command-autocomplete-dropdown',
    
    // Touch-Friendly Features
    SHORTCUTS_TOOLBAR: 'terminal-touch-shortcuts-toolbar',
    COMMAND_SUGGESTIONS: 'terminal-command-suggestions-panel',
    VIRTUAL_KEYBOARD: 'terminal-virtual-keyboard-container',
    SWIPE_GESTURE_AREA: 'terminal-swipe-gesture-detection-area',
    
    // Command Features
    HELP_PANEL: 'terminal-help-commands-reference-panel',
    HISTORY_PANEL: 'terminal-command-history-sidebar',
    FAVORITES_BAR: 'terminal-favorite-commands-quickbar',
    
    // Theme & Customization
    THEME_SELECTOR: 'terminal-color-theme-selector-dropdown',
    FONT_SIZE_CONTROLS: 'terminal-font-size-adjustment-controls',
    
    // Special Effects
    MATRIX_ANIMATION: 'terminal-matrix-rain-animation-overlay',
    TYPING_ANIMATION: 'terminal-realistic-typing-animation',
    LOADING_SPINNER: 'terminal-command-loading-spinner'
};
```

**Developer Mode - Terminal Commands & Features:**

#### Core Portfolio Commands:
```bash
# Personal & Professional Information
about           # Personal story, background, and professional journey
projects        # Interactive project showcase with filtering options
skills          # Technical skills matrix with proficiency levels
experience      # Professional work history with achievements
contact         # Contact information with social media links
education       # Academic background and qualifications  
certifications  # Professional certifications with badge display
leadership      # Leadership roles and community contributions
resume          # Download resume with format options (PDF/HTML)

# Interactive & Utility Commands
help            # Comprehensive command reference with examples
whoami          # Display developer profile and system information
clear           # Animated terminal clear with welcome message
history         # Command history with search and replay functionality
uptime          # Session duration and system statistics
```

#### Fun & Engaging Commands:
```bash
# Entertainment Commands
weather         # Current weather with ASCII art display
quote           # Inspirational programming quotes database
joke            # Programming jokes and developer humor
coffee          # ASCII coffee art with developer facts
matrix          # Matrix digital rain animation effect
hack            # Simulated "hacking" sequence animation
date            # Current date/time with timezone information
fortune         # Random fortune cookies for developers

# Developer-Specific Commands
github          # GitHub profile stats and recent activity
social          # Social media links with ASCII art
stack           # Technology stack visualization
stats           # Portfolio statistics and metrics
changelog       # Recent updates and portfolio version history
easter-egg      # Hidden surprise commands for exploration
```

#### Mode Switching Commands:
```bash
visitor         # Switch to visitor portfolio mode
blog           # Navigate to blog section
admin          # Admin login prompt (password protected)
theme          # Toggle between terminal color schemes
settings       # Terminal customization options
```

**Terminal Interface Features:**

1. **Realistic Terminal Experience**:
   - Authentic terminal styling with customizable themes (Green Matrix, Amber, Blue, etc.)
   - Realistic typing animations with configurable speed
   - Blinking cursor with customizable blink rate
   - Command history navigation (up/down arrows)
   - Tab completion for commands and arguments

2. **Touch-Friendly Mobile Optimization**:
   ```javascript
   const MOBILE_TERMINAL_IDS = {
       TOUCH_SHORTCUTS_BAR: 'terminal-mobile-shortcuts-bar',
       COMMON_COMMANDS_GRID: 'terminal-common-commands-grid',
       SWIPE_HISTORY_AREA: 'terminal-swipe-history-navigation',
       VIRTUAL_KEYBOARD_TOGGLE: 'terminal-virtual-keyboard-toggle',
       COMMAND_AUTOCOMPLETE_TOUCH: 'terminal-touch-autocomplete-panel'
   };
   ```
   - **Command Shortcuts Bar**: Quick-access buttons for common commands
   - **Swipe Gestures**: Left/right swipe for command history navigation
   - **Touch-Friendly Autocomplete**: Large touch targets for command completion
   - **Virtual Keyboard**: Custom keyboard with command suggestions
   - **Pinch to Zoom**: Font size adjustment via pinch gestures

3. **Advanced Terminal Features**:
   - **Command Aliases**: Shortcut commands (e.g., 'p' for projects, 'h' for help)
   - **Command Chaining**: Support for multiple commands (e.g., 'clear && about')
   - **Output Formatting**: Colored output with syntax highlighting
   - **Progress Indicators**: Loading animations for commands that fetch data
   - **Error Handling**: Helpful error messages with command suggestions

4. **Terminal Customization**:
   ```javascript
   const TERMINAL_THEMES = {
       CLASSIC_GREEN: 'terminal-theme-classic-green',
       AMBER_MONOCHROME: 'terminal-theme-amber-retro',
       BLUE_TERMINAL: 'terminal-theme-blue-modern',
       PURPLE_HACKER: 'terminal-theme-purple-hacker',
       CUSTOM_RGB: 'terminal-theme-custom-colors'
   };
   ```

### 3. Visitor Mode - Professional Portfolio Interface (Light Theme)
```javascript
/**
 * Portfolio Component IDs - ID: portfolio-main-container
 * Clean, professional light-themed portfolio showcase
 */
const PORTFOLIO_IDS = {
    // Main Layout
    MAIN_CONTAINER: 'portfolio-main-container',
    NAVIGATION_HEADER: 'portfolio-navigation-header-bar',
    SCROLL_PROGRESS: 'portfolio-reading-progress-indicator',
    BACK_TO_TOP: 'portfolio-back-to-top-button',
    
    // Hero Section
    HERO_SECTION: 'portfolio-hero-main-section',
    HERO_BACKGROUND: 'portfolio-hero-background-container',
    PROFILE_IMAGE_CONTAINER: 'portfolio-profile-image-container',
    PROFESSIONAL_HEADSHOT: 'portfolio-professional-headshot-image',
    PROFILE_IMAGE_OVERLAY: 'portfolio-profile-hover-overlay',
    
    HERO_CONTENT: 'portfolio-hero-content-wrapper',
    NAME_HEADING: 'portfolio-professional-name-heading',
    TITLE_SUBHEADING: 'portfolio-job-title-subheading',
    TYPING_ANIMATION: 'portfolio-dynamic-typing-animation',
    HERO_DESCRIPTION: 'portfolio-hero-description-text',
    
    // Call-to-Action Buttons
    CTA_BUTTONS_CONTAINER: 'portfolio-cta-buttons-container',
    RESUME_DOWNLOAD_BTN: 'portfolio-resume-download-primary-button',
    CONTACT_ME_BTN: 'portfolio-contact-me-secondary-button',
    PROJECTS_SHOWCASE_BTN: 'portfolio-view-projects-button',
    
    // Social Media Links
    SOCIAL_MEDIA_BAR: 'portfolio-social-media-links-bar',
    GITHUB_LINK: 'portfolio-github-profile-link',
    LINKEDIN_LINK: 'portfolio-linkedin-profile-link',
    TWITTER_LINK: 'portfolio-twitter-profile-link',
    EMAIL_LINK: 'portfolio-email-contact-link',
    
    // About Me Section
    ABOUT_SECTION: 'portfolio-about-me-main-section',
    ABOUT_CONTAINER: 'portfolio-about-content-container',
    ABOUT_IMAGE: 'portfolio-about-secondary-image',
    ABOUT_TEXT_CONTENT: 'portfolio-about-text-content',
    PERSONAL_INTERESTS: 'portfolio-personal-interests-grid',
    VALUES_SHOWCASE: 'portfolio-core-values-showcase',
    CAREER_HIGHLIGHTS: 'portfolio-career-highlights-timeline',
    
    // Projects Section
    PROJECTS_SECTION: 'portfolio-projects-showcase-section',
    PROJECTS_HEADER: 'portfolio-projects-section-header',
    PROJECTS_FILTER_BAR: 'portfolio-projects-technology-filter',
    PROJECTS_GRID: 'portfolio-featured-projects-grid',
    PROJECT_CARD: 'portfolio-project-card-{project-id}', // Dynamic ID
    PROJECT_IMAGE: 'portfolio-project-image-{project-id}',
    PROJECT_OVERLAY: 'portfolio-project-hover-overlay-{project-id}',
    PROJECT_TITLE: 'portfolio-project-title-{project-id}',
    PROJECT_DESCRIPTION: 'portfolio-project-description-{project-id}',
    PROJECT_TECH_STACK: 'portfolio-project-tech-badges-{project-id}',
    PROJECT_LINKS: 'portfolio-project-action-links-{project-id}',
    VIEW_ALL_PROJECTS: 'portfolio-view-all-projects-button',
    
    // Skills Section
    SKILLS_SECTION: 'portfolio-technical-skills-main-section',
    SKILLS_HEADER: 'portfolio-skills-section-header',
    SKILLS_MATRIX_CONTAINER: 'portfolio-skills-matrix-container',
    FRONTEND_SKILLS: 'portfolio-frontend-skills-category',
    BACKEND_SKILLS: 'portfolio-backend-skills-category',
    DATABASE_SKILLS: 'portfolio-database-skills-category',
    DEVOPS_SKILLS: 'portfolio-devops-skills-category',
    TOOLS_SKILLS: 'portfolio-tools-skills-category',
    SKILL_ITEM: 'portfolio-skill-item-{skill-name}',
    SKILL_PROFICIENCY: 'portfolio-skill-proficiency-bar-{skill-name}',
    SKILL_ICON: 'portfolio-skill-technology-icon-{skill-name}',
    
    // Experience Section
    EXPERIENCE_SECTION: 'portfolio-work-experience-main-section',
    EXPERIENCE_TIMELINE: 'portfolio-experience-timeline-container',
    EXPERIENCE_ITEM: 'portfolio-experience-item-{company-id}',
    COMPANY_LOGO: 'portfolio-company-logo-{company-id}',
    JOB_TITLE: 'portfolio-job-position-title-{company-id}',
    COMPANY_NAME: 'portfolio-company-name-{company-id}',
    EMPLOYMENT_DURATION: 'portfolio-employment-dates-{company-id}',
    JOB_DESCRIPTION: 'portfolio-job-description-{company-id}',
    KEY_ACHIEVEMENTS: 'portfolio-key-achievements-list-{company-id}',
    TECHNOLOGIES_USED: 'portfolio-technologies-used-{company-id}',
    
    // Education & Certifications
    EDUCATION_SECTION: 'portfolio-education-background-section',
    EDUCATION_GRID: 'portfolio-education-institutions-grid',
    EDUCATION_ITEM: 'portfolio-education-item-{institution-id}',
    INSTITUTION_LOGO: 'portfolio-institution-logo-{institution-id}',
    DEGREE_TITLE: 'portfolio-degree-title-{institution-id}',
    INSTITUTION_NAME: 'portfolio-institution-name-{institution-id}',
    GRADUATION_YEAR: 'portfolio-graduation-year-{institution-id}',
    
    CERTIFICATIONS_SECTION: 'portfolio-professional-certifications-section',
    CERTIFICATIONS_GRID: 'portfolio-certifications-display-grid',
    CERTIFICATION_BADGE: 'portfolio-certification-badge-{cert-id}',
    CERTIFICATION_NAME: 'portfolio-certification-name-{cert-id}',
    CERTIFICATION_ISSUER: 'portfolio-certification-issuer-{cert-id}',
    CERTIFICATION_DATE: 'portfolio-certification-date-{cert-id}',
    CERTIFICATION_VERIFY: 'portfolio-certification-verify-link-{cert-id}',
    
    // Leadership Section
    LEADERSHIP_SECTION: 'portfolio-leadership-community-section',
    LEADERSHIP_GRID: 'portfolio-leadership-roles-grid',
    LEADERSHIP_ROLE: 'portfolio-leadership-role-{role-id}',
    LEADERSHIP_TITLE: 'portfolio-leadership-position-{role-id}',
    LEADERSHIP_ORGANIZATION: 'portfolio-leadership-org-{role-id}',
    LEADERSHIP_ACHIEVEMENTS: 'portfolio-leadership-achievements-{role-id}',
    
    // Contact Section
    CONTACT_SECTION: 'portfolio-contact-information-section',
    CONTACT_FORM: 'portfolio-contact-form-container',
    CONTACT_INFO_CARD: 'portfolio-contact-details-card',
    LOCATION_INFO: 'portfolio-location-information',
    AVAILABILITY_STATUS: 'portfolio-availability-status-indicator',
    
    // Footer
    FOOTER_CONTAINER: 'portfolio-site-footer-container',
    FOOTER_SOCIAL_LINKS: 'portfolio-footer-social-media-links',
    COPYRIGHT_TEXT: 'portfolio-copyright-information',
    LAST_UPDATED: 'portfolio-last-updated-timestamp'
};
```

**Visitor Mode - Portfolio Features:**

#### 1. Hero Section Features:
- **Professional Headshot**: High-quality profile image with hover effects
- **Dynamic Typing Animation**: Multiple role titles with typewriter effect
- **Social Media Integration**: Direct links to professional profiles
- **Resume Download**: Prominent CTA with download tracking
- **Availability Indicator**: Current availability status for opportunities

#### 2. Interactive Project Showcase:
```javascript
const PROJECT_FEATURES = {
    FILTERING_SYSTEM: 'portfolio-projects-filter-by-technology',
    HOVER_EFFECTS: 'portfolio-project-card-hover-animations',
    LIVE_DEMO_LINKS: 'portfolio-project-live-demo-buttons',
    SOURCE_CODE_LINKS: 'portfolio-project-github-repository-links',
    TECHNOLOGY_BADGES: 'portfolio-project-tech-stack-badges',
    PROJECT_GALLERY: 'portfolio-project-image-gallery-modal'
};
```
- **Technology Filtering**: Filter projects by tech stack (React, Node.js, etc.)
- **Interactive Cards**: Hover effects revealing project details
- **Live Demo Links**: Direct links to deployed applications
- **Source Code Access**: GitHub repository links
- **Image Galleries**: Modal galleries for project screenshots

#### 3. Skills Matrix System:
```javascript
const SKILLS_FEATURES = {
    PROFICIENCY_BARS: 'portfolio-animated-skill-proficiency-indicators',
    TECHNOLOGY_ICONS: 'portfolio-technology-logo-icons',
    SKILL_CATEGORIES: 'portfolio-skills-organized-by-category',
    INTERACTIVE_TOOLTIPS: 'portfolio-skill-detail-hover-tooltips',
    ENDORSEMENTS: 'portfolio-skill-endorsements-counter'
};
```
- **Animated Proficiency Bars**: Visual skill level indicators
- **Technology Icons**: Official logos for each technology
- **Category Organization**: Skills grouped by type (Frontend, Backend, etc.)
- **Interactive Tooltips**: Detailed information on hover
- **Years of Experience**: Experience timeline for each skill

#### 4. Professional Timeline:
- **Work Experience**: Chronological employment history
- **Company Logos**: Official company branding
- **Key Achievements**: Quantified accomplishments
- **Technology Stack**: Technologies used in each role
- **Duration Indicators**: Employment periods with visual timeline

### 4. Blog System Component IDs
```javascript
/**
 * Blog System Component IDs
 * SEO-optimized blogging platform
 */
const BLOG_IDS = {
    LIST_CONTAINER: 'blog-posts-listing-main-container',
    SEARCH_BAR: 'blog-content-search-input-bar',
    FILTER_SIDEBAR: 'blog-category-filter-sidebar',
    POST_CARD: 'blog-post-preview-card-{slug}',
    PAGINATION: 'blog-posts-pagination-navigation',
    FEATURED_POST: 'blog-featured-post-highlight-card',
    POST_CONTENT: 'blog-post-main-content-area',
    COMMENT_SECTION: 'blog-post-comments-section',
    COMMENT_FORM: 'blog-new-comment-submission-form',
    SOCIAL_SHARE: 'blog-post-social-sharing-buttons'
};
```

### 5. Admin Panel Component IDs
```javascript
/**
 * Admin Panel Component IDs
 * Comprehensive management interface
 */
const ADMIN_IDS = {
    LOGIN_CONTAINER: 'admin-authentication-login-container',
    DASHBOARD_LAYOUT: 'admin-main-dashboard-layout',
    SIDEBAR_NAV: 'admin-navigation-sidebar-menu',
    CONTENT_AREA: 'admin-main-content-management-area',
    RICH_EDITOR: 'admin-wysiwyg-content-editor',
    FILE_UPLOADER: 'admin-file-upload-management-zone',
    ANALYTICS_PANEL: 'admin-site-analytics-dashboard-panel',
    USER_PROFILE: 'admin-user-profile-settings-panel'
};
```

## Development Workflow & AI Agent Instructions

### Phase 1: Project Initialization (Days 1-2)
1. **Repository Setup**
   - Initialize Git repository with professional .gitignore
   - Set up package.json with all dependencies
   - Create environment configuration files
   - Set up ESLint, Prettier, and Husky pre-commit hooks

2. **Project Structure Creation**
   - Create complete folder structure
   - Set up constants files (HTTP status, component IDs, etc.)
   - Initialize custom error classes
   - Create base configuration files

### Phase 2: Backend Development (Days 3-7)
1. **Database & Models**
   - MongoDB connection setup
   - Create all Mongoose schemas with proper validation
   - Set up database indexes and constraints

2. **Core Backend Architecture**
   - Implement Repository Pattern base classes
   - Create Service Layer with business logic
   - Build Controller Layer with proper error handling
   - Set up middleware (auth, validation, file upload)

3. **API Development**
   - Create all REST API endpoints
   - Implement JWT authentication system
   - Set up Multer file upload functionality
   - Add comprehensive input validation

### Phase 3: Frontend Development (Days 8-14)
1. **Next.js Setup & Configuration**
   - Configure Next.js with Tailwind CSS
   - Set up theme system (light/dark)
   - Create global components and layouts

2. **Core Components Development**
   - Landing page with three-way navigation
   - Terminal emulator with all commands
   - Portfolio interface with all sections
   - Blog system with comment functionality

3. **Admin Panel Development**
   - Authentication system
   - Content management interfaces
   - File upload management
   - Analytics dashboard

### Phase 4: Integration & Testing (Days 15-18)
1. **API Integration**
   - Connect frontend to backend APIs
   - Implement error handling and loading states
   - Add form validation and user feedback

2. **Testing Implementation**
   - Unit tests for utilities and helpers
   - Integration tests for API endpoints
   - Component tests for React components
   - End-to-end testing scenarios

### Phase 5: Optimization & Deployment (Days 19-21)
1. **Performance Optimization**
   - Image optimization and lazy loading
   - Code splitting and bundle optimization
   - SEO implementation and meta tags

2. **Vercel Deployment**
   - Environment variable configuration
   - Build optimization for serverless functions
   - CDN and static asset optimization

## AI Agent Communication Guidelines

When communicating with the AI agent for development:

1. **Use Specific Component IDs**: Always reference components by their unique IDs
   ```
   "Please update the terminal-command-input-field component to include autocomplete"
   "Add validation to the admin-authentication-login-form"
   ```

2. **Reference Exact File Paths**: Use the established project structure
   ```
   "Update the server/src/constants/http-status.js file"
   "Modify the client/src/components/features/Terminal/TerminalEmulator.js"
   ```

3. **Follow Naming Conventions**: Always use the established naming patterns
   ```
   "Create a new function called validateEmailFormat"
   "Add a constant TERMINAL_COMMAND_HISTORY_LIMIT"
   ```

4. **Error Handling References**: Use the custom error classes
   ```
   "Throw a ValidationError when email format is invalid"
   "Handle DatabaseError in the user repository"
   ```

## Repository Structure for AI Agent Reference

Create a `docs/AI-AGENT-REFERENCE.md` file containing:

```markdown
# AI Agent Development Reference

## Component ID Quick Reference
[Complete list of all component IDs organized by feature]

## File Structure Map
[Detailed file structure with descriptions]

## Function Naming Patterns
[Examples of proper function naming]

## Error Handling Patterns
[Examples of proper error handling]

## API Endpoint Patterns
[Standard API endpoint structures]

## Database Query Patterns
[Standard database operation examples]
```

## README.md Structure

```markdown
# Professional Portfolio Application

## Overview
Enterprise-level personal portfolio with terminal interface, blog system, and admin panel.

## Tech Stack
- Backend: Node.js, Express.js, MongoDB
- Frontend: React, Next.js, Tailwind CSS
- File Upload: Multer
- Authentication: JWT

## Quick Start
[Installation and setup instructions]

## Project Structure
[Detailed folder structure explanation]

## Development Guidelines
[Coding standards and conventions]

## API Documentation
[API endpoint documentation]

## Deployment
[Vercel deployment instructions]

## Component Library
[List of all components with IDs]

## Contributing
[Development workflow and standards]
```

## Critical Requirements Summary

1. **JSDoc Comments**: Every function, class, and component
2. **Unique Component IDs**: Every interactive element must have a descriptive ID
3. **No Hardcoded Status Codes**: Use HTTP_STATUS enum exclusively
4. **Global Error Handling**: Custom error classes and centralized handling
5. **Strict Naming Conventions**: Consistent across entire codebase
6. **Professional File Headers**: Author, version, and description in every file
7. **Repository Documentation**: Comprehensive docs for AI agent reference
8. **Development Phases**: Clear workflow for systematic development
9. **Testing Coverage**: Unit, integration, and E2E tests
10. **Vercel Optimization**: Production-ready deployment configuration

The AI agent should develop this project systematically, following the established conventions and using the unique component IDs for all UI elements. Every piece of code should be production-ready with proper documentation and error handling.