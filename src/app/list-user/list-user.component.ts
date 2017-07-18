import { TableComponent } from './../table/table.component';
import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { Apicultor } from './../models/apicultor';
import { Router } from '@angular/router';
import { UserWeb } from './../models/user-web';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, NgZone, ViewContainerRef, ViewChild } from '@angular/core';
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

  listUser: any[] = [];
  perfil: string;
  @ViewChild('table') table: TableComponent;

  constructor(private view: ViewContainerRef, private parseService: ParseService, private zone: NgZone, private route: Router, private dialogService: DialogService) {
    this.perfil = parse.User.current().attributes.tipo;
  }

  ngOnInit() {

    this.parseService.runCloud('listUsers', { noInclude: true }).then((result: UserWeb[]) => {
      this.zone.run(() => {
        this.mountListUser(result);
      });
    });
  }

  mountListUser(resul: UserWeb[]) {

    let list = []

    // Filtra todos os usuários que foram excluidos
    resul = resul.filter((user)=> {return user.attributes.excluded != true});

    for (let us of resul) {

      try {

        let user: any = {};
        user['id'] = us.id;
        user['tipo'] = us.attributes.tipo;
        user['data'] = us.createdAt.getTime();
        user[`username`] = us.getUsername();

        if (user.tipo == constantes.APICULTOR) {
          let apicultor: Apicultor = us.attributes.apicultor;
          user['email'] = apicultor.getEmail();
          user['nome'] = apicultor.getNome();
          user['habilitado'] = apicultor.isTermoParticipacaoProjeto();
          user['status'] = apicultor.isTermoParticipacaoProjeto() ? 'Ativo' : 'Aguardando aprovação';
        } else if (user.tipo == constantes.ASSOCIACAO) {
          let associacao: Associacao = us.attributes.associacao;
          user['email'] = associacao.getEmail();
          user['nome'] = associacao.getNome();
          user['status'] = 'Ativo';
        } else if (user.tipo == constantes.GESTOR) {
          user['email'] = us.getEmail();
          user['nome'] = us.attributes.nomeGestor;
          user['status'] = 'Ativo';
        }

        if (us.attributes.excluded)
          user['status'] = 'Desativado';

        list.push(user);

      } catch (erro) {
        console.error(erro);
        console.log(us);
      }

    }

    list = list.sort((a, b) => { return a.data > b.data ? -1 : 1 });    
    this.parseService.listUser = this.listUser = list;

  }
  acoes(param) {
    let user: any = param.element;
    switch (param.acao) {
      case 'EDITAR':
        let queryParam = { user: user.id, type: user.tipo };

        if (user.tipo == constantes.GESTOR) {
          queryParam['email'] = user.email;
        }

        this.route.navigate(['home/editar/usuario'], { queryParams: queryParam });
      break;
      case 'EXCLUIR':
        this.dialogService.confirm('Confirmar exclusão', '<p> Deseja prosseguir com a exclusão do dado?</p>', null, this.view).subscribe((value) => {
          if (value) {
            this.parseService.get(user.id, UserWeb,['apicultor','associacao']).then(result => {
              let updateUser = { objectId: result.id, excluded: true, username:result.id };
              let promises = [];

              if(user.tipo == constantes.ASSOCIACAO){
                let associacao:Associacao = result.attributes.associacao;
                associacao.setExcluded(true);
                promises.push(this.parseService.save(associacao));
              }

              promises.push(this.parseService.runCloud('updateUser', updateUser));
              parse.Promise.when(promises).then((response)=>{
                 if (response)
                  this.zone.run(() => {
                    this.dialogService.confirm('Sucesso', '<p> Usuário excluido com sucesso!</p>', 'SUCCESS', this.view);
                    let user = this.listUser.find(value => { return value.id == result.id });
                    let index = this.listUser.indexOf(user);
                    this.listUser = this.listUser.splice(index, 1);
                  });
              });
            });
          }
        });
      break;
      case 'HABILITAR':

          this.dialogService.confirm('Confirmar', '<p> Deseja prosseguir com a ativação ?</p>', null, this.view).subscribe((value) => {

            if (value) {
              this.parseService.get(user.id, UserWeb, ['apicultor']).then(result => {
                let apicultor: Apicultor = result.attributes.apicultor;
                apicultor.setTermoParticipacaoProjeto(true);
                this.parseService.save(apicultor).then(result1 => {
                  if (result1) {
                    this.zone.run(() => {
                      let userTemp = this.listUser.find(value => { return value.id == user.id });
                      userTemp.habilitado = true;
                      userTemp.status = 'Ativo';
                      let index = this.listUser.indexOf(userTemp);
                      this.listUser.splice(index, 1);
                      this.listUser.push(userTemp);
                      this.table.refresh();
                      this.dialogService.confirm('Sucesso', '<p> Apicultor Ativado com sucesso!</p>', 'SUCCESS', this.view);
                    });
                  }
                });
              });
            }
          });
        break;
    }
  }

}
