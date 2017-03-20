import { Observable } from 'rxjs/Rx';
import { ParseService } from './../service/parse.service';
import { UserWeb } from './../models/user-web';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class UserResolver implements Resolve<UserWeb> {
    constructor(private parseService:ParseService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
        ): Observable<any>|Promise<any>|any {
            
            let user = route.queryParams['user'];
            let queryUser = this.parseService.createQuery(UserWeb);
            queryUser.equalTo('objectId',user);
            
            return this.parseService.executeQuery(queryUser);
    }
}
