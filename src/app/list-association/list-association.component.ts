import { Router } from '@angular/router';
import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { ParseService } from './../service/parse.service';
import { Component, OnInit } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-association',
  templateUrl: './list-association.component.html',
  styleUrls: ['./list-association.component.scss']
})
export class ListAssociationComponent implements OnInit {

   
  private data: any[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'nome',  label: 'Nome' },
    { name: 'sigla', label: 'Sigla' },
    { name: 'email', label: 'Email'},
    { name: 'telefone', label: 'Telefone'},
    { name: 'acoes_associacao', label: 'Ações'},
    
    ];

  constructor(private parseService:ParseService, private dialogService:DialogService,private route:Router) { }

  ngOnInit() {
    let query = this.parseService.createQuery(Associacao);
    query.notEqualTo('objectId','ZlmHhZ4YHK');

    this.parseService.executeQuery(query).then((response:Associacao[])=>{
     this.data =  response.map(associacao=>{
        return {
          id: associacao.id,
          nome: associacao.getNome(),
          sigla: associacao.getSigla(),
          telefone:associacao.getTelefone(),
          email:associacao.getEmail()
        }
      });
    });
  }
   acoes(param) {
    let menssagem = undefined;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['editar/associação'], { queryParams: { associacao: param.element.id } });
        break;
      case 'EXCLUIR':
        menssagem = '<p> Deseja prosseguir com a exclusão do dado?</p>';
        this.dialogService.confirm('Confirmar exclusão', menssagem, null, null).subscribe((value) => {
          if (value) {
            // this.excluir(param.element);
          }
        });
        break;      
    }
  }


}
