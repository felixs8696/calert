import { Controller } from '../entities';

export default class MapCtrl extends Controller {
  constructor($scope, $log, uiGmapGoogleMapApi, Map, MapService, MarkerIconService, NavigationService, SessionService, DangerService) {
    super(...arguments);

    // Map Variables
    this.mapObj = Map;
    this.map = Map.map;
    this.NavigationService = NavigationService;
    this.isTracking = false;

    // $scope.$watch(function() {
    //   return DangerService.getDangerLevel();
    // }, (newValue, oldValue) => {
    //   console.log(newValue);
    //   if (newValue > 0) NavigationService.changeMarkerIcon(MarkerIconService.getDangerMarkerIcon(newValue));
    // })

    uiGmapGoogleMapApi.then((maps)=> {
      // Define Map options that need to interact with the controller
      // TODO: Use REST protocol to set maps and update url
      this.setMap = () => {
        this.map = MapService.map;
        this.mapObj = MapService.mapObj;
        this.GMap = new google.maps.Map(document.getElementById("map"), this.map);
        MapService.initMapMarkers(this.GMap);
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

MapCtrl.$inject = ['$scope', '$log', 'uiGmapGoogleMapApi', 'Map', 'MapService', 'MarkerIconService', 'NavigationService', 'SessionService', 'DangerService'];
