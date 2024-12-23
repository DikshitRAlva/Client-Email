# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Step 4: Install the app dependencies
RUN npm install

# Step 5: Copy the entire application into the container
COPY . .

# Step 6: Set environment variables if needed (optional)
COPY .env ./

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Define the command to run the application
CMD ["node", "app.js"]  
