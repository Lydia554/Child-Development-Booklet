# Use Node.js as the base image
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all files and build the Vue app
COPY . .
RUN npm run build

# Expose the port where the app will be served
EXPOSE 8080

# Serve the built files and ensure it listens on 0.0.0.0:8080
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
