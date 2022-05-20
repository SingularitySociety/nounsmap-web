import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";
import * as imageUtil from "./image/imageUtil"
import * as map from "./map/map"
import * as path from "path";
import * as os from "os";
import UUID from "uuid-v4";

import { firebaseConfig } from "../common/project";


// This function is called by users after post user's photo
export const posted = async (db, data: any, context: functions.https.CallableContext | Context) => {
    //const customerUid = utils.validate_auth(context);
    console.log(context);
    const { photoId,lat,lng,zoom } = data;
    const _lat = Number(lat) || 0;
    const _lng = Number(lng) || 0;
    const _zoom = Number(zoom) || 10;
    const regex = /^[0-9a-zA-Z]+$/;
    if (!regex.test(photoId)) {  
      throw utils.process_error(`wrong photoId:${photoId}`);
    }  
    utils.validate_params({ photoId }); // tip, sendSMS and lng are optinoal
    const fromObj = {bucket:firebaseConfig.storageBucket , name:'images/photos/' + photoId + '/original.jpg'}
    const toObj = {bucket:firebaseConfig.storageBucket , name:'images/photos/' + photoId + '/ogp/600.jpg',context:"image/jpeg"}
    try {
        const tmpMap = await map.downloadMapImage(_lat,_lng,_zoom);
        const tmpPhoto = await imageUtil.downloadFileFromBucket(fromObj);
        const tmpResizedPhoto = await imageUtil.resizeLocal(tmpPhoto, 220);
        const iconPath = "./images/red160px.png";
        const tmpBlendImage = await imageUtil.blendLocal(tmpMap,tmpResizedPhoto,iconPath);
        const url = await imageUtil.uploadFileToBucket(tmpBlendImage,toObj);
        fs.unlinkSync(tmpBlendImage);
        fs.unlinkSync(tmpResizedPhoto);
        fs.unlinkSync(tmpPhoto);
        fs.unlinkSync(tmpMap);
        await db.doc(`photos/${photoId}`).set(
          {
            title:"NounsMap Photo & News share!",
            description:"We are planning to release easy photo and map share service",
            deletedFlag:false,
            publicFlag:true,
            images: {
              [600]: {
                url,
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

export const debugPhotoSync = async (db, data: any, context: functions.https.CallableContext | Context) => {
    console.log(context);
    const { photoId } = data;
    let storage = admin.storage();
    const objname = `images/photos/${photoId}/ogp/tmp.jpg`;  
    const toFilePath = `images/photos/${photoId}/ogp/600.jpg`;  
    const bucketObj = storage.bucket(firebaseConfig.storageBucket);
    const tempFilePath = path.join(os.tmpdir(), UUID());
  
    await bucketObj.file(objname).download({ destination: tempFilePath });
    console.log("Image downloaded locally to", tempFilePath);
    // upload
    const uuid = UUID();
    const ret = await bucketObj.upload(tempFilePath, {
      destination: toFilePath,
      metadata: {
        contentType: "image/jpeg",
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });
    // generate public image url see: https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
    const file = ret[0];
    const url = (process.env.FUNCTIONS_EMULATOR && process.env.FIRESTORE_EMULATOR_HOST) ?
      `http://localhost:9199/v0/b/${bucketObj.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`:
      `https://firebasestorage.googleapis.com/v0/b/${bucketObj.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
    await db.doc(`photos/${photoId}`).set(
      {
        title:"NounsMap Photo & News share!",
        description:"We are planning to release easy photo and map share service",
        deletedFlag:false,
        publicFlag:true,
        images: {
          [600]: {
            original: "no",
            url,
          },
        },
      },
      { merge: true }
    );
    return { success: true , url};
};
  