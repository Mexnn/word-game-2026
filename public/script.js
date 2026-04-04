// 1. Firebase Config (ใช้สำหรับดึงข้อมูล Leaderboard มาโชว์หน้าเว็บ)
const firebaseConfig = {
    apiKey: "AIzaSyCxcK1hs9BNKDCtRM19YbfNX4F-UUqcsqk",
    authDomain: "wordgame-f3486.firebaseapp.com",
    projectId: "wordgame-f3486",
    storageBucket: "wordgame-f3486.firebasestorage.app",
    messagingSenderId: "56194239653",
    appId: "1:56194239653:web:b90ce2a55f395d2300514c",
    measurementId: "G-LFTH9V26YP"
};

// เริ่มต้น Firebase ฝั่งหน้าบ้าน
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. คลังคำศัพท์ (คุณสามารถเพิ่มคำได้ที่นี่)
const thaiWords = [
    { w: "ช้าง", h: "สัตว์ประจำชาติไทย ตัวใหญ่ มีงวง" },
    { w: "ส้มตำ", h: "อาหารอีสานยอดฮิต มีปลาร้าและมะละกอ" },
    { w: "กรุงเทพ", h: "เมืองหลวงของประเทศไทย" },
    { w: "ภูเขา", h: "พื้นที่สูงที่มีความชัน" }
];

const engWords = [
    { w: "apple", h: "A round red or green fruit" },
    { w: "computer", h: "An electronic device for processing data" },
    { w: "ocean", h: "A very large expanse of sea" },
    { w: "javascript", h: "The language of the web" }
];

let currentWord = "";
let score = 0;
let playerName = "";
let currentMode = "";

// 3. ฟังก์ชันเริ่มเกม
function startGame(mode) {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return alert("กรุณาใส่ชื่อก่อนเล่น!");
    
    currentMode = mode;
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('category-title').innerText = mode === 'TH' ? "🇹🇭 หมวดไทย" : "🇺🇸 English Mode";
    
    nextQuestion();
}

// 4. สุ่มคำถามถัดไป
function nextQuestion() {
    const list = currentMode === 'TH' ? thaiWords : engWords;
    const random = list[Math.floor(Math.random() * list.length)];
    currentWord = random.w.toLowerCase();
    
    document.getElementById('hint-text').innerText = "คำใบ้: " + random.h;
    document.getElementById('guessInput').value = "";
    document.getElementById('feedback').innerText = "";
    document.getElementById('guessInput').focus();
}

// 5. เช็คคำตอบ
function submitGuess() {
    const userGuess = document.getElementById('guessInput').value.toLowerCase().trim();
    const feedback = document.getElementById('feedback');

    if (userGuess === currentWord) {
        score += 10;
        document.getElementById('score').innerText = score;
        feedback.innerText = "✅ ถูกต้อง! +10 คะแนน";
        feedback.style.color = "green";
        
        // --- จุดสำคัญ: เรียกใช้ Node.js Backend ---
        saveScoreWithNodeJS(playerName, score); 
        
        setTimeout(nextQuestion, 1500);
    } else {
        feedback.innerText = "❌ ผิดนะ ลองใหม่อีกครั้ง!";
        feedback.style.color = "red";
    }
}

// 6. ส่งข้อมูลไปให้ Node.js (Backend API) บันทึกลง Firebase
async function saveScoreWithNodeJS(name, score) {
    try {
        const response = await fetch('/api/save-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score })
        });
        const result = await response.json();
        console.log("Node.js Response:", result.message);
    } catch (error) {
        console.error("Error calling Node.js API:", error);
    }
}

// 7. ดึงข้อมูลตารางคะแนน (Real-time Leaderboard)
function loadLeaderboard() {
    db.collection("leaderboard").orderBy("score", "desc").limit(5)
    .onSnapshot((snapshot) => {
        const tbody = document.querySelector("#leaderboardTable tbody");
        tbody.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            tbody.innerHTML += `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.score}</td>
                </tr>`;
        });
    });
}

// เริ่มโหลดตารางคะแนนทันทีที่เปิดเว็บ
loadLeaderboard();