/**
 * @fileoverview UI Component ID Constants
 * @author Professional Developer <dev@portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/**
 * Landing Page Component IDs
 * @constant {Object} LANDING_PAGE_IDS
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

/**
 * Terminal System Component IDs
 * @constant {Object} TERMINAL_IDS
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

/**
 * Portfolio Component IDs
 * @constant {Object} PORTFOLIO_IDS
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

/**
 * Blog System Component IDs
 * @constant {Object} BLOG_IDS
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
    
    // Individual Blog Post Page
    POST_MAIN_CONTAINER: 'blog-post-main-content-container',
    POST_HEADER_SECTION: 'blog-post-header-section-container',
    POST_HERO_IMAGE: 'blog-post-hero-featured-image',
    POST_TITLE_HEADING: 'blog-post-main-title-heading',
    POST_CONTENT_AREA: 'blog-post-main-content-article',
    
    // Comments System
    COMMENTS_MAIN_SECTION: 'blog-post-comments-main-section',
    COMMENTS_HEADER: 'blog-comments-section-header',
    COMMENTS_COUNT: 'blog-comments-total-count-display',
    COMMENTS_LIST: 'blog-comments-display-list-container',
    COMMENT_FORM_SECTION: 'blog-new-comment-form-section',
    COMMENT_FORM_CONTAINER: 'blog-comment-submission-form-container'
};

/**
 * Admin Panel Component IDs
 * @constant {Object} ADMIN_IDS
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
    NAV_SETTINGS_LINK: 'admin-nav-system-settings-link'
};

module.exports = {
    LANDING_PAGE_IDS,
    TERMINAL_IDS,
    PORTFOLIO_IDS,
    BLOG_IDS,
    ADMIN_IDS
};