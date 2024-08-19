var admin = require("firebase-admin");

var serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Check if Firebase is initialized
if (!admin.apps.length) {
  console.log("Firebase is not initialized");
} else {
  console.log("Firebase is initialized");
}
export default admin;
