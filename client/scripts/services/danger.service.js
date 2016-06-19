import { Service } from '../entities';

export default class DangerService extends Service {
  constructor(SessionService, NavigationService, MarkerIconService, $log) {
    super(...arguments);
    this.SessionService= SessionService;
    this.dangerLevel = 0;
    this.increaseDanger = () => {
      // if (this.dangerLevel == 0) this.SessionService.enterSession();
      if (this.dangerLevel < 3) this.dangerLevel += 1;
      NavigationService.changeMarkerIcon(MarkerIconService.getDangerMarkerIcon(this.dangerLevel));
      $log.context('DangerService.increaseDanger').debug(this.dangerLevel);
      return this.dangerLevel;
    }

    this.decreaseDanger= () => {
      if (this.dangerLevel > 0) this.dangerLevel -= 1;
      if (this.dangerLevel == 0) this.SessionService.finishSession();
      NavigationService.changeMarkerIcon(MarkerIconService.getDangerMarkerIcon(this.dangerLevel));
      $log.context('DangerService.decreaseDanger').debug(this.dangerLevel);
    }

    this.getDangerLevel = () => {
      return this.dangerLevel;
    }

    this.setDangerLevel = (index) => {
      this.dangerLevel = index;
      return this.dangerLevel;
    }
  }
}

DangerService.$inject = ['SessionService', 'NavigationService', 'MarkerIconService', '$log'];
