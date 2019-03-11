##########################################################################
# Create an image based on the official Node 8.11.3 image from dockerhub #
##########################################################################
FROM node:8.11.3-jessie

# Copy the code into the container at /build
ADD . /build

# Set the working directory to /build
WORKDIR /build

# Install modules
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install -g npm
RUN npm install

# Build
RUN npm run build

##########################################################################
# Create image based on the official Nginx 1.13 image from dockerhub     #
##########################################################################
FROM nginx:1.13-alpine

# Copy distribution app in English to nginx files
COPY --from=0 /build/dist/tng-portal-en /usr/share/nginx/html

# Set nginx configuration from app files
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Enable selected environment
COPY src/config-sp.json /usr/share/nginx/html/
COPY src/config-vnv.json /usr/share/nginx/html/
COPY src/config.json /usr/share/nginx/html/
COPY src/entrypoint.sh /

ENV PLATFORM sp
CMD ["/entrypoint.sh"]

# Expose application port
EXPOSE 4200