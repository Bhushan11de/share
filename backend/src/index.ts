import cors from "cors";
import * as admin from "firebase-admin";
import express from "express";

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

// Initialize Firebase if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Firebase initialized successfully");
}

// Function to check if Firebase is initialized
function isFirebaseInitialized() {
  return admin.apps.length > 0;
}

// Route for user signup using email and password
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res
      .status(201)
      .send({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ message: "Error creating user", error });
  }
});

// Route for user login using email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const idToken = await admin.auth().createCustomToken(user.uid);
    res.status(200).send({ message: "User logged in successfully", idToken });
  } catch (error) {
    res.status(401).send({ message: "Unauthorized", error });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
