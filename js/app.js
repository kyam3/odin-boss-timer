import { addBossToFirestore, fetchBosses, deleteBoss } from './firestore.js';
import { displayBosses, sortById, sortBySpawnTime } from './table.js';

// ページ読み込み時にバージョン（更新日時）を表示
window.onload = () => {
    const timestampElement = document.getElementById("timestamp");
    if (window.BUILD_TIMESTAMP) {
        timestampElement.textContent = window.BUILD_TIMESTAMP; // テンプレート変数を表示
    }
};

// バージョン表示用関数（日時を取得）
const getVersion = () => {
    const now = new Date();
    const version = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ` + 
                    `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}` + 
                    `.${now.getMilliseconds().toString().padStart(3, '0')}`;
    return version;
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

window.addBoss = addBoss;

// ソート操作
window.sortById = () => fetchBosses(bosses => displayBosses(sortById(bosses)));
window.sortBySpawnTime = () => fetchBosses(bosses => displayBosses(sortBySpawnTime(bosses)));
