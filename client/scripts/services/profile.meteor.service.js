import { Service } from '../entities';

export default class MarkerProfileService extends Service {
  constructor($log) {
    super(...arguments);
    this.$log = $log;
  }
  setProfile(profile, callback) {
    Meteor.call('setProfile', profile, (error, user) => {
      if (error) this.$log.context('MarkerProfileService.setProfile').error(angular.toJson(error));
      if (callback) callback(user);
    });
  }
}

MarkerProfileService.$inject=['$log'];
