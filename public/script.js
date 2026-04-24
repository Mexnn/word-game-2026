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

// 2. คลังคำศัพท์ (จัดให้ 150+ คำ ครอบคลุมหลายหมวดหมู่)
const thaiWords = [
    // หมวดสัตว์
    { w: "ช้าง", h: "สัตว์ประจำชาติไทย ตัวใหญ่ มีงวง" }, { w: "เสือ", h: "สัตว์กินเนื้อลายพาดกลอน ดุร้าย" }, { w: "สิงโต", h: "เจ้าป่า มีแผงคอ" }, { w: "หมี", h: "สัตว์ตัวใหญ่ ชอบกินน้ำผึ้ง" }, { w: "ยีราฟ", h: "สัตว์คอยาวที่สุดในโลก" }, { w: "ม้าลาย", h: "สัตว์ที่มีลายสีขาวสลับดำทั้งตัว" }, { w: "จระเข้", h: "สัตว์เลื้อยคลาน อาศัยในน้ำ ปากกว้าง" }, { w: "งู", h: "สัตว์เลื้อยคลาน ไม่มีขา บางชนิดมีพิษ" }, { w: "เต่า", h: "สัตว์มีกระดอง เดินช้า" }, { w: "กระต่าย", h: "สัตว์หูยาว ชอบกินแครอท" }, { w: "นกแก้ว", h: "นกสีสวยงาม สามารถเลียนเสียงคนได้" }, { w: "ฉลาม", h: "ปลาดุร้ายในทะเล มีฟันแหลมคม" }, { w: "โลมา", h: "สัตว์เลี้ยงลูกด้วยนมในทะเล แสนรู้" }, { w: "วาฬ", h: "สัตว์ที่ใหญ่ที่สุดในโลก อาศัยในทะเล" }, { w: "เพนกวิน", h: "นกที่บินไม่ได้ อาศัยในซีกโลกใต้" },
    // หมวดอาหาร/ผลไม้
    { w: "ส้มตำ", h: "อาหารอีสานยอดฮิต มีปลาร้าและมะละกอ" }, { w: "ต้มยำกุ้ง", h: "ซุปเผ็ดเปรี้ยวของไทย มีกุ้งเป็นหลัก" }, { w: "ผัดไทย", h: "เส้นจันท์ผัดใส่ไข่ กุ้งแห้ง ถั่วงอก" }, { w: "กะเพรา", h: "เมนูสิ้นคิดของคนไทย ผัดใส่ใบหอมๆ" }, { w: "ข้าวผัด", h: "นำข้าวสวยไปรวนในกระทะกับไข่และเนื้อสัตว์" }, { w: "หมูปิ้ง", h: "อาหารเช้ายอดฮิต กินคู่กับข้าวเหนียว" }, { w: "ทุเรียน", h: "ราชาผลไม้ มีหนามแหลม กลิ่นแรง" }, { w: "มังคุด", h: "ราชินีผลไม้ เปลือกม่วง เนื้อขาว" }, { w: "มะม่วง", h: "ผลไม้สุกสีเหลือง นิยมทานกับข้าวเหนียวมูน" }, { w: "แตงโม", h: "ผลไม้ลูกใหญ่ เนื้อสีแดง น้ำเยอะ" }, { w: "กล้วย", h: "ผลไม้ปลอกเปลือกง่าย ลิงชอบกิน" }, { w: "มะละกอ", h: "ผลไม้เนื้อสีส้ม ใช้ทำส้มตำตอนดิบ" }, { w: "สับปะรด", h: "ผลไม้มีตาเยอะแยะรอบตัว" },
    // หมวดสิ่งของ/เครื่องใช้
    { w: "คอมพิวเตอร์", h: "อุปกรณ์อิเล็กทรอนิกส์ประมวลผลข้อมูล" }, { w: "สมาร์ทโฟน", h: "โทรศัพท์มือถือที่เล่นอินเทอร์เน็ตได้" }, { w: "โทรทัศน์", h: "เครื่องใช้ไฟฟ้าสำหรับดูรายการต่างๆ" }, { w: "ตู้เย็น", h: "เครื่องใช้ไฟฟ้าสำหรับเก็บของสดให้เย็น" }, { w: "พัดลม", h: "เครื่องใช้ไฟฟ้าที่เป่าลมให้ความเย็น" }, { w: "แอร์", h: "เครื่องปรับอากาศ" }, { w: "หนังสือ", h: "แหล่งรวบรวมความรู้เป็นรูปเล่ม" }, { w: "ดินสอ", h: "อุปกรณ์เขียน ลบได้ด้วยยางลบ" }, { w: "ปากกา", h: "อุปกรณ์ใช้สำหรับเขียน มีน้ำหมึก" }, { w: "กระเป๋า", h: "สิ่งของสำหรับใส่สัมภาระ" }, { w: "รองเท้า", h: "สิ่งที่ใช้สวมใส่เท้า" }, { w: "แว่นตา", h: "สิ่งที่ช่วยให้คนสายตาสั้นมองเห็นชัดขึ้น" }, { w: "นาฬิกา", h: "เครื่องมือสำหรับบอกเวลา" }, { w: "กรรไกร", h: "ของมีคมใช้สำหรับตัดกระดาษ" },
    // หมวดสถานที่/ธรรมชาติ
    { w: "โรงเรียน", h: "สถานที่สำหรับศึกษาหาความรู้" }, { w: "โรงพยาบาล", h: "สถานที่รักษาคนไข้" }, { w: "วัด", h: "สถานที่ทำบุญของชาวพุทธ" }, { w: "ตลาด", h: "สถานที่ซื้อขายสินค้าและอาหาร" }, { w: "ทะเล", h: "แหล่งน้ำเค็มขนาดใหญ่ มีหาดทราย" }, { w: "ภูเขา", h: "พื้นที่สูงที่มีความชัน" }, { w: "น้ำตก", h: "แหล่งน้ำที่ไหลตกลงมาจากหน้าผาสูง" }, { w: "แม่น้ำ", h: "สายน้ำขนาดใหญ่ที่ไหลลงสู่ทะเล" }, { w: "ป่าไม้", h: "พื้นที่ที่มีต้นไม้ขึ้นหนาแน่น" }, { w: "ท้องฟ้า", h: "เบื้องบนที่เรามองเห็นเมฆและพระอาทิตย์" }, { w: "พระอาทิตย์", h: "ดาวฤกษ์ที่ให้แสงสว่างตอนกลางวัน" }, { w: "พระจันทร์", h: "ดาวบริวารของโลก ส่องสว่างตอนกลางคืน" }, { w: "ดาว", h: "สิ่งที่ส่องแสงระยิบระยับบนท้องฟ้าตอนกลางคืน" },
    // หมวดอาชีพ/บุคคล
    { w: "ครู", h: "ผู้สอนหนังสือและอบรมศิษย์" }, { w: "หมอ", h: "ผู้ประกอบวิชาชีพรักษาโรค" }, { w: "พยาบาล", h: "ผู้ดูแลและช่วยเหลือคนไข้ในโรงพยาบาล" }, { w: "ตำรวจ", h: "ผู้พิทักษ์สันติราษฎร์ จับโจรผู้ร้าย" }, { w: "ทหาร", h: "ผู้ปกป้องประเทศชาติ" }, { w: "นักดับเพลิง", h: "ผู้ที่มีหน้าที่ผจญเพลิง" }, { w: "ชาวนา", h: "ผู้ปลูกข้าวให้เรากิน กระดูกสันหลังของชาติ" },
    // หมวดยานพาหนะ
    { w: "รถยนต์", h: "ยานพาหนะ 4 ล้อ" }, { w: "จักรยานยนต์", h: "รถมอเตอร์ไซค์ 2 ล้อ" }, { w: "จักรยาน", h: "ยานพาหนะ 2 ล้อ ใช้แรงปั่น" }, { w: "เครื่องบิน", h: "ยานพาหนะที่ใช้เดินทางบนท้องฟ้า" }, { w: "รถไฟ", h: "ยานพาหนะที่วิ่งบนราง" }, { w: "เรือ", h: "ยานพาหนะที่ใช้สัญจรทางน้ำ" }, { w: "ตุ๊กตุ๊ก", h: "รถโดยสารสามล้อ สัญลักษณ์ของไทย" }
];

