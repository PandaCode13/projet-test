# Build the TypeScript project
FROM node:22.16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run type-check
RUN npm run build 

# Production image
FROM node:22.16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "run", "start"]
