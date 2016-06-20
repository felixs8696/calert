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
      var SlidingMarker = require('marker-animate-unobtrusive');
      this.marker = new SlidingMarker({duration: 1000});
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
        if (gmap) {
          this.setTrackedMarker(latlng, gmap);
        } else {
          this.setTrackedMarker(latlng);
        }
        this.gotCurrentLocation = true;
        this.cfpLoadingBar.complete();
      }, (error) => {
        this.$log.context('NavigationService.initCurrentPos').error(angular.toJson(error));
        if (error.code == error.PERMISSION_DENIED) {
          this.$log.context('NavigationService.initCurrentPos').warn('Location Services not on');
        }
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
        var pos = {lat: this.marker.position.lat(), lng: this.marker.position.lng()};
        var newPos = {lat: position.coords.latitude, lng: position.coords.longitude};
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // transition(pos, newPos);
        this.marker.setPosition(latlng);
        // this.$log.context('NavigationService.startPosWatch.posWatcher').log('Location Update:' + newPos);
        if (gmap) {
          // TODO: Turn geocoder back on once you figure out what to do with it.
          // this.MapService.geocodeLatLng(this.geocoder, gmap, position.coords.latitude, position.coords.longitude);
          this.fitBounds(gmap, this.marker.position);
        }
      }, (error) => {
        this.$log.context('NavigationService.startPosWatch.posWatcher').error(angular.toJson(error));
        if (error.code == error.PERMISSION_DENIED) {
          this.$log.context('NavigationService.initCurrentPos').warn('Location Services not on');
        }
      }, { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 });
      this.$log.context('NavigationService.startPosWatch').debug("Started Position Watcher");
      return this.posWatcher;
    });
  }

  stopPosWatch() {
    this.gotCurrentLocation = false;
    navigator.geolocation.clearWatch(this.posWatcher);
    this.posWatcher = null;
    this.$log.context('NavigationService.stopPosWatch').debug("Position Watcher Halted");
  }

  setTrackedMarker(markerPosition, gmap) {
    if (markerPosition) {
      this.marker.setPosition(markerPosition);
      if (gmap) {
        this.marker.setMap(gmap);
        navigator.geolocation.clearWatch(this.posWatcher);
        this.startPosWatch(gmap);
      }
    }
  }

  startTrackingIndicator() {
    this.startedTracking = true;
  }

  stopTrackingIndicator() {
    this.startedTracking = false;
  }

  isTracking() {
    return this.startedTracking;
  }

  fitBounds(gmap, markerPosition) {
    var ne = gmap.getBounds().getNorthEast();
    var sw = gmap.getBounds().getSouthWest();
    var topLat = ne.lat();
    var rightLng = ne.lng();
    var bottomLat = sw.lat();
    var leftLng = sw.lng();
    var dstTop = Math.abs(topLat - markerPosition.lat());
    var dstBottom = Math.abs(markerPosition.lat() - bottomLat);
    var dstRight = Math.abs(rightLng - markerPosition.lng());
    var dstLeft = Math.abs(markerPosition.lng() - leftLng);
    if(!gmap.getBounds().contains(markerPosition) || dstTop <= 0.001 || dstBottom <= 0.001 || dstRight <= 0.001 || dstLeft <= 0.001) {
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(markerPosition);
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
         var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.003, bounds.getNorthEast().lng() + 0.003);
         var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.003, bounds.getNorthEast().lng() - 0.003);
         bounds.extend(extendPoint1);
         bounds.extend(extendPoint2);
      }
      gmap.fitBounds(bounds);
    }
  }
}

NavigationService.$inject = ['$log','uiGmapGoogleMapApi', 'MapService', 'IntervalService', 'cfpLoadingBar', 'MarkerIconService'];
