import { Controller } from '../entities';

export default class MenuCtrl extends Controller {
  constructor($log, $state, $ionicHistory) {
    super(...arguments);
    this.$log = $log;
    this.$state = $state;
    this.$ionicHistory = $ionicHistory;
  }

  // Logs the user out and returns to the home page
  logout() {
    this.$ionicHistory.nextViewOptions({
      disableBack: true
    });
    Accounts.logout((error) => {
      if (error) $log.context('MenuCtrl.logout').error(error);
      else this.$state.go('login');
    });
  }
}

MenuCtrl.$inject = ['$log', '$state', '$ionicHistory'];
