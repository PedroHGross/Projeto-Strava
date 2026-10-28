import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "conta-facil-ienh.firebaseapp.com",
  projectId: "conta-facil-ienh",
  storageBucket: "conta-facil-ienh.firebasestorage.app",
  messagingSenderId: "71762671723",
  appId: "1:71762671723:web:d31febc4fe70718c22d92e",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
