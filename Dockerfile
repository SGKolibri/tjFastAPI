FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json, and install dependencies
COPY package*.json ./
RUN npm install

# Copy the Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy all files and compile TypeScript to JavaScript
COPY . .
RUN npx tsc

# Expose the appropriate port
EXPOSE 4567

# Start the application using the compiled JavaScript
CMD ["npx", "ts-node", "src/app.ts"]