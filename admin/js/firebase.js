import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    get,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2ldQ-eDBTPI79YoAOiOO6ps2p2DM7zFk",
    authDomain: "iasd-admin-ddf47.firebaseapp.com",
    databaseURL: "https://iasd-admin-ddf47-default-rtdb.firebaseio.com",
    projectId: "iasd-admin-ddf47",
    storageBucket: "iasd-admin-ddf47.firebasestorage.app",
    messagingSenderId: "421626317975",
    appId: "1:421626317975:web:52f280bcddaa62ac902dd2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
    db,
    ref,
    push,
    set,
    get,
    remove,
    update
};