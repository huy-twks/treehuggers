const webpush = require("web-push");

export const triggerPushMsg = (subscription: any, dataToSend: any) => {
  return webpush
    .sendNotification(subscription, dataToSend)
    .catch((err: { statusCode: number }) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log("Subscription has expired or is no longer valid: ", err);
      } else {
        throw err;
      }
    });
};