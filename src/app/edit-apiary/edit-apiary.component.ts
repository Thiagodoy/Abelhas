import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-apiary',
  templateUrl: './edit-apiary.component.html',
  styleUrls: ['./edit-apiary.component.scss']
})
export class EditApiaryComponent implements OnInit {

  // MOCK
  apicultores: any[] = [{ nome: 'Valdir Correa Nogueira', value: 1 }];
  propriedades: any[] = [{ nome: 'Sítio do Catelan - sto augustinho', value: 1 }];
  culturas: any[] = [{ nome: 'Soja' }, { nome: 'Pinus' }, { nome: 'Pasto' }, { nome: 'Milho' }, { nome: 'Melão' }, { nome: 'Maracujá' }];

  constructor() { }

  ngOnInit() {
  }

}
