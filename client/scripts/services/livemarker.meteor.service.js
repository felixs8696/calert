import { Service } from '../entities';

export default class MeteorLiveMarkerService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  getLiveMarkerCursor(callback) {
    Meteor.call('getLiveMarkerArray', function (error, liveMarkerCursor) {
      if (error) this.$log.context('MeteorLiveMarkerService.getLiveMarkerCursor').error(angular.toJson(error));
      if (callback) callback(liveMarkerCursor);
    });
  }
  getLiveMarkerArray(callback) {
    Meteor.call('getLiveMarkerArray', function (error, liveMarkerArray) {
      if (error) this.$log.context('MeteorLiveMarkerService.getLiveMarkerArray').error(angular.toJson(error));
      if (callback) callback(liveMarkerArray);
    });
  }
  addLiveMarker(liveMarker, callback) {
    Meteor.call('addLiveMarker', liveMarker, function(error, recLiveMarker) {
      if (error) $log.context('MeteorLiveMarkerService.addLiveMarker').error(angular.toJson(error));
      if (callback) callback(recLiveMarker);
    });
  }
}

MeteorLiveMarkerService.$inject=['$log'];
