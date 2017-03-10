import { Municipio } from './../models/municipio';
import { EspecieAbelha } from './../models/especie-abelha';
import { Propriedade } from './../models/propriedade';
import { Apicultor } from './../models/apicultor';
import { ActivatedRoute } from '@angular/router';
import { ParseService } from './../service/parse.service';
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
    { propriedade: 'Propriedade 1', apicultor: 'Marcelo de Souza', data: '12/12/2015', },
    { propriedade: 'Propriedade 1', apicultor: 'Rodrigo', data: '12/12/2015', },
    { propriedade: 'Propriedade 1', apicultor: 'Marcos', data: '12/12/2015', },
    { propriedade: 'Propriedade 1', apicultor: 'Thiago', data: '12/12/2015', },
    { propriedade: 'Propriedade 1', apicultor: 'Diego', data: '12/12/2015', },
    { propriedade: 'Propriedade 1', apicultor: 'Delmas Mattos', data: '12/12/2015', },

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'propriedade', label: 'Propriedade' },
    { name: 'apicultor', label: 'Apicultor' },
    { name: 'data', label: 'Data da criação' },
  ];

  listApicultor: Apicultor[] = [];
  listPropriedade: Propriedade[] = [];
  listEspecieAbelha: EspecieAbelha[] = [];
  listMunicipio: Municipio[] = [];

  constructor(private parseService: ParseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((res) => {
                
           this.listApicultor = res.listApicultor;
           this.listPropriedade = res.listPropriedade;
           this.listEspecieAbelha = res.ListEspecieAbelhave;
           this.listMunicipio = res.ListMunicipio;
          
           //  Workaround - são realizadas varias chamadas async, com isso garante que o loading é parado;
           this.parseService.forceCloseLoading();
    });
  }

}
