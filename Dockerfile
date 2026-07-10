# Use official Node.js runtime environment
FROM node:18-alpine

# Set directory inside the container
WORKDIR /app

# Copy dependency structures
COPY package*.json ./

# Install clean production dependencies
RUN npm ci --only=production

# Copy remaining server source code
COPY . .

# Expose backend service port
EXPOSE 5000

# Run the backend application
CMD ["node", "server.js"]