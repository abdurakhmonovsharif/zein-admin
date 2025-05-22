FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN npm install -g pnpm
# Remove --frozen-lockfile flag to allow pnpm to update the lockfile
RUN pnpm install

# Copy all project files (including components directory)
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]
