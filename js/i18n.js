export const translations = {
    th: {
        tooltip_lang: "Switch to English",
        tooltip_location: "ตำแหน่งปัจจุบัน",
        tooltip_add_place: "เพิ่มสถานที่",
        tooltip_logout: "ออกจากระบบ",
        btn_login: "เข้าสู่ระบบ",
        tooltip_ai: "AI คู่หู",
        ai_greeting: "สวัสดีครับ! ผมคือ AI คู่หูของคุณ ให้ผมแนะนำสถานที่ท่องเที่ยวหรือร้านอาหารใกล้ๆ คุณไหมครับ?",
        chat_placeholder: "ถามข้อมูลสถานที่ หรือขอคำแนะนำ...",
        modal_add_title: "เพิ่มร้านค้า / สถานที่ท่องเที่ยว",
        modal_edit_title: "แก้ไขสถานที่",
        label_place_name: "ชื่อสถานที่",
        label_place_desc: "รายละเอียด / แนะนำ",
        label_lat: "ละติจูด",
        label_lng: "ลองจิจูด",
        modal_map_hint: "เลื่อนหมุดบนแผนที่เพื่อระบุตำแหน่ง",
        btn_save_place: "บันทึกสถานที่",
        btn_saving: "กำลังบันทึก...",
        btn_delete_place: "ลบสถานที่นี้",
        alert_no_gps: "เบราว์เซอร์ไม่รองรับ GPS",
        alert_gps_error: "ข้อผิดพลาด GPS: ",
        alert_click_map: "กรุณาคลิกบนแผนที่ในตำแหน่งที่ต้องการเพิ่มสถานที่",
        alert_delete_confirm: "คุณแน่ใจหรือไม่ที่จะลบสถานที่นี้?",
        alert_delete_failed: "ลบไม่สำเร็จ: ",
        alert_save_failed: "เกิดข้อผิดพลาด: ",
        ai_error: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ AI",
        ask_ai_btn: "ถาม AI เกี่ยวกับที่นี่",
        added_by: "เพิ่มโดย",
        no_details: "ไม่มีรายละเอียด",
        btn_edit: "แก้ไข",
        view_on_maps: "ดูบน Google Maps",
        unknown_location: "ตำแหน่งที่ไม่ทราบชื่อ",
        ai_system_prompt: `คุณคือ "AI Mate" คู่หูนำเที่ยวที่เชี่ยวชาญด้านการแนะนำสถานที่ท่องเที่ยวและร้านอาหาร 
พูดคุยในรูปแบบที่เป็นมิตร สนุกสนาน กระตือรือร้น และเป็นกันเองเหมือนเพื่อนสนิท ห้ามพิมพ์เป็นย่อหน้ายาวๆ เด็ดขาด
ให้แนะนำสถานที่ในรูปแบบของ "ลิสต์หัวข้อ (Bullet points หรือ Numbered lists)" เสมอ เพื่อให้อ่านง่ายและผู้ใช้ตัดสินใจได้ทันที
ตอบคำถามสั้นๆ กระชับ และใช้ภาษาไทยเป็นหลัก 
ถ้าผู้ใช้ถามถึงสถานที่เจาะจง ให้บอกบรรยากาศ จุดเด่น และข้อแนะนำมาเป็นข้อๆ`
    },
    en: {
        tooltip_lang: "เปลี่ยนเป็นภาษาไทย",
        tooltip_location: "Current Location",
        tooltip_add_place: "Add Place",
        tooltip_logout: "Logout",
        btn_login: "Login",
        tooltip_ai: "AI Mate",
        ai_greeting: "Hello! I am your AI Mate. Would you like me to recommend nearby restaurants or attractions?",
        chat_placeholder: "Ask about places or get recommendations...",
        modal_add_title: "Add Shop / Attraction",
        modal_edit_title: "Edit Place",
        label_place_name: "Place Name",
        label_place_desc: "Description / Recommendation",
        label_lat: "Latitude",
        label_lng: "Longitude",
        modal_map_hint: "Move the map to specify the location",
        btn_save_place: "Save Place",
        btn_saving: "Saving...",
        btn_delete_place: "Delete this place",
        alert_no_gps: "Browser does not support GPS",
        alert_gps_error: "GPS Error: ",
        alert_click_map: "Please click on the map to select a location to add.",
        alert_delete_confirm: "Are you sure you want to delete this place?",
        alert_delete_failed: "Failed to delete: ",
        alert_save_failed: "Error occurred: ",
        ai_error: "Sorry, failed to connect to AI",
        ask_ai_btn: "Ask AI about this place",
        added_by: "Added by",
        no_details: "No description",
        btn_edit: "Edit",
        view_on_maps: "View on Google Maps",
        unknown_location: "Unknown location",
        ai_system_prompt: `You are "AI Mate", a travel companion specializing in recommending tourist attractions and restaurants.
Speak like a close friend—informal, fun, and enthusiastic. DO NOT write in long paragraphs. 
Always use bullet points or numbered lists to present your recommendations so it's easy for the user to make decisions.
Keep each bullet point brief and to the point. Primarily use English.
If the user asks about a specific place, give tips and highlights in short bullet points.`
    }
};

export let currentLang = localStorage.getItem('appLang') || 'th';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('appLang', lang);
        // Reload to apply Google Maps language parameter and app translations cleanly
        window.location.reload();
    }
}

export function t(key) {
    return translations[currentLang][key] || key;
}

export function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        if (translations[currentLang][key]) {
            el.setAttribute('data-tooltip', translations[currentLang][key]);
        }
    });
}
