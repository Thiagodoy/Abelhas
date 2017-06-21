import { Router } from '@angular/router';
import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-association',
  templateUrl: './list-association.component.html',
  styleUrls: ['./list-association.component.scss']
})
export class ListAssociationComponent implements OnInit {


  data: any[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'nome', label: 'Nome' },
    { name: 'sigla', label: 'Sigla' },
    { name: 'email', label: 'Email' },
    { name: 'telefone', label: 'Telefone' },
    { name: 'acoes_associacao', label: 'Ações' },
  ];

  constructor(private zone: NgZone, private view: ViewContainerRef, private parseService: ParseService, private dialogService: DialogService, private route: Router) { }

  ngOnInit() {
    let query = this.parseService.createQuery(Associacao);
    query.notEqualTo('objectId', 'ZlmHhZ4YHK');
    query.notEqualTo('excluded', true);
    query.descending('createdAt');

    this.parseService.executeQuery(query).then((response: Associacao[]) => {
      this.data = response.map(associacao => {
        return {
          id: associacao.id,
          nome: associacao.getNome(),
          sigla: associacao.getSigla(),
          telefone: associacao.getTelefone(),
          email: associacao.getEmail()
        }
      });
    });
  }
  acoes(param) {
    let menssagem = undefined;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['home/editar/associação'], { queryParams: { associacao: param.element.id } });
        break;
      case 'EXCLUIR':
        menssagem = '<p> Deseja prosseguir com a exclusão do dado?</p>';
        this.dialogService.confirm('Confirmar exclusão', menssagem, null, this.view).subscribe((value) => {

          if (value) {
            this.parseService.get(param.element.id, Associacao).then(result => {
              result.setExcluded(true);
              this.parseService.save(result).then(result1 => {
                if (result1)
                  this.zone.run(() => {
                    this.dialogService.confirm('Sucesso', 'Exclusão realizada com sucesso!', 'SUCCESS', this.view).subscribe(() => {
                      this.data = this.data.filter((value) => { return result1.id != value.id; });
                    });
                  });
              });
            });
          }
        });
        break;
    }
  }


}
