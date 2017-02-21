import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-edit-multiple-apiary',
  templateUrl: './edit-multiple-apiary.component.html',
  styleUrls: ['./edit-multiple-apiary.component.sass']
})
export class EditMultipleApiaryComponent implements OnInit {

   // MOCK
  private data: any[] = [
    {propriedade: 'Propriedade 1', apicultor: 'Marcelo de Souza',  data: '12/12/2015', },
    {propriedade: 'Propriedade 1', apicultor: 'Rodrigo',  data: '12/12/2015', },
    {propriedade: 'Propriedade 1', apicultor: 'Marcos',  data: '12/12/2015', },
    {propriedade: 'Propriedade 1', apicultor: 'Thiago',  data: '12/12/2015', },
    {propriedade: 'Propriedade 1', apicultor: 'Diego',  data: '12/12/2015', },
    {propriedade: 'Propriedade 1', apicultor: 'Delmas Mattos',  data: '12/12/2015', },    

  ];

  columns: ITdDataTableColumn[] = [    
    { name: 'propriedade', label: 'Propriedade' },
    { name: 'apicultor', label: 'Apicultor'},
    { name: 'data', label: 'Data da criação'},
    ]; 

  constructor() { }

  ngOnInit() {  
  }

}
