import { functions } from "@/utils/firebase";
import { httpsCallable } from "firebase/functions";

export const photoPosted = httpsCallable(functions, "photoPosted");
export const photoInfoUpdated = httpsCallable(functions, "photoInfoUpdated");
export const photoDeleted = httpsCallable(functions, "photoDeleted");
export const photoNFTPosted = httpsCallable(functions, "photoNFTPosted");
export const photoNFTSync = httpsCallable(functions, "photoNFTSync");
export const photoNFTDownload = httpsCallable(functions, "photoNFTDownload");
export const generateNonce = httpsCallable(functions, "generateNonce");
export const verifyNonce = httpsCallable(functions, "verifyNonce");
export const deleteNonce = httpsCallable(functions, "deleteNonce");
