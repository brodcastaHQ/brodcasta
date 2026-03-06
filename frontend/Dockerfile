FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY . .

RUN pnpm run build

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "3000"]
