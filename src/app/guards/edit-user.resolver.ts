import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { Associacao } from './../models/associacao';
import { route } from './../route/route';
import { UserWeb } from './../models/user-web';
import { ParseService } from './../service/parse.service';
import { Observable } from 'rxjs/Rx';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import * as parse from 'parse';

@Injectable()
export class EditUserResolver implements Resolve<any> {
    constructor(private parseService:ParseService,private zone:NgZone) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            
            let userId = route.queryParams['user'];
            let type = route.queryParams['type'];
            let objectResult:any = {};
            objectResult['type'] = type;

            let query = this.parseService.createQuery(UserWeb);
            query.equalTo('objectId', userId);
            query.include('associacao');
            query.include('apicultor');
            

            let promiseAssociacao = this.parseService.findAll(Associacao);
            let promisseEstado    = this.parseService.findAll(Estado);
            let promiseMunicipio  = this.parseService.findAll(Municipio);
            let promiseUser       =  this.parseService.executeQuery(query)
            
            
            return parse.Promise.when(promiseAssociacao,promisseEstado,promiseUser).then((res_1,res_2,res_4)=>{
                
                    objectResult['associacao'] = res_1;
                    objectResult['estado'] = res_2;
                    //objectResult['municipio'] = res_3;
                    objectResult['user'] = res_4[0];            
                   
                   
                   return objectResult 
                    
                
            });
 
            

    }
}
