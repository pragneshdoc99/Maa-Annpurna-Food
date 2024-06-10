import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCyEJ9RIT9bNeMDHOdk0iTT8yovWCQTS2E",
  authDomain: "maa-annapurna-hotel.firebaseapp.com",
  projectId: "maa-annapurna-hotel",
  storageBucket: "maa-annapurna-hotel.appspot.com",
  messagingSenderId: "476590200648",
  appId: "1:476590200648:web:0e8478be228b1101ab857d"
};
firebase.initializeApp(config);

export default firebase;
