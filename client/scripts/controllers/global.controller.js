import { Controller } from '../entities';

export default class GlobalCtrl extends Controller {
  constructor($scope, SessionService,$state) {
    super(...arguments);
    // this.sessionStatus = false;
    this.$state = $state;
    $scope.$watch(() => {
      return SessionService.inSession;
    }, (newValue, oldValue) => {
      // console.log(newValue);
      this.sessionStatus = newValue;
    });
    // console.log($state);
  }

  toggleMainMap() {
    if (this.$state.current.name == "app.map") this.$state.go("app.main");
    if (this.$state.current.name == "app.main") this.$state.go("app.map");
  }
}

GlobalCtrl.$inject = ['$scope', 'SessionService', '$state'];
