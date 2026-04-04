const admin = require('firebase-admin');

// แก้ปัญหาเรื่องการรันซ้ำใน Serverless
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            // ใส่แค่ Project ID ตรงนี้ 
            // (ถ้ายังไม่ติด ให้ลองไปที่หน้าเว็บ Firebase > Project Settings เพื่อดู ID ที่ถูกต้อง)
            projectId: "wordgame-f3486" 
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

const db = admin.firestore();

export default async function handler(req, res) {
    // อนุญาตให้ส่งข้อมูลข้าม Domain (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { name, score } = req.body;

        // เช็กว่าข้อมูลส่งมาครบไหม
        if (!name || score === undefined) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบนะจ๊ะ' });
        }

        try {
            // บันทึกแบบระบุชื่อ Document เป็นชื่อผู้เล่นเลย
            await db.collection('leaderboard').doc(String(name)).set({
                name: String(name),
                score: Number(score),
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({ message: 'บันทึกสำเร็จโดย Node.js!' });
        } catch (error) {
            console.error("Database Error:", error);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: 'ใช้ POST เท่านั้นครับ' });
    }
}
