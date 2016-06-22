import { Service } from '../entities';

export default class MeteorMapService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  getMap(name, callback) {
    Meteor.call('getMap', name, (error, map) => {
      if (error) this.$log.context('MeteorMapService.getMap').error(angular.toJson(error));
      if (callback) callback(map);
    });
  }
  addMap(map, callback) {
    Meteor.call('addMap', map, (error, recMap) => {
      if (error) this.$log.context('MeteorMapService.addMap').error(angular.toJson(error));
      if (callback) callback(recMap);
    });
  }
}

MeteorMapService.$inject=['$log'];
