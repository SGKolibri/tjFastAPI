# Dockerfile
FROM node:18

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Gera os arquivos do Prisma
RUN npx prisma generate

# Copia o restante dos arquivos
COPY . .

# Exponha a porta correta
EXPOSE 5050

# Comando de inicialização
CMD ["npm", "start"]