# Mobile Phone Access Setup Instructions

## What I've Updated

I've updated your CORS settings to allow access from:
1. **Development mode**: Any origin (most permissive for mobile testing)
2. **Local network IP ranges**: 
   - 192.168.x.x (most common home networks)
   - 10.x.x.x (some corporate/mobile networks)
   - 172.16-31.x.x (Docker/container networks)
3. **Localhost variations**: 127.0.0.1, localhost
4. **Cloud platforms**: Vercel, Netlify, Heroku domains

## How to Access from Mobile Phone

### Step 1: Find Your Computer's Local IP Address

**On macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```cmd
ipconfig | findstr "IPv4"
```

**Alternative method (works on all platforms):**
- Go to your network settings and look for your WiFi connection details
- Your IP will look something like: `192.168.1.100` or `10.0.0.50`

### Step 2: Start Your Servers

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   # Server should run on port 8000
   ```

2. **Start the frontend server:**
   ```bash
   cd client
   npm run dev
   # Client should run on port 3000
   ```

### Step 3: Access on Mobile

1. **Make sure your mobile phone is on the same WiFi network as your computer**

2. **Access your app using your computer's IP:**
   - Frontend: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

3. **If you get connection errors:**
   - Check your computer's firewall settings
   - Make sure both devices are on the same network
   - Try temporarily disabling your computer's firewall

### Step 4: Alternative - Use Next.js Host Binding

You can also start your Next.js client to bind to all interfaces:

```bash
cd client
npm run dev -- --hostname 0.0.0.0
```

Then access via: `http://YOUR_IP_ADDRESS:3000`

## Environment Variables

Make sure you have a `.env` file in your project root with:

```bash
NODE_ENV=development
PORT=8000
# ... other variables from .env.example
```

## Troubleshooting

1. **CORS errors**: Check the server console for "CORS: Blocked origin" messages
2. **Connection refused**: Check if your firewall is blocking the ports
3. **Can't find server**: Verify both devices are on same WiFi network
4. **API calls failing**: Make sure the client is pointing to the correct backend URL

## Security Note

These settings are permissive for development. For production, you should:
1. Set specific allowed origins
2. Remove the `NODE_ENV === 'development'` bypass
3. Use HTTPS
4. Implement proper authentication
