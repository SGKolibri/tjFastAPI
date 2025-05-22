FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json, and install dependencies
COPY package*.json ./
RUN npm cache clean --force && \
    npm install --unsafe-perm --legacy-peer-deps

# Install additional dependencies for Prisma
RUN npm install -g fstream unzipper bluebird graceful-fs

# Install PM2 globally
RUN npm install -g pm2

# Copy the Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the .env file for Prisma to access
COPY .env .env

# Copy all files EXCEPT node_modules
COPY . .

# Certifique-se de que a pasta public/relatorios existe e tem permissões adequadas
RUN mkdir -p ./public/relatorios && chmod -R 777 ./public

# Compile TypeScript to JavaScript
RUN npm run build

# Run Prisma migrations
# RUN npx prisma migrate deploy

# Expose the appropriate port
EXPOSE 4567

# Start the application using PM2 Runtime
CMD ["pm2-runtime", "dist/app.js"]