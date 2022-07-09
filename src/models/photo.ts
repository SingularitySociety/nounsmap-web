import { serverTimestamp, FieldValue } from "firebase/firestore";
import {TokenMeta} from "./SmartContract";
export interface PhotoInfo {
  file: File | null;
  size: { w: number; h: number } | null;
  resizedBlob: Blob | null;
  location: { lat: number; lng: number } | null;
}
export interface PhotoPubData {
  uid: string;
  photoId: string;
  iconURL: string;
  photoURL: string;
  lat: number;
  lng: number;
  zoom: number;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}
export interface PhotoOrgData {
  id: string;
  description: string;
  original_name: string;
  images: {
    resizedImages: {
      600: {
        path: string;
        url: string;
      };
    };
  };
  lat: number;
  lng: number;
  zoom: number;
  plevel: number;
  iconId: string;
  iconURL: string;
  deletedFlag: boolean;
  publicFlag: boolean;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface NftPhoto {
  nounsmapCreated: boolean,
  tokenId: string;
  tokenURI: TokenMeta,
  owner: string,
  photoId: string;
  photoURL: string;
  uid: string | null;
  iconURL: string | null;
  lat: number | null;
  lng: number | null;
  zoom: number | null;
  createdAt: FieldValue | null;
  updatedAt: FieldValue | null;
}

export const generateNewPhotoData = (
  pid: string,
  photoURL: string,
  org: string,
  path: string,
  lat: number,
  lng: number,
  zoom: number,
  iconId: string,
  iconURL: string
): PhotoOrgData => {
  const photoData = {
    id: pid,
    description: "",
    original_name: org,
    images: {
      resizedImages: {
        600: {
          path: path,
          url: photoURL,
        },
      },
    },
    lat: lat,
    lng: lng,
    zoom: zoom,
    plevel: 0,
    iconId,
    iconURL,
    deletedFlag: false,
    publicFlag: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  return photoData;
};
