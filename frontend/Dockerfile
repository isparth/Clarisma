# Use an official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]