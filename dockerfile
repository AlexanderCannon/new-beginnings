FROM node:16.14.2
# ENV NODE_ENV=production
ENV NODE_ENV=dev

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

# RUN yarn install --production --frozen-lockfile
RUN yarn install

COPY . .

CMD [ "nodemon", "src" ]