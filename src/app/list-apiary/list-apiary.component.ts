import { Component, OnInit, ViewChild, ContentChild, AfterContentInit, NgZone } from '@angular/core';
import { Router } from '@angular/router'
import { ITdDataTableColumn } from '@covalent/core';
import { ParseService } from '../service/parse.service';
import { MomentService } from '../service/moment.service';
import { Apiario } from '../models/apiario';
import { Apicultor } from '../models/apicultor';
import { TableComponent } from '../table/table.component';



@Component({
  selector: 'app-list-apiary',
  templateUrl: './list-apiary.component.html',
  styleUrls: ['./list-apiary.component.scss']
})
export class ListApiaryComponent implements OnInit {

  @ContentChild(TableComponent) viewchield: TableComponent;
  listApiario: any[] = [];
  queryApiario: Parse.Query;
  filter: any = { status: undefined, startDate: undefined, endDate: undefined, apicultor: undefined };


  columns: ITdDataTableColumn[] = [
    { name: 'attributes.ativo', label: 'Validado' },
    { name: 'attributes.especieAbelha.attributes.nome', label: 'Espécie' },
    { name: 'attributes.apicultor.attributes.nome', label: 'Apicultor' },
    { name: 'attributes.status', label: 'Status' },
    { name: 'createdAt', label: 'Data', format: (value) => { return this.momentService.core(value).format('DD/MM/YYYY HH:mm') } },
    { name: 'acoes', label: 'Ações' }];

  dateFormat: string = 'DD-MM-YYYY';
  font: string = 'Roboto,"Helvetica Neue",sans-serif';

  constructor(
    private serviceParse: ParseService,
    private momentService: MomentService,
    private route: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {

    this.queryApiario = this.serviceParse.createQuery(Apiario);
    this.queryApiario.include('apicultor');
    this.queryApiario.include('especieAbelha');
    this.queryApiario.select('apicultor', 'especieAbelha', 'ativo');
  }

  itemSelected(apiario: Apiario) { }
  confirmarValidacao(apiario: Apiario) { }
  confirmarExclusao(apiario: Apiario) { }

  listarApiario() {


    if (this.filter.apicultor) {
      let queryApicultor = this.serviceParse.createQuery(Apicultor);
      queryApicultor.contains('nome', 'Genesio');
      this.queryApiario.matchesQuery('apicultor', queryApicultor);
    }

    if (this.filter.apicultor) {
      let querydateGreater = this.serviceParse.createQuery(Apiario);
      let querydateLess = this.serviceParse.createQuery(Apiario);

      querydateGreater.greaterThanOrEqualTo('createdAt', this.filter.startDate);
      querydateLess.lessThanOrEqualTo('createdAt', this.filter.endDate);
      let queryMerge = this.serviceParse.or(querydateGreater, querydateLess);
      this.queryApiario.matchesQuery('createdAt', queryMerge);

    }

    if (this.filter.status) { }


    this.serviceParse.executeQuery(this.queryApiario).done(result => {
      this.zone.run(() => {
        this.atualiza(result);
      });
    }).fail((fail)=>{
      console.log('Erro');
      console.log(fail);
    });

  }

  selectDate(paran, event) {
    this.filter[paran] = event;
  }

  atualiza(result) {
    if (result && result.length > 0) {
      this.listApiario = result;
    } else {
      this.listApiario = [];
    }

  }

  excluir(apiario:Apiario) {
        // this.serviceParse.destroy(apiario)
        // .done(()=>{})
        // .fail(()=>{});
  }

  acoes(param) {
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['editar/apiario'], { queryParams: { apiario: param.element.id } });
        break;
      case 'EXCLUIR':
         this.excluir(param.element); 
        break;
      case 'HISTORICO':
        break;
    }
  }
}
