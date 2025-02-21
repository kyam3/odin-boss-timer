// ボスデータをテーブルに表示する関数
export const displayBosses = (bosses) => {
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
        deleteButton.addEventListener('click', () => deleteBoss(boss.id, displayBosses));

        tableBody.appendChild(row);
    });
};

// IDでソート
export const sortById = (bosses) => {
    bosses.sort((a, b) => a.id.localeCompare(b.id)); // IDを文字列としてソート
    return bosses;
};

// 湧く時間でソート
export const sortBySpawnTime = (bosses) => {
    bosses.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.spawnTime}:00`);
        const timeB = new Date(`1970-01-01T${b.spawnTime}:00`);
        return timeA - timeB; // 時間順でソート
    });
    return bosses;
};
