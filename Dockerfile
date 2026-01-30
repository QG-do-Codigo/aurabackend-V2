FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o Nest
RUN npm run build

# Porta padrão do Nest
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
