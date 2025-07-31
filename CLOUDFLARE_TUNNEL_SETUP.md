# Cloudflare Tunnel CORS Configuration

## Changes Made

### 1. Next.js Configuration (`client/next.config.js`)
Added experimental `allowedDevOrigins` to allow Cloudflare tunnel domains:

```javascript
experimental: {
  allowedDevOrigins: [
    'trycloudflare.com',
    '*.trycloudflare.com'
  ]
}
```

### 2. Express Server CORS (`server/src/app.js`)
Updated CORS patterns to include:
- `^https:\/\/.*\.trycloudflare\.com$` - Cloudflare tunnels
- `^https:\/\/.*\.ngrok\.io$` - Ngrok tunnels (bonus)
- `^https:\/\/.*\.loca\.lt$` - Localtunnel (bonus)

These patterns are applied to both:
- Main CORS configuration
- Static file serving CORS

## How It Works

1. **Next.js Side**: The `allowedDevOrigins` config tells Next.js to allow cross-origin requests from `*.trycloudflare.com` domains for development resources like `/_next/*`.

2. **Express Side**: The CORS middleware now recognizes and allows requests from Cloudflare tunnel domains matching the pattern `https://*.trycloudflare.com`.

## Testing Your Cloudflare Tunnel

1. **Start your servers** (both should be running now):
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

2. **Create Cloudflare tunnel**:
   ```bash
   # Install cloudflared if you haven't
   # Then run:
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Access via tunnel**: Use the provided `*.trycloudflare.com` URL

## Expected Behavior

- ✅ No more CORS warnings in Next.js console
- ✅ API requests from tunnel domain work properly
- ✅ Static assets load correctly
- ✅ Full functionality maintained

## Security Notes

- These settings are permissive for development
- For production, consider more restrictive origins
- Cloudflare tunnels are temporary and change on each restart

## Troubleshooting

If you still see CORS issues:
1. Clear browser cache
2. Check browser console for specific error details
3. Verify the tunnel domain matches the pattern `*.trycloudflare.com`
4. Restart both development servers after config changes
