# 🚀 Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying your Next.js + Express.js portfolio to production with the domain `jasilmeledath.dev`.

## Recommended Hosting Setup

### 🌐 **Client (Frontend) - Vercel**
- **Domain**: `jasilmeledath.dev`
- **Features**: Next.js optimized, automatic deployments, edge network
- **Cost**: Free tier available

### ⚡ **Server (API) - Railway**
- **Domain**: `api.jasilmeledath.dev`
- **Features**: Automatic deployments, built-in monitoring, PostgreSQL/MongoDB support
- **Cost**: $5/month starter plan

### 🗄️ **Database - MongoDB Atlas**
- **Features**: Managed MongoDB, automatic scaling, backups
- **Cost**: Free tier (512MB), $9/month for 2GB+

---

## Step-by-Step Deployment

### 1. **Prepare Environment Variables**

#### Create Production Environment Files

```bash
# Root level - .env.production
NODE_ENV=production
```

#### Client Environment - `client/.env.production`
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.jasilmeledath.dev
NEXT_PUBLIC_SITE_URL=https://jasilmeledath.dev
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

#### Server Environment - `server/.env.production`
```bash
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio-production
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum
ADMIN_EMAIL=jasilmeledath@gmail.com
ADMIN_PASSWORD=your-secure-production-password
FRONTEND_URL=https://jasilmeledath.dev
EMAIL_PASSWORD=your-gmail-app-password
```

### 2. **Deploy Server to Railway**

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd server
   railway link [your-project-id]
   ```

4. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI="mongodb+srv://..."
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set ADMIN_EMAIL="jasilmeledath@gmail.com"
   railway variables set ADMIN_PASSWORD="your-password"
   railway variables set EMAIL_PASSWORD="your-gmail-app-password"
   railway variables set FRONTEND_URL="https://jasilmeledath.dev"
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Get Railway Domain**:
   - Go to Railway dashboard
   - Copy your service URL (e.g., `https://your-service.up.railway.app`)

### 3. **Set Up MongoDB Atlas**

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create free cluster
   - Choose region closest to your users

2. **Create Database User**:
   - Database Access → Add New Database User
   - Choose password authentication
   - Give read/write access

3. **Configure Network Access**:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for production
   - Or add Railway's IP ranges for better security

4. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` and `<dbname>`

### 4. **Deploy Client to Vercel**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Navigate to Client**:
   ```bash
   cd client
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables in Vercel**:
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add production variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
     NEXT_PUBLIC_SITE_URL=https://jasilmeledath.dev
     ```

### 5. **Configure Domain with Namecheap**

#### Set Up DNS Records

1. **Login to Namecheap**:
   - Go to Domain List → Manage → Advanced DNS

2. **Add DNS Records**:

   **For Main Domain (jasilmeledath.dev)**:
   ```
   Type: CNAME
   Host: @
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

   **For API Subdomain (api.jasilmeledath.dev)**:
   ```
   Type: CNAME
   Host: api
   Value: your-railway-domain.up.railway.app
   TTL: Automatic
   ```

3. **Add Custom Domain in Vercel**:
   - Project Settings → Domains
   - Add `jasilmeledath.dev`
   - Follow verification steps

4. **Add Custom Domain in Railway**:
   - Service Settings → Networking
   - Add `api.jasilmeledath.dev`

### 6. **Update Client API Configuration**

Update the API URL in your client environment:

```bash
# In Vercel dashboard, update environment variable:
NEXT_PUBLIC_API_URL=https://api.jasilmeledath.dev
```

Redeploy client:
```bash
vercel --prod
```

### 7. **SSL/HTTPS Verification**

Both Vercel and Railway provide automatic SSL certificates:

- ✅ `https://jasilmeledath.dev` (Vercel)
- ✅ `https://api.jasilmeledath.dev` (Railway)

### 8. **Final Testing**

