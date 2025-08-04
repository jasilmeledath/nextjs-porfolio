# 📖 Portfolio Project Documentation

## 🌟 Project Overview

**Jasil Meledath's Professional Portfolio** is a full-stack web application built with modern technologies, featuring a sleek Next.js frontend and robust Express.js backend. The project showcases professional work, includes a comprehensive blog system, and provides an admin panel for content management.

### 🎯 Purpose
- Professional portfolio showcase
- Technical blog platform
- Content management system
- Interactive terminal experience
- Responsive mobile-first design

### 🌐 Live URLs
- **Production**: [https://jasilmeledath.dev](https://jasilmeledath.dev)
- **API**: [https://api.jasilmeledath.dev](https://api.jasilmeledath.dev)

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14.2.30
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS 3.3.5
- **Animations**: Framer Motion 10.18.0
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React, React Icons
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Backend (Server)
- **Framework**: Express.js 4.18.2
- **Language**: JavaScript (Node.js 18+)
- **Database**: MongoDB with Mongoose 7.5.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer 1.4.5
- **Email**: Nodemailer 6.10.1
- **Validation**: Joi 17.9.2
- **Testing**: Jest + Supertest

### Database
- **Primary**: MongoDB (Atlas for production)
- **ORM**: Mongoose
- **Features**: Indexing, validation, relationships

### Hosting & Deployment
- **Client**: Vercel (recommended) / Netlify / Cloudflare Pages
- **Server**: Railway (recommended) / Render / Heroku
- **Database**: MongoDB Atlas
- **Domain**: Namecheap DNS
- **SSL**: Automatic (Vercel/Railway)

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint
- **Process Management**: PM2 (VPS deployment)
- **Containerization**: Docker + Docker Compose

---

## 📂 Project Structure

```
Nextjs Portfolio/
├── 📁 client/                    # Next.js Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # React components
│   │   │   ├── 📁 admin/         # Admin panel components
│   │   │   ├── 📁 blog/          # Blog-related components
│   │   │   ├── 📁 common/        # Shared components
│   │   │   └── 📁 ui/            # UI components
│   │   ├── 📁 constants/         # Constants and IDs
│   │   ├── 📁 context/           # React contexts
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   ├── 📁 pages/             # Next.js pages
│   │   │   ├── 📁 admin/         # Admin panel pages
│   │   │   ├── 📁 api/           # API routes (proxy)
│   │   │   ├── 📁 blog/          # Blog pages
│   │   │   ├── 📄 index.js       # Landing page
│   │   │   ├── 📄 portfolio.js   # Portfolio page
│   │   │   └── 📄 terminal.js    # Terminal page
│   │   ├── 📁 services/          # API services
│   │   ├── 📁 styles/            # Global styles
│   │   └── 📁 utils/             # Utility functions
│   ├── 📁 public/                # Static assets
│   ├── 📄 next.config.js         # Next.js configuration
│   ├── 📄 tailwind.config.js     # Tailwind configuration
│   └── 📄 package.json           # Dependencies
│
├── 📁 server/                    # Express.js Backend
│   ├── 📁 src/
│   │   ├── 📁 config/            # Configuration files
│   │   ├── 📁 constants/         # Constants and enums
│   │   ├── 📁 controllers/       # Route controllers
│   │   ├── 📁 middleware/        # Express middleware
│   │   ├── 📁 models/            # Mongoose models
│   │   ├── 📁 routes/            # Express routes
│   │   ├── 📁 services/          # Business logic
│   │   ├── 📁 utils/             # Utility functions
│   │   └── 📄 app.js             # Express app setup
│   ├── 📁 uploads/               # File uploads
│   │   ├── 📁 avatars/           # Profile images
│   │   ├── 📁 projects/          # Project images
│   │   └── 📁 resumes/           # Resume files
│   ├── 📄 server.js              # Server entry point
│   ├── 📄 healthcheck.js         # Health check script
│   └── 📄 package.json           # Dependencies
│
├── 📁 scripts/                   # Deployment scripts
│   ├── 📄 build-production.js    # Production build
│   ├── 📄 cleanup-console-logs.js # Console log cleanup
│   ├── 📄 deploy-vercel.sh       # Vercel deployment
│   ├── 📄 deploy-railway.sh      # Railway deployment
│   └── 📄 setup-production.js    # Production setup
│
├── 📁 .zencoder/                 # AI assistant configuration
├── 📄 .env.production            # Production environment
├── 📄 .env.example               # Environment template
├── 📄 package.json               # Root package.json
├── 📄 ecosystem.config.js        # PM2 configuration
├── 📄 docker-compose.yml         # Docker setup
├── 📄 Dockerfile                 # Docker image
├── 📄 vercel.json               # Vercel configuration
├── 📄 netlify.toml              # Netlify configuration
├── 📄 render.yaml               # Render configuration
├── 📄 DEPLOYMENT_GUIDE.md       # Deployment instructions
└── 📄 PROJECT_DOCUMENTATION.md  # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- MongoDB (local or Atlas)
- Git

### Development Setup

1. **Clone Repository**:
   ```bash
   git clone [repository-url]
   cd "Nextjs Portfolio"
   ```

2. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Environment Setup**:
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env.local
   
   # Update with your configuration
   ```

4. **Database Setup**:
   ```bash
   # Start MongoDB locally or configure Atlas URI
   # Database will be automatically seeded on first run
   ```

5. **Start Development Servers**:
   ```bash
   npm run dev
   ```

6. **Access Applications**:
   - **Client**: http://localhost:3000
   - **Server**: http://localhost:8000
   - **API Docs**: http://localhost:8000/api/v1/health

### Production Setup

1. **Run Production Setup**:
   ```bash
   npm run setup:production
   ```

2. **Build for Production**:
   ```bash
   npm run build:production
   ```

3. **Deploy**:
   ```bash
   # See DEPLOYMENT_GUIDE.md for detailed instructions
   ```

---

## 🎨 Features

### 🏠 Landing Page
- **Mode Selection**: Terminal, Portfolio, and Blog modes
- **Responsive Design**: Mobile-first approach
- **Theme Toggle**: Dark/Light mode with system preference
- **Smooth Animations**: Framer Motion powered transitions

### 💻 Terminal Interface
- **Command System**: Interactive CLI with custom commands
- **Autocomplete**: Smart command suggestions
- **Command History**: Navigate through previous commands
- **Responsive**: Touch-friendly on mobile devices
- **Themes**: Multiple terminal color schemes

### 🎯 Portfolio Showcase
- **Professional Display**: Clean, modern portfolio layout
- **Project Gallery**: Interactive project cards with previews
- **Skills Matrix**: Categorized technical skills
- **Resume Download**: PDF resume download functionality
- **Contact Form**: Integrated contact form with email notifications

### 📝 Blog System
- **Markdown Support**: Rich text with syntax highlighting
- **Comment System**: Guest comments with moderation
- **Search & Filter**: Full-text search and category filtering
- **SEO Optimized**: Dynamic meta tags and structured data
- **Social Sharing**: Share buttons with tracking

### 🔐 Admin Panel
- **Dashboard**: Analytics and content overview
- **Portfolio Management**: Edit personal info, projects, and skills
- **Blog Management**: Create, edit, and publish blog posts
- **Comment Moderation**: Approve, reject, and manage comments
- **File Management**: Upload and manage images and documents
- **User Management**: Admin authentication and authorization

### 📱 Mobile Experience
- **Responsive Design**: Optimized for all screen sizes
- **Touch Interactions**: Swipe gestures and touch-friendly controls
- **Progressive Web App**: PWA features for mobile installation
- **Performance**: Optimized loading and smooth animations

---

## 🔧 API Documentation

### Base URL
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.jasilmeledath.dev/api/v1`

### Authentication
```bash
# Login
POST /auth/login
{
  "email": "admin@example.com",
  "password": "password"
}

# Response
{
  "status": "success",
  "data": {
    "token": "jwt-token",
    "user": { ... }
  }
}
```

### Portfolio Endpoints
```bash
# Get portfolio data
GET /portfolio

# Update personal info (Admin)
PUT /portfolio-management/personal-info
Authorization: Bearer {token}

# Get projects
GET /portfolio/projects

# Create project (Admin)
POST /portfolio-management/projects
Authorization: Bearer {token}
```

### Blog Endpoints
```bash
# Get blog posts
GET /blogs?page=1&limit=10&search=query

# Get single blog post
GET /blogs/:slug

# Create blog post (Admin)
POST /blogs
Authorization: Bearer {token}

# Get comments
GET /comments/:blogId

# Create comment
POST /comments
{
  "blogId": "blog-id",
  "author": "Name",
  "email": "email@example.com",
  "content": "Comment content"
}
```

### Health Check
```bash
# Basic health check
GET /health

# Detailed health check
GET /health/ready
```

---

## 🔐 Environment Variables

### Client Environment (`.env.local` / `.env.production`)
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000        # API base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # Client base URL

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_HOTJAR_ID=HOTJAR_SITE_ID

# SEO
NEXT_PUBLIC_SITE_NAME=Jasil Meledath - Portfolio
NEXT_PUBLIC_SITE_TITLE=Full Stack Developer
NEXT_PUBLIC_SITE_DESCRIPTION=Portfolio description
```

### Server Environment (`.env`)
```bash
# Server Configuration
NODE_ENV=development                              # Environment mode
PORT=8000                                        # Server port
API_BASE_URL=http://localhost:8000               # API base URL

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio-dev
MONGODB_TEST_URI=mongodb://localhost:27017/portfolio-test

# Authentication
JWT_SECRET=your-super-secret-jwt-key             # JWT signing secret
JWT_EXPIRES_IN=7d                                # Token expiration
JWT_REFRESH_SECRET=your-refresh-token-secret     # Refresh token secret
JWT_REFRESH_EXPIRES_IN=30d                       # Refresh expiration

# Admin User
ADMIN_EMAIL=admin@example.com                    # Admin email
ADMIN_PASSWORD=your-secure-password              # Admin password
ADMIN_FIRST_NAME=Admin                           # Admin first name
ADMIN_LAST_NAME=User                             # Admin last name

# File Upload
MAX_FILE_SIZE=5242880                            # 5MB file size limit
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx # Allowed file types
UPLOAD_PATH=./uploads                            # Upload directory

# Email Configuration
EMAIL_HOST=smtp.gmail.com                        # SMTP host
EMAIL_PORT=587                                   # SMTP port
EMAIL_SECURE=false                               # Use TLS
EMAIL_USER=your-email@gmail.com                  # Email username
EMAIL_PASSWORD=your-app-password                 # Email password (app-specific)
EMAIL_FROM=your-email@gmail.com                  # From email address
EMAIL_FROM_NAME=Your Name                        # From name

# Social Media
GITHUB_URL=https://github.com/yourusername
LINKEDIN_URL=https://linkedin.com/in/yourusername
TWITTER_URL=https://twitter.com/yourusername
EMAIL=your.email@domain.com

# SEO
SITE_NAME=Your Portfolio                         # Site name
SITE_URL=http://localhost:3000                   # Site URL
SITE_TITLE=Your Name - Developer                 # Page title
SITE_DESCRIPTION=Your portfolio description      # Meta description
SITE_KEYWORDS=developer,portfolio,react,nodejs   # Meta keywords

# Rate Limiting
RATE_LIMIT_WINDOW=15                             # Rate limit window (minutes)
RATE_LIMIT_MAX_REQUESTS=100                      # Max requests per window

# Logging
LOG_LEVEL=debug                                  # Log level (debug/info/warn/error)
LOG_FILE=./logs/app.log                          # Log file path

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000               # Client URL for CORS
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run client tests
npm run client:test

# Run server tests
npm run server:test

# Run tests with coverage
npm run test:ci
```

### Test Structure

#### Client Tests
- **Components**: React component unit tests
- **Hooks**: Custom hook testing
- **Services**: API service mocking
- **Pages**: Page component integration tests

#### Server Tests
- **Routes**: API endpoint testing
- **Controllers**: Business logic testing
- **Models**: Database model testing
- **Middleware**: Authentication and validation testing

### Test Configuration

#### Jest Configuration (Client)
```javascript
// client/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

#### Jest Configuration (Server)
```javascript
// server/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/constants/**'
  ]
};
```

---

## 🎨 Styling & Design

### Design System

#### Colors
```scss
// Primary Colors
$primary-blue: #3b82f6;
$primary-purple: #8b5cf6;
$primary-gradient: linear-gradient(135deg, $primary-blue, $primary-purple);

