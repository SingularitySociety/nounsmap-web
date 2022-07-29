import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";
import UUID from "uuid-v4";
import axios, { AxiosRequestConfig } from "axios";

import * as constant from "./constant";

const runSharp = async (
  bucket,
  fromFileFullPath,
  toFileFullPath,
  size,
  contentType
) => {
  const tmpResizeFile = path.join(os.tmpdir(), UUID());

  try {
    // resize
    await sharp(fromFileFullPath)
      .rotate()
      .resize(size, size, {
        fit: "inside",
      })
      .toFile(tmpResizeFile);

    // upload
    const uuid = UUID();
    const ret = await bucket.upload(tmpResizeFile, {
      destination: toFileFullPath,
      metadata: {
        contentType: contentType,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });
    // generate public image url see: https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
    const file = ret[0];
    const url =
      process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST
        ? `http://localhost:9199/v0/b/${bucket.name}/o/${encodeURIComponent(
            file.name
          )}?alt=media&token=${uuid}`
        : `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
    return url;
  } catch (e) {
    console.log("error", e);
  }
  return false;
};
export const downloadFileFromBucket = async (object) => {
  const bucketObj = admin.storage().bucket(object.bucket);
  const tempFilePath = path.join(os.tmpdir(), UUID());

  await bucketObj.file(object.name).download({ destination: tempFilePath });
  console.log("Image downloaded locally to", tempFilePath);
  return tempFilePath;
};
export const downloadLink = async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  const meta = await bucket.file(object.name).getMetadata();
  //console.log("file meta ", meta);
  const url =
    process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST
      ? `http://localhost:9199/v0/b/${bucket.name}/o/${encodeURIComponent(
          object.name
        )}?alt=media&token=${meta[0].metadata.firebaseStorageDownloadTokens}`
      : `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(object.name)}?alt=media&token=${
          meta[0].metadata.firebaseStorageDownloadTokens
        }`;
  return url;
};
export const resizedImage = async (object, toFileFullPath, size) => {
  const bucketObj = admin.storage().bucket(object.bucket);

  const fromTempFilePath = await downloadFileFromBucket(object);
  const ret = await runSharp(
    bucketObj,
    fromTempFilePath,
    toFileFullPath,
    size,
    object.contentType
  );

  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  fs.unlinkSync(fromTempFilePath);
  return ret;
};

export const removeFile = async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  await bucket.file(object.name).delete();
};

export const validImagePath = (filePath, matchPaths) => {
  const filePaths = filePath.split("/");
  return matchPaths.reduce((ret, matchPath) => {
    const splitMatchPath = matchPath.path.split("/");
    return (
      ret ||
      (Object.keys(splitMatchPath).reduce((match, key) => {
        if (match === false) {
          return false;
        }
        if (splitMatchPath[key] === "*") {
          return true;
        }
        return filePaths[Number(key)] === splitMatchPath[key];
      }, true) &&
        filePaths.length === splitMatchPath.length)
    );
  }, false);
};

export const getFirestorePath = (filePath) => {
  const paths = filePath.split("/");
  if (validImagePath(filePath, [constant.originalPath])) {
    return paths.slice(1, 2).join("/");
  } else if (validImagePath(filePath, [constant.ogpPath])) {
    return paths.slice(1, 2).join("/");
  }
  return "";
};

export const getImageId = (filePath) => {
  const paths = filePath.split("/");
  return paths[paths.length - 1].split(".")[0];
};

export const getToFileFullPath = (filePath, size) => {
  // from aa/a.jpg -> to aa/resize/a_600.jpg
  const dirName = path.dirname(filePath) + "/resize";
  const fileName = path.basename(filePath);
  const thumbFileName = `${size}/${fileName}`;
  const toFileFullPath = path.join(dirName, thumbFileName);
  return toFileFullPath;
};

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
export const blendLocal = async (mapFilePath, photoPath, iconPath) => {
  const tmpFile = path.join(os.tmpdir(), UUID()) + ".jpg";
  try {
    // resize
    await sharp(mapFilePath)
      .composite([
        {
          input: iconPath,
          blend: "over",
          top: 180,
          left: 270,
        },
        {
          input: photoPath,
          blend: "over",
          top: 30,
          left: 130,
        },
      ])
      .toFile(tmpFile);
    return tmpFile;
  } catch (e) {
    console.log("error", e);
  }
  return "";
};

export const blendWaterMarkLocal = async (photoPath, iconPath) => {
  const tmpFile = path.join(os.tmpdir(), UUID()) + ".jpg";
  const tmpFile2 = path.join(os.tmpdir(), UUID()) + ".jpg";
  try {
    const size = 200; //watermark_size
    await sharp(iconPath)
      .greyscale()
      .resize(size, size, {
        fit: "inside",
      })
      .toFile(tmpFile);

    await sharp(photoPath)
      .composite([
        {
          input: tmpFile,
          blend: "multiply",
          top: 10,
          left: 20,
        },
      ])
      .toFile(tmpFile2);
    fs.unlinkSync(tmpFile);
    return tmpFile2;
  } catch (e) {
    console.log("error", e);
  }
  return "";
};

export const uploadFileToBucket = async (tmpFile, object) => {
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
    const url =
      process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST
        ? `http://localhost:9199/v0/b/${object.bucket}/o/${encodeURIComponent(
            file.name
          )}?alt=media&token=${uuid}`
        : `https://firebasestorage.googleapis.com/v0/b/${
            object.bucket
          }/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
    return url;
  } catch (e) {
    console.log("error", e);
  }
  return false;
};

export const copyFileToBucket = async (fromObj, toPath) => {
  const bucketObj = admin.storage().bucket(fromObj.bucket);
  const ret = await bucketObj.file(fromObj.name).copy(toPath);
  console.log("Image copied", ret);
  return;
};

export const downloadFile = async (url) => {
  try {
    const tmpFile = path.join(os.tmpdir(), UUID()) + ".jpg";
    const config = { responseType: "arraybuffer" };
    const ret = await axios.get(url, config as AxiosRequestConfig);
    await fs.promises.writeFile(tmpFile, ret.data);
    return tmpFile;
  } catch (e) {
    console.log("error", e);
  }
  return null;
};
