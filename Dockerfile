FROM node:20.18.2


WORKDIR /app

COPY *.js /app
COPY *.json /app
COPY yarn.lock /*

RUN npm install -g yarn --force
RUN yarn install

EXPOSE 5000
CMD ["yarn", "start"]