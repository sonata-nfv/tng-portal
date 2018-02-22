# Create image based on the official Node 8.9 image from dockerhub
FROM node:8.9.4-slim

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# Copy dependency definitions
COPY dist/ /usr/src/app

USER node
RUN mkdir ~/.npm-global

WORKDIR /usr/src/app

RUN npm i http-server -g

EXPOSE 4200

CMD ["/home/node/.npm-global/bin/http-server", "-p", "4200"]