FROM node:16-alpine

# Create app directory
WORKDIR /app

# Create a non-root user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package files
COPY package*.json ./

# Install dependencies as root
RUN npm install

# Copy app source
COPY . .

# Set ownership of the app directory and node_modules
RUN chown -R appuser:appgroup /app && \
    chmod -R 755 /app && \
    chmod -R 777 /app/node_modules

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"] 