// Neutral Colors
$gray-50: #f9fafb;
$gray-900: #111827;

// Status Colors
$success: #10b981;
$error: #ef4444;
$warning: #f59e0b;
```

#### Typography
```scss
// Font Families
$font-primary: 'Inter', sans-serif;
$font-mono: 'JetBrains Mono', monospace;

// Font Sizes
$text-xs: 0.75rem;     // 12px
$text-sm: 0.875rem;    // 14px
$text-base: 1rem;      // 16px
$text-lg: 1.125rem;    // 18px
$text-xl: 1.25rem;     // 20px
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
};
```

### Component Structure
```
📁 components/
├── 📁 ui/              # Reusable UI components
│   ├── Button.jsx      # Button variations
│   ├── Input.jsx       # Input field component
│   ├── Modal.jsx       # Modal dialog
│   └── Card.jsx        # Card component
├── 📁 common/          # Common components
│   ├── Header.jsx      # Site header
│   ├── Footer.jsx      # Site footer
│   └── Layout.jsx      # Page layout wrapper
└── 📁 features/        # Feature-specific components
    ├── Portfolio/      # Portfolio components
    ├── Blog/          # Blog components
    └── Terminal/      # Terminal components
```

---

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Token Refresh**: Automatic token refresh mechanism
- **Role-Based Access**: Admin-only protected routes

### Security Headers
```javascript
// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  crossOriginEmbedderPolicy: false
}));
```

### Input Validation
- **Joi Schemas**: Server-side validation
- **React Hook Form**: Client-side validation
- **Sanitization**: XSS and injection prevention
- **File Upload**: Type and size restrictions

### Rate Limiting
```javascript
// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

