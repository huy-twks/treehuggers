import express, { Express, Request, response, Response } from 'express';
import dotenv from 'dotenv';
const { getFirestore } = require('firebase-admin/firestore');
import {router} from './src/router/router'
import { b64ToObject } from './src/utils/converter';
import cors from 'cors'
import { store } from './src/service/Subscriber';
import { getAvgCarbonIntensityOverTime, getCurrentCarbonIntensity, isGridDirty } from './src/controller/CalculateAvgCarbonIntensity';
import { NotificationResponse, SubcriptionWithRegion } from './src/models';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const serviceAccountKey = process.env.FIREBASE_SECRETS || ""
const webpush = require('web-push');
const hour = 3600000;
const minute = 5000;


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

const sendNotification = async (subscriber: SubcriptionWithRegion) => {
  const avg =  await getAvgCarbonIntensityOverTime(subscriber.region, new Date());
    const curr =  await getCurrentCarbonIntensity(subscriber.region);
    const payload: NotificationResponse = {
      gridStatus: isGridDirty(curr,avg)
    }
    await webpush.sendNotification(subscriber.subscription, JSON.stringify(payload));
}

app.get('/notification', async (req: Request, res: Response) => {
  try {
    store?.forEach(subscription => sendNotification(subscription));
    res.json({message: "Message sent to subscribers "});
  } catch(error) {
    res.send(error);
  }

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  setInterval(sendNotification, hour);
});
