FROM node:20-alpine

WORKDIR /app

# Ativa pnpm
RUN corepack enable

# Copia dependências
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia o restante do projeto
COPY . .

# 🔥 BUILD O NEST
RUN pnpm build

# Expõe a porta
EXPOSE 3000

# Roda em produção
CMD ["pnpm", "start:prod"]
