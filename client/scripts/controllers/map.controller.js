import { Controller } from '../entities';

export default class MapCtrl extends Controller {
  constructor($scope, $log, uiGmapGoogleMapApi, Map, MapService, MarkerIconService, NavigationService, SessionService, DangerService, PlatformService) {
    super(...arguments);
    this.$log = $log;

    // Map Variables
    this.mapObj = Map;
    this.map = Map.map;
    this.GMap = MapService.GMap;
    this.NavigationService = NavigationService;
    if (PlatformService.isMobile()) {
      console.log((window.innerHeight - 43) + 'px')
      document.getElementById("map").style.height = window.innerHeight - 43 + 'px';
    }

    uiGmapGoogleMapApi.then((maps)=> {
      // Define Map options that need to interact with the controller
      // TODO: Use REST protocol to set maps and update url
      this.setMap = () => {
        this.map = MapService.map;
        this.mapObj = MapService.mapObj;
        this.GMap = new google.maps.Map(document.getElementById("map"), this.map);
        MapService.initMapMarkers(this.GMap);
        if (PlatformService.isMobile()) this.GMap.draggable = true;
        if (this.NavigationService.isTracking()) NavigationService.setTrackedMarker(NavigationService.marker.position, this.GMap);
        // Create a geocoder object to turn latlng object into a place
        this.geocoder = new google.maps.Geocoder;
      }
      // Load the Map with the added options into the controller
      this.setMap(Map);
      $scope.$watch(() => {
        return SessionService.inSession;
      }, (sessionStatus, oldStatus) => {
        if(sessionStatus && !this.NavigationService.isTracking()) this.startTracking();
        if(!sessionStatus) this.stopTracking();
      });
    });
  }

  startTracking() {
    if (!this.GMap) this.setMap(Map);
    this.NavigationService.initCurrentPos(this.GMap);
    this.NavigationService.startPosWatch(this.GMap);
    this.NavigationService.startTrackingIndicator();
    this.$log.context('MapCtrl.startTracking').debug('Started Tracking Location');
  }

  stopTracking() {
    this.NavigationService.stopPosWatch();
    this.$log.context('MapCtrl.stopTracking').debug('Stopped Tracking Location');
  }
}

MapCtrl.$inject = ['$scope', '$log', 'uiGmapGoogleMapApi', 'Map', 'MapService', 'MarkerIconService', 'NavigationService', 'SessionService', 'DangerService', 'PlatformService'];
