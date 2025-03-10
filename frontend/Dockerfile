# Use an official Node.js image
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json first (caching trick)
COPY package.json package-lock.json ./

# Set NPM registry to avoid timeouts
RUN npm config set registry https://registry.npmjs.org/

# Run NPM install with retry logic
RUN npm install || npm install || npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
