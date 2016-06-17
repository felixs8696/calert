import { Service } from '../entities';

export default class MarkerService extends Service {
  constructor(uiGmapGoogleMapApi,$filter) {
    super(...arguments);
    this.mapMarkers = {};
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.$filter = $filter;
    uiGmapGoogleMapApi.then(() => {
      this.infowindow = new google.maps.InfoWindow();
    })
  }

  addMarker(marker) {
    this.mapMarkers[marker._id] = marker;
    this.uiGmapGoogleMapApi.then(() => {
      google.maps.event.addListener(marker, 'mouseover', () => {
        var contentString = marker.content.title + " at " + this.$filter('date')(marker.content.timestamp,'short');
        this.infowindow.setContent(contentString);
        this.infowindow.open(marker.getMap(), marker);
      });
    });
  }

  getMarkerById(id) {
    return this.mapMarkers[id];
  }

}

MarkerService.$inject = ['uiGmapGoogleMapApi', '$filter'];
