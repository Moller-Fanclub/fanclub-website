FROM node:20-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev && npm i --no-save prisma@5
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=build /app/dist ./dist
COPY races.json ./races.json
EXPOSE 3001
# No migrations dir yet: db push syncs schema to the (empty) DB
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/src/server.js"]
