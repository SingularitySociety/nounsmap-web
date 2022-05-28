import * as functions from "firebase-functions";
import * as fs from "fs";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";
import * as imageUtil from "./image/imageUtil";
import * as map from "./map/map";

import { firebaseConfig } from "../common/project";

const defaultIconURL: string =
  "https://firebasestorage.googleapis.com/v0/b/nounsmap-web-dev.appspot.com/o/images%2Fconfigs%2Ficons%2Fred160px.png?alt=media&token=a05a89db-013e-4361-a035-181829c31d56";

const getIconPath = async (uid, pdata) => {
  if (pdata.iconURL.length > 1) {
    const iconObj = {
      bucket: firebaseConfig.storageBucket,
      name: `images/users/${uid}/public_icons/${pdata.iconId}/icon.svg`,
    };
    return imageUtil.downloadFileFromBucket(iconObj).then((tmpIcon) => {
      return imageUtil.resizeLocal(tmpIcon, 96);
    });
  } else {
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
  let tmpFile, tmpFiles, tmpBlend;
  const fromObj = {
    bucket: firebaseConfig.storageBucket,
    name: `images/users/${uid}/public_photos/${photoId}/original.jpg`,
  };
  const toObj = {
    bucket: firebaseConfig.storageBucket,
    name: ogpPath,
    context: "image/jpeg",
  };
  return Promise.all([
    map.downloadMapImage(_lat, _lng, _zoom),
    imageUtil.downloadFileFromBucket(fromObj).then((tmpPhoto) => {
      tmpFile = tmpPhoto;
      return imageUtil.resizeLocal(tmpPhoto, 220);
    }),
    getIconPath(uid, pdata),
  ])
    .then((ret) => {
      console.log(ret);
      tmpFiles = ret;
      return imageUtil.blendLocal(ret[0], ret[1], ret[2]);
    })
    .then((tmpBlendImage) => {
      console.log(tmpBlendImage);
      tmpBlend = tmpBlendImage;
      return Promise.all([
        imageUtil.uploadFileToBucket(tmpBlendImage, toObj),
        fs.unlinkSync(tmpFile),
        fs.unlinkSync(tmpFiles[0]),
        fs.unlinkSync(tmpFiles[1]),
      ]);
    })
    .then((ret) => {
      console.log(ret, tmpBlend);
      fs.unlinkSync(tmpBlend as string);
      return ret[0];
    });
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
    const _iconURL =
      photo.data().iconURL.length > 1 ? photo.data().iconURL : defaultIconURL;
    const _photoURL = photo.data().images.resizedImages["600"].url;
    console.log(url, _iconURL, _photoURL);
    await db.doc(`photos/${photoId}`).set(
      {
        uid,
        iconURL: _iconURL,
        photoURL: _photoURL,
        lat: _lat,
        lng: _lng,
        zoom: _zoom,
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
      },
      { merge: true }
    );
    return { success: true, url };
  } catch (error) {
    throw utils.process_error(error);
  }
};
