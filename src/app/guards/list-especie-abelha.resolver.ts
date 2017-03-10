import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { EspecieAbelha } from './../models/especie-abelha';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ListEspecieAbelhaResolver implements Resolve<EspecieAbelha[]> {
    constructor(private parseSevice: ParseService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {

        return this.parseSevice.findAll(EspecieAbelha).then((result) => {
            return result;
        });
    }
}