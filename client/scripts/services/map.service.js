import { Service } from '../entities';

export default class MapService extends Service {
  constructor(uiGmapGoogleMapApi, $log, $filter, MarkerService) {
    super(...arguments);
    this.map = undefined;
    this.mapObj = undefined;
    this.GMap = undefined;
    // this.GMap = undefined;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.MarkerService = MarkerService;
    this.$log = $log;
    this.$filter = $filter;
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
      this.$log.context('MapService.initMap').debug("Map set", Map);
    });
  }

  initMapMarkers(gmap) {
    this.GMap = gmap;
    this.uiGmapGoogleMapApi.then((maps) => {
      for (var i = 0; i < this.map.markers.length; i++) {
        var marker = this.map.markers[i];
        var newMarker = new google.maps.Marker({
          position: {lat: marker.latitude, lng: marker.longitude},
          map: gmap,
          icon: marker.icon,
          _id: marker._id,
          id: marker.id,
          content: marker.content,
          mapId: marker.mapId
        });
        this.MarkerService.addMarker(newMarker);
      }
    });
  }

  geocodeLatLng(geocoder, latitude, longitude, callback) {
    this.uiGmapGoogleMapApi.then((maps) => {
      var latlng = {lat: latitude, lng: longitude};
      geocoder.geocode({'location': latlng}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            var service = new google.maps.places.PlacesService(document.createElement('div'));
            var geoPlace = results[1];
            service.getDetails({placeId: geoPlace.place_id}, (place, status) => {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                this.$log.context('MapService.geocodeLatLng').log("Lat: " + place.geometry.location.lat() + ", Lng: " + place.geometry.location.lng() + ", Addr: " + place.formatted_address);
                callback({geo: results[1], lat: latitude, lng: longitude});
              } else {
                this.$log.context('MapService.geocodeLatLng').error(angular.toJson(status));
              }
            });
          } else {
            this.$log.context('MapService.geocodeLatLng').warn('No results found');
          }
        } else {
          this.$log.context('MapService.geocodeLatLng').error('Geocoder failed due to: ' + angular.toJson(status));
        }
      });
    })
  }
}

MapService.$inject = ['uiGmapGoogleMapApi', '$log', '$filter', 'MarkerService'];
