import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ParseService } from './../service/parse.service';
import { Apicultor } from '../models/apicultor';

@Injectable()
export class ListApicultorResolver implements Resolve<Apicultor[]> {
    constructor(private parseService: ParseService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {

       return this.parseService.findAll(Apicultor).then(result => {         
            return result;
        });
    }
}
