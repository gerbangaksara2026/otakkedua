FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++ 

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# We use npm install since there might not be a package-lock.json in the AI Studio environment
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create volume dir and ensure permissions
RUN mkdir -p /app/data && chown node:node /app/data

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Optional: Ensure data directory is writable by nextjs
RUN chown nextjs:nodejs -R /app/data

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

VOLUME ["/app/data"]

CMD ["node", "server.js"]
