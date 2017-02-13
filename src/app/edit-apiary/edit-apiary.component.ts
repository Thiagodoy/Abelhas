import { Component, OnInit,EventEmitter } from '@angular/core';
let Jquery = require('jquery');


@Component({
  selector: 'app-edit-apiary',

  templateUrl: './edit-apiary.component.html',
  styleUrls: ['./edit-apiary.component.scss'],

})
export class EditApiaryComponent implements OnInit {

  // MOCK
  apicultores: any[] = [{ nome: 'Valdir Correa Nogueira', value: 1 }];
  propriedades: any[] = [{ nome: 'Sítio do Catelan - sto augustinho', value: 1 }];
  culturas: any[] = [{ nome: 'Soja' }, { nome: 'Pinus' }, { nome: 'Pasto' }, { nome: 'Milho' }, { nome: 'Melão' }, { nome: 'Maracujá' }, { nome: 'Melão' }, { nome: 'Maracujá' },
  { nome: 'Soja' }, { nome: 'Pinus' }, { nome: 'Pasto' }, { nome: 'Milho' }, { nome: 'Melão' }, { nome: 'Maracujá' }];
  especies: any[] = [{ name: 'Melipona' }, { name: 'Mandaçaia ' }, { name: 'Tetragonisca angustul' }];
  motivoMortandade: any[] = [{ name: 'Agroquimicos' }];

  static pop:EventEmitter<Object> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {

    Jquery('#myImg').click((event)=>{
      
      let src = Jquery(event.currentTarget).attr('src');
     EditApiaryComponent.pop.emit({src:src});
    });

    Jquery('#closeModal').click(function(){
      Jquery('#myModal').hide();
    });
  } 

}
