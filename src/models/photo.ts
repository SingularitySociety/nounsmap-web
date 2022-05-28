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
) => {
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
  };
  return photoData;
};
