import { Service } from '../entities';

export default class FormConstantsService extends Service {
  constructor() {
    super(...arguments);
    this.dangers = ['1 (non-emergency)','2 (caution)','3 (emergency)'];
    this.genders = ['M','F','Other','Non-Gender'];
    this.builds = ['Slim','Muscular','Fat','Medium','Solid','Obese'];
    this.ageRanges = ['1-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','91-100','100+'];
    this.dangerCols = {1: '#FFD1D1', 2: '#FF5B5B', 3: '#FF0000', info: '#F2FFAA'}
  }
}

FormConstantsService.$inject = [];
