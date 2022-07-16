import express from "express";
import * as admin from "firebase-admin";
import * as xmlbuilder from "xmlbuilder";
import * as fs from "fs";
import moment from "moment";
import { nounsMapConfig, firebaseConfig } from "../common/project";

import * as Sentry from "@sentry/node";

export const app = express();
export const router = express.Router();

// for test, db is not immutable
if (!admin.apps.length) {
  admin.initializeApp();
}

let db = admin.firestore();

export const updateDb = (_db) => {
  db = _db;
};

export const logger = async (req, res, next) => {
  next();
};
export const hello_response = async (req, res) => {
  res.json({ message: "hello" });
};

const lastmod = (restaurant) => {
  try {
    if (restaurant.updatedAt) {
      return moment(restaurant.updatedAt.toDate()).format("YYYY-MM-DD");
    }
    if (restaurant.createdAt) {
      return moment(restaurant.createdAt.toDate()).format("YYYY-MM-DD");
    }
  } catch (e) {
    console.log(e);
  }
  return "2020-07-01";
};

export const sitemap_response = async (req, res) => {
  try {
    const hostname = "https://" + nounsMapConfig.hostName;

    const urlset = xmlbuilder
      .create("urlset")
      .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    const docs = (
      await db
        .collection("restaurants")
        .where("publicFlag", "==", true)
        .where("deletedFlag", "==", false)
        .orderBy("updatedAt", "desc")
        .get()
    ).docs;
    await Promise.all(
      docs.map(async (doc) => {
        const url = urlset.ele("url");
        url.ele("loc", hostname + "/r/" + doc.id);
        url.ele("lastmod", lastmod(doc.data()));
      })
    );

    const xml = urlset.dec("1.0", "UTF-8").end({ pretty: true });

    res.setHeader("Content-Type", "text/xml");
    res.send(xml);
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return res.status(500).end();
  }
};

const escapeHtml = (str: string): string => {
  if (typeof str !== "string") {
    return "";
  }
  const mapping: any = {
    "&": "&amp;",
    "'": "&#x27;",
    "`": "&#x60;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return str.replace(/[&'`"<>]/g, function (match) {
    return mapping[match];
  });
};

const isId = (id: string) => {
  return /^[a-zA-Z0-9-]+$/.test(id);
};
const ogpPage = async (req: any, res: any) => {
  const { photo_id } = req.params;
  console.log(photo_id);
  const template_data = fs.readFileSync("./templates/index.html", {
    encoding: "utf8",
  });
  try {
    if (!isId(photo_id)) {
      console.error(`isId ${photo_id} failed`);
      return res.status(404).send(template_data);
    }
    const photouser = await db.doc(`photos/${photo_id}`).get();

    if (!photouser || !photouser.exists) {
      console.error(`photouser ${photo_id} not found`);
      return res.status(404).send(template_data);
    }
    const photouser_data: any = photouser.data();

    const photo = await db
      .doc(`users/${photouser_data.uid}/public_photos/${photo_id}`)
      .get();
    if (!photo || !photo.exists) {
      console.error(`user ${photouser_data.uid}/ photo ${photo_id} not found`);
      return res.status(404).send(template_data);
    }
    const photo_data: any = photo.data();
    if (photo_data.deletedFlag || !photo_data.publicFlag) {
      console.error(
        `delete or not public user ${photouser_data.uid}/ photo ${photo_id}  ${photo_data.deletedFlag} ${photo_data.publicFlag}`
      );
      return res.status(404).send(template_data);
    }

    const siteName = nounsMapConfig.siteName;
    const title = photo_data.title
      ? [photo_data.title, nounsMapConfig.pageTitle].join(" / ")
      : nounsMapConfig.siteName;
    const image = photo_data.images.ogp["600"].url;
    const description =
      photo_data.description || nounsMapConfig.siteDescription;
    const regexTitle = /<title.*title>/;
    const url = `https://${nounsMapConfig.hostName}/p/${escapeHtml(photo_id)}`;

    const metas = [
      `<title>${escapeHtml(title)}</title>`,
      `<meta data-n-head="1" charset="utf-8">`,
      `<meta data-n-head="1" name="viewport" content="width=device-width,initial-scale=1">`,
      `<meta name="description" content="${escapeHtml(description)}"/>`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:site" content="@nounsmap" />`,
      `<meta name="twitter:creator" content="@nounsmap" />`,
      `<meta name="twitter:description" content="${description}" />`,
      `<meta name="twitter:image" content="${image}" />`,
    ];
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");

    const regexBody = /<div id="__replace_body">/;

    const bodyString = [
      '<div id="__nuxt">',
      '<h1 style="font-size: 50px;">',
      escapeHtml(title),
      "</h1>",
      '<span style="font-size: 30px;">',
      escapeHtml(nounsMapConfig.introduction),
      "</span>",
    ].join("\n");
    res.send(
      template_data
        .replace(/<meta[^>]*>/g, "")
        .replace(regexTitle, metas.join("\n"))
        .replace(regexBody, bodyString)
    );
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
  }
};

const image = async (req: any, res: any) => {
  console.log("hello");
  const { contentsId } = req.params;
  console.log(contentsId);
  if (!/^[0-9a-zA-Z]+$/.test(contentsId)) {
    return res.status(404).send("not found");
  }
  const template_data = fs.readFileSync("./templates/index.html", {
    encoding: "utf8",
  });

  if (!isId(contentsId)) {
    console.error(`isId ${contentsId} failed`);
    return res.status(404).send(template_data);
  }
  const photouser = await db.doc(`photos/${contentsId}`).get();

  if (!photouser || !photouser.exists) {
    console.error(`photouser ${contentsId} not found`);
    return res.status(404).send(template_data);
  }
  const photouser_data: any = photouser.data();

  const photo = await db
    .doc(`users/${photouser_data.uid}/public_photos/${contentsId}`)
    .get();
  if (!photo || !photo.exists) {
    console.error(`user ${photouser_data.uid}/ photo ${contentsId} not found`);
    return res.status(404).send(template_data);
  }
  const photo_data: any = photo.data();
  if (photo_data.deletedFlag || !photo_data.publicFlag) {
    console.error(
      `delete or not public user ${photouser_data.uid}/ photo ${contentsId}  ${photo_data.deletedFlag} ${photo_data.publicFlag}`
    );
    return res.status(404).send(template_data);
  }
  const path = photo_data.images.resizedImages["watermark"].path;
  console.log(path);
  const imageObj = {
    bucket: firebaseConfig.storageBucket,
    name: `${path}`,
  };
  const bucketObj = admin.storage().bucket(imageObj.bucket);
  const image = await bucketObj
    .file(imageObj.name)
    .download()
    .then((contents) => {
      return Buffer.from(contents[0].buffer);
    });
  console.log(image);
  res.setHeader("Content-Type", "image/jpeg");
  res.type("jpg");
  res.send(image);
};

// eslint-disable-next-line
const debugError = async (req: any, res: any) => {
  // eslint-disable-line
  setTimeout(() => {
    throw new Error("sample error");
  }, 10);
};

app.use(express.json());
app.get("/p/:photo_id", ogpPage);
app.get("/sitemap.xml", sitemap_response);
app.get("/debug/error", debugError);
app.get("/contents/:contentsId", image);
