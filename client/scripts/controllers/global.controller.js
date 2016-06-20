import { Controller } from '../entities';

export default class GlobalCtrl extends Controller {
  constructor($scope, SessionService,$state, cfpLoadingBar) {
    super(...arguments);
    this.$state = $state;

    $scope.$watch(() => {
      return SessionService.inSession;
    }, (newValue, oldValue) => {
      this.sessionStatus = newValue;
    });

    $scope.$on('cfpLoadingBar:started', (event, data) => {
      this.showLoadingBar = true;
    });
    $scope.$on('cfpLoadingBar:completed', (event, data) => {
      this.showLoadingBar = false;
    });
  }

  toggleMainMap() {
    if (this.$state.current.name == "app.main") {
      this.$state.go("app.map");
    } else  {
      this.$state.go("app.main");
    }
  }
}

GlobalCtrl.$inject = ['$scope', 'SessionService', '$state', 'cfpLoadingBar'];
