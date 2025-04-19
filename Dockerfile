# Stage 1: Build the Angular app
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Angular app in production mode
RUN npm run build --prod

# Stage 2: Serve the app using nginx
FROM nginx:alpine

EXPOSE 4200

# Copy built app from Stage 1
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/sample-angular/browser /usr/share/nginx/html