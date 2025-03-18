# Usa uma imagem base do Node.js com a versão LTS (Long Term Support)
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Constrói a aplicação Next.js
RUN npm run build

# Expõe a porta que a aplicação vai rodar (Next.js usa a porta 3000 por padrão)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]