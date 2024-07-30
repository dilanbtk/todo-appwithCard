import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBMTMmVAOhZoWs0gE9-zFWdVsLUfOKtwXw",
    authDomain: "toodos-2b474.firebaseapp.com",
    databaseURL: "https://toodos-2b474-default-rtdb.firebaseio.com",
    projectId: "toodos-2b474",
    storageBucket: "toodos-2b474.appspot.com",
    messagingSenderId: "437443772391",
    appId: "1:437443772391:web:674137e27bd923d337c742",
    measurementId: "G-HNT01VWYPC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
