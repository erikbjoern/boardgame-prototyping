import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBn59JefoWlPXDRcZOQgl14MIIq-VQfKqg",
  authDomain: "boardgame-prototyping.firebaseapp.com",
  projectId: "boardgame-prototyping",
  storageBucket: "boardgame-prototyping.appspot.com",
  messagingSenderId: "973237934229",
  appId: "1:973237934229:web:b7034d58487df62f01e39c"
};

// Get a Firestore instance
export default firebase
  .initializeApp(firebaseConfig)
  .firestore()
