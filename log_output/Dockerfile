# Pull the Node.js image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json index.js ./

# Install dependencies
RUN npm install --production

# Expose the port
EXPOSE 3000

# Start the Server
CMD ["node", "index.js"]