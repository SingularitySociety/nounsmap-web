import * as admin from "firebase-admin";

import exportIfNeeded from "./lib/exportifneeded";
if (!admin.apps.length) {
  admin.initializeApp();
}

exportIfNeeded("api", "api", exports);
exportIfNeeded("test", "tests/test", exports);
exportIfNeeded("photoPosted", "photo/photoPosted", exports);
