# Use an official Node.js image as a base
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (helps with caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Fix permission issue for Vue CLI
RUN chmod +x node_modules/.bin/vue-cli-service || true

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]
