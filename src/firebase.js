import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD9jVBd3prMoNfUNjEa05AS-1J8_eqN8Ow",
  authDomain: "nidhify-cd207.firebaseapp.com",
  projectId: "nidhify-cd207",
  messagingSenderId: "995695015061",
  appId: "1:995695015061:web:eff7724dfccfab08c6179c",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage, deleteToken };
