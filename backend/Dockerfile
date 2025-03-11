# 1. Use an official Node.js image to build
FROM node:18 AS build

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install --legacy-peer-deps

# 5. Copy application source code
COPY . .

# 6. Build Vue.js app
RUN npm run build

# 7. Serve Vue.js app with a simple HTTP server
FROM node:18-alpine AS serve
WORKDIR /app
COPY --from=build /app/dist /app
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", ".", "-l", "8080"]
