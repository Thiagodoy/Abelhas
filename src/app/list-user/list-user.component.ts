import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  
   // MOCK
  private data: any[] = [
      {usuario:'Luis',nome_user:'Luis Carlos de Souza',perfil:'Apicultor',status:'Ativo',acoes_usuario:null},
      {usuario:'Sandro',nome_user:'Sandro Perez',perfil:'Gestor',status:'Ativo',acoes_usuario:null},
      {usuario:'Orestes',nome_user:'Orestes Barbieri',perfil:'Associação',status:'Aguardando Termo',acoes_usuario:null},
      {usuario:'Leandro',nome_user:'Leandro Rosa',perfil:'Associação',status:'Termo de compromisso expirado',acoes_usuario:null},
      {usuario:'Marcelo',nome_user:'Marcelo Trevisan',perfil:'Gestor',status:'Ativo',acoes_usuario:null},
      {usuario:'Gabriel',nome_user:'Gabriel Franschini',perfil:'Apicultor',status:'Desativado',acoes_usuario:null}   

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'usuario',  label: 'Usuario' },
    { name: 'nome_user', label: 'Nome' },
    { name: 'perfil', label: 'Perfil'},
    { name: 'status', label: 'Status'},
    { name: 'acoes_usuario', label: 'Ações'},
    ];

  constructor() { }

  ngOnInit() {
  }

}
