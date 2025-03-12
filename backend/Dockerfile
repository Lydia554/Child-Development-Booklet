# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend server and ensure it listens on 0.0.0.0 (needed for Fly.io)
CMD ["node", "server.js"]
