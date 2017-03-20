import { ParseService } from './../service/parse.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Associacao } from './../models/associacao';

@Injectable()
export class ListAssociacaoResolver implements Resolve<Associacao[]> {
    constructor(private parseService:ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            
            return this.parseService.findAll(Associacao);
    }
}
