import * as functions from "firebase-functions";
import * as fs from "fs";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";
import * as imageUtil from "./image/imageUtil";
import * as map from "./map/map";
import { BigNumber, ethers } from "ethers";
import { firebaseConfig, ContentsContract } from "../common/project";
import { firestore } from "firebase-admin";

const providerViewOnly = new ethers.providers.AlchemyProvider(
  ContentsContract.network
);
const contractViewOnly = new ethers.Contract(
  ContentsContract.address,
  ContentsContract.wabi.abi,
  providerViewOnly
);

const defaultIconURL =
  "https://firebasestorage.googleapis.com/v0/b/nounsmap-web-dev.appspot.com/o/images%2Fconfigs%2Ficons%2Fred160px.png?alt=media&token=a05a89db-013e-4361-a035-181829c31d56";

const getIconPath = async (pdata) => {
  if (pdata.iconURL.length > 1) {
    const tmpIcon = await imageUtil.downloadFile(pdata.iconURL);
    return await imageUtil.resizeLocal(tmpIcon, 96);
  } else {
    //const tempFilePath = path.join(os.tmpdir(), UUID());
    //fs.copyFileSync("./images/red160px.png",tempFilePath)
    //return tempFilePath
    return "./images/red160px.png";
  }
};

const uploadImages = async (
  uid,
  photoId,
  pdata,
  _lat,
  _lng,
  _zoom,
  ogpPath,
  waterPath
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
  const waterObj = {
    bucket: firebaseConfig.storageBucket,
    name: waterPath,
    context: "image/jpeg",
  };
  const tmpFiles = await Promise.all([
    map.downloadMapImage(_lat, _lng, _zoom),
    imageUtil.downloadFileFromBucket(fromObj).then((tmpPhoto) => {
      tmpFile = tmpPhoto;
      return imageUtil.resizeLocal(tmpPhoto, 220);
    }),
    getIconPath(pdata),
  ]);
  const tmpBlend = await imageUtil.blendLocal(
    tmpFiles[0],
    tmpFiles[1],
    tmpFiles[2]
  );
  // watermarked (same as original posted)
  const tmpWater = await imageUtil.blendWaterMarkLocal(tmpFile, tmpFiles[2]);

  const ret = await Promise.all([
    imageUtil.uploadFileToBucket(tmpBlend, toObj),
    imageUtil.uploadFileToBucket(tmpWater, waterObj),
    fs.unlinkSync(tmpFile),
    fs.unlinkSync(tmpFiles[0]),
    fs.unlinkSync(tmpFiles[1]),
  ]);
  console.log(ret);
  fs.unlinkSync(tmpBlend as string);
  fs.unlinkSync(tmpWater as string);
  return [ret[0], ret[1]];
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
    const waterPath = `images/users/${uid}/public_photos/${photoId}/watermark.jpg`;
    const urls = await uploadImages(
      uid,
      photoId,
      pdata,
      _lat,
      _lng,
      _zoom,
      ogpPath,
      waterPath
    );
    const _iconURL = pdata.iconURL.length > 1 ? pdata.iconURL : defaultIconURL;
    const _photoURL = urls[1];
    console.log(urls, _iconURL, _photoURL);
    await db.doc(`photos/${photoId}`).set(
      {
        uid,
        photoId,
        title: pdata.title,
        description: pdata.description,
        eventId: pdata.eventId,
        iconURL: _iconURL,
        photoURL: _photoURL,
        lat: _lat,
        lng: _lng,
        zoom: _zoom,
        createdAt: pdata.createdAt,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await db.doc(`users/${uid}/public_photos/${photoId}`).set(
      {
        images: {
          ogp: {
            [600]: {
              path: ogpPath,
              url: urls[0],
            },
          },
          resizedImages: {
            watermark: {
              path: waterPath,
              url: urls[1],
            },
          },
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true, urls };
  } catch (error) {
    throw utils.process_error(error);
  }
};

// This function is called by users after post user's photo
export const infoUpdated = async (
  db,
  data: any,
  context: functions.https.CallableContext | Context
) => {
  const uid = utils.validate_auth(context);
  const { photoId, title, eventId } = data;
  const regex = /^[0-9a-zA-Z-]+$/;  
  if (!regex.test(photoId)) {
    throw utils.process_error(`wrong photoId:${photoId}`);
  }
  console.log(
    `user:${uid} photo:${photoId} title:${title} eventId:${eventId}`
  );
  const photo = await db.doc(`users/${uid}/public_photos/${photoId}`).get();
  if (!photo || !photo.exists || !photo.data()) {
    throw utils.process_error(
      `fire store data ,notfound user:${uid} photoId:${photoId}`
    );
  }
  const pdata = photo.data();
  console.log(pdata);
  if ( pdata.title != title || pdata.eventId != eventId) {
    throw utils.process_error(`wrong call:${photoId},${title},${eventId}`);
  }  
  try {    
    await db.doc(`photos/${photoId}`).set(
      {
        title: pdata.title,
        description: pdata.description,
        eventId: pdata.eventId,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    throw utils.process_error(error);
  }
};

// This function is called by users on nft photo request cretion
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
      getIconPath(pdata),
    ]);
    // watermarked (same as original posted)
    const tmpBlend = await imageUtil.blendWaterMarkLocal(
      tmpFiles[0],
      tmpFiles[1]
    );
    console.log(tmpBlend);
    const watermarkPath = `images/nft_photos/${photoId}/watermark.jpg`;
    const toObj = {
      bucket: firebaseConfig.storageBucket,
      name: watermarkPath,
      context: "image/jpeg",
    };
    const toNft = `images/nft_photos/${photoId}/nft_original.jpg`;
    const ret = await Promise.all([
      imageUtil.uploadFileToBucket(tmpBlend, toObj),
      imageUtil.copyFileToBucket(fromObj, toNft),
      fs.unlinkSync(tmpFile),
      fs.unlinkSync(tmpFiles[0]),
      //fs.unlinkSync(tmpFiles[1]),
    ]);
    const url = ret[0];
    console.log(ret, url);
    fs.unlinkSync(tmpBlend as string);

    // update image meta for user
    await db.doc(`users/${uid}/public_photos/${photoId}`).update(
      {
        "images.resizedImages.wartermark": {
          path: watermarkPath,
          url,
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    // update image meta for public
    await db.doc(`photos/${photoId}`).update(
      {
        photoURL: url,
        updatedAt: firestore.FieldValue.serverTimestamp(),
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
      status: "init",
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true, url };
  } catch (error) {
    throw utils.process_error(error);
  }
};

// This function is called by user when open NFT view
export const nftSync = async (
  db,
  data: any,
  context: functions.https.CallableContext | Context
) => {
  const uid = utils.validate_auth(context);
  console.log("nftSync request from:", uid, data);
  try {
    //check latest token count, and already synced count
    let result = await contractViewOnly.functions.totalSupply();
    const limit = result[0].toNumber();
    const config = await db.doc(`configs/nft_sync`).get();
    const [start, end] = (() => {
      if (config && config.exists && config.data()) {
        if (config.data().checkedAddress != ContentsContract.address) {
          return [0, limit];
        }
        if (config.data().checkedCount) {
          return [config.data().checkedCount, limit];
        }
      }
      return [0, limit];
    })();
    console.log(start, end);

    for (let idx = start; idx < end; idx++) {
      const bigid = (await contractViewOnly.functions.tokenByIndex(idx))[0];
      const id = (bigid as BigNumber).toNumber();
      const uri = (await contractViewOnly.functions.tokenURI(id))[0];
      const tokenURI = JSON.parse(
        Buffer.from(
          uri.substr("data:application/json;base64,".length),
          "base64"
        ).toString()
      );
      const photoId = (await contractViewOnly.functions.getContents(id))[0];
      const attribute = (await contractViewOnly.functions.getAttributes(id))[0];
      console.log(id, photoId, attribute);
      const owner = (await contractViewOnly.functions.ownerOf(id))[0];
      const photo = await db.doc(`nft_photos/${photoId}`).get();
      if (photo && photo.exists && photo.data()) {
        continue;
      }
      const reqDoc = await db.doc(`nft_request_photos/${photoId}`).get();
      if (!reqDoc || !reqDoc.exists || !reqDoc.data()) {
        console.error("no request doc on photoId:", photoId);
        continue;
      }
      const { iconURL, photoURL, lat, lng, zoom } = reqDoc.data();
      console.log("set nft_photos", photoId);
      db.doc(`nft_photos/${photoId}`).set({
        nounsmapCreated: true,
        photoId,
        tokenURI,
        tokenId: id,
        contract: ContentsContract.address,
        iconURL,
        photoURL,
        lat,
        lng,
        zoom,
        owner,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log("update nft_request_photos", photoId);
      await db.doc(`nft_request_photos/${photoId}`).update(
        {
          status: "minted",
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log("update config nft_sync", end);
      await db.doc(`configs/nft_sync`).set(
        {
          checkedAddress: ContentsContract.address,
          checkedCount: end,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
    return { success: true, limit };
  } catch (error) {
    throw utils.process_error(error);
  }
};

// this can be called by only owner
export const nftDownloadURL = async (
  db,
  data: any,
  context: functions.https.CallableContext | Context
) => {
  console.log(data);
  const uid = utils.validate_auth(context);
  const { photoId } = data;
  utils.validate_params({ photoId });
  const regex = /^[0-9a-zA-Z-]+$/;
  if (!regex.test(photoId)) {
    throw utils.process_error(`wrong photoId:${photoId}`);
  }
  try {
    //check contents owner
    const bigId = (await contractViewOnly.functions.getTokenId(photoId))[0];
    console.log("tokenId:", bigId);
    const tokenId = (bigId as BigNumber).toNumber();
    let result = await contractViewOnly.functions.ownerOf(tokenId);
    if (ethers.utils.getAddress(uid) !== ethers.utils.getAddress(result[0])) {
      throw utils.process_error(
        `wrong user requested  request uid:${uid} actualOwner:${result[0]} photoId:${photoId}`
      );
    }
    const url = await imageUtil.downloadLink({
      name: `images/nft_photos/${photoId}/nft_original.jpg`,
    });
    console.log(url);
    return { success: true, url };
  } catch (error) {
    throw utils.process_error(error);
  }
};
