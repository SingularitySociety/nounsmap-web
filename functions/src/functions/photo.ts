import * as functions from "firebase-functions";
import * as fs from "fs";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";
import * as imageUtil from "./image/imageUtil";
import * as map from "./map/map";

import { firebaseConfig } from "../common/project";

const defaultIconURL =
  "https://firebasestorage.googleapis.com/v0/b/nounsmap-web-dev.appspot.com/o/images%2Fconfigs%2Ficons%2Fred160px.png?alt=media&token=a05a89db-013e-4361-a035-181829c31d56";

const getIconPath = async (uid, pdata) => {
  if (pdata.iconURL.length > 1) {
    const iconObj = {
      bucket: firebaseConfig.storageBucket,
      name: `images/users/${uid}/public_icons/${pdata.iconId}/icon.svg`,
    };
    const tmpIcon = await imageUtil.downloadFileFromBucket(iconObj);
    return await imageUtil.resizeLocal(tmpIcon, 96);
  } else {
    //const tempFilePath = path.join(os.tmpdir(), UUID());
    //fs.copyFileSync("./images/red160px.png",tempFilePath)
    //return tempFilePath
    return "./images/red160px.png";
  }
};

const uploadOGPImage = async (
  uid,
  photoId,
  pdata,
  _lat,
  _lng,
  _zoom,
  ogpPath
) => {
  let tmpFile;
  const fromObj = {
    bucket: firebaseConfig.storageBucket,
    name: `images/users/${uid}/public_photos/${photoId}/original.jpg`,
  };
  const toObj = {
    bucket: firebaseConfig.storageBucket,
    name: ogpPath,
    context: "image/jpeg",
  };
  const tmpFiles = await Promise.all([
    map.downloadMapImage(_lat, _lng, _zoom),
    imageUtil.downloadFileFromBucket(fromObj).then((tmpPhoto) => {
      tmpFile = tmpPhoto;
      return imageUtil.resizeLocal(tmpPhoto, 220);
    }),
    getIconPath(uid, pdata),
  ]);
  const tmpBlend = await imageUtil.blendLocal(
    tmpFiles[0],
    tmpFiles[1],
    tmpFiles[2]
  );
  console.log(tmpBlend);
  const ret = await Promise.all([
    imageUtil.uploadFileToBucket(tmpBlend, toObj),
    fs.unlinkSync(tmpFile),
    fs.unlinkSync(tmpFiles[0]),
    fs.unlinkSync(tmpFiles[1]),
  ]);
  console.log(ret);
  fs.unlinkSync(tmpBlend as string);
  return ret[0];
};

