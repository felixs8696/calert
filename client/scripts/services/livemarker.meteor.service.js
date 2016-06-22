import { Service } from '../entities';

export default class MeteorLiveMarkerService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  getLiveMarkerCursor(callback) {
    Meteor.call('getLiveMarkerArray', (error, liveMarkerCursor) => {
      if (error) this.$log.context('MeteorLiveMarkerService.getLiveMarkerCursor').error(angular.toJson(error));
      if (callback) callback(liveMarkerCursor);
    });
  }
  getLiveMarkerArray(callback) {
    Meteor.call('getLiveMarkerArray', (error, liveMarkerArray) => {
      if (error) this.$log.context('MeteorLiveMarkerService.getLiveMarkerArray').error(angular.toJson(error));
      if (callback) callback(liveMarkerArray);
    });
  }
  addLiveMarker(liveMarker, callback) {
    Meteor.call('addLiveMarker', liveMarker, (error, recLiveMarker) => {
      if (error) this.$log.context('MeteorLiveMarkerService.addLiveMarker').error(angular.toJson(error));
      if (callback) callback(recLiveMarker);
    });
  }
}

MeteorLiveMarkerService.$inject=['$log'];
