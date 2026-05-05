FROM node:22-alpine

WORKDIR /app

# Cache de dependencias separado del código
COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]