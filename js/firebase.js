import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { CONFIG } from './config.js';

// Initialize Firebase
const app = initializeApp(CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export let currentUser = null;

export function initAuth(onUserChange) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        onUserChange(user);
    });
}

export async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
        alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
        throw error;
    }
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

// Database Operations
export function listenToPlaces(onDataChange) {
    const placesRef = ref(db, 'places');
    onValue(placesRef, (snapshot) => {
        const data = snapshot.val();
        const places = [];
        if (data) {
            for (const [id, place] of Object.entries(data)) {
                places.push({ id, ...place });
            }
        }
        onDataChange(places);
    });
}

export async function addPlace(placeData) {
    if (!currentUser) throw new Error("ต้องเข้าสู่ระบบก่อนเพิ่มสถานที่");
    
    const placesRef = ref(db, 'places');
    const newPlaceRef = push(placesRef);
    
    const dataToSave = {
        ...placeData,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        createdAt: new Date().toISOString()
    };
    
    await set(newPlaceRef, dataToSave);
    return newPlaceRef.key;
}

export async function updatePlace(id, placeData) {
    if (!currentUser) throw new Error("ต้องเข้าสู่ระบบก่อนแก้ไขสถานที่");
    
    const placeRef = ref(db, `places/${id}`);
    
    const dataToUpdate = {
        name: placeData.name,
        description: placeData.description,
        lat: placeData.lat,
        lng: placeData.lng,
        updatedAt: new Date().toISOString()
    };
    
    await update(placeRef, dataToUpdate);
}

export async function deletePlace(id) {
    if (!currentUser) throw new Error("ต้องเข้าสู่ระบบก่อนลบสถานที่");
    const placeRef = ref(db, `places/${id}`);
    await remove(placeRef);
}