// This function is called by users after post user's photo
export const posted = async (
  db,
  data: any,
  context: functions.https.CallableContext | Context
) => {
  const uid = utils.validate_auth(context);
  const { photoId, lat, lng, zoom } = data;
  const _lat = Number(lat) || 0;
  const _lng = Number(lng) || 0;
  const _zoom = Number(zoom) || 10;
  const regex = /^[0-9a-zA-Z-]+$/;
  if (!regex.test(photoId)) {
    throw utils.process_error(`wrong photoId:${photoId}`);
  }
  utils.validate_params({ photoId }); // tip, sendSMS and lng are optinoal
  console.log(
    `user:${uid} photo:${photoId} lat:${_lat} lng:${_lng} zoom:${_zoom}`
  );
  const photo = await db.doc(`users/${uid}/public_photos/${photoId}`).get();
  if (!photo || !photo.exists || !photo.data()) {
    throw utils.process_error(
      `fire store data ,notfound user:${uid} photoId:${photoId}`
    );
  }
  const pdata = photo.data();
  console.log(pdata);
  const FieldValue = require("firebase-admin").firestore.FieldValue;
  try {
    const ogpPath = `images/users/${uid}/public_photos/${photoId}/ogp/600.jpg`;
    const url = await uploadOGPImage(
      uid,
      photoId,
      pdata,
      _lat,
      _lng,
      _zoom,
      ogpPath
    );
    const _iconURL = pdata.iconURL.length > 1 ? pdata.iconURL : defaultIconURL;
    const _photoURL = pdata.images.resizedImages["600"].url;
    console.log(url, _iconURL, _photoURL);
    await db.doc(`photos/${photoId}`).set(
      {
        uid,
        photoId,
        iconURL: _iconURL,
        photoURL: _photoURL,
        lat: _lat,
        lng: _lng,
        zoom: _zoom,
        createdAt: pdata.createdAt,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await db.doc(`users/${uid}/public_photos/${photoId}`).set(
      {
        title: "NounsMap Photo & News share!",
        description:
          "We are planning to release easy photo and map share service",
        images: {
          ogp: {
            [600]: {
              path: ogpPath,
              url,
            },
          },
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, url };
  } catch (error) {
    throw utils.process_error(error);
  }
};

// This function is called by users after post user's photo
export const nftPosted = async (
  db,
  data: any,
  context: functions.https.CallableContext | Context
) => {
  const { photoId } = data;
  console.log(data);
  const uid = utils.validate_auth(context);
  const regex = /^[0-9a-zA-Z-]+$/;
  if (!regex.test(photoId)) {
    throw utils.process_error(`wrong photoId:${photoId}`);
  }
  utils.validate_params({ photoId }); // tip, sendSMS and lng are optinoal
  const photo = await db.doc(`users/${uid}/public_photos/${photoId}`).get();
  if (!photo || !photo.exists || !photo.data()) {
    throw utils.process_error(
      `fire store data ,notfound user:${uid} photoId:${photoId}`
    );
  }
  const pdata = photo.data();
  console.log(pdata);
  const { lat, lng, zoom, iconURL } = pdata;
  const _lat = Number(lat) || 0;
  const _lng = Number(lng) || 0;
  const _zoom = Number(zoom) || 10;
  console.log(
    `user:${uid} photo:${photoId} lat:${_lat} lng:${_lng} zoom:${_zoom}`
  );
  try {
    // read from original
    let tmpFile;
    const fromObj = {
      bucket: firebaseConfig.storageBucket,
      name: `images/users/${uid}/public_photos/${photoId}/nft_original.jpg`,
    };
    // update resized
    const tmpFiles = await Promise.all([
      imageUtil.downloadFileFromBucket(fromObj).then((tmpPhoto) => {
        tmpFile = tmpPhoto;
        return imageUtil.resizeLocal(tmpPhoto, 600);
      }),
      getIconPath(uid, pdata),
    ]);
    // watermarked (same as original posted)
    const tmpBlend = await imageUtil.blendWaterMarkLocal(
      tmpFiles[0],
      tmpFiles[1]
    );
    console.log(tmpBlend);
    const watermarkPath = `images/users/${uid}/public_photos/${photoId}/watermark.jpg`;
    const toObj = {
      bucket: firebaseConfig.storageBucket,
      name: watermarkPath,
      context: "image/jpeg",
    };
    const ret = await Promise.all([
      imageUtil.uploadFileToBucket(tmpBlend, toObj),
      fs.unlinkSync(tmpFile),
      fs.unlinkSync(tmpFiles[0]),
      //fs.unlinkSync(tmpFiles[1]),
    ]);
    const url = ret[0];
    console.log(ret, url);
    fs.unlinkSync(tmpBlend as string);

    const FieldValue = require("firebase-admin").firestore.FieldValue;
    // update image meta for user
    await db.doc(`users/${uid}/public_photos/${photoId}`).update(
      {
        "images.resizedImages.wartermark": {
          path: watermarkPath,
          url,
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    // update image meta for public
    await db.doc(`photos/${photoId}`).update(
      {
        photoURL: url,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    // create nft_request for public

    await db.doc(`nft_request_photos/${photoId}`).set({
      creator: uid,
      photoId,
      photoURL: url,
      title: pdata.title,
      description: pdata.description,
      iconURL,
      lat,
      lng,
      zoom,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { success: true, url };
  } catch (error) {
    throw utils.process_error(error);
  }
};
