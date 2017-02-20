import { Component } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
let Jquery = require('jquery');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  listMenu: any = [{ icon: 'person', text: 'Usuarios', router: '' }, { icon: 'note', text: 'Apiários', router: '' }, { icon: 'note', text: 'Propriedades', router: '' },
  { icon: 'note', text: 'Culturas', router: '' }, { icon: 'bee', text: 'Espécie Abelha', router: '' }, { icon: 'note', text: 'Mortandade', router: '' },
  { icon: 'note', text: 'Modivo destivação apiário', router: '' }, { icon: 'note', text: 'Atividade apícula', router: '' }];


  menus:any[] = [
    { route: '', descricao:'Listar apiarios'  },
    { route: 'editar/apiario', descricao:'Editar Apiário' },
    { route: 'edicao/multipla', descricao:'Edição Multipla' },
    { route: 'usuarios', descricao:'Listar usuários' },
    { route: 'editar/associação', descricao:'Editar Associação' },
    { route: 'associações', descricao:'Listar Associações' },
    { route: 'editar/propriedade', descricao:'Editar Propriedade' },
    { route: 'propriedades', descricao:'Listar propriedades' },
    { route: 'dados/desativação', descricao:'Dados de desativação' },
    { route: 'editar/usuario', descricao:'Editar Usuário' }
  ];

  constructor(mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    //Aplicação de icons customizados
    mdIconRegistry.addSvgIcon('bee', sanitizer.bypassSecurityTrustResourceUrl('assets/bee.svg'));
    mdIconRegistry.addSvgIcon('cpf', sanitizer.bypassSecurityTrustResourceUrl('assets/id-card.svg'));
    mdIconRegistry.addSvgIcon('edit_profile', sanitizer.bypassSecurityTrustResourceUrl('assets/edit-profile.svg'));

    // Exibe a modal da imagem do componente Editar
    EditApiaryComponent.pop.subscribe((event) => {
      Jquery('#myModal').toggle();
      Jquery('#img01').attr('src', event.src);
    });

    Jquery('#closeModal').click(function(){
      Jquery('#myModal').toggle();
    });


  }
  
}
