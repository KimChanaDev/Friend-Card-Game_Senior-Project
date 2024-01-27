FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm run gen-keys

ENV PORT=3001
ENV CLIENT_URL=http://localhost:8080
ENV MONGO_USER=empty
ENV MONGO_PASSWORD=empty
ENV MONGO_PATH=empty
ENV TYPE=empty
ENV PROJECT_ID=empty
ENV PRIVATE_KEY_ID=empty
ENV PRIVATE_KEY=empty
ENV CLIENT_EMAIL=empty
ENV CLIENT_ID=empty
ENV AUTH_URI=empty
ENV TOKEN_URI=empty
ENV AUTH_PROVIDER_X509_CERT_URL=empty
ENV CLIENT_X509_CERT_URL=empty

EXPOSE $PORT

CMD ["npm", "run", "start"]