# Cloudflare Tunnel Setup Guide

## Problem Fixed
Your portfolio application now works properly with Cloudflare tunnels! The issue was that when accessing through a Cloudflare tunnel, the frontend was still trying to make API calls to `localhost:8000`, which doesn't exist in the tunnel environment.

## What Was Changed

### 1. Dynamic API Configuration
- Created `/client/src/utils/api-config.js` to detect tunnel environments
- Updated all service files to use dynamic API URLs
- API calls now use proxy routes when accessed via tunnels

### 2. Next.js API Proxies
- `/client/src/pages/api/proxy/[...path].js` - Proxies API calls to your Express server
- `/client/src/pages/api/uploads/[...path].js` - Proxies static file requests

### 3. Updated Services
- `portfolio-service.js` - Now uses dynamic API URLs
- `auth-service.js` - Updated for tunnel support
- `blog-service.js` - Updated for tunnel support
- `portfolio-management-service.js` - Updated for tunnel support

### 4. Next.js Configuration
- Added `allowedDevOrigins` for Cloudflare tunnels
- Added conditional rewrites for tunnel mode

## How to Use

### Method 1: Automatic Detection (Recommended)
1. Start your servers normally:
   ```bash
   # Terminal 1: Start backend
   cd server && npm start
   
   # Terminal 2: Start frontend
   cd client && npm run dev
   ```

2. Create Cloudflare tunnel:
   ```bash
   # Terminal 3: Create tunnel
   cloudflared tunnel --url http://localhost:3000
   ```

3. Access via the provided `*.trycloudflare.com` URL - it should work automatically!

### Method 2: Manual Tunnel Mode
1. Start backend:
   ```bash
   cd server && npm start
   ```

2. Start frontend in tunnel mode:
   ```bash
   cd client && npm run dev:tunnel
   ```

3. Create tunnel and access via the tunnel URL

## How It Works

1. **Detection**: The app detects if it's being accessed via a tunnel URL
2. **API Routing**: When tunneled, API calls go through Next.js proxy routes
3. **Static Files**: Upload/image requests are proxied through Next.js
4. **CORS**: All CORS settings updated to allow tunnel domains

## Testing

✅ **Localhost**: Should work as before  
✅ **Cloudflare Tunnel**: Portfolio details now load properly  
✅ **Other Tunnels**: Also supports ngrok, localtunnel  
✅ **File Uploads**: Images and assets work through tunnels  
✅ **API Calls**: All API endpoints accessible via tunnel  

## Environment Variables (Optional)

You can set these in your `.env.local` file for custom configuration:

```bash
# Custom API server URL
API_SERVER_URL=http://localhost:8000/api/v1

# Custom server URL for static files
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

## Troubleshooting

1. **Still getting API errors?**
   - Check that your Express server is running on port 8000
   - Clear browser cache and reload

2. **Images not loading?**
   - The upload proxy handles this automatically
   - Check browser developer tools for any 404 errors

3. **CORS errors?**
   - Both server and client CORS are configured for tunnels
   - Restart both servers if you see CORS issues

## Success! 🎉

Your portfolio should now work perfectly with Cloudflare tunnels. You can share the tunnel URL with others and they'll be able to view your complete portfolio including all project details, images, and functionality.
