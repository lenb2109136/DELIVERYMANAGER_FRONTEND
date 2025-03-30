// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGjDSD1cfwiWohB3RU-QjemI-l6u6QT4E",
  authDomain: "htttdl-21e41.firebaseapp.com",
  databaseURL: "https://htttdl-21e41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "htttdl-21e41",
  storageBucket: "htttdl-21e41.firebasestorage.app",
  messagingSenderId: "238206346046",
  appId: "1:238206346046:web:85fde64e07eff99b2f426f",
  measurementId: "G-EFY838G5CR",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const Database = getDatabase(app); // Lấy Database từ Firebase

export { app, Database };
