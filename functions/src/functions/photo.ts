import * as functions from "firebase-functions";
import * as fs from "fs";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";
import * as imageUtil from "./image/imageUtil";
import * as map from "./map/map";

import { firebaseConfig } from "../common/project";

const defaultIconURL: string =
  "https://firebasestorage.googleapis.com/v0/b/nounsmap-web-dev.appspot.com/o/images%2Fconfigs%2Ficons%2Fred160px.png?alt=media&token=a05a89db-013e-4361-a035-181829c31d56";

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
  const fromObj = {
    bucket: firebaseConfig.storageBucket,
    name: `images/users/${uid}/public_photos/${photoId}/original.jpg`,
  };
  const toObj = {
    bucket: firebaseConfig.storageBucket,
    name: `images/users/${uid}/public_photos/${photoId}/ogp/600.jpg`,
    context: "image/jpeg",
  };
  try {
    const tmpMap = await map.downloadMapImage(_lat, _lng, _zoom);
    const tmpPhoto = await imageUtil.downloadFileFromBucket(fromObj);
    const tmpResizedPhoto = await imageUtil.resizeLocal(tmpPhoto, 220);
    const iconPath = "./images/red160px.png";
    const tmpBlendImage = await imageUtil.blendLocal(
      tmpMap,
      tmpResizedPhoto,
      iconPath
    );
    const url = await imageUtil.uploadFileToBucket(tmpBlendImage, toObj);
    fs.unlinkSync(tmpBlendImage);
    fs.unlinkSync(tmpResizedPhoto);
    fs.unlinkSync(tmpPhoto);
    fs.unlinkSync(tmpMap);

    const photo = await db.doc(`users/${uid}/public_photos/${photoId}`).get();
    if (!photo || !photo.exists) {
      return;
    }
    console.log(photo.data());
    const _iconURL =
      photo.data().iconURL.length > 1 ? photo.data().iconURL : defaultIconURL;
    const _photoURL = photo.data().images.resizedImages["600"].url;
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
              path: toObj.name,
              url,
            },
          },
        },
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    throw utils.process_error(error);
  }
};
