import { Controller } from '../entities';

export default class MapCtrl extends Controller {
  constructor($scope, $log, uiGmapGoogleMapApi, uiGmapIsReady, Map, $timeout, IntervalService) {
    super(...arguments);

    // Map Variables
    // this.control = {};
    this.mapObj = Map;
    this.map = Map.map;

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
        Map.map.center = new google.maps.LatLng(Map.map.center.latitude, Map.map.center.longitude);
        this.map = Map.map;
        this.mapObj = Map;
        this.GMap = new google.maps.Map(document.getElementById("map"), this.map);
        $log.info("Map set", Map);
      }
      // Load the Map with the added options into the controller
      this.setMap(Map);

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

      var marker;
      navigator.geolocation.getCurrentPosition((pos) => {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: this.GMap
        });
      }, (error) => {
        switch(error.code) {
          case error.TIMEOUT:
            navigator.geolocation.getCurrentPosition(success, error);
            break;
        };
        $log.error(error);
      });

      var watchId = navigator.geolocation.watchPosition((position) => {
        // TODO: Turn geocoder back on once you figure out what to do with it.
        // TODO: Mayber replace geocoder with places service
        // this.geocodeLatLng(geocoder, this.GMap, position.coords.latitude, position.coords.longitude);
        var pos = {lat: marker.position.lat(), lng: marker.position.lng()};
        var newPos = {lat: position.coords.latitude, lng: position.coords.longitude};
        transition(pos, newPos);
        this.GMap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      }, (error) => {
        $log.error(error);
      }, { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 });

      function diffSign(from, to) {
        if ((from == 0 && to != 0)||(from !=0 && to == 0)) return true;
        if ((from > 0 && to < 0) || (from < 0 && to > 0)) return true;
        return false;
      }

      function transition(from, to){
        var deltaLat = (to.lat - from.lat)/100;
        var deltaLng = (to.lng - from.lng)/100;
        var i = 0;
        IntervalService.createInterval("aniMark",function(){
          i++;
          if (i == 100 || (diffSign(to.lat-from.lat,deltaLat) || diffSign(to.lng-from.lng,deltaLng))) {
            IntervalService.cancelIntervalByKey("aniMark");
          }
          from.lat += deltaLat;
          from.lng += deltaLng;
          var latlng = new google.maps.LatLng(from.lat, from.lng);
          marker.setPosition(latlng);
        }, 10);
      }
    });
  }
}

MapCtrl.$inject = ['$scope', '$log', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'Map', '$timeout', 'IntervalService'];
