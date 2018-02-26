# # Create image based on the official Node 8.9 image from dockerhub
FROM nginx:1.13-alpine

# Copy distribution app to nginx files
COPY dist/ /usr/share/nginx/html

# Set nginx configuration from app files
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Expose application port
EXPOSE 4200
