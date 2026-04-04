// ใช้ Node.js Native Fetch ส่งข้อมูลผ่าน REST API (ไม่ต้องพึ่งกุญแจลับ)
export default async function handler(req, res) {
    // 1. ตั้งค่าอนุญาตให้หน้าเว็บคุยกับหลังบ้านได้ (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ตอบกลับ OPTIONS ทันทีเพื่อให้ CORS ผ่าน
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            // 2. รับข้อมูลที่ส่งมาจากหน้าเว็บ
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            const { name, score } = body;

            if (!name) {
                return res.status(400).json({ error: "กรุณาส่งชื่อมาด้วยครับ" });
            }

            // 3. ใช้ Node.js ส่งข้อมูลเข้า Firebase โดยตรง (ใช้ Project ID ของคุณ)
            const projectId = "wordgame-f3486";
            const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/leaderboard/${name}`;

            const firestoreResponse = await fetch(firebaseUrl, {
                method: 'PATCH', // PATCH จะสร้างข้อมูลใหม่ถ้ายังไม่มี หรืออัปเดตถ้ามีอยู่แล้ว
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        name: { stringValue: String(name) },
                        score: { integerValue: parseInt(score) }
                    }
                })
            });

            if (!firestoreResponse.ok) {
                const errorData = await firestoreResponse.json();
                throw new Error("Firebase API Error: " + JSON.stringify(errorData));
            }

            // 4. ส่งข้อความกลับไปหาหน้าเว็บว่าสำเร็จแล้ว!
            return res.status(200).json({ message: 'บันทึกคะแนนผ่าน Node.js สำเร็จ!' });

        } catch (error) {
            console.error("Node.js Error:", error.message);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "ต้องใช้ Method POST เท่านั้นครับ" });
    }
}
