export interface photoData {
  deletedFlag: boolean;
  publicFlag: boolean;
  description: string;
  id: string;
  type: string;
  images: {
    item: {
      resizedImages: {
        [key: string]: string;
      };
    };
  };
  lat: number;
  lng: number;
  zoom: number;
  plevel: number;
}

export const getNewPhotoData = (
  pid: string,
  org: string,
  path: string,
  lat: number,
  lng: number,
  zoom: number
) => {
  const photoData = {
    id: pid,
    description: "",
    original_name: org,
    images: {
      original: path,
    },
    lat: lat,
    lng: lng,
    zoom: zoom,
    plevel: 0,
    deletedFlag: false,
    publicFlag: true,
  };
  return photoData;
};
