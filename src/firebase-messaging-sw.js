importScripts("https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js");

importScripts("https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js");

// [START get_messaging_object]
// Retrieve Firebase Messaging object.
firebase.initializeApp({
  apiKey: "AIzaSyDUa2AEI1UiqDK9VwnTU-K3FqPYrP0vqSA",
  authDomain: "angular-pwa-platzi-36a70.firebaseapp.com",
  databaseURL: "https://angular-pwa-platzi-36a70.firebaseio.com",
  projectId: "angular-pwa-platzi-36a70",
  storageBucket: "angular-pwa-platzi-36a70.appspot.com",
  messagingSenderId: "1025749956587",
  appId: "1:1025749956587:web:8c0049007d071830098bae"
});
const messaging = firebase.messaging();
// [END get_messaging_object]
