FROM node:lts-alpine3.15
COPY . .
RUN npm install
CMD "npm start run"