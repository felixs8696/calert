import { Service } from '../entities';

export default class IntervalService extends Service {
  constructor($interval) {
    super(...arguments);
    this.$interval = $interval;
    this.intervals = {};
  }

  addInterval(intervalKey, intervalVal) {
    this.intervals[intervalKey] = intervalVal;
  }

  createInterval(intervalKey, fn, delay, invokeApply, pass) {
    var intervalVal = this.$interval(fn, delay, invokeApply, pass);
    this.addInterval(intervalKey, intervalVal);
    return intervalVal;
  }

  cancelIntervalByRef(ref) {
    this.$interval.cancel(ref);
  }

  cancelIntervalByKey(intervalKey) {
    this.$interval.cancel(this.intervals[intervalKey]);
  }

  cancelAllIntervals() {
    for (var intervalKey in this.intervals) {
      if (this.intervals.hasOwnProperty(intervalKey)) {
        this.$interval.cancel(this.intervals[intervalKey]);
      }
    }
  }
}

IntervalService.$inject = ['$interval'];
