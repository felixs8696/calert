import { Service } from '../entities';

export default class MapService extends Service {
  constructor(uiGmapGoogleMapApi, $log) {
    super(...arguments);
    this.map = undefined;
    this.mapObj = undefined;
    // this.GMap = undefined;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.$log = $log;
  }
  initMap(Map) {
    this.uiGmapGoogleMapApi.then((maps) => {
      Map.map.window = {
        marker: {},
        show: false,
        closeClick: () => {this.map.window.show = false;},
        options: {pixelOffset: new google.maps.Size(0, -40)}
      };
      Map.map.markersEvents = {
        mouseover: (marker, eventName, model) => {
          this.map.window.model = model;
          this.map.window.show = true;
        },
        click: (marker, eventName, model) => {
          this.map.event = model.content;
          // this.toggleInfo();
        }
      };
      Map.map.center = new google.maps.LatLng(Map.map.center.latitude, Map.map.center.longitude);
      this.map = Map.map;
      this.mapObj = Map;
      this.$log.info("Map set", Map);
    });
  }

  geocodeLatLng(geocoder, map, latitude, longitude) {
    this.uiGmapGoogleMapApi.then((maps) => {
      var latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({'location': latlng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            var service = new google.maps.places.PlacesService(map);
            var geoPlace = results[1];
            service.getDetails({placeId: geoPlace.place_id}, (place, status) => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                console.log("Lat: " + place.geometry.location.lat() + ", Lng: " + place.geometry.location.lng() + ", Addr: " + place.formatted_address);
              } else {
                this.$log.error(status);
              }
            });
          } else {
            this.$log.warn('No results found');
          }
        } else {
          this.$log.error('Geocoder failed due to: ' + status);
        }
      });
    })
  }
}

MapService.$inject = ['uiGmapGoogleMapApi', '$log'];
