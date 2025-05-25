# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /frontend

COPY package.json package-lock.json* ./
RUN npm install

COPY public ./public
COPY src ./src

RUN npm run build

# Stage 2: Serve hasil build dengan server statis
FROM node:18-alpine

WORKDIR /frontend

RUN npm install -g serve

COPY --from=builder /frontend/build ./build

EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]
