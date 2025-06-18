// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsrFdO_AIWcdnQsnudg-4nf6ZqzOUOeW0",
  authDomain: "tienda-ropa-v2.firebaseapp.com",
  projectId: "tienda-ropa-v2",
  storageBucket: "tienda-ropa-v2.appspot.com", // CORREGIDO
  messagingSenderId: "160948910890",
  appId: "1:160948910890:web:1db09e25b550a9b13fbc53"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

