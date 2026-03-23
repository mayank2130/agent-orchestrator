FROM node:22-alpine AS builder
WORKDIR /app

# Install build deps for native modules (node-pty needs python3/make/g++)
RUN apk add --no-cache python3 make g++ git

COPY . .
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm --filter "@composio/ao-core" build && \
    pnpm --filter "@composio/ao-plugin-*" build 2>/dev/null || true && \
    cd packages/web && pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder /app/packages/web/.next/static ./.next/static
COPY --from=builder /app/packages/web/public ./public
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
