# 1. Use a lightweight Node.js image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install --legacy-peer-deps

# 5. Copy application source code
COPY . .

# 6. Expose port 5000
EXPOSE 5000

# 7. Use environment variable for PORT (required for Heroku)
CMD ["node", "server.js"]
