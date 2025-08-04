# Optimized Dockerfile for Railway deployment
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy and install server dependencies first (for better caching)
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy and install client dependencies
WORKDIR /app
COPY client/package*.json ./client/
WORKDIR /app/client
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm ci

# Copy source files
WORKDIR /app
COPY client/ ./client/
COPY server/ ./server/

# Build Next.js app
WORKDIR /app/client
RUN npm run build

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Create required directories and set permissions
WORKDIR /app
RUN mkdir -p server/uploads server/logs && chown -R nodejs:nodejs .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node server/healthcheck.js

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Start command
CMD ["dumb-init", "node", "server/server.js"]