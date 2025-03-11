<<<<<<< HEAD
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
=======
# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
>>>>>>> d6370f801ffc4624259b63d5b375b22b93566ac9
