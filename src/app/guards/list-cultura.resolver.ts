import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ParseService } from '../service/parse.service';
import { Cultura } from '../models/cultura';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ListCulturasResolver implements Resolve<Cultura> {
    constructor(private parseService: ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            return this.parseService.findAll(Cultura);
            
    }
}
