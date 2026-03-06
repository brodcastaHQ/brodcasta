FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev", "--host", "0.0.0.0", "--port", "3000"]