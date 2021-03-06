import express from 'express';
import cors from 'cors'
import { User } from "./config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { getFirestore, collection, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCpspyJBziegUr-XlHfRRiEol1qKqLSzP0",
    authDomain: "okab-6a8ac.firebaseapp.com",
    projectId: "okab-6a8ac",
    storageBucket: "okab-6a8ac.appspot.com",
    messagingSenderId: "935513642014",
    appId: "1:935513642014:web:457bcd1dd20bc60caaca0f",
    measurementId: "G-8978S7Z8XF"
  };

// Initialize firestore db, auth
const fbapp = initializeApp(firebaseConfig);
const db = getFirestore(fbapp);
const auth = getAuth(app);

const app = express();
app.use(express.json());
app.use(cors());


/* Endoints */
app.get('/app/', (req, res) => {
    res.json({"message":"Your API works! (200)"})
    res.status(200)
    });   

app.get("/", async (req, res) => {
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

app.post("/create", async (req, res) => {
  const data = req.body;
  try {
    const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
    );
    try {
        const docRef = await addDoc(collection(db, "Users"), {
            name: registerEmail,
            password: registerPassword
        });
        console.log("Document written with ID: ", docRef.id);
        const updateTimestamp = await updateDoc(docRef, {
            time_created: serverTimestamp()
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
      console.log("User registered");
      console.log(user);
  }
  catch (error) {
      console.log(error.message);
  }
  console.log("Data of Users", data);
  res.send({msg: "User Added"});
});

app.post("/update", async (req, res) => {
  const id = req.body.id;
  delete req.body.id;
  const data = req.body;
  await User.doc(id).update(data);
  res.send({ msg: "Updated" });
});

app.post("/delete", async (req, res) => {
  const data = req.body;
  try {
    const docRef = await deleteDoc(doc(db, "Users", data.name));
} catch (e) {
    console.error("Error removing document: ", e);
}
  console.log("User successfully deleted", data);
  res.send({msg: "User Deleted"});
});

app.listen(5000, () => console.log("Up & RUnning *5000"));