import { Component, OnDestroy } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
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


  isLogado:boolean = false;

  constructor(mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private parseService: ParseService, private loadingService: TdLoadingService) {
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

    this.parseService.usuarioLogadoEvent.subscribe(isLogado=>{
      this.isLogado = isLogado;
    });

  }

  ngOnDestroy() {
    this.parseService.loaderEvent.unsubscribe();
    this.parseService.usuarioLogadoEvent.unsubscribe();
  }

}
