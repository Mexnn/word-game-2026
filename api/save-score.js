// api/save-score.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const { name, score, mode } = req.body; // รับตัวแปร mode เพิ่มเข้ามา
            const projectId = "wordgame-f3486";
            
            // แยกชื่อตารางคะแนนตามโหมด เช่น leaderboard_1m, leaderboard_5m, leaderboard_unlimited
            const collectionName = `leaderboard_${mode}`;

            // ยิงข้อมูลเข้า Firebase ผ่าน REST API
            const firebaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${name}?updateMask.fieldPaths=name&updateMask.fieldPaths=score`;

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
