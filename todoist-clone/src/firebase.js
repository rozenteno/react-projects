import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyBYrTyIIkx0ocloLEItTqCyPLctX6zkqYw",
  authDomain: "todoist-clone-b6e6d.firebaseapp.com",
  databaseURL: "https://todoist-clone-b6e6d.firebaseio.com",
  projectId: "todoist-clone-b6e6d",
  storageBucket: "todoist-clone-b6e6d.appspot.com",
  messagingSenderId: "501373196910",
  appId: "1:501373196910:web:69415c495b4fc886"
});

export { firebaseConfig as firebase };
