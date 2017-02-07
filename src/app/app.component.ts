import { Component } from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  listMenu: any = [{ icon: 'person', text: 'Usuarios', router: '' }, { icon: 'note', text: 'Apiários', router: '' }, { icon: 'note', text: 'Propriedades', router: '' },
  { icon: 'note', text: 'Culturas', router: '' }, { icon: 'bee', text: 'Espécie Abelha', router: '' }, { icon: 'note', text: 'Mortandade', router: '' },
  { icon: 'note', text: 'Modivo destivação apiário', router: '' }, { icon: 'note', text: 'Atividade apícula', router: '' }];

  constructor(mdIconRegistry:MdIconRegistry,sanitizer: DomSanitizer ){
    //Aplicação de icons customizados
    mdIconRegistry.addSvgIcon('bee', sanitizer.bypassSecurityTrustResourceUrl('assets/bee.svg'));   

  }
}
