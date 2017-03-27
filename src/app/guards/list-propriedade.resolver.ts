import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { Propriedade } from './../models/propriedade';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import * as parse from 'parse';

@Injectable()
export class ListPropriedadeResolver implements Resolve<Propriedade[]> {
    constructor(private parseService: ParseService, private zone: NgZone) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {


        return parse.Promise.as<any>(() => { }).then(() => {

            this.zone.runOutsideAngular(() => {
                this.parseService.findAll(Propriedade).then((result) => {
                    this.zone.run(() => {
                        return result;
                    });
                });
            });
        });


    }
}