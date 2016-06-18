import { Service } from '../entities';

export default class PlatformService extends Service {
  constructor() {
    super(...arguments);
    this.device = ionic.Platform.device();
    this.platform = ionic.Platform.platform();
    this.platformVersion = ionic.Platform.version();
  }

  isWebView() {
    return ionic.Platform.isWebView();
  }

  isMobile() {
    return !ionic.Platform.isWebView();
  }

}

PlatformService.$inject = [];
