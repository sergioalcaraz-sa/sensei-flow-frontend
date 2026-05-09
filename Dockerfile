# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código
COPY . .

# Argumento de construcción para la URL del backend
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Construir la aplicación Next.js
RUN npm run build

EXPOSE 3000

# Comando de arranque para producción
CMD ["npm", "start"]