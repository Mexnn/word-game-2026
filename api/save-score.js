// api/save-score.js (เวอร์ชันแก้ปัญหา Error 500 แบบเด็ดขาด)
export default async function handler(req, res) {
    // ตั้งค่าหัวข้อเพื่อให้หน้าเว็บส่งข้อมูลมาได้ (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { name, score } = req.body;
            const projectId = "wordgame-f3486";

            // ยิงข้อมูลเข้า Firebase ผ่านทางช่องทางพิเศษ (REST API)
            // วิธีนี้จะใช้ชื่อผู้เล่น (name) เป็นชื่อเอกสารใน Database เลย
            const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/leaderboard/${name}?updateMask.fieldPaths=name&updateMask.fieldPaths=score`;

            const firestoreResponse = await fetch(firebaseUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        name: { stringValue: String(name) },
                        score: { integerValue: parseInt(score) }
                    }
                })
            });

            if (!firestoreResponse.ok) {
                const errorText = await firestoreResponse.text();
                throw new Error("Firebase Error: " + errorText);
            }

            return res.status(200).json({ message: 'บันทึกคะแนนเรียบร้อยแล้ว!' });

        } catch (error) {
            console.error("Backend Error:", error.message);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    }
}
