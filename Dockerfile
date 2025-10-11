# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Para desenvolvimento: usar ts-node diretamente
# Copiar código fonte
COPY src/ ./src/

# Etapa de produção (mais simples para desenvolvimento)
FROM node:18-alpine AS production

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para ts-node)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY --chown=nodejs:nodejs src/ ./src/
COPY --chown=nodejs:nodejs tsconfig*.json ./

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=development
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando de inicialização usando ts-node
ENTRYPOINT ["dumb-init", "--"]
CMD ["npx", "ts-node", "src/index.ts"]