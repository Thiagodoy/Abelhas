import { Municipio } from './../models/municipio';
import { Apiario } from './../models/apiario';
import { EspecieAbelha } from './../models/especie-abelha';
import { Propriedade } from './../models/propriedade';
import { Apicultor } from './../models/apicultor';
import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import * as parse from 'parse';
import { TdLoadingService } from '@covalent/core';

@Injectable()
export class EditMultipleResolver implements Resolve<any> {
    constructor(private parseService: ParseService, private loadingService: TdLoadingService, private zone: NgZone) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {     

        let object = {};
         
        return this.parseService.findAll(Apicultor).then(resu => {
            object['listApicultores'] = resu;
            return this.parseService.findAll(Propriedade);
        }).then(resu => {
            object['listPropriedades'] = resu;
            return this.parseService.findAll(EspecieAbelha);
        }).then((resu)=>{
                object['listEspecieAbelha'] = resu;
                return this.parseService.findAll(Municipio);
        }).then((resu)=>{
                object['listMunicipo'] = resu;
                return object
        }).then(resu=>{            
          
            return resu;
        });      
    }
}
