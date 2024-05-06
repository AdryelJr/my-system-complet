import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBmMBjE2bN_8-1oqRxCjAqWT0s-NtiW-Ow",
    authDomain: "my-project-complet.firebaseapp.com",
    databaseURL: "https://my-project-complet-default-rtdb.firebaseio.com",
    projectId: "my-project-complet",
    storageBucket: "my-project-complet.appspot.com",
    messagingSenderId: "219792007484",
    appId: "1:219792007484:web:9f2ee18f5d01dff67e3e39"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database }