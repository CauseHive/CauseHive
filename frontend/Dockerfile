# Frontend Dockerfile (Vite + React)
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || npm install

# Copy source and build
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Serve with nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
# Minimal SPA config: redirect all to index.html
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  location / {\n    try_files $uri /index.html;\n  }\n  add_header Cache-Control "public, max-age=31536000, immutable";\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
