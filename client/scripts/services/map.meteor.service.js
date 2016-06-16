import { Service } from '../entities';

export default class MeteorMapService extends Service {
  constructor() {
    super(...arguments);
  }
  getMap(name, callback) {
    Meteor.call('getMap', name, function (error, map) {
      if (error) console.log(error);
      if (callback) callback(map);
    });
  }
  addMap(map, callback) {
    Meteor.call('addMap', map, function(error, recMap) {
      if (error) console.log(error);
      if (callback) callback(recMap);
    });
  }
}
