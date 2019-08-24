# base image
FROM node:12.2.0-alpine

COPY . /src/app
WORKDIR /src/app

RUN npm install -qy

# add `/app/node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

# build app
RUN npm run build