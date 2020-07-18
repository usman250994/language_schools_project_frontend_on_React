FROM node:12 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM iamfreee/docker-nginx-static-spa:latest

COPY --from=build /app/build /var/www/html