---

## 📊 Performance Optimization

### Frontend Optimizations
- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Dead code elimination
- **Bundle Analysis**: Bundle size monitoring
- **Caching**: Browser and CDN caching strategies

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB indexes
- **Response Compression**: Gzip compression
- **Query Optimization**: Efficient database queries
- **Connection Pooling**: MongoDB connection optimization
- **Caching**: Redis caching (optional)

### Performance Metrics
```javascript
// Core Web Vitals targets
const performanceTargets = {
  LCP: '<2.5s',    // Largest Contentful Paint
  FID: '<100ms',   // First Input Delay
  CLS: '<0.1',     // Cumulative Layout Shift
  TTI: '<3.8s',    // Time to Interactive
  FCP: '<1.8s'     // First Contentful Paint
};
```

---

## 🚀 Deployment Process

### Automated Deployment

#### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm run install:all
      - name: Run tests
        run: npm test
      - name: Build production
        run: npm run build:production
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### Manual Deployment Commands

```bash
# Production build and deploy
npm run deploy:build

# Deploy client to Vercel
./scripts/deploy-vercel.sh production

# Deploy server to Railway
./scripts/deploy-railway.sh

# VPS deployment with PM2
pm2 start ecosystem.config.js --env production
```

---

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear build cache
npm run clean

