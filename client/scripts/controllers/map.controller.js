import { Controller } from '../entities';

export default class MapCtrl extends Controller {
  constructor($scope, $log, uiGmapGoogleMapApi, uiGmapIsReady, Map) {
    super(...arguments);

    // Map Variables
    this.control = {};
    this.mapObj = Map;
    this.map = Map.map;

    uiGmapIsReady.promise().then((maps) => {
      // Retrieve Google Map Control Object to make built in methods available
      this.GMap = this.control.getGMap();
      // Create a geocoder object to turn latlng object into a place
      var geocoder = new google.maps.Geocoder;
      this.geocodeLatLng = (geocoder, map, latitude, longitude) => {
        var latlng = {lat: latitude, lng: longitude};
        geocoder.geocode({'location': latlng}, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              // If geocoder API returns result use places service to get place object
              var service = new google.maps.places.PlacesService(this.GMap);
              var geoPlace = results[1];
              service.getDetails({placeId: geoPlace.place_id}, (place, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                  console.log("Lat: " + place.geometry.location.lat() +
                              ", Lng: " + place.geometry.location.lng() +
                              ", Addr: " + place.formatted_address);
                } else {
                  $log.error(status);
                }
              });
            } else {
              $log.warn('No results found');
            }
          } else {
            $log.error('Geocoder failed due to: ' + status);
          }
        });
      }

      var marker = {
        id: this.map.markers.length,
        latitude: this.map.center.latitude,
        longitude: this.map.center.longitude
      };
      this.map.markers.push(marker);

      var success = (position) => {
        this.GMap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        var geocoder = new google.maps.Geocoder;
        this.geocodeLatLng(geocoder, this.GMap, position.coords.latitude, position.coords.longitude);
        console.log(position);
        var m = this.map.markers[this.map.markers.length-1]
        m.latitude = position.coords.latitude;
        m.longitude = position.coords.longitude;
      }

      var error = (err) => {
        switch(error.code) {
          case error.TIMEOUT:
            // Acquire a new position object.
            navigator.geolocation.getCurrentPosition(success, error);
            break;
        };
        $log.error(err);
      }

      var options = {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 0
        // distanceFilter: 1
      };

      var watchId = navigator.geolocation.watchPosition(success, error, options);
    });
    uiGmapGoogleMapApi.then((maps)=> {
      //Map Object Options set in Client when dependent on controller or files
      // Define Marker Icons to be set later
      var iconSize = new google.maps.Size(28, 38);
      this.markerIcons={
        danger1: {url: "markers/marker-1.svg", scaledSize: iconSize},
        danger2: {url: "/public/markers/marker-2.svg", scaledSize: iconSize},
        danger3: {url: "markers/marker-3.svg", scaledSize: iconSize},
        info: {url: "markers/marker-i.svg", scaledSize: iconSize}
      };
      // Define Map options that need to interact with the controller
      // TODO: Use REST protocol to set maps and update url
      this.setMap = (Map) => {
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
        this.map = Map.map;
        $log.info("Map set", Map);
      }
      // Load the Map with the added options into the controller
      this.setMap(Map);
      this.mapObj = Map;
    });
  }
}

MapCtrl.$inject = ['$scope', '$log', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'Map'];
