import { DialogService } from './../service/dialog.service';
import { Router } from '@angular/router';
import { Propriedade } from './../models/propriedade';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent implements OnInit {



  listPropriedade: any[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'propriedade', label: 'Propriedade' },
    { name: 'rota', label: 'Rota Acesso' },
    { name: 'municipio', label: 'Municipio' },
    { name: 'acoes_propriedade', label: 'Ações' },
  ];

  constructor(private parseService: ParseService, private route: Router, private dialogService: DialogService,private view:ViewContainerRef) { }

  ngOnInit() {

    let query = this.parseService.createQuery(Propriedade);
    query.include('municipio');
    query.limit(1000);
    query.notEqualTo('objectId','WeT4Kbqnri');
    
    this.parseService.executeQuery(query).then((result:Propriedade[]) => {
      this.listPropriedade = result.map(propriedade => {
        
          return {
            id: propriedade.id,
            propriedade: propriedade.getNome(),
            rota: propriedade.getRotaAcesso(),
            municipio: propriedade.getMunicipio().getNome()
          }
      });
    });    
  }

  acoes(param) {
    let menssagem = undefined;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['home/editar/propriedade'], { queryParams: { propriedade: param.element.id } });
        break;
      case 'EXCLUIR':
        menssagem = '<p> Deseja prosseguir com a exclusão do dado?</p>';
        this.dialogService.confirm('Confirmar exclusão', menssagem, null, this.view).subscribe((value) => {
          if (value) {
            let query = this.parseService.createQuery(Propriedade);
            query.equalTo('objectId', param.element.id)
            this.parseService.executeQuery(query).then((result: Propriedade[]) => {
              result[0].setExclude(true);
              this.parseService.save(result[0]).then(result => {
                if (result)
                  this.dialogService.confirm('Confirmar exclusão', 'Propriedade excluida com sucesso!', 'SUCCESS', this.view);
              });
            });
          }
        });
        break;
    }
  }
}
