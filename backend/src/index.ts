import cors from "cors";
import * as admin from "firebase-admin";
import express from "express";

const app = express();
const router = express.Router();

app.use(express.json()); // Middleware to parse JSON bodies

// Initialize Firebase if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("successfull");
}

// Function to check if Firebase is initialized
function isFirebaseInitialized() {
  return admin.apps.length > 0;
}

router.post("/login", async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // Proceed with login logic using the uid
    res.status(200).send({ message: "User logged in successfully", uid });
  } catch (error) {
    res.status(401).send({ message: "Unauthorized", error });
  }
});

router.post("/logout", (req, res) => {
  // Implement logout logic here
  res.status(200).send({ message: "User logged out successfully" });
});

router.post("/reset-password", (req, res) => {
  // Implement password reset logic here
  res.status(200).send({ message: "Password reset link sent" });
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
