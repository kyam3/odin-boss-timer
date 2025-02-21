// Firebaseの設定
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// ボスデータを格納する配列
let bosses = [];

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
        `;
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
const addBoss = () => {
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

// ページ読み込み時にデータを取得
window.onload = fetchBosses;
