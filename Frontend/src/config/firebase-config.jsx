import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyBCNyyTwo_RLCHrJD_xNnYHy8G67DDeKbw",
    authDomain: "friendcardgame.firebaseapp.com",
    projectId: "friendcardgame",
    storageBucket: "friendcardgame.appspot.com",
    messagingSenderId: "32554163001",
    appId: "1:32554163001:web:826be047b3462c391f66e8",
    measurementId: "G-EP9GFC9J3T"
  };

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp