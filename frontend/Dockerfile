# Use an official Node.js image as a base
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
COPY . . 
RUN npm run build

# Serve frontend with a static server
RUN npm install -g serve
CMD ["serve", "-s", "dist"]

# Expose port 8080 for frontend
EXPOSE 8080
