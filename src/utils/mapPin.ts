import { Ref } from "vue";
import router from "@/router";
import { getLocaleName } from "@/i18n/utils";

interface PinData {
  pid: string | null;
  title: string | null;
  icon?: google.maps.Icon;
  photoURL: string;
  lat: number;
  lng: number;
  zoom: number;
  visibility: boolean;
}
export class Pin {
  protected _mapInstance: Ref<typeof google>;
  protected _mapObj: Ref<google.maps.Map>;
  protected _marker: google.maps.Marker;
  protected _infoWindow: google.maps.InfoWindow;
  protected _data: PinData;

  protected contentString(photoURL: string) {
    return (
      '<div id="content">' +
      '<div  id="siteNotice">' +
      '<img  class="w-16 lg:w-32 xl:w-32" src="' +
      photoURL +
      '" />' +
      "</div>" +
      "</div>"
    );
  }

  protected contentStringLarge(photoURL: string) {
    return (
      '<div id="content">' +
      '<div  id="siteNotice">' +
      '<img  class="w-48" src="' +
      photoURL +
      '" />' +
      "</div>" +
      "</div>"
    );
  }

  constructor(
    mapInstance: Ref<typeof google>,
    mapObj: Ref<google.maps.Map>,
    data: PinData,
    eventId: number
  ) {
    this._mapInstance = mapInstance;
    this._mapObj = mapObj;

    this._marker = new mapInstance.value.maps.Marker({
      icon: data.icon,
      position: new mapInstance.value.maps.LatLng(data.lat, data.lng),
      map: mapObj.value,
      visible: data.visibility,
    });
    this._infoWindow = new mapInstance.value.maps.InfoWindow({
      content: this.contentString(data.photoURL),
    });
    this._infoWindow.setContent(this.contentString(data.photoURL));
    this.showPhoto();
    this._marker.addListener("click", () => {
      this._infoWindow.open({
        anchor: this._marker,
        map: mapObj.value,
        shouldFocus: false,
      });
      if (data.pid) {
        if (eventId > 0) {
          router.push({
            name: getLocaleName(router, "eventphoto"),
            params: { eventId, photoId: data.pid },
          });
        } else {
          router.push({
            name: getLocaleName(router, "photo"),
            params: { photoId: data.pid },
          });
        }
      }
    });
    this._data = data;
  }
  data() {
    return this._data;
  }
  setContent() {
    this._infoWindow.setContent(this.contentString(this._data.photoURL));
  }
  setContentLarge() {
    this._infoWindow.setContent(this.contentStringLarge(this._data.photoURL));
  }
  setZ(index: number) {
    this._marker.setZIndex(index);
    this._infoWindow.setZIndex(index);
  }
  showPhoto() {
    this._infoWindow.open({
      anchor: this._marker,
      map: this._mapObj.value,
      shouldFocus: false,
    });
  }
  hidePhoto() {
    this._infoWindow.close();
  }

  update(data: Partial<PinData>) {
    this._data = { ...this._data, ...data };

    if (data.icon != null) {
      this._marker.setIcon(data.icon);
    }

    if (data.photoURL != null) {
      this._infoWindow.setContent(this.contentString(data.photoURL));
    }
    if (data.lat != null || data.lng != null) {
      const latlng = new google.maps.LatLng(
        data.lat ?? this._data.lat,
        data.lng ?? this._data.lng
      );
      this._marker.setPosition(latlng);
    }

    if (data.visibility != null) {
      this._marker.setVisible(data.visibility);
      if (!data.visibility) {
        this.hidePhoto();
      }
    }
  }
  delete() {
    this.hidePhoto();
    this._marker.setVisible(false);
    this._marker.setMap(null);
  }
}

export class PinsType {
  [id: string]: Pin;
}
