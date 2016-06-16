import { Service } from '../entities';

export default class NavigationService extends Service {
  constructor($log, uiGmapGoogleMapApi, MapService, IntervalService) {
    super(...arguments);
    this.$log = $log;
    this.MapService = MapService;
    this.IntervalService = IntervalService;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.marker = null;
  }
  initCurrentPos(gmap) {
    this.uiGmapGoogleMapApi.then(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: gmap
        });
      }, (error) => {
        this.$log.error(error);
      });
    });
  }

  startPosWatch(gmap) {
    this.uiGmapGoogleMapApi.then(() => {
      function diffSign(from, to) {
        if ((from == 0 && to != 0)||(from !=0 && to == 0)) return true;
        if ((from > 0 && to < 0) || (from < 0 && to > 0)) return true;
        return false;
      }

      transition = (from, to) => {
        var deltaLat = (to.lat - from.lat)/100;
        var deltaLng = (to.lng - from.lng)/100;
        var i = 0;
        this.IntervalService.createInterval("aniMark",() => {
          i++;
          if (i == 100 || (diffSign(to.lat-from.lat,deltaLat) || diffSign(to.lng-from.lng,deltaLng))) {
            this.IntervalService.cancelIntervalByKey("aniMark");
          }
          from.lat += deltaLat;
          from.lng += deltaLng;
          var latlng = new google.maps.LatLng(from.lat, from.lng);
          this.marker.setPosition(latlng);
        }, 10);
      }

      var watchId = navigator.geolocation.watchPosition((position) => {
        // TODO: Turn geocoder back on once you figure out what to do with it.
        // this.MapService.geocodeLatLng(this.geocoder, gmap, position.coords.latitude, position.coords.longitude);
        var pos = {lat: this.marker.position.lat(), lng: this.marker.position.lng()};
        var newPos = {lat: position.coords.latitude, lng: position.coords.longitude};
        transition(pos, newPos);
        console.log(newPos);
        gmap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      }, (error) => {
        this.$log.error(error);
      }, { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 });
      return watchId;
    });
  }
}

NavigationService.$inject = ['$log','uiGmapGoogleMapApi', 'MapService', 'IntervalService'];
