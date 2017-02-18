import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent implements OnInit {


     // MOCK
  private data: any[] = [
      {propriedade:'Propriedade',rota:'rota F',municipio:'São Carlos - SP',acoes_propriedade:null},
      {propriedade:'Propriedade',rota:'rota Y',municipio:'São Carlos - SP',acoes_propriedade:null},
      {propriedade:'Propriedade',rota:'rota I',municipio:'São Carlos - SP',acoes_propriedade:null},
      {propriedade:'Propriedade',rota:'rota ',municipio:'São Carlos - SP',acoes_propriedade:null},
      {propriedade:'Propriedade',rota:'rota B',municipio:'São Carlos - SP',acoes_propriedade:null},
      {propriedade:'Propriedade',rota:'rota ',municipio:'São Carlos - SP',acoes_propriedade:null}   

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'propriedade',  label: 'Propriedade' },
    { name: 'rota', label: 'Rota Acesso' },
    { name: 'municipio', label: 'Municipio'},    
    { name: 'acoes_propriedade', label: 'Ações'},    
    ];

  constructor() { }

  ngOnInit() {
  }

}
