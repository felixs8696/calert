import { Service } from '../entities';

export default class MeteorMarkerService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  getMarkerArray(callback) {
    Meteor.call('getMarkerArray', (error, markerArr) => {
      if (error) this.$log.context('MeteorMarkerService.getMarkerArray').error(angular.toJson(error));
      if (callback) callback(markerArr);
    });
  }
  addMarker(marker, callback) {
    Meteor.call('addMarker', marker, (error, recMarker) => {
      if (error) this.$log.context('MeteorMarkerService.addMarker').error(angular.toJson(error));
      if (callback) callback(recMarker);
    });
  }
}

MeteorMarkerService.$inject=['$log'];