# Update dependencies
npm update

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Check MongoDB connection
node server/src/utils/test-db-connection.js

# Verify environment variables
echo $MONGODB_URI
```

#### API Errors
```bash
# Check server logs
pm2 logs jasilmeledath-api

# Test API health
curl https://api.jasilmeledath.dev/api/v1/health
```

### Debugging Tools

#### Development
- **React Developer Tools**: Component debugging
- **Redux DevTools**: State management debugging
- **Network Tab**: API request monitoring
- **Console**: Error tracking and logging

#### Production
- **Vercel Analytics**: Performance monitoring
- **Railway Logs**: Server error tracking
- **MongoDB Compass**: Database monitoring
- **Uptime Monitoring**: Service availability

---

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**: Create a personal fork
2. **Create Branch**: Feature/bugfix branches
3. **Make Changes**: Follow coding standards
4. **Run Tests**: Ensure all tests pass
5. **Submit PR**: Detailed pull request description

### Coding Standards

#### JavaScript/TypeScript
```javascript
// Use const/let instead of var
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Function naming
const getUserData = async (userId) => { ... };

// Component naming (PascalCase)
const UserProfile = ({ user }) => { ... };
```

#### Git Commit Messages
```bash
# Format: type(scope): description
feat(auth): add JWT token refresh
fix(blog): resolve comment submission issue
docs(readme): update installation instructions
style(ui): improve button hover states
```

### Code Review Process
1. **Automated Checks**: Linting, testing, build
2. **Manual Review**: Code quality, logic, security
3. **Testing**: Feature functionality verification
4. **Documentation**: Update relevant documentation

---

## 📈 Roadmap

### Planned Features

#### Phase 1 (Current)
- [x] Portfolio showcase
- [x] Blog system with comments
- [x] Admin panel
- [x] Terminal interface
- [x] Mobile responsiveness

#### Phase 2 (Next Release)
- [ ] Newsletter subscription
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] SEO enhancements
- [ ] Performance optimizations

#### Phase 3 (Future)
- [ ] Multi-language support
- [ ] Advanced search
- [ ] User registration
- [ ] Community features
- [ ] API documentation site

### Technical Improvements
- [ ] End-to-end testing (Cypress)
- [ ] Storybook component library
- [ ] GraphQL API migration
- [ ] Microservices architecture
- [ ] Advanced caching layer

---

## 📞 Support & Contact

### Getting Help
- **Documentation Issues**: Update this documentation
- **Bug Reports**: Create GitHub issue with reproduction steps
- **Feature Requests**: Create GitHub issue with detailed description
- **Security Issues**: Email directly to security contact

### Contact Information
- **Email**: jasilmeledath@gmail.com
- **LinkedIn**: [linkedin.com/in/jasilmeledath](https://linkedin.com/in/jasilmeledath)
- **GitHub**: [github.com/jasilmeledath](https://github.com/jasilmeledath)
- **Website**: [jasilmeledath.dev](https://jasilmeledath.dev)

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

### Third-Party Licenses
- Next.js: MIT License
- Express.js: MIT License
- MongoDB: Server Side Public License
- Tailwind CSS: MIT License
- All other dependencies: See individual package licenses

---

## 🙏 Acknowledgments

### Libraries & Tools
- **Next.js Team**: Amazing React framework
- **Vercel**: Excellent hosting platform
- **MongoDB**: Flexible database solution
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Beautiful animations

### Inspiration
- Modern portfolio designs
- Developer community feedback
- Open source contributions
- Web development best practices

---

**Last Updated**: January 27, 2025  
**Version**: 1.0.0  
**Maintainer**: Jasil Meledath (jasilmeledath@gmail.com)