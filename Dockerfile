# Use an official Node.js runtime as the base image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install all dependencies including devDependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma migration
# RUN npx prisma migrate deploy

# Build your application
RUN yarn build:prod

# Use a lighter-weight base image for the production build
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Set the environment variable
ENV DATABASE_URL=postgres://foysalahmed0075:obxv1kIG0UNt@ep-shrill-scene-846072-pooler.ap-southeast-1.aws.neon.tech/neondb?pgbouncer=true&connect_timeout=10
ENV DIRECT_URL= postgres://foysalahmed0075:obxv1kIG0UNt@ep-shrill-scene-846072.ap-southeast-1.aws.neon.tech/neondb?connect_timeout=10
ENV JWT_SECRET = 4f053a3e212e718b292455fc2c23
ENV PORT = 5001
# Install production dependencies
RUN yarn install --production --frozen-lockfile

# Generate Prisma Client
RUN npx prisma generate

# Expose the port on which your application listens
EXPOSE 5001

# Specify the command to start your application
CMD ["node", "./dist/src/main"]
