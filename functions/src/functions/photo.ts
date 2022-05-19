import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as utils from "../lib/utils";
import { Context } from "../models/TestType";

// This function is called by users after post user's photo
export const posted = async (db, data: any, context: functions.https.CallableContext | Context) => {
    //const customerUid = utils.validate_auth(context);
    const { photoId,lat,lng,zoom } = data;
    const _lat = Number(lat) || 0;
    const _lng = Number(lng) || 0;
    const _zoom = Number(zoom) || 10;
    utils.validate_params({ photoId }); // tip, sendSMS and lng are optinoal
    
    try {
        const photoRef = db.doc(`photos/${photoId}`);
        return { success: true };
    } catch (error) {
        throw utils.process_error(error);
    }
};