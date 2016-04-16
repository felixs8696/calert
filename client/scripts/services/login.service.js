import { Service } from '../entities';

export default class Login extends Service {
  constructor() {
    super(...arguments);
    this.templateUrl = 'client/templates/login.html';
  }
  showModal() {
    console.log('showing login form');
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
    });
  }

  hideModal() {
    console.log('hiding login form');
    this.scope.$destroy();
    this.modal.remove();
  }
}

Login.$inject = ['$rootScope', '$ionicModal', '$timeout'];
