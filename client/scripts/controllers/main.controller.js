import { Controller } from '../entities';

export default class MainCtrl extends Controller {
  constructor($scope, $state, $ionicModal, SessionService, DangerService) {
    super(...arguments);
    this.$state = $state;
    this.SessionService = SessionService;
    this.dangerLevel = DangerService.dangerLevel;
    this.increaseDanger = DangerService.increaseDanger;
    this.decreaseDanger = DangerService.decreaseDanger;
    this.resetSession = DangerService.resetSession;

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
    this.dangerLevel = this.increaseDanger();
  }

  markSafe() {
    this.resetSession();
    this.openModal();
    console.log("Danger Level (Reset): " + this.dangerLevel);
    console.log("Marked Safe");
  }

  cancelAlert() {
    this.resetSession();
    console.log("Danger Level (Cancel): " + this.dangerLevel);
    console.log("Alert Canceled");
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
  }

  closeModal(){
    this.$scope.modal.hide();
  }

}

MainCtrl.$inject = ['$scope', '$state', '$ionicModal', 'SessionService', 'DangerService'];
