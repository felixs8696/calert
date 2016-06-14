import { Controller } from '../entities';

export default class MenuCtrl extends Controller {
  constructor() {
    super(...arguments);
    this.credentials = {};
    this.$reactive(this).attach(this.$scope);
  }

  login() {
    this.Login.showModal();
  }

  closeLogin() {
    this.Login.hideModal();
  }

  // Perform the login action when the user submits the login form
  doLogin() {
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          console.log(err);
        } else {
          this.closeLogin();
          this.$state.go('chats');
        }
      })
    );
  };
}

MenuCtrl.$inject = ['Login', '$timeout', '$reactive', '$scope'];
