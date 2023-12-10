import dotenv from 'dotenv';
import { App } from './App.js';
import { GameController } from './Controller/GameController.js';
import { UserController } from './Controller/UserController.js';
import admin from 'firebase-admin';
// import serviceAccount from './ServiceAccount.json'
// const serviceAccount = require('./ServiceAccount.json')
// import serviceAccount from './ServiceAccount.json'

dotenv.config();

const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": (process.env.PRIVATE_KEY && JSON.parse(process.env.PRIVATE_KEY).privateKey),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
}

console.log(serviceAccount)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
})

const app = new App([new GameController, new UserController]);
app.listen();