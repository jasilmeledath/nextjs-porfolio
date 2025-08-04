# Simple Dockerfile for Railway deployment
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Install client dependencies and build
WORKDIR /app/client
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci
COPY client/ ./
RUN npm run build

# Copy server files
WORKDIR /app/server
COPY server/ ./

# Create required directories
RUN mkdir -p /app/server/uploads /app/server/logs

# Set proper ownership
RUN chown -R nodejs:nodejs /app

# Expose port
EXPOSE 8000

# Set environment
ENV NODE_ENV=production
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node /app/server/healthcheck.js

# Switch to non-root user
USER nodejs

# Start the server
CMD ["dumb-init", "node", "/app/server/server.js"]