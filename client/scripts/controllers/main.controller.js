import { Controller } from '../entities';

export default class MainCtrl extends Controller {
  constructor($scope, $state, $ionicModal, SessionService, DangerService, $log, $ionicSlideBoxDelegate, uiGmapGoogleMapApi, NavigationService, PlatformService, MapService, $timeout, MarkerIconService, $ionicScrollDelegate, $ionicPopup, MeteorMarkerService) {
    super(...arguments);
    this.$state = $state;
    this.$log = $log;
    this.$scope = $scope;
    this.$timeout = $timeout;

    this.SessionService = SessionService;
    this.DangerService = DangerService;
    this.MapService = MapService;
    this.MarkerIconService = MarkerIconService;
    this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
    this.dangerLevel = DangerService.dangerLevel;
    this.decreaseDanger = DangerService.decreaseDanger;
    this.resetSession = DangerService.resetSession;

    this.errorAlert = () => {
      var alertPopup = $ionicPopup.alert({
       title: 'Missing Required Fields',
       template: 'Please swipe back and fill all fields marked in red or tap the bookmark to fill out the form later.'
      });

      alertPopup.then(function(res) {
       $log.context('MainCtrl.errorAlert').warn('Missing Required Fields');
      });
    };

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
          var marker = new google.maps.Marker({map: map, position: latLng, icon: MarkerIconService.getInfoMarkerIcon()});
          var geocoder = new google.maps.Geocoder;
          MapService.geocodeLatLng(geocoder, latLng.lat(), latLng.lng(), (place) => {
            $timeout(() => {
              this.event.address = place.geo.formatted_address;
              this.event.place = place;
            });
          })
        }
      })
    });

    this.openModal = () => {
      $scope.modal.show().then(() => {
        $ionicSlideBoxDelegate.update();
      });
      $log.context().debug("Report Incident Form Opened");
    }
    this.closeModal = () => {
      this.event = {};
      $scope.modal.hide().then(() => {
        $ionicSlideBoxDelegate.slide(0);
      });
      this.safeForm.$setPristine();
      this.safeForm.$setUntouched();
    }

    this.slideBoxNext = () => {
      this.$ionicSlideBoxDelegate.next();
    }
    this.slideBoxPrev = () => {
      this.$ionicSlideBoxDelegate.previous();
    }
    this.secondarySlideButton = () => {
      if ($ionicSlideBoxDelegate.currentIndex() < $ionicSlideBoxDelegate.slidesCount() -1) {
        return {icon: 'ion-arrow-right-c', func: this.slideBoxNext};
      } else {
        return {icon: 'ion-checkmark-round', func: this.submitSafeForm};
      }
    }

    this.saveDraft = () => {
      console.log(this.event);
      this.closeModal();
    }

    this.submitSafeForm = () => {
      this.safeForm.$setSubmitted();
      if (this.safeForm.$valid) {
        var dangerLevel = this.event.danger.split(' ')[0];
        var newTimestamp = new Date(this.event.date.getFullYear(), this.event.date.getMonth(), this.event.date.getDate(), this.event.time.getHours(), this.event.time.getMinutes(), this.event.time.getSeconds(), 0);
        if (this.event.anonymous == true) {
          this.event.reporter.firstName = undefined;
          this.event.reporter.lastName = undefined;
          this.event.reporter.email = undefined;
        }
        var newMarker = {
          id: this.MapService.map.markers.length,
          icon: this.MarkerIconService.getInfoMarkerIcon(),
          content: {
            current: false,
            title: this.event.title,
            reporter: this.event.reporter,
            danger: dangerLevel,
            timestamp: newTimestamp,
            people: this.event.others,
            description: this.event.description,
            place: this.event.place.geo.name,
            address: this.event.address,
            icon: this.event.place.geo.icon,
            suspects: this.event.suspects
          },
          mapId: this.MapService.mapObj._id,
          latitude: this.event.place.lat,
          longitude: this.event.place.lng
        };
        console.log(newMarker);
        MeteorMarkerService.addMarker(newMarker, (recMarker) => {
          this.$log.context().debug('Added to Markers collection in DB: '+ recMarker);
        })
        this.closeModal();
      } else {
        this.errorAlert();
      }
    }

    this.event = {};
    this.dangers = ['1 (non-emergency)','2 (caution)','3 (emergency)'];
    this.genders = ['M','F','Other','Non-Gender'];
    this.builds = ['Slim','Muscular','Fat','Medium','Solid','Obese'];
    this.ageRanges = ['1-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100','100+'];
    this.dangerCols = {1: '#FFD1D1', 2: '#FF5B5B', 3: '#FF0000', info: '#F2FFAA'}
    this.event.others = [];
    this.currentOther = "";
    this.suspectNumber = 1;
    this.suspectRange = this.arrayify(this.suspectNumber);
    this.suspectFocuses = {'arFocus': {0: false}, 'sgFocus': {0: false}, 'heFocus': {0: false}, 'sbFocus': {0: false},
                           'srFocus': {0: false}, 'haFocus': {0: false}, 'scFocus': {0: false}, 'saFocus': {0: false},
                           'swFocus': {0: false}, 'dfFocus': {0: false}, 'soFocus': {0: false}}

    this.otherEnter = () => {
      if (this.currentOther && this.currentOther.length > 0) {
        this.event.others.push(this.currentOther);
        this.currentOther = "";
      }
    }

    this.deleteChip = (index) => {
      this.event.others.splice(index,1);
    }

    this.adjustSuspects = (n) => {
      if (this.suspectNumber != 0) {
        this.suspectNumber += n;
      }
      this.suspectRange = this.arrayify(this.suspectNumber);
      $ionicSlideBoxDelegate.update();
    }

    this.suspectFocusControl = (focus, index) => {
      return this.suspectFocuses[focus][index];
    }

    this.suspectFocusToggle = (focus, index, bool) => {
      this.suspectFocuses[focus][index] = bool;
    }

    $scope.$watch(function(){
      return DangerService.getDangerLevel()
    },(newValue, oldValue)=>{
      this.dangerLevel = newValue;
    });

    $scope.$watch(() => {
      return SessionService.inSession;
    }, (newValue, oldValue) => {
      this.sessionStatus = newValue;
    });

    $ionicModal.fromTemplateUrl('client/templates/safe.form.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then((modal) => {
      $scope.modal = modal;
    });
  }
  viewMap() {
    this.$state.go('app.map');
  }

  displayToast(toastContent) {
    this.toastContent = toastContent;
    this.showToast = true;
    this.$timeout(()=>{
      this.showToast = false;
    },2000);
  }

  alertPress() {
    if (!this.SessionService.sessionStatus()) this.displayToast('Getting GPS Location...');
    this.SessionService.enterSession();
    this.dangerLevel = this.DangerService.increaseDanger();
  }

  markSafe() {
    if (this.SessionService.sessionStatus()) {
      this.event.marker = this.NavigationService.marker;
      this.event.danger = this.dangers[this.DangerService.dangerLevel - 1];
      this.SessionService.finishSession();
      this.DangerService.setDangerLevel(0);
      this.openModal();
      this.$log.context('MainCtrl.markSafe').info('User ('+ Meteor.userId() + ') Marked Safe');
    } else {
      this.displayToast('Not in Alert Mode');
    }
  }

  cancelAlert() {
    if (this.DangerService.dangerLevel > 0) {
      this.displayToast('Alert Canceled');
      this.SessionService.finishSession();
      this.DangerService.setDangerLevel(0);
      this.$log.context("MainCtrl.cancelAlert").info("Alert Canceled");
    }
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

  arrayify(num){
    return new Array(num)
  };

}

MainCtrl.$inject = ['$scope', '$state', '$ionicModal', 'SessionService', 'DangerService', '$log', '$ionicSlideBoxDelegate', 'uiGmapGoogleMapApi', 'NavigationService', 'PlatformService', 'MapService', '$timeout', 'MarkerIconService', '$ionicScrollDelegate', '$ionicPopup', 'MeteorMarkerService'];
