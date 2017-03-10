import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { Propriedade } from './../models/propriedade';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
 export class ListPropriedadeResolver implements Resolve<Propriedade[]> {
    constructor(private parseService:ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
             
             return this.parseService.findAll(Propriedade).then((result)=>{
                 return result;
             });
    }
}