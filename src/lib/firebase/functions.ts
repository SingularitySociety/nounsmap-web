import { functions } from "@/lib/firebase/firebase";
import { httpsCallable } from "firebase/functions";


export const photoPosted = httpsCallable(functions, "photoPosted");
