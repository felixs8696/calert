import { Controller } from '../entities';

export default class LoginCtrl extends Controller {
  constructor($scope, $reactive, $log, $state, Login) {
    super(...arguments);
    $reactive(this).attach($scope);
    this.credentials = {};
    // Controller variables
    this.$log = $log;
    this.$state = $state;

    // Scope variables
    this.error = '';
  }

  // Perform the login action when the user submits the login form
  login() {
    Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
          this.$log.error(err);
        } else {
          this.$state.go('app.map');
        }
      })
    );
  };
}

LoginCtrl.$inject = ['$scope', '$reactive', '$log', '$state', 'Login'];
