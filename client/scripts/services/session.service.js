import { Service } from '../entities';

export default class SessionService extends Service {
  constructor($log) {
    super(...arguments);
    this.inSession = false;
    this.$log = $log;
  }
  enterSession() {
    if (!this.inSession) {
      this.inSession = true;
      this.$log.info("Danger Session Entered")
    }
  }

  finishSession() {
    if (this.inSession) {
      this.inSession = false;
      this.$log.info("Danger Session Ended")
    }
  }

  sessionStatus() {
    return this.inSession;
  }

}

SessionService.$inject = ['$log'];
