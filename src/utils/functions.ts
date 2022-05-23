import { functions } from "@/utils/firebase";
import { httpsCallable } from "firebase/functions";

export const photoPosted = httpsCallable(functions, "photoPosted");
export const testFunctions = httpsCallable(functions, "test");
