"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_admin_1 = require("firebase-admin");
var serviceAccount = require("./stock-app-a474d-firebase-adminsdk-pk0go-a1b0ce81a5.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    databaseURL: "https://stock-app-a474d.firebaseio.com",
});
exports.default = firebase_admin_1.default;
