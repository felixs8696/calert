import { Controller } from '../entities';

export default class MainCtrl extends Controller {
  constructor($scope, $state, $ionicModal, SessionService, DangerService, $log, $ionicSlideBoxDelegate, uiGmapGoogleMapApi, NavigationService, PlatformService, MapService, $timeout) {
    super(...arguments);
    this.$state = $state;
    this.$log = $log;
    this.$scope = $scope;

    this.event = {};
    this.dangers = ['1 (non-emergency)','2 (caution)','3 (emergency)'];
    this.genders = ['M','F','Other','Non-Gender'];
    this.builds = ['Slim','Muscular','Fat','Medium','Solid','Obese'];
    this.ageRanges = ['1-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100','100+'];
    this.dangerCols = {1: '#FFD1D1', 2: '#FF5B5B', 3: '#FF0000', info: '#F2FFAA'}
    this.others = [];

    this.SessionService = SessionService;
    this.DangerService = DangerService;
    this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
    this.dangerLevel = DangerService.dangerLevel;
    this.decreaseDanger = DangerService.decreaseDanger;
    this.resetSession = DangerService.resetSession;

    $scope.$watch(function(){
      return DangerService.getDangerLevel()
    },(newValue, oldValue)=>{
      this.dangerLevel = newValue;
    });

    $ionicModal.fromTemplateUrl('client/templates/safe.form.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then((modal) => {
      $scope.modal = modal;
    });

    $scope.$on('modal.shown', () => {
      if (PlatformService.isMobile()) document.getElementsByClassName("slide-box")[0].style.height = window.innerHeight - 43 + 'px';
      uiGmapGoogleMapApi.then((maps) => {
        var input = document.getElementById('pac-input');
        this.alertSearchBox = new google.maps.places.Autocomplete(input);
        var latLng = NavigationService.marker.position;
        if (latLng) {
          var map = new google.maps.Map(document.getElementById('clickMap'), {
            center: latLng, scrollwheel: false, zoom: 16, draggable: false
          });
          var marker = new google.maps.Marker({map: map, position: latLng});
          // Create a geocoder object to turn latlng object into a place
          var geocoder = new google.maps.Geocoder;
          MapService.geocodeLatLng(geocoder, latLng.lat(), latLng.lng(), (place) => {
            $timeout(() => {
              this.event.address = place.geo.formatted_address;
              console.log(place.geo.formatted_address);
              this.event.place = place;
            });
          })
        }
      })
    });
  }
  viewMap() {
    this.$state.go('app.map');
  }

  alertPress() {
    this.SessionService.enterSession();
    this.dangerLevel = this.DangerService.increaseDanger();
  }

  markSafe() {
    this.SessionService.finishSession();
    this.DangerService.setDangerLevel(0);
    this.openModal();
    this.$log.context('MainCtrl.markSafe').info('User ('+ Meteor.userId() + ') Marked Safe');
  }

  cancelAlert() {
    this.SessionService.finishSession();
    this.DangerService.setDangerLevel(0);
    this.$log.context("MainCtrl.cancelAlert").info("Alert Canceled");
  }

  dangerClass() {
    var danger1 = { background: "background-danger-1", primary: "primary-danger-1" };
    var danger2 = { background: "background-danger-2", primary: "primary-danger-2" };
    var danger3 = { background: "background-danger-3", primary: "primary-danger-3" };
    var noDanger = { background: null, primary: null };
    switch(this.dangerLevel) {
      case 1:
        return danger1;
      case 2:
        return danger2;
      case 3:
        return danger3;
      default:
        return noDanger;
    }
  }

  openModal(){
    this.$scope.modal.show();
    this.$log.context().debug("Report Incident Form Opened");
  }

  closeModal(safeForm){
    this.event = {};
    this.$scope.modal.hide();
    this.safeForm.$setPristine();
    this.safeForm.$setUntouched();
  }

  slideBoxNext() {
    this.$ionicSlideBoxDelegate.next();
  }

  slideBoxPrev() {
    this.$ionicSlideBoxDelegate.previous();
  }

}

MainCtrl.$inject = ['$scope', '$state', '$ionicModal', 'SessionService', 'DangerService', '$log', '$ionicSlideBoxDelegate', 'uiGmapGoogleMapApi', 'NavigationService', 'PlatformService', 'MapService', '$timeout'];
