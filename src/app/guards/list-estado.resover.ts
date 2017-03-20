import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ParseService } from './../service/parse.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Estado } from './../models/estado';

@Injectable()
export class ListEstadoResolver implements Resolve<Estado[]> {
    constructor(private parseService:ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            

            let url = state.url;
            let type = route.queryParams['type'];
            debugger;
            return this.parseService.findAll(Estado).then(result=>{
                return result;
            })
    }
}