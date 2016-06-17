import { Service } from '../entities';

export default class MarkerIconService extends Service {
  constructor(uiGmapGoogleMapApi) {
    super(...arguments);
    uiGmapGoogleMapApi.then((maps)=> {
      var iconSize = new google.maps.Size(28, 38);
      this.markerIcons = {
        danger1: {url: "markers/marker-1.svg", scaledSize: iconSize},
        danger2: {url: "markers/marker-2.svg", scaledSize: iconSize},
        danger3: {url: "markers/marker-3.svg", scaledSize: iconSize},
        info: {url: "markers/marker-i.svg", scaledSize: iconSize}
      };
    });
  }

  getDangerMarkerIcon(index) {
    if (index >= 1 && index <= 3) {
      var key = 'danger' + index;
      return this.markerIcons[key];
    }
  }

  getInfoMarkerIcon() {
    return this.markerIcons['info'];
  }
}

MarkerIconService.$inject = ['uiGmapGoogleMapApi'];
