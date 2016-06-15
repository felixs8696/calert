import { Controller } from '../entities';

export default class MenuCtrl extends Controller {
  constructor($log, $state) {
    super(...arguments);
    this.$log = $log;
    this.$state = $state;
  }

  // Logs the user out and returns to the home page
  logout() {
    Accounts.logout((error) => {
      if (error) $log.error(error);
      else this.$state.go('app.login');
    });
  }
}

MenuCtrl.$inject = ['$log', '$state'];
