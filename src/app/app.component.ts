import { Associacao } from './models/associacao';
import { Apicultor } from './models/apicultor';
import { Router } from '@angular/router';
import { route } from './route/route';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { TdLoadingService } from '@covalent/core'
import { DomSanitizer } from '@angular/platform-browser';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
import { ParseService } from './service/parse.service';
import * as parse from 'parse';
let Jquery = require('jquery');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  listMenu: any = [{ icon: 'person', text: 'Usuarios', router: '' }, { icon: 'note', text: 'Apiários', router: '' }, { icon: 'note', text: 'Propriedades', router: '' },
  { icon: 'note', text: 'Culturas', router: '' }, { icon: 'bee', text: 'Espécie Abelha', router: '' }, { icon: 'note', text: 'Mortandade', router: '' },
  { icon: 'note', text: 'Modivo destivação apiário', router: '' }, { icon: 'note', text: 'Atividade apícula', router: '' }];


  menus: any[] = [
    { route: 'lista/apiarios', descricao: 'Listar apiarios' },
    { route: 'edicao/multipla', descricao: 'Edição Multipla' },
    { route: 'lista/usuarios', descricao: 'Listar usuários' },
    { route: 'editar/associação', descricao: 'Editar Associação' },
    { route: 'associações', descricao: 'Listar Associações' },
    { route: 'editar/propriedade', descricao: 'Editar Propriedade' },
    { route: 'lista/propriedade', descricao: 'Listar propriedades' },
    { route: 'dados/desativação', descricao: 'Dados de desativação' },
    { route: 'editar/usuario', descricao: 'Editar Usuário' }
  ];

  perfil: string = '';
  nome: string = '';
  @ViewChild('sidenav') sidenav: any;


  isLogado: boolean = false;

  constructor(mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private parseService: ParseService, private loadingService: TdLoadingService, private route: Router) {
    //Aplicação de icons customizados
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

    if (this.parseService.core.User.current()) {

      let res = this.parseService.core.User.current();
      this.perfil = res.attributes.tipo;
      this.isLogado = true;

      if (res.attributes.tipo == 'GESTOR')
        this.nome = res.attributes.nomeGestor;

      if (res.attributes.tipo == 'APICULTOR') {
        let apicultor: Apicultor = res.attributes.apicultor;
        this.nome = apicultor.getNome();
      }
      if (res.attributes.tipo == 'ASSOCIACAO') {
        let associacao: Associacao = res.attributes.associacao;
        this.nome = associacao.getNome();
      }
      this.route.navigate(['home/lista/apiarios']);

    }
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
