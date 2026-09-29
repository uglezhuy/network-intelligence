# ============================================================
# Network Intelligence — образ бэкенда
# (HTTP API + мониторинг + Telegram-бот + MAX-бот)
#
# Многоступенчатая сборка:
#   1) build   — установка зависимостей и компиляция TypeScript
#   2) runtime — только production-зависимости + dist
# ============================================================

# ---- Этап 1: build ------------------------------------------------
FROM node:22-slim AS build

WORKDIR /app

# Сначала зависимости (чтобы слой кешировался при пересборке)
COPY package.json package-lock.json ./
RUN npm ci

# Исходники и компиляция
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Этап 2: runtime -----------------------------------------------
FROM node:22-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Только production-зависимости (dotenv, mysql2)
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev && npm cache clean --force

# Скомпилированный бэкенд и данные (гео-база монтируется volume-ом,
# см. compose.yaml и раздел «Гео-база» в README)
COPY --from=build /app/dist ./dist
COPY data ./data

EXPOSE 3000

CMD ["node", "dist/startAPIMonitorsBots.js"]