
import { ParseService } from './../service/parse.service';
import { Observable } from 'rxjs/Rx';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate,Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Apicultor } from '../models/apicultor';
import { Associacao } from '../models/associacao'

@Injectable()
export class CanActivateUser implements CanActivate {
    constructor(private parseService: ParseService,private router:Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {      

        
        if (this.parseService.core.User.current()){    
    
            let res = this.parseService.core.User.current();
            let perfil = res.attributes.tipo;
            let isLogado = true;
            let nome = undefined;
            

            if (res.attributes.tipo === 'GESTOR') {
              nome = res.attributes.nomeGestor;
            }
    
            if (res.attributes.tipo === 'APICULTOR') {
              let apicultor: Apicultor = res.attributes.apicultor;
              nome = apicultor.getNome();
            }
    
            if (res.attributes.tipo === 'ASSOCIACAO') {
              let associacao: Associacao = res.attributes.associacao;
              nome = associacao.getNome();
            }
            this.parseService.usuarioLogadoEvent.emit({perfil,nome,isLogado});
            return true;
        }
        else{
            this.router.navigate(['']);
            return false;
        }
    }
}
