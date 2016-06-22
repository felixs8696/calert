import { Controller } from '../entities';

export default class ProfileCtrl extends Controller {
  constructor($scope) {
    super(...arguments);
  }
}

ProfileCtrl.$inject = ['$scope'];
