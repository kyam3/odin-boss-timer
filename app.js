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

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// ボスデータを格納する配列
let bosses = [];

// 初期データの取得
const fetchBosses = async () => {
    const querySnapshot = await getDocs(collection(db, "bosses"));
    bosses = [];
    querySnapshot.forEach((doc) => {
        bosses.push({ id: doc.id, ...doc.data() });
    });
    displayBosses();
};

// データの表示
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
        `;
        tableBody.appendChild(row);
    });
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

// ページ読み込み時にデータを取得
window.onload = fetchBosses;
