// นี่คือโค้ด Node.js ที่รันบน Server
const admin = require('firebase-admin');

// ตั้งค่า Firebase (ใช้ Project ID ของคุณ)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: "wordgame-f3486" 
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, score } = req.body;
        try {
            await db.collection('leaderboard').doc(name).set({
                name: name,
                score: score,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            return res.status(200).json({ message: 'Saved by Node.js!' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    res.status(405).send('Method Not Allowed');
}