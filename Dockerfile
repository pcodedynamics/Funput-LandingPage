# Stage 1: Build the static page
FROM node:26-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the static files using Nginx alpine (lightweight)
FROM nginx:alpine

# Copy custom nginx configuration for gzip and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from Stage 1 to Nginx public folder
COPY --from=builder /app/dist/funput/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
