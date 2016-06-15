import { Controller } from '../entities';

export default class MainCtrl extends Controller {
  constructor($state) {
    super(...arguments);
  }
}

MainCtrl.$inject = ['$state'];
