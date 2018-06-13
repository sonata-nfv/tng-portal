# # Create an image based on the official Node 8.11.3 image from dockerhub
FROM node:8.11.3-alpine

# Copy the code into the container at /build
ADD . /build

# Set the working directory to /build
WORKDIR /build

# Build
RUN npm install
RUN npm run build

# # Create image based on the official Nginx 1.13 image from dockerhub
FROM nginx:1.13-alpine

# Copy distribution app to nginx files
COPY --from=0 /build/dist/ /usr/share/nginx/html

# Set nginx configuration from app files
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose application port
EXPOSE 4200