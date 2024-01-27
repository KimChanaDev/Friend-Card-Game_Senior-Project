FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENV REACT_APP_SERVER_PORT=http://localhost:3001

CMD [ "npm", "run", "preview" ]