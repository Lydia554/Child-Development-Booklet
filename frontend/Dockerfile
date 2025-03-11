# Use an official Node.js image as a base
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Fix Vue CLI permissions
RUN chmod +x node_modules/.bin/vue-cli-service

# Build the Vue.js frontend
RUN npm run build

# Install a static file server for serving the frontend
RUN npm install -g serve
CMD ["serve", "-s", "dist"]

# Expose port 8080 for the frontend
EXPOSE 8080
