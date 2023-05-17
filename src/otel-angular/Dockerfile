### STAGE 1: Build ###
FROM node:16 AS build
WORKDIR /usr/local/app
COPY ./ /usr/local/app
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/dist/otel-angular /usr/share/nginx/html

EXPOSE 80