import { Service } from '../entities';

export default class DangerService extends Service {
  constructor(SessionService, NavigationService, MarkerIconService) {
    super(...arguments);
    this.SessionService= SessionService;
    this.dangerLevel = 0;
    this.increaseDanger = () => {
      if (this.dangerLevel == 0) this.SessionService.enterSession();
      if (this.dangerLevel < 3) this.dangerLevel += 1;
      console.log("Danger Level (+): " + this.dangerLevel);
      NavigationService.changeMarkerIcon(MarkerIconService.getDangerMarkerIcon(this.dangerLevel));
      return this.dangerLevel;
    }

    this.decreaseDanger= () => {
      if (this.dangerLevel > 0) this.dangerLevel -= 1;
      if (this.dangerLevel == 0) this.SessionService.finishSession();
      NavigationService.changeMarkerIcon(MarkerIconService.getDangerMarkerIcon(this.dangerLevel));
      console.log("Danger Level (-): " + this.dangerLevel);
    }

    this.resetSession= () => {
      this.SessionService.finishSession();
      this.dangerLevel = 0;
    }

    this.getDangerLevel = () => {
      return this.dangerLevel;
    }
  }
}

DangerService.$inject = ['SessionService', 'NavigationService', 'MarkerIconService'];
