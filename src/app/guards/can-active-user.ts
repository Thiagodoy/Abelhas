
import { ParseService } from './../service/parse.service';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate,Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CanActivateUser implements CanActivate {
    constructor(private parseService: ParseService,private router:Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        console.log('CANACTIVE');
        console.log(this.parseService.getUsuarioLogado());

        if (this.parseService.getUsuarioLogado() || this.parseService.core.User.current())                
            return true;
        else{
            this.router.navigate(['']);
            return false;
        }
        
    }
}
