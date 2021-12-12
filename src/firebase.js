import firebase from "firebase/compat";

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAIhO7WAStJva-9V8pYGZNGgvkRRl2SJ7s",
    authDomain: "blog-9446f.firebaseapp.com",
    projectId: "blog-9446f",
    storageBucket: "blog-9446f.appspot.com",
    messagingSenderId: "844283967611",
    appId: "1:844283967611:web:af02f0f07aff10c093cade",
    measurementId: "${config.measurementId}"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };