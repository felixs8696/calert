import { Controller } from '../entities';

export default class MainCtrl extends Controller {
  constructor($scope, $state, $ionicModal, SessionService, DangerService, $log) {
    super(...arguments);
    this.$state = $state;
    this.$log = $log;
    this.SessionService = SessionService;
    this.DangerService = DangerService;
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

  closeModal(){
    this.$scope.modal.hide();
  }

}

MainCtrl.$inject = ['$scope', '$state', '$ionicModal', 'SessionService', 'DangerService', '$log'];
