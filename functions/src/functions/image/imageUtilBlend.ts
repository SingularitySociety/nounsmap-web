import * as admin from "firebase-admin";

import * as path from "path";
import * as os from "os";
//import * as fs from "fs";
import sharp from "sharp";
import UUID from "uuid-v4";

export const resizeLocal = async (fromFileFullPath, size) => {
  const tmpResizeFile = path.join(os.tmpdir(), UUID());
  try {
    // resize
    await sharp(fromFileFullPath)
      .rotate()
      .resize(size, size, {
        fit: "inside",
      })
      .toFile(tmpResizeFile);

    return tmpResizeFile;
  } catch (e) {
    console.log("error", e);
  }
  return "";
};
export const blendLocal = async (mapFilePath, photoPath, iconPath, toFileFullPath) => {
  //const tmpResizeFile = path.join(os.tmpdir(), UUID(),".jpg");
  try {
    // resize
    await sharp(mapFilePath)
      .composite([
        {
          input: photoPath ,
          blend: "over",
          top:30,
          left:130,
        },
        {
          input: iconPath ,
          blend: "over",
          top:200,
          left:270,
        },

      ])
      .toFile(toFileFullPath);

    return true;
  } catch (e) {
    console.log("error", e);
  }
  return false;
};

export const uploadFileToBucket = async (tmpFile,object) => {
  const bucketObj = admin.storage().bucket(object.bucket);
    //const tmpResizeFile = path.join(os.tmpdir(), UUID());
  try {
    // upload
    const uuid = UUID();
    const ret = await bucketObj.upload(tmpFile, {
      destination: object.name,
      metadata: {
        contentType: object.contentType,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });
    const file = ret[0];
    return `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
  } catch (e) {
    console.log("error", e);
  }
  return false;
};
