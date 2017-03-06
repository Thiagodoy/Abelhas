import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ParseService } from '../service/parse.service';
import { Apiario } from '../models/apiario';
import { Observable } from 'rxjs/Rx'


@Injectable()
export class ApiaryDetailResolver implements Resolve<Apiario> {
    constructor(private parseService: ParseService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {

        let query = this.parseService.createQuery(Apiario);
        query.equalTo('objectId', route.queryParams['apiario']);
        query.include('apicultor');
        query.include('culturas');
        query.include('especieAbelha');
        query.include('atividadeApicula');
        query.include('propriedade');

        return this.parseService.executeQuery(query).then((result) => {
            return result[0];
        });
    }
}