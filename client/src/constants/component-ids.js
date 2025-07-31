/**
 * @fileoverview Frontend Component ID Constants
 * @author jasilmeledath@gmail.com <jasil.portfolio.com>
 * @created 2025-01-27
 * @lastModified 2025-01-27
 * @version 1.0.0
 */

/**
 * Landing Page Component IDs
 * @constant {Object} LANDING_PAGE_IDS
 */
export const LANDING_PAGE_IDS = {
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
export const TERMINAL_IDS = {
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
export const PORTFOLIO_IDS = {
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
    
    // Projects Section
    PROJECTS_SECTION: 'portfolio-projects-showcase-section',
    PROJECTS_GRID: 'portfolio-featured-projects-grid',
    PROJECT_CARD: 'portfolio-project-card-{project-id}', // Dynamic ID
    
    // Skills Section
    SKILLS_SECTION: 'portfolio-technical-skills-main-section',
    SKILLS_MATRIX_CONTAINER: 'portfolio-skills-matrix-container',
    
    // Contact Section
    CONTACT_SECTION: 'portfolio-contact-information-section',
    CONTACT_FORM: 'portfolio-contact-form-container'
};

/**
 * Blog System Component IDs
 * @constant {Object} BLOG_IDS
 */
export const BLOG_IDS = {
    // Main Blog Layout
    MAIN_CONTAINER: 'blog-platform-main-container',
    BLOG_HEADER: 'blog-platform-header-navigation',
    
    // Blog List Page
    BLOG_LIST_CONTAINER: 'blog-posts-listing-main-container',
    BLOG_SEARCH_BAR: 'blog-content-search-input-field',
    POSTS_GRID: 'blog-posts-display-grid-container',
    POST_CARD: 'blog-post-preview-card-{post-slug}', // Dynamic ID
    
    // Individual Blog Post
    POST_MAIN_CONTAINER: 'blog-post-main-content-container',
    POST_CONTENT_AREA: 'blog-post-main-content-article',
    
    // Comments System
    COMMENTS_MAIN_SECTION: 'blog-post-comments-main-section',
    COMMENT_FORM_SECTION: 'blog-new-comment-form-section'
};

/**
 * Admin Panel Component IDs
 * @constant {Object} ADMIN_IDS
 */
export const ADMIN_IDS = {
    // Authentication
    LOGIN_PAGE_CONTAINER: 'admin-authentication-login-page-container',
    LOGIN_FORM_WRAPPER: 'admin-login-form-wrapper-container',
    EMAIL_INPUT_FIELD: 'admin-login-email-input-field',
    PASSWORD_INPUT_FIELD: 'admin-login-password-input-field',
    LOGIN_SUBMIT_BUTTON: 'admin-login-submit-authentication-button',
    
    // Dashboard
    DASHBOARD_MAIN_CONTAINER: 'admin-main-dashboard-layout-container',
    SIDEBAR_NAVIGATION: 'admin-dashboard-sidebar-navigation-menu'
};

/**
 * Common UI Component IDs
 * @constant {Object} COMMON_IDS
 */
export const COMMON_IDS = {
    // Navigation & Layout
    MAIN_NAVIGATION_HEADER: 'main-navigation-header-container',
    THEME_TOGGLE_BUTTON: 'global-theme-toggle-button',
    MOBILE_MENU_TRIGGER: 'mobile-hamburger-menu-trigger',
    FOOTER_CONTAINER: 'site-footer-container',
    
    // Modals & Overlays
    MODAL_OVERLAY: 'modal-background-overlay',
    LOADING_SPINNER: 'global-loading-spinner-overlay',
    
    // Form Elements
    FORM_SUBMIT_BUTTON: 'form-submit-action-button',
    EMAIL_INPUT_FIELD: 'email-address-input-field',
    MESSAGE_TEXTAREA: 'contact-message-textarea-field'
};