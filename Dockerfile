FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema directory
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the remaining application code
COPY . .

# Expose the appropriate port
EXPOSE 5050

# Start the application
CMD ["npm", "start"]
