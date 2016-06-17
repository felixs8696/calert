import { Service } from '../entities';

export default class MeteorMapService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  getMap(name, callback) {
    Meteor.call('getMap', name, function (error, map) {
      if (error) this.$log.context('MeteorMapService.getMap').error(error);
      if (callback) callback(map);
    });
  }
  addMap(map, callback) {
    Meteor.call('addMap', map, function(error, recMap) {
      if (error) $log.context('MeteorMapService.addMap').error(error);
      if (callback) callback(recMap);
    });
  }
}

MeteorMapService.$inject=['$log'];
