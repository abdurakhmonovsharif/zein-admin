FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy all project files (including components directory)
COPY . .

# Ensure components directory exists and has correct files
RUN ls -la ./components || echo "Components directory not found"

# Build the application with verbose logging
RUN pnpm run build --verbose

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]
