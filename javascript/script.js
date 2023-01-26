// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { doc, setDoc, collection, getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUyUXit_cf7HTxTJAtZPt1ywUIjhdbb-c",
  authDomain: "eugene-fingerprint.firebaseapp.com",
  projectId: "eugene-fingerprint",
  storageBucket: "eugene-fingerprint.appspot.com",
  messagingSenderId: "471916759323",
  appId: "1:471916759323:web:5ac4337f3e3c803fa9abbe",
  measurementId: "G-491BP86Y6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function getVisitorData() {
  const fp = await FingerprintJS.load({ debug: true });
  return await fp.get();
}

function getLocation(uri) {
  return fetch(`${uri}`)
    .then((response) => response.json())
    .then((data) => JSON.stringify(data.data));
}

async function startPlayground() {
  try {
    const { visitorId, confidence, components } = await getVisitorData();
    let domain = new URL(window.location.href);
    domain = domain.hostname;
    let usersCol = collection(firestore, "prd-user-log");
    if (domain.startsWith("127") || domain.startsWith("localhost")) {
      usersCol = collection(firestore, "dev-user-log");
    }
    const userRef = doc(usersCol, `${visitorId}@${new Date().getTime()}@${Math.floor(Math.random() * 100)}`);
    const geoLoc = await getLocation("https://eugene-fcm.vercel.app/geolocation");
    await setDoc(userRef, {
      fingerprintID: `${visitorId}`,
      createAt: new Date(),
      website: window.location.href,
      location: `${geoLoc}`,
    });
  } catch (err) {
    const errorCol = collection(firestore, "error-log");
    const errorRef = doc(errorCol, `${new Date().getTime()}@${Math.floor(Math.random() * 100)}`);
    await setDoc(errorRef, {
      error: `${JSON.stringify(err)}`,
      createAt: new Date(),
      website: window.location.href,
    });
  }
}

startPlayground();
