// 1. Firebase Config (คงค่าเดิมของคุณไว้)
const firebaseConfig = {
    apiKey: "AIzaSyCxcK1hs9BNKDCtRM19YbfNX4F-UUqcsqk",
    authDomain: "wordgame-f3486.firebaseapp.com",
    projectId: "wordgame-f3486",
    storageBucket: "wordgame-f3486.firebasestorage.app",
    messagingSenderId: "56194239653",
    appId: "1:56194239653:web:b90ce2a55f395d2300514c",
    measurementId: "G-LFTH9V26YP"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. ตัวแปรระบบ
let thaiWords = []; // เปลี่ยนมาใช้ Array ว่าง เพื่อรอรับข้อมูลจาก API
let currentWord = "";
let score = 0;
let playerName = "";
let currentMode = ""; 
let timeLeft = 0;
let timerInterval;

// 3. ฟังก์ชันดึงคำศัพท์จาก API ของเราเอง
async function fetchWords() {
    try {
        const response = await fetch('/api/words');
        if (!response.ok) throw new Error('Network response was not ok');
        thaiWords = await response.json();
        console.log(`โหลดคำศัพท์สำเร็จ: ${thaiWords.length} คำ`);
    } catch (error) {
        console.error("โหลดคำศัพท์ไม่สำเร็จ:", error);
        alert("⚠️ ไม่สามารถโหลดข้อมูลคำศัพท์ได้ กรุณารีเฟรชหน้าเว็บอีกครั้ง");
    }
}

// เรียกใช้ฟังก์ชันทันทีที่เปิดเว็บ
fetchWords();

// 4. เริ่มเกมตามโหมดเวลา
function startGame(mode) {
    // เช็คว่าโหลดคำศัพท์จาก API เสร็จหรือยัง เพื่อป้องกันบัค
    if (thaiWords.length === 0) {
        return alert("⏳ กำลังเชื่อมต่อฐานข้อมูลคำศัพท์ กรุณารอสักครู่...");
    }

    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return alert("กรุณาใส่ชื่อผู้ท้าชิงก่อนเล่น!");
    
    currentMode = mode;
    score = 0;
    document.getElementById('score').innerText = score;
    
    // ตั้งค่าเวลา
    const timerContainer = document.getElementById('timer-container');
    if (mode === '1m') {
        timeLeft = 60;
        timerContainer.classList.remove('hidden');
        startTimer();
    } else if (mode === '5m') {
        timeLeft = 300;
        timerContainer.classList.remove('hidden');
        startTimer();
    } else {
        timerContainer.classList.add('hidden'); // โหมดไม่จำกัดเวลา ซ่อนตัวจับเวลา
    }

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    nextQuestion();
}

// 5. ระบบจับเวลา
function startTimer() {
    document.getElementById('time').innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`⏰ หมดเวลา! คุณทำคะแนนไปได้ ${score} คะแนน`);
            goHome(); // หมดเวลากลับหน้าแรก
        }
    }, 1000);
}

// 6. สุ่มคำถาม
function nextQuestion() {
    const random = thaiWords[Math.floor(Math.random() * thaiWords.length)];
    currentWord = random.w.toLowerCase();
    
    document.getElementById('hint-text').innerText = "💡 โจทย์: " + random.h;
    document.getElementById('guessInput').value = "";
    document.getElementById('feedback').innerText = "";
    document.getElementById('guessInput').focus();
}

// 7. เช็คคำตอบ
function submitGuess() {
    if (timeLeft <= 0 && currentMode !== 'unlimited') return; // หมดเวลาห้ามตอบ

    const userGuess = document.getElementById('guessInput').value.toLowerCase().trim();
    const feedback = document.getElementById('feedback');

    if (userGuess === currentWord) {
        score += 10;
        document.getElementById('score').innerText = score;
        feedback.innerText = "✅ ถูกต้อง! +10 คะแนน";
        feedback.style.color = "#4CAF50"; // สีเขียวสว่างให้เหมาะกับ Dark Mode
        
        // เซฟคะแนนไปที่โหมดนั้นๆ ผ่าน API
        saveScoreWithNodeJS(playerName, score, currentMode); 
        
        setTimeout(nextQuestion, 1500);
    } else {
        feedback.innerText = "❌ ผิดนะ ลองใหม่อีกครั้ง!";
        feedback.style.color = "#ff4d4d"; // สีแดงสว่างให้เหมาะกับ Dark Mode
    }
}

// 8. ปุ่มยอมแพ้
function giveUp() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `เฉลยคือ: "${currentWord}"`;
    feedback.style.color = "#ffeb3b"; // สีเหลืองเตือน
    setTimeout(nextQuestion, 2000);
}

// 9. ปุ่มกลับหน้าแรก
function goHome() {
    clearInterval(timerInterval); // หยุดเวลา
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('playerName').value = ""; // เคลียร์ชื่อ
}

// 10. ส่งข้อมูลไปให้ Node.js บันทึกลง Firebase
async function saveScoreWithNodeJS(name, score, mode) {
    try {
        await fetch('/api/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, mode })
        });
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

// 11. ดึงข้อมูลตารางคะแนนทั้ง 3 บอร์ดพร้อมกัน (ดึง 10 อันดับ)
function loadLeaderboards() {
    const modes = ['1m', '5m', 'unlimited'];
    
    modes.forEach(mode => {
        db.collection(`leaderboard_${mode}`).orderBy("score", "desc").limit(10)
        .onSnapshot((snapshot) => {
            const tbody = document.querySelector(`#board-${mode} tbody`);
            if (tbody) {
                tbody.innerHTML = "";
                let rank = 1; // ตัวนับอันดับ
                
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    let rankDisplay = rank;
                    let rowClass = "rank-normal"; 
                    
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
                    
                    rank++; 
                });
            }
        });
    });
}

// โหลดบอร์ดคะแนนตอนเปิดเว็บ
loadLeaderboards();

// กด Enter เพื่อตอบได้เลย
document.getElementById("guessInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();
    }
});