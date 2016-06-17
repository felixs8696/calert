import { Service } from '../entities';

export default class NavigationService extends Service {
  constructor($log, uiGmapGoogleMapApi, MapService, IntervalService, cfpLoadingBar, MarkerIconService) {
    super(...arguments);
    this.$log = $log;
    this.MapService = MapService;
    this.IntervalService = IntervalService;
    this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
    this.cfpLoadingBar = cfpLoadingBar;
    this.posWatcher = null;
    uiGmapGoogleMapApi.then(() => {
      this.marker = new google.maps.Marker();
    });
  }

  changeMarkerIcon(icon) {
    this.uiGmapGoogleMapApi.then((maps) => {
      this.marker.setIcon(icon);
      this.$log.context('NavigationService.changeMarkerIcon').log("Marker icon set to: "+ icon);
    })
  }

  initCurrentPos(gmap) {
    this.cfpLoadingBar.start();
    this.uiGmapGoogleMapApi.then(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.setTrackedMarker(latlng, gmap);
        this.cfpLoadingBar.complete();
      }, (error) => {
        this.$log.context('NavigationService.initCurrentPos').error(error);
      });
    });
    this.$log.context('NavigationService.initCurrentPos').debug("Current position found. Tracking Marker Set.");
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
          if (i >= 100 || (diffSign(to.lat-from.lat,deltaLat) || diffSign(to.lng-from.lng,deltaLng))) {
            this.IntervalService.cancelIntervalByKey("aniMark");
          }
          from.lat += deltaLat;
          from.lng += deltaLng;
          var latlng = new google.maps.LatLng(from.lat, from.lng);
          this.marker.setPosition(latlng);
        }, 10);
      }

      this.posWatcher = navigator.geolocation.watchPosition((position) => {
        // TODO: Turn geocoder back on once you figure out what to do with it.
        // this.MapService.geocodeLatLng(this.geocoder, gmap, position.coords.latitude, position.coords.longitude);
        var pos = {lat: this.marker.position.lat(), lng: this.marker.position.lng()};
        var newPos = {lat: position.coords.latitude, lng: position.coords.longitude};
        transition(pos, newPos);
        this.$log.context('NavigationService.startPosWatch.posWatcher').log('Location Update:' + newPos);
        gmap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      }, (error) => {
        this.$log.context('NavigationService.startPosWatch.posWatcher').error(error);
      }, { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 });
      this.$log.context('NavigationService.startPosWatch').debug("Started Position Watcher");
      return this.posWatcher;
    });
  }

  stopPosWatch() {
    navigator.geolocation.clearWatch(this.posWatcher);
    this.posWatcher = null;
    this.$log.context('NavigationService.stopPosWatch').debug("Position Watcher Halted");
  }

  setTrackedMarker(markerPosition, gmap) {
    if (markerPosition) {
      this.marker.setPosition(markerPosition);
      this.marker.setMap(gmap);
      gmap.panTo(markerPosition);
      gmap.setZoom(18);
    }
  }
}

NavigationService.$inject = ['$log','uiGmapGoogleMapApi', 'MapService', 'IntervalService', 'cfpLoadingBar', 'MarkerIconService'];
