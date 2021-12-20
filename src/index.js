import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import reportWebVitals from "./reportWebVitals";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import "./index.css";
import App from "./components/App";

import "./helpers/IconsImport";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpeHiDEKPpY0chqTUR4ywSOdKv89UEbfw",
  authDomain: "euromillions-stats.firebaseapp.com",
  projectId: "euromillions-stats",
  storageBucket: "euromillions-stats.appspot.com",
  messagingSenderId: "927975251473",
  appId: "1:927975251473:web:2dc5c9e4c9a9d74a831bb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });
// Subsequent queries will use persistence, if it was enabled successfully


ReactDOM.render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
