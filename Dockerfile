# 1. Base image
FROM node:20-slim

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install all dependencies
RUN npm install --legacy-peer-deps

# 5. Copy all source files
COPY . .

# 6. Build the application
RUN npm run build

# 7. Set environment
ENV NODE_ENV=production

# 8. Expose port
EXPOSE 4000

# 9. Start command
CMD ["npm", "start"]
