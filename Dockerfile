# Multi-stage build: build app with Node, serve with nginx

# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# If package-lock.json is present, npm ci will run; otherwise fall back to npm install
RUN npm ci --no-audit --prefer-offline --no-fund || npm install --no-audit --no-fund

# Copy rest of the sources
COPY . .

# Build the production bundle
RUN npm run build

# 2) Run stage - nginx serving static built files
FROM nginx:stable-alpine

# Remove default nginx config and use our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

# Use the default nginx entrypoint
CMD ["nginx", "-g", "daemon off;"]
