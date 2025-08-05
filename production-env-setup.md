# Production Environment Variables Setup

## Frontend (Vercel) Environment Variables

Add these environment variables to your Vercel project dashboard:

### API Configuration
```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
NEXT_PUBLIC_SITE_URL=https://jasilmeledath-portfolio.vercel.app
FRONTEND_URL=https://jasilmeledath-portfolio.vercel.app
```

### Analytics (Optional)
```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Backend Deployment Options

You have several options for deploying your Node.js backend:

### Option 1: Railway (Recommended for beginners)
1. Go to https://railway.app
2. Connect your GitHub repository
3. Deploy the `server` folder
4. Add all the server environment variables

### Option 2: Render
1. Go to https://render.com
2. Connect your repository
3. Create a new Web Service
4. Set root directory to `server`
5. Build command: `npm install`
6. Start command: `npm start`

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app
3. Deploy server folder

## Environment Variables for Backend

### Database (Production MongoDB)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-prod
NODE_ENV=production
PORT=8000
```

### JWT & Security
```
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-production-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d
```

### Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=jasilmeledath@gmail.com
EMAIL_PASSWORD=mydn cttd wlcm yuaa
EMAIL_FROM=jasilmeledath@gmail.com
EMAIL_FROM_NAME=Jasil Meledath - Developer Blog
```

### Admin Configuration
```
ADMIN_EMAIL=jasilmeledath@gmail.com
ADMIN_PASSWORD=secure-production-password
ADMIN_FIRST_NAME=Jasil
ADMIN_LAST_NAME=Meledath
```

### Site Configuration
```
SITE_URL=https://jasilmeledath-portfolio.vercel.app
FRONTEND_URL=https://jasilmeledath-portfolio.vercel.app
```

## Steps After Frontend Deployment

1. **Get your Vercel URL**: After deployment, note the URL (e.g., `https://jasilmeledath-portfolio.vercel.app`)

2. **Deploy Backend**: Choose one of the backend deployment options above

3. **Update Frontend Environment Variables**: 
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add the variables listed above with your actual backend URL

4. **Test the Full Stack**: Ensure frontend can communicate with backend

## Quick Backend Deployment with Railway

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project in server directory
cd server
railway init

# 4. Deploy
railway up
```

## MongoDB Atlas Setup (Recommended for Production)

1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update MONGODB_URI in your backend environment variables
