// 1. Firebase Config
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

// 2. คลังคำศัพท์ (ภาษาไทย 50 คำ จุใจ!)
const thaiWords = [
    { w: "ช้าง", h: "สัตว์ประจำชาติไทย ตัวใหญ่ มีงวง" },
    { w: "ส้มตำ", h: "อาหารอีสานยอดฮิต มีปลาร้าและมะละกอ" },
    { w: "กรุงเทพ", h: "เมืองหลวงของประเทศไทย" },
    { w: "ภูเขา", h: "พื้นที่สูงที่มีความชัน" },
    { w: "ทะเล", h: "แหล่งน้ำเค็มขนาดใหญ่ มีหาดทราย" },
    { w: "ทุเรียน", h: "ราชาผลไม้ มีหนามแหลม กลิ่นแรง" },
    { w: "หมูปิ้ง", h: "อาหารเช้ายอดฮิต กินคู่กับข้าวเหนียว" },
    { w: "ตุ๊กตุ๊ก", h: "รถโดยสารสามล้อ สัญลักษณ์ของไทย" },
    { w: "ผัดไทย", h: "เส้นจันท์ผัดใส่ไข่ กุ้งแห้ง ถั่วงอก" },
    { w: "โรงเรียน", h: "สถานที่สำหรับศึกษาหาความรู้" },
    { w: "ต้มยำกุ้ง", h: "ซุปเผ็ดเปรี้ยวของไทย มีกุ้งเป็นหลัก" },
    { w: "มะม่วง", h: "ผลไม้สุกสีเหลือง นิยมทานกับข้าวเหนียวมูน" },
    { w: "ลอยกระทง", h: "ประเพณีขอขมาพระแม่คงคาในวันเพ็ญเดือนสิบสอง" },
    { w: "สงกรานต์", h: "เทศกาลปีใหม่ไทย มีการเล่นสาดน้ำ" },
    { w: "มวยไทย", h: "ศิลปะการต่อสู้ประจำชาติ ใช้อวัยวะทั้ง 8" },
    { w: "วัดพระแก้ว", h: "วัดคู่บ้านคู่เมืองในกรุงเทพมหานคร" },
    { w: "รถไฟ", h: "ยานพาหนะที่วิ่งบนราง" },
    { w: "เครื่องบิน", h: "ยานพาหนะที่ใช้เดินทางบนท้องฟ้า" },
    { w: "จักรยาน", h: "ยานพาหนะ 2 ล้อ ใช้แรงปั่น" },
    { w: "โรงพยาบาล", h: "สถานที่รักษาคนไข้" },
    { w: "ตำรวจ", h: "ผู้พิทักษ์สันติราษฎร์ จับโจรผู้ร้าย" },
    { w: "หมอ", h: "ผู้ประกอบวิชาชีพรักษาโรค" },
    { w: "ครู", h: "ผู้สอนหนังสือและอบรมศิษย์" },
    { w: "ตู้เย็น", h: "เครื่องใช้ไฟฟ้าสำหรับเก็บของสดให้เย็น" },
    { w: "พัดลม", h: "เครื่องใช้ไฟฟ้าที่เป่าลมให้ความเย็น" },
    { w: "โทรทัศน์", h: "เครื่องใช้ไฟฟ้าสำหรับดูรายการต่างๆ" },
    { w: "สมาร์ทโฟน", h: "โทรศัพท์มือถือที่เล่นอินเทอร์เน็ตได้" },
    { w: "คอมพิวเตอร์", h: "อุปกรณ์อิเล็กทรอนิกส์ประมวลผลข้อมูล" },
    { w: "หนังสือ", h: "แหล่งรวบรวมความรู้เป็นรูปเล่ม" },
    { w: "ปากกา", h: "อุปกรณ์ใช้สำหรับเขียน มีน้ำหมึก" },
    { w: "ดินสอ", h: "อุปกรณ์เขียน ลบได้ด้วยยางลบ" },
    { w: "ไม้บรรทัด", h: "อุปกรณ์สำหรับวัดความยาวและขีดเส้นตรง" },
    { w: "กระเป๋า", h: "สิ่งของสำหรับใส่สัมภาระ" },
    { w: "รองเท้า", h: "สิ่งที่ใช้สวมใส่เท้าเพื่อป้องกันอันตราย" },
    { w: "หมวก", h: "สิ่งที่ใช้สวมศีรษะเพื่อกันแดด" },
    { w: "แว่นตา", h: "สิ่งที่ช่วยให้คนสายตาสั้นมองเห็นชัดขึ้น" },
    { w: "นาฬิกา", h: "เครื่องมือสำหรับบอกเวลา" },
    { w: "พระอาทิตย์", h: "ดาวฤกษ์ที่ให้แสงสว่างตอนกลางวัน" },
    { w: "พระจันทร์", h: "ดาวบริวารของโลก ส่องสว่างตอนกลางคืน" },
    { w: "ดาว", h: "สิ่งที่ส่องแสงระยิบระยับบนท้องฟ้าตอนกลางคืน" },
    { w: "เมฆ", h: "ไอน้ำที่รวมตัวกันลอยอยู่บนท้องฟ้า" },
    { w: "ฝน", h: "หยดน้ำที่ตกลงมาจากฟ้า" },
    { w: "รุ้งกินน้ำ", h: "ปรากฏการณ์แสง 7 สีหลังฝนตก" },
    { w: "แม่น้ำ", h: "สายน้ำขนาดใหญ่ที่ไหลลงสู่ทะเล" },
    { w: "น้ำตก", h: "แหล่งน้ำที่ไหลตกลงมาจากหน้าผาสูง" },
    { w: "ป่าไม้", h: "พื้นที่ที่มีต้นไม้ขึ้นหนาแน่น" },
    { w: "ดอกไม้", h: "ส่วนที่มีสีสันสวยงามและมีกลิ่นหอมของพืช" },
    { w: "ผีเสื้อ", h: "แมลงปีกสวยงาม ชอบดูดน้ำหวานดอกไม้" },
    { w: "นก", h: "สัตว์ปีกที่บินได้บนท้องฟ้า" },
    { w: "ปลา", h: "สัตว์น้ำ อาศัยและหายใจในน้ำ" }
];

const engWords = [
    { w: "apple", h: "A round red or green fruit" },
    { w: "computer", h: "An electronic device for processing data" },
    { w: "ocean", h: "A very large expanse of sea" },
    { w: "javascript", h: "The language of the web" },
    { w: "tiger", h: "A large wild cat with a yellow-orange coat and dark stripes" },
    { w: "guitar", h: "A musical instrument with strings" }
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
        
        saveScoreWithNodeJS(playerName, score); 
        
        setTimeout(nextQuestion, 1500);
    } else {
        feedback.innerText = "❌ ผิดนะ ลองใหม่อีกครั้ง!";
        feedback.style.color = "red";
    }
}

// --- ฟังก์ชันใหม่: ปุ่มยอมแพ้ ---
function giveUp() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `💡 เฉลยคือ: "${currentWord}"`;
    feedback.style.color = "#ff8c00"; // สีส้ม
    
    // โชว์เฉลย 2 วินาที แล้วข้ามไปข้อถัดไปโดยไม่ได้คะแนน
    setTimeout(nextQuestion, 2000);
}

// 6. ส่งข้อมูลไปให้ Node.js
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

// 7. ดึงข้อมูลตารางคะแนน
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

loadLeaderboard();
