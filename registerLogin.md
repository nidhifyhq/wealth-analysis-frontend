const messaging = getMessaging(app);
getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }).then(console.log);

VM193:1 Uncaught ReferenceError: getMessaging is not defined
    at <anonymous>:1:19