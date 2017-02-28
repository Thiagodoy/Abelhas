import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class MomentService {

  core = moment;
  constructor() {
      this.core.locale('pt-BR');
   }

}
