import { Controller } from '../entities';

export default class MapCtrl extends Controller {
  constructor($scope, $log, uiGmapGoogleMapApi, uiGmapIsReady, Map, $timeout, IntervalService, MapService, MarkerIconService, NavigationService, SessionService) {
    super(...arguments);

    // Map Variables
    // this.control = {};
    this.mapObj = Map;
    this.map = Map.map;
    this.NavigationService = NavigationService;
    this.isTracking = false;

    uiGmapGoogleMapApi.then((maps)=> {
      // Define Map options that need to interact with the controller
      // TODO: Use REST protocol to set maps and update url
      this.setMap = () => {
        this.map = MapService.map;
        this.mapObj = MapService.mapObj;
        this.GMap = new google.maps.Map(document.getElementById("map"), this.map);
        // Create a geocoder object to turn latlng object into a place
        this.geocoder = new google.maps.Geocoder;
      }
      // Load the Map with the added options into the controller
      this.setMap(Map);
      $scope.$watch(() => {
        return SessionService.inSession;
      }, (sessionStatus, oldStatus) => {
        if(!this.isTracking && sessionStatus) this.startTracking();
        if (!sessionStatus) this.stopTracking();
      });
    });
  }

  startTracking() {
    if (!this.GMap) this.setMap(Map);
    this.NavigationService.initCurrentPos(this.GMap);
    this.NavigationService.startPosWatch(this.GMap);
    this.isTracking = true;
  }

  stopTracking() {

  }
}

MapCtrl.$inject = ['$scope', '$log', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'Map', '$timeout', 'IntervalService', 'MapService', 'MarkerIconService', 'NavigationService', 'SessionService'];
