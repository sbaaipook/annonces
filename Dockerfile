FROM node:16
WORKDIR /annonce
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]

ENV APP_NAME=annonces
ENV APP_SECRET=9fcfe6a62f4f77ec810ff1fe76cf26f2d6ec5848441a6ed86413cc90dff94e
ENV APP_PORT=4000
ENV NODE_ENV=production
ENV DEBUG=*-app:*
ENV DB_URL=mongodb://mongo-db:27017/annonces