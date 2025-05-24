# 1. Base image
FROM node:20-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy source code
COPY . .

# 6. Build the application
RUN npm run build

# 7. Set environment
ENV NODE_ENV=production

# 8. Expose port
EXPOSE 4000

# 9. Start command
CMD ["npm", "start"]

# 6. Qolgan fayllarni (shu jumladan tsconfig, next.config.js, src) copy qilish
COPY . .

# 7. Production build
RUN npm run build

# 8. Portni ochish
EXPOSE 4000

# 9. Appni ishga tushurish
CMD ["npm", "start"]
