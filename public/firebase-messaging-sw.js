importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD9jVBd3prMoNfUNjEa05AS-1J8_eqN8Ow",
  authDomain: "nidhify-cd207.firebaseapp.com",
  projectId: "nidhify-cd207",
  messagingSenderId: "995695015061",
  appId: "1:995695015061:web:eff7724dfccfab08c6179c",
});

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {

//   if (payload.notification) return;

//   const { title, body, url } = payload.data || {};
//   const options = {
//     body,
//     icon: "/logo192px.png",
//     badge: "/whitebgnew128.png",
//     data: { url },
//   };
//   self.registration.showNotification(title || "Nidhify", options);
// });


// messaging.onBackgroundMessage((payload) => {
//   const notification = payload.notification || {};
//   const data = payload.data || {};

//   self.registration.showNotification(notification.title || "Nidhify", {
//     body: notification.body || "",
//     icon: "/logo192px.png",
//     badge: "/whitebgnew128.png",
//     image: notification.image,
//     data: { url: data.url || "/dashboard" },
//   });
// });

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(clients.openWindow(url));
});
