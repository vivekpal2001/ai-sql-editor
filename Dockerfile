# Build stage
FROM node:20-alpine AS builder

# Install dependencies required for building native modules
RUN apk add --no-cache postgresql-dev python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Clean any existing build files
RUN rm -rf .next

# Build the application
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/next.config.mjs /app/next.config.mjs
COPY --from=builder /app/postcss.config.mjs /app/postcss.config.mjs
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/app /app/app
COPY --from=builder /app/components /app/components
COPY --from=builder /app/hooks /app/hooks
COPY --from=builder /app/lib /app/lib

EXPOSE 3000
CMD ["npm", "start"]
