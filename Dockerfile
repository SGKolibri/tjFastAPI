FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npx prisma generate
RUN rm -rf node_modules
RUN npm install

COPY . .

CMD ["npm", "start"]

EXPOSE 5050