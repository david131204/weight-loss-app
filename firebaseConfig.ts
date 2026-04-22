import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvElaooAQzYw6BOCT_lYFFRWzLDb_o1KE",
  authDomain: "leanpath-c991b.firebaseapp.com",
  projectId: "leanpath-c991b",
  storageBucket: "leanpath-c991b.firebasestorage.app",
  messagingSenderId: "121121097904",
  appId: "1:121121097904:web:e79fc8283750382890d375",
  measurementId: "G-HH710MG3NZ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: ReturnType<typeof getAuth>;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };

