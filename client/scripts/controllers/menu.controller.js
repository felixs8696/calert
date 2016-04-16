import { Controller } from '../entities';

export default class MenuCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.loginData = {};
  }

  login() {
    this.Login.showModal();
  }

  closeLogin() {
    this.Login.hideModal();
  }

  // Perform the login action when the user submits the login form
  doLogin = function() {
    console.log('Doing login', this.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    this.$timeout(() => {
      this.closeLogin();
    }, 1000);
  };
}

MenuCtrl.$inject = ['Login', '$timeout'];
