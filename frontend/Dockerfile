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

# Harden & optimize for SPA delivery
RUN <<'EOF'
cat > /etc/nginx/conf.d/default.conf <<'NGINX'
server {
	listen 80;
	server_name _;
	root /usr/share/nginx/html;

	# Brotli/gzip (alpine build includes gzip; brotli would need module - skipping dynamic brotli)
	gzip on;
	gzip_comp_level 6;
	gzip_min_length 1024;
	gzip_types text/plain text/css application/javascript application/json image/svg+xml;
	gzip_vary on;

	# Security headers (adjust CSP if you add external origins)
	add_header X-Content-Type-Options nosniff always;
	add_header X-Frame-Options SAMEORIGIN always;
	add_header X-XSS-Protection "1; mode=block" always;
	add_header Referrer-Policy strict-origin-when-cross-origin always;
	add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
	# Basic CSP (relaxed for data: images; adjust as needed)
	add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https: http:;" always;

	# Cache immutable hashed assets for 1 year, HTML short
	location ~* \.(?:js|css|woff2?|ttf|eot|svg)$ {
		try_files $uri =404;
		add_header Cache-Control "public, max-age=31536000, immutable";
	}
	location = /index.html { add_header Cache-Control "no-cache"; }

	# SPA fallback
	location / {
		try_files $uri /index.html;
	}
}
NGINX
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
