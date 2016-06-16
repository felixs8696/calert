import { Controller } from '../entities';

export default class GlobalCtrl extends Controller {
  constructor($scope, SessionService) {
    super(...arguments);
    // this.sessionStatus = false;
    $scope.$watch(() => {
      return SessionService.inSession;
    }, (newValue, oldValue) => {
      console.log(newValue);
      this.sessionStatus = newValue;
    });
  }
}

GlobalCtrl.$inject = ['$scope', 'SessionService'];
