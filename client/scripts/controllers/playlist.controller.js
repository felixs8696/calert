import { Controller } from '../entities';

export default class PlaylistCtrl extends Controller {
  constructor($scope, $stateParams) {
    super(...arguments);
  }
}

PlaylistCtrl.$inject = ['$scope', '$stateParams'];
