import { Service } from '../entities';

export default class SessionService extends Service {
  constructor($log, NavigationService) {
    super(...arguments);
    // this.inSession = false;
    this.$log = $log;
    this.NavigationService = NavigationService;
  }
  enterSession() {
    if (!this.inSession) {
      this.inSession = true;
      this.NavigationService.initCurrentPos();
      this.NavigationService.startPosWatch();
      // this.NavigationService.startTrackingIndicator();
      this.$log.context('SessionService.enterSession').debug("Alert Session Entered. Started Tracking Location.")
    }
  }

  finishSession() {
    if (this.inSession) {
      this.inSession = false;
      this.NavigationService.stopPosWatch();
      this.NavigationService.stopTrackingIndicator();
      // TODO: Save marker to recent sessions in profile
      // TODO: this.marker = null;
      this.$log.context('SessionService.finishSession').debug("Alert Session Ended")
    }
  }

  sessionStatus() {
    return this.inSession;
  }

}

SessionService.$inject = ['$log', 'NavigationService'];
