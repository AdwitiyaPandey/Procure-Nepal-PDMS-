import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCtEnVVDyHwCMjqNYCr5rxJaeAn-xGdnw4",
  authDomain: "procure-nepal.firebaseapp.com",
  databaseURL: "https://procure-nepal-default-rtdb.firebaseio.com",
  projectId: "procure-nepal",
  storageBucket: "procure-nepal.firebasestorage.app",
  messagingSenderId: "464406837564",
  appId: "1:464406837564:web:77b6b9248df68a2c02c639",
  measurementId: "G-Z8XD0EHWEL"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
