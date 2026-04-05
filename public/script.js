// 10. ดึงข้อมูลตารางคะแนนทั้ง 3 บอร์ดพร้อมกัน (ดึง 10 อันดับ)
function loadLeaderboards() {
    const modes = ['1m', '5m', 'unlimited'];
    
    modes.forEach(mode => {
        // เปลี่ยนจาก .limit(5) เป็น .limit(10) เพื่อโชว์ 10 อันดับ
        db.collection(`leaderboard_${mode}`).orderBy("score", "desc").limit(10)
        .onSnapshot((snapshot) => {
            const tbody = document.querySelector(`#board-${mode} tbody`);
            if (tbody) {
                tbody.innerHTML = "";
                let rank = 1; // ตัวนับอันดับ
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    let rankDisplay = rank;
                    let rowClass = "rank-normal"; // คลาสพื้นฐานสำหรับอันดับ 4-10
                    
                    // ใส่เหรียญและสีไฮไลท์ให้อันดับ 1-3
                    if (rank === 1) { 
                        rankDisplay = "🥇 1"; 
                        rowClass = "rank-1"; 
                    } else if (rank === 2) { 
                        rankDisplay = "🥈 2"; 
                        rowClass = "rank-2"; 
                    } else if (rank === 3) { 
                        rankDisplay = "🥉 3"; 
                        rowClass = "rank-3"; 
                    }
                    
                    // สร้างแถวข้อมูล
                    tbody.innerHTML += `
                        <tr class="${rowClass}">
                            <td>${rankDisplay}</td>
                            <td>${data.name}</td>
                            <td>${data.score}</td>
                        </tr>`;
                    
                    rank++; // เพิ่มอันดับขึ้นทีละ 1
                });
            }
        });
    });
}
