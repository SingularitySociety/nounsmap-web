import * as admin from "firebase-admin";

import exportIfNeeded from "./common/exportifneeded";
if (!admin.apps.length) {
    admin.initializeApp();
}

exportIfNeeded("api", "api", exports);
exportIfNeeded("test", "tests/test", exports);

 
