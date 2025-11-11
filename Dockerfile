# Build stage
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .nvmrc ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set NODE_ENV=production for build (prevents Vite from inlining env vars)
ENV NODE_ENV=production

# Build application
RUN npm run build

# Production stage
FROM node:22.14.0-alpine AS runner

WORKDIR /app

# Install only production dependencies if needed
# (Astro standalone mode includes everything in dist/, but keeping this for safety)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV WEBSITES_PORT=3000

# Start the application
CMD ["node", "dist/server/entry.mjs"]

