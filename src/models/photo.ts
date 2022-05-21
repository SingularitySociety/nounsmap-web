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