1. **Test Website**: Visit `https://jasilmeledath.dev`
2. **Test API**: Visit `https://api.jasilmeledath.dev/api/v1/health`
3. **Test Admin Panel**: Login at `/admin`
4. **Test Contact Form**: Submit contact form
5. **Test Blog System**: Create and view blog posts

---

## Alternative Deployment Options

### Option 2: Netlify + Render

#### Client to Netlify:
```bash
# Build and deploy
npm run build:production
netlify deploy --prod --dir=client/.next
```

#### Server to Render:
- Connect GitHub repository
- Set environment variables
- Deploy automatically

### Option 3: Cloudflare Pages + Railway

#### Client to Cloudflare Pages:
```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy
wrangler pages publish client/.next
```

### Option 4: VPS Deployment (DigitalOcean/Linode)

```bash
# Install PM2 globally
npm install -g pm2

# Deploy both client and server
pm2 start ecosystem.config.js --env production

# Set up Nginx reverse proxy
sudo nginx -s reload
```

---

## Environment Variables Reference

### Required Production Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `256-bit-random-string` |
| `ADMIN_EMAIL` | Admin email | `jasilmeledath@gmail.com` |
| `ADMIN_PASSWORD` | Admin password | `secure-password` |
| `EMAIL_PASSWORD` | Gmail app password | `app-specific-password` |
| `FRONTEND_URL` | Client URL | `https://jasilmeledath.dev` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_ANALYTICS_ID` | GA measurement ID | None |
| `HOTJAR_ID` | Hotjar site ID | None |
| `CLOUDINARY_*` | Image hosting | None |

---

## Monitoring and Maintenance

### Health Checks
- **API Health**: `https://api.jasilmeledath.dev/api/v1/health`
- **Client Status**: Vercel dashboard
- **Server Status**: Railway dashboard

### Backup Strategy
1. **Database**: MongoDB Atlas automatic backups
2. **Code**: Git repository backups
3. **Uploads**: Regular file backups

### Performance Monitoring
1. **Vercel Analytics**: Built-in performance metrics
2. **Railway Metrics**: CPU, memory, and response times
3. **MongoDB Monitoring**: Atlas performance advisor

---

## Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// server/src/app.js - Update CORS configuration
const corsOptions = {
    origin: ['https://jasilmeledath.dev'],
    credentials: true
};
```

#### Environment Variables Not Working
- Check variable names (case sensitive)
- Verify deployment platform has variables set
- Redeploy after adding variables

#### Database Connection Issues
- Verify MongoDB Atlas network access
- Check connection string format
- Ensure database user has correct permissions

#### Build Failures
- Clear build cache: `npm run clean`
- Update dependencies: `npm update`
- Check logs in deployment platform

---

## Cost Estimation

### Monthly Costs (USD)

| Service | Tier | Cost | Features |
|---------|------|------|----------|
| Vercel | Pro | $20 | Custom domain, analytics |
| Railway | Starter | $5 | 512MB RAM, 1GB storage |
| MongoDB Atlas | M2 | $9 | 2GB storage, backups |
| **Total** | | **$34** | Full production setup |

### Free Tier Option

| Service | Tier | Limitations |
|---------|------|-------------|
| Vercel | Hobby | 100GB bandwidth/month |
| Railway | Free | $5 credit/month |
| MongoDB Atlas | M0 | 512MB storage |

---

## Security Checklist

- [ ] Strong JWT secrets (256+ bits)
- [ ] Secure admin passwords
- [ ] HTTPS enforced everywhere
- [ ] Database network restrictions
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] Error messages sanitized
- [ ] File upload restrictions
- [ ] CORS properly configured
- [ ] Security headers active

---

## Next Steps

1. **Monitor Performance**: Set up alerts for downtime
2. **SEO Optimization**: Submit sitemap to Google
3. **Analytics**: Configure Google Analytics
4. **Backup Strategy**: Implement regular backups
5. **CDN**: Consider adding Cloudflare for extra performance
6. **Monitoring**: Set up uptime monitoring (UptimeRobot, Pingdom)

---

**📞 Support**: For deployment issues, check the troubleshooting section or create an issue in the repository.