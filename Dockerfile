FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# PRODUCTION
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN npm ci --omit=dev && npm cache clean --force

USER node
EXPOSE 3009
CMD ["node","--max-old-space-size=400", "dist/src/main.js"]
