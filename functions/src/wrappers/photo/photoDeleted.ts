import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as Photo from "../../functions/photo";

const db = admin.firestore();

export default functions
  .runWith({
    memory: "1GB" as "1GB",
  })
  .https.onCall(async (data, context) => {
    return await Photo.deleted(db, data, context);
  });
