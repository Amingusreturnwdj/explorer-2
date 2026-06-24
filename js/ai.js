import { CONFIG } from './config.js';

const BASE_SYSTEM_PROMPT = `คุณคือ "AI Mate" คู่หูนำเที่ยวที่เชี่ยวชาญด้านการแนะนำสถานที่ท่องเที่ยวและร้านอาหาร 
คุณจะคอยให้คำแนะนำเกี่ยวกับสถานที่ต่างๆ ในรูปแบบที่เป็นมิตร สนุกสนาน และกระตือรือร้นเหมือนเพื่อนสนิทพาเที่ยว 
ตอบคำถามสั้นๆ กระชับ เข้าใจง่าย และใช้ภาษาไทยเป็นหลัก 
ถ้าผู้ใช้ถามถึงสถานที่เจาะจง ให้ข้อมูลเกี่ยวกับบรรยากาศ จุดเด่น และข้อแนะนำในการไปเยือน`;

let chatHistory = [
    { role: "system", content: BASE_SYSTEM_PROMPT }
];

let aiContextState = {
    address: "ไม่ระบุตำแหน่ง",
    lat: null,
    lng: null,
    nearbyPlaces: [],
    customPlaces: []
};

export function updateAIContextLocation(address, lat, lng) {
    aiContextState.address = address;
    aiContextState.lat = lat;
    aiContextState.lng = lng;
    rebuildSystemPrompt();
}

export function updateAIContextPlaces(places) {
    aiContextState.nearbyPlaces = places.map(p => ({
        name: p.name,
        rating: p.rating || "ไม่มี"
    }));
    rebuildSystemPrompt();
}

export function updateAIContextCustomPlaces(places) {
    aiContextState.customPlaces = places.map(p => ({
        name: p.name,
        description: p.description || "ไม่มีรายละเอียด"
    }));
    rebuildSystemPrompt();
}

function rebuildSystemPrompt() {
    let context = `\n\n[ข้อมูลระบบเพื่อใช้ประกอบการตอบคำถาม]:\n`;
    if (aiContextState.lat !== null) {
        context += `- ตำแหน่งผู้ใช้งานปัจจุบัน: บริเวณ "${aiContextState.address}" (พิกัด Lat: ${aiContextState.lat}, Lng: ${aiContextState.lng})\n`;
    }
    
    context += `- สถานที่และร้านอาหารรอบๆ ผู้ใช้ตอนนี้ (ข้อมูลจาก Google Maps):\n`;
    if (aiContextState.nearbyPlaces.length > 0) {
        // จำกัดแค่ 10 ที่เพื่อไม่ให้ context ยาวเกินไป
        aiContextState.nearbyPlaces.slice(0, 10).forEach((p, i) => {
            context += `  ${i+1}. ${p.name} (ดาว: ${p.rating})\n`;
        });
    } else {
        context += `  (กำลังค้นหาหรือไม่มีข้อมูล)\n`;
    }

    if (aiContextState.customPlaces.length > 0) {
        context += `- สถานที่พิเศษที่ถูกเพิ่มไว้ในฐานข้อมูลแอพ (Local Database):\n`;
        aiContextState.customPlaces.slice(0, 10).forEach((p, i) => {
            context += `  * ${p.name} (รายละเอียด: ${p.description})\n`;
        });
    }

    context += `\n**คำสั่งสำคัญ**: \n1. ให้คุณอ้างอิงรายชื่อสถานที่ด้านบนนี้ในการแนะนำผู้ใช้เป็นหลัก เพราะเป็นสถานที่ที่มีอยู่จริงบนแผนที่รอบๆ ตัวผู้ใช้\n2. หากผู้ใช้ถามถึงสถานที่เจาะจง ให้ข้อมูลบรรยากาศและข้อแนะนำ หากเป็นสถานที่ในรายการข้างต้นให้ชื่นชมและสนับสนุนให้ไป`;
    
    chatHistory[0].content = BASE_SYSTEM_PROMPT + context;
}

export async function askAI(message, onMessageReceived, onError) {
    // Add user message to history
    chatHistory.push({ role: "user", content: message });

    try {
        const response = await fetch(CONFIG.DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: chatHistory,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch response from DeepSeek API");
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        
        // Add AI response to history
        chatHistory.push({ role: "assistant", content: aiMessage });
        
        onMessageReceived(aiMessage);
    } catch (error) {
        console.error("AI Error:", error);
        // Remove the failed user message from history so they can retry
        chatHistory.pop();
        if (onError) onError(error.message);
    }
}

export function clearChatHistory() {
    const currentSystemPrompt = chatHistory[0].content;
    chatHistory = [
        { role: "system", content: currentSystemPrompt }
    ];
}
