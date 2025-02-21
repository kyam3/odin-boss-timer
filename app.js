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

// ボスデータを格納する配列
let bosses = [];

// バージョン表示用関数（日時を取得）
const getVersion = () => {
    const now = new Date();
    const version = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` + 
                    `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}` + 
                    `.${now.getMilliseconds().toString().padStart(3, '0')}`;
    return version;
};

// ページ読み込み時にバージョンを表示
window.onload = () => {
    document.getElementById("version").textContent = getVersion(); // 日時バージョンを表示
    fetchBosses(); // ボスデータを取得
};

// ボスデータをFirestoreに追加する関数
const addBossToFirestore = async (name, remainingTime) => {
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

// ボスデータをテーブルに表示する関数
const displayBosses = () => {
    const tableBody = document.querySelector('#bossTable tbody');
    tableBody.innerHTML = ''; // 既存のデータをクリア

    bosses.forEach((boss) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', boss.id); // 各行にIDを設定

        row.innerHTML = `
            <td>${boss.id}</td>
            <td>${boss.name}</td>
            <td>${boss.remainingTime}</td>
            <td>${boss.spawnTime}</td>
            <td><button class="delete-btn">削除</button></td> <!-- 削除ボタン -->
        `;
        
        // 削除ボタンにクリックイベントを追加
        const deleteButton = row.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => deleteBoss(boss.id));

        tableBody.appendChild(row);
    });
};

// Firestoreからボスデータを取得する関数
const fetchBosses = async () => {
    const querySnapshot = await getDocs(collection(db, "bosses"));
    bosses = [];
    querySnapshot.forEach((doc) => {
        bosses.push({ id: doc.id, ...doc.data() });
    });
    displayBosses();
};

// ボスを削除する関数
const deleteBoss = async (id) => {
    const bossDoc = doc(db, "bosses", id);
    await deleteDoc(bossDoc);
    console.log(`Document with ID ${id} deleted`);
    fetchBosses(); // 再度データを取得
};

// IDでソート
const sortById = () => {
    bosses.sort((a, b) => a.id.localeCompare(b.id)); // IDを文字列としてソート
    displayBosses(); // ソート後に再表示
};

// 湧く時間でソート
const sortBySpawnTime = () => {
    bosses.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.spawnTime}:00`);
        const timeB = new Date(`1970-01-01T${b.spawnTime}:00`);
        return timeA - timeB; // 時間順でソート
    });
    displayBosses(); // ソート後に再表示
};

// ボスを追加する関数
export const addBoss = () => {
    const bossName = document.getElementById('bossName').value;
    const remainingTime = document.getElementById('remainingTime').value;
    if (bossName && remainingTime) {
        addBossToFirestore(bossName, remainingTime);
        document.getElementById('bossName').value = ''; // 入力フィールドをクリア
        document.getElementById('remainingTime').value = ''; // 入力フィールドをクリア
    } else {
        alert("ボス名と残り時間を入力してください！");
    }
};

// ボタンイベントリスナーを設定
document.getElementById('addBossBtn').addEventListener('click', addBoss);
