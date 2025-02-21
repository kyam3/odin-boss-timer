// Firebaseのモジュールをインポート
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyAk0LNlawSWUm--9l_Wf9-4qVfxGiyq-Dw",
    authDomain: "odin-boss-timer.firebaseapp.com",
    projectId: "odin-boss-timer",
    storageBucket: "odin-boss-timer.firebasestorage.app",
    messagingSenderId: "29849058878",
    appId: "1:29849058878:web:06c4e1ff0f3988c11f1b6f",
    measurementId: "G-NCLC5GRC2D"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ボスデータをFirestoreに追加する関数
export const addBossToFirestore = async (name, remainingTime) => {
    const spawnTime = calculateSpawnTime(remainingTime);
    const docRef = await addDoc(collection(db, "bosses"), {
        name: name,
        remainingTime: remainingTime,
        spawnTime: spawnTime
    });
    console.log("Document written with ID: ", docRef.id);
    fetchBosses(); // 再度データを取得
};

// 湧く時間を計算する関数
const calculateSpawnTime = (remainingTime) => {
    const currentTime = new Date();
    const hours = parseInt(remainingTime.substring(0, 2), 10);
    const minutes = parseInt(remainingTime.substring(2, 4), 10);
    currentTime.setHours(currentTime.getHours() + hours);
    currentTime.setMinutes(currentTime.getMinutes() + minutes);
    return currentTime.toLocaleTimeString();
};

// Firestoreからボスデータを取得する関数
export const fetchBosses = async (callback) => {
    const querySnapshot = await getDocs(collection(db, "bosses"));
    let bosses = [];
    querySnapshot.forEach((doc) => {
        bosses.push({ id: doc.id, ...doc.data() });
    });
    callback(bosses);
};

// ボスを削除する関数
export const deleteBossFromFirestore = async (id, callback) => {
    const bossDoc = doc(db, "bosses", id);
    await deleteDoc(bossDoc);
    console.log(`Document with ID ${id} deleted`);
    fetchBosses(callback); // 再度データを取得
};
