import { Service } from '../entities';

export default class SessionService extends Service {
  constructor() {
    super(...arguments);
    this.inSession = false;
  }
  enterSession() {
    this.inSession = true;
  }

  finishSession() {
    this.inSession = false;
  }

  sessionStatus() {
    return this.inSession;
  }

}

SessionService.$inject = [];
