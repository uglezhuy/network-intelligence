# ============================================================
# Network Intelligence — веб-интерфейс (React + Vite)
# ============================================================

FROM node:22-slim

WORKDIR /app

# Сначала зависимости (кешируемый слой)
COPY package.json package-lock.json ./
RUN npm ci

# Остальной код
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]