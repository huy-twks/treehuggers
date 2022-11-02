import express, { Express, Request, response, Response } from 'express';
import dotenv from 'dotenv';
const { getFirestore } = require('firebase-admin/firestore');
import {router} from './src/router/router'
import { b64ToObject } from './src/utils/converter';
import cors from 'cors'
import { store } from './src/service/Subscriber';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const serviceAccountKey = process.env.FIREBASE_SECRETS || ""
const webpush = require('web-push');

app.use(cors())
app.use(router);

// Initialize Firebase
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(b64ToObject(serviceAccountKey))
});

const db = getFirestore();

// VAPID keys should only be generated only once.
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/notification', async (req: Request, res: Response) => {
  store?.forEach(async subscriber => {
    await webpush.sendNotification(subscriber.subscription, 'Your Push Payload Text');
  });

  res.json({message: "Message sent to subscribers "})
});

app.listen(port, () => {console.log(`⚡️[server]: Server is running at https://localhost:${port}`)});
