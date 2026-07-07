importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD9jVBd3prMoNfUNjEa05AS-1J8_eqN8Ow",
  authDomain: "nidhify-cd207.firebaseapp.com",
  projectId: "nidhify-cd207",
  messagingSenderId: "995695015061",
  appId: "1:995695015061:web:eff7724dfccfab08c6179c",
});

// IMPORTANT: Do not comment this line out. 
// This instantiates FCM and registers the browser push listeners.
const messaging = firebase.messaging();