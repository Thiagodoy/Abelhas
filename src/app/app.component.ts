import { Associacao } from './models/associacao';
import { Apicultor } from './models/apicultor';
import { Router } from '@angular/router';
import { route } from './route/route';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { TdLoadingService } from '@covalent/core'
import { DomSanitizer } from '@angular/platform-browser';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
import { ParseService } from './service/parse.service';
let Jquery = require('jquery');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  perfil: string = '';
  nome: string = '';
  @ViewChild('sidenav') sidenav: any;

  expand:boolean = true;
  isLogado: boolean = false;

  constructor(mdIconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private parseService: ParseService, private loadingService: TdLoadingService, private route: Router) {
    // Aplicação de icons customizados
    mdIconRegistry.addSvgIcon('bee', sanitizer.bypassSecurityTrustResourceUrl('assets/bee.svg'));
    mdIconRegistry.addSvgIcon('cpf', sanitizer.bypassSecurityTrustResourceUrl('assets/id-card.svg'));
    mdIconRegistry.addSvgIcon('edit_profile', sanitizer.bypassSecurityTrustResourceUrl('assets/edit-profile.svg'));

    // Exibe a modal da imagem do componente Editar
    EditApiaryComponent.pop.subscribe((event) => {
      Jquery('#myModal').toggle();
      Jquery('#img01').attr('src', event.src);
    });

    Jquery('#closeModal').click(function () {
      Jquery('#myModal').toggle();
    });

    this.loadingService.resolve();

    this.parseService.loaderEvent.subscribe(res => {

      if (res) {
        this.loadingService.register();
      } else {
        this.loadingService.resolve();
      }
    });

    this.parseService.usuarioLogadoEvent.subscribe(user => {
      if (user.isLogado) {
        this.isLogado = user.isLogado;
        this.perfil = user.perfil;
        this.nome = user.nome;
      } else {
        this.isLogado = user.isLogado;
      }
    });
    
  }

  logout() {
    this.parseService.logout();
    this.sidenav.toggle();
  }

  ngOnDestroy() {
    this.parseService.loaderEvent.unsubscribe();
    this.parseService.usuarioLogadoEvent.unsubscribe();
    this.parseService.logout();
  }

}
