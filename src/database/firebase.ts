import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCqCVp9OBLdyaDbwntkWsv9D2x-oEIanXk',
  authDomain: 'zasta-challenge.firebaseapp.com',
  projectId: 'zasta-challenge',
  storageBucket: 'zasta-challenge.appspot.com',
  messagingSenderId: '487989157844',
  appId: '1:487989157844:web:8f18bcb8effa7533708041',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
