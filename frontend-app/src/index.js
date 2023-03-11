import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCZ-D-Uwot30uWmriqde11ZikYtH2qfHLo",
  authDomain: "fullstack-auth-8465f.firebaseapp.com",
  projectId: "fullstack-auth-8465f",
  storageBucket: "fullstack-auth-8465f.appspot.com",
  messagingSenderId: "534741279707",
  appId: "1:534741279707:web:ea65589200a8881935bdfe",
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