let currentWord = "";
let score = 0;
let playerName = "";
let currentMode = ""; // '1m', '5m', 'unlimited'
let timeLeft = 0;
let timerInterval;

// 3. เริ่มเกมตามโหมดเวลา
function startGame(mode) {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return alert("กรุณาใส่ชื่อก่อนเล่น!");
    
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

// 4. ระบบจับเวลา
function startTimer() {
    document.getElementById('time').innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`⏰ หมดเวลา! คุณทำได้ ${score} คะแนน`);
            goHome(); // หมดเวลากลับหน้าแรก
        }
    }, 1000);
}

// 5. สุ่มคำถาม
function nextQuestion() {
    const random = thaiWords[Math.floor(Math.random() * thaiWords.length)];
    currentWord = random.w.toLowerCase();
    
    document.getElementById('hint-text').innerText = "💡 โจทย์: " + random.h;
    document.getElementById('guessInput').value = "";
    document.getElementById('feedback').innerText = "";
    document.getElementById('guessInput').focus();
}

// 6. เช็คคำตอบ
function submitGuess() {
    if (timeLeft <= 0 && currentMode !== 'unlimited') return; // หมดเวลาห้ามตอบ

    const userGuess = document.getElementById('guessInput').value.toLowerCase().trim();
    const feedback = document.getElementById('feedback');

    if (userGuess === currentWord) {
        score += 10;
        document.getElementById('score').innerText = score;
        feedback.innerText = "✅ ถูกต้อง! +10 คะแนน";
        feedback.style.color = "green";
        
        // เซฟคะแนนไปที่โหมดนั้นๆ
        saveScoreWithNodeJS(playerName, score, currentMode); 
        
        setTimeout(nextQuestion, 1500);
    } else {
        feedback.innerText = "❌ ผิดนะ ลองใหม่อีกครั้ง!";
        feedback.style.color = "red";
    }
}

// 7. ปุ่มยอมแพ้
function giveUp() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `เฉลยคือ: "${currentWord}"`;
    feedback.style.color = "#ff8c00"; 
    setTimeout(nextQuestion, 2000);
}

// 8. ปุ่มกลับหน้าแรก
function goHome() {
    clearInterval(timerInterval); // หยุดเวลา
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('playerName').value = ""; // เคลียร์ชื่อ
}

// 9. ส่งข้อมูลไปให้ Node.js (แนบ mode ไปด้วย)
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

// 10. ดึงข้อมูลตารางคะแนนทั้ง 3 บอร์ดพร้อมกัน (ดึง 10 อันดับ)
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

// โหลดบอร์ดคะแนนตอนเปิดเว็บ
loadLeaderboards();

// กด Enter เพื่อตอบได้เลย
document.getElementById("guessInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitGuess();
    }
});
