import admin from "firebase-admin";
import * as serviceAccount from "./stock-app-a474d-firebase-adminsdk-pk0go-a1b0ce81a5.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://stock-app-a474d.firebaseio.com",
});

export default admin;
