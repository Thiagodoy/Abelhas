import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { Apicultor } from './../models/apicultor';
import { Router } from '@angular/router';
import { UserWeb } from './../models/user-web';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import * as parse from 'parse';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'nome', label: 'Usuario' },
    { name: 'email', label: 'Email' },
    { name: 'tipo', label: 'Perfil' },
    { name: 'status', label: 'Status' },
    { name: 'acoes_usuario', label: 'Ações' },
  ];

  listUser: UserWeb[] = [];

  constructor(private parseService: ParseService, private zone: NgZone, private route: Router,private dialogService:DialogService) { }

  ngOnInit() {

    let queryUser = this.parseService.createQuery(UserWeb);
    queryUser.include('apicultor');
    queryUser.include('associacao');    

    this.parseService.executeQuery(queryUser).then(result => {
      this.zone.run(() => {
        this.mountListUser(result);
      });
    });
  }

  mountListUser(resul: parse.Object[]) {

    let list = []

    for (let us of resul) {

      let user: any = {};
      user['id'] = us.id;
      user['tipo'] = us.attributes.tipo;
      
      if (user.tipo == 'APICULTOR') {
        let apicultor: Apicultor = us.attributes.apicultor;
        user['email'] = apicultor.getEmail();
        user['nome'] = apicultor.getNome();
      } else if (user.tipo == 'ASSOCIACAO') {
        let associacao: Associacao = us.attributes.associacao;
        user['email'] = associacao.getEmail();
        user['nome'] = associacao.getNome();
      }else if(user.tipo == 'GESTOR'){
         user['email'] = us.attributes.email;
        user['nome'] = us.attributes.username;
      }
      user['status'] = 'Lorem'
      list.push(user);
    }

    this.listUser = list;

  }
  acoes(param) {
    let user: any = param.element;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['editar/usuario'], { queryParams: { user: user.id, type: user.tipo } });
        break;
        case 'EXCLUIR':
        
        this.dialogService.confirm('Confirmar exclusão', '<p> Deseja prosseguir com a exclusão do dado?</p>', null, null).subscribe((value) => {
          if (value) {
           
          }
        });
        break
    }
  }

}
