import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA9qKMe6oj2QglS5QBPCc7IPVwvLON4mWk",
  authDomain: "ai-studio-applet-webapp-5c83d.firebaseapp.com",
  projectId: "ai-studio-applet-webapp-5c83d",
  storageBucket: "ai-studio-applet-webapp-5c83d.firebasestorage.app",
  messagingSenderId: "739563991477",
  appId: "1:739563991477:web:71d88a6e3834ffef7be9fc"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
