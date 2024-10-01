FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm run build

FROM node:20-alpine AS deployment

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

FROM node:20-alpine AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY --from=deployment /app .

CMD ["npm", "run", "start:prod"]

EXPOSE 3000
