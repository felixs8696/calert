import { Service } from '../entities';

export default class LoggerService extends Service {
  constructor($log) {
    super(...arguments);
    function enhanceLogging(loggingFunc, context) {
      return function() {
        var contextEnabled = $log.enabledContexts[context];
        if ($log.enabledContexts[context] == null || contextEnabled) {
          var modifiedArguments = [].slice.call(arguments);
          var date = new Date();
          var time = date.toTimeString().substring(0,8) + " " + date.toTimeString().substring(19, date.toTimeString().length -1);
          var fDate = date.getMonth() + 1 + "." + date.getDate() + "." + date.getFullYear() + " " + time + "::";
          modifiedArguments[0] = [ fDate + '[' + context + ']> '] + modifiedArguments[0];
          loggingFunc.apply(null, modifiedArguments);
        }
      };
    }

    this.setLog = () => {
      $log.enabledContexts = [];
      $log.context = function(context) {
        return {
          log   : enhanceLogging($log.log, context),
          info  : enhanceLogging($log.info, context),
          warn  : enhanceLogging($log.warn, context),
          debug : enhanceLogging($log.debug, context),
          error : enhanceLogging($log.error, context),
          enableLogging: function(enable) {
            $log.enabledContexts[context] = enable;
          }
        };
      };
    }
  }
}

LoggerService.$inject = ['$log'];
