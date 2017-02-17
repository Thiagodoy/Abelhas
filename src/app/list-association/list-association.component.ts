import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-association',
  templateUrl: './list-association.component.html',
  styleUrls: ['./list-association.component.scss']
})
export class ListAssociationComponent implements OnInit {

   // MOCK
  private data: any[] = [
      {nome:'Associação',sigla:'AARRF',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null},
      {nome:'Associação',sigla:'JHGTY',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null},
      {nome:'Associação',sigla:'PPLOI',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null},
      {nome:'Associação',sigla:'KJUY',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null},
      {nome:'Associação',sigla:'KJHYB',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null},
      {nome:'Associação',sigla:'LLHY',telefone:'(99) 9999-9999',email:'example@example.com',acoes_associacao:null}   

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'nome',  label: 'Nome' },
    { name: 'sigla', label: 'Sigla' },
    { name: 'email', label: 'Email'},
    { name: 'telefone', label: 'Telefone'},
    { name: 'acoes_associacao', label: 'Ações'},
    
    ];

  constructor() { }

  ngOnInit() {
  }

}
