import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ParseService } from '../service/parse.service';
import { Mortandade } from '../models/mortandade';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ListMortandadeResolver implements Resolve<Mortandade> {
    constructor(private parseService: ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            return this.parseService.findAll(Mortandade);
            
    }
}
