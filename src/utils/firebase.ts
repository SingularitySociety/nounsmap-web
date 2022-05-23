import { initializeApp } from "firebase/app";

//import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

import { firebaseConfig, nounsMapConfig } from "../config/project";

const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage();
export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions(firebaseApp);
if (nounsMapConfig.useEmulator) {
  console.log("firebase emulator mode");
  //connectAuthEmulator(auth,"localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8095);
  connectStorageEmulator(storage, "localhost", 9199);
  connectFunctionsEmulator(functions, "localhost", 5002);
}
