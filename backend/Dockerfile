# Use a lightweight version of Node 20
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your Express app runs on
EXPOSE 5000

# Command to start the backend
CMD ["node", "index.js"]