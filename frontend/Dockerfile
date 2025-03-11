# Use an official Node.js image as a base
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (helps with caching)
COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build


# Fix permission issue for Vue CLI
RUN chmod +x node_modules/.bin/vue-cli-service || true


# Expose port
EXPOSE 3000

CMD ["npm", "start"]