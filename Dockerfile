FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json, and install dependencies
COPY package*.json ./
RUN npm cache clean --force && \
    npm install --production --no-optional

# Install PM2 globally
RUN npm install -g pm2

# Copy the Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the .env file for Prisma to access
COPY .env .env

# Copy all files and compile TypeScript to JavaScript
COPY . .
RUN npx tsc

# Run Prisma migrations
# RUN npx prisma migrate deploy

# Expose the appropriate port
EXPOSE 4567

# Start the application using PM2 Runtime
CMD ["pm2-runtime", "dist/app.js"]