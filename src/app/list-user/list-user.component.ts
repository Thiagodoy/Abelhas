import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { Apicultor } from './../models/apicultor';
import { Router } from '@angular/router';
import { UserWeb } from './../models/user-web';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, NgZone, ViewContainerRef } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';
import * as parse from 'parse';
import constantes from '../constantes';

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

  constructor(private view: ViewContainerRef, private parseService: ParseService, private zone: NgZone, private route: Router, private dialogService: DialogService) { }

  ngOnInit() {

    let queryUser = this.parseService.createQuery(UserWeb);
    queryUser.include('apicultor');
    queryUser.include('associacao');    
    queryUser.addDescending('createdAt');

    this.parseService.executeQuery(queryUser).then((result:UserWeb[]) => {
      this.zone.run(() => {
        this.mountListUser(result);
      });
    });
  }

  mountListUser(resul:UserWeb[]) {

    let list = []

    for (let us of resul) {

      let user: any = {};
      user['id'] = us.id;
      user['tipo'] = us.attributes.tipo;

      if (user.tipo == constantes.APICULTOR) {
        let apicultor: Apicultor = us.attributes.apicultor;
        user['email'] = apicultor.getEmail();
        user['nome'] = apicultor.getNome();
      } else if (user.tipo == constantes.ASSOCIACAO) {
        let associacao: Associacao = us.attributes.associacao;
        user['email'] = associacao.getEmail();
        user['nome'] = associacao.getNome();
      } else if (user.tipo == constantes.GESTOR) {
        user['email'] = us.getEmail();
        user['nome'] = us.attributes.nomeGestor;
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
        this.route.navigate(['home/editar/usuario'], { queryParams: { user: user.id, type: user.tipo } });
        break;
      case 'EXCLUIR':

        this.dialogService.confirm('Confirmar exclusão', '<p> Deseja prosseguir com a exclusão do dado?</p>', null, this.view).subscribe((value) => {
          if (value) {
            this.parseService.get(user.id, UserWeb).then(result => {
              result.attributes.excluded = true;
              this.parseService.save(result).then(result1 => {
                if (result)
                  this.zone.run(() => {
                    this.dialogService.confirm('Sucesso', '<p> Usuário excluido com sucesso!</p>', 'SUCCESS', this.view);
                    let user = this.listUser.find(value=> {return value.id == result1.id} );
                    let index = this.listUser.indexOf(user);
                    this.listUser = this.listUser.slice(index,1);
                  })
              });
            });
          }
        });
        break
    }
  }

}
