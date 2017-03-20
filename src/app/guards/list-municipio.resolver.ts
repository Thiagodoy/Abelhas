import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { Municipio } from './../models/municipio';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ListMunicipioResolver implements Resolve<Municipio[]> {
    constructor(private parseService: ParseService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
            
            
            
            
           return this.parseService.findAll(Municipio).then((result)=>{
                return result;
            })

    }
}