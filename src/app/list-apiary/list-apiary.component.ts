import { TableComponent } from './../table/table.component';
import { Apiario } from './../models/apiario';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Propriedade } from './../models/propriedade';
import { Apicultor } from './../models/apicultor';
import { Component, OnInit, ViewChild, ContentChild, AfterContentInit, NgZone, ViewContainerRef, AfterContentChecked, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router'
import { ITdDataTableColumn } from '@covalent/core';
import { ParseService } from '../service/parse.service';
import { MomentService } from '../service/moment.service';
import { DialogService } from '../service/dialog.service';
import * as parse from 'parse';

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
  listApicultor: Apicultor[] = [];
  listProriedade: Propriedade[] = [];

  controlApicultor: FormControl = new FormControl();
  controlPropriedade: FormControl = new FormControl();
  controlStatus: FormControl = new FormControl();

  filteredOptionsApicultor: Observable<Apicultor[]>;
  filteredOptionsPropriedade: Observable<Propriedade[]>;

  @ViewChild('table') table: TableComponent;


  columns: ITdDataTableColumn[] = [
    { name: 'valido', label: 'Validado' },
    { name: 'especie', label: 'Espécie' },
    { name: 'apicultor', label: 'Apicultor' },
    { name: 'propriedadea', label: 'Propriedade' },
    { name: 'status', label: 'Status' },
    { name: 'data', label: 'Data' },
    { name: 'acoes', label: 'Ações' }];

  dateFormat: string = 'DD-MM-YYYY';
  font: string = 'Roboto,"Helvetica Neue",sans-serif';

  constructor(
    private zone: NgZone,
    private serviceParse: ParseService,
    private momentService: MomentService,
    private route: Router,
    private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit() {
    let promiseApicultor = this.serviceParse.findAll(Apicultor);
    let promisePropriedade = this.serviceParse.findAll(Propriedade);
    parse.Promise.when([promiseApicultor, promisePropriedade]).then((res: any[]) => {
      this.listApicultor = res[0];
      this.listProriedade = res[1];
    });

    this.filteredOptionsApicultor = this.controlApicultor.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterApicultor(nome) : this.listApicultor.slice()));

    this.filteredOptionsPropriedade = this.controlPropriedade.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterPropriedade(nome) : this.listProriedade.slice()));

    this.controlStatus.setValue('todos');
  }

  listarApiario() {


    this.queryApiario = this.serviceParse.createQuery(Apiario);
    this.queryApiario.include('apicultor');
    this.queryApiario.include('especieAbelha');
    this.queryApiario.include('propriedade');
    this.queryApiario.notEqualTo('excluded', true);

    if (this.controlApicultor.value != '' && this.controlApicultor.value != null) {
      let queryApicultor = this.serviceParse.createQuery(Apicultor);
      queryApicultor.equalTo('objectId', this.controlApicultor.value.id);
      this.queryApiario.matchesQuery('apicultor', queryApicultor);
    }

    if (this.controlPropriedade.value != '' && this.controlPropriedade.value != null) {
      let queryPropriedade = this.serviceParse.createQuery(Propriedade);
      queryPropriedade.equalTo('objectId', this.controlPropriedade.value.id);
      this.queryApiario.matchesQuery('propriedade', queryPropriedade);
    }

    if (this.filter.startDate)
      this.queryApiario.greaterThanOrEqualTo('createdAt', this.filter.startDate);

    if (this.filter.endDate)
      this.queryApiario.lessThanOrEqualTo('createdAt', this.filter.endDate);

    if (this.controlStatus.value != 'todos') {
      if (this.controlStatus.value == 'validados')
        this.queryApiario.equalTo('valido', true);
      else
        this.queryApiario.notEqualTo('valido', true);
    }

    this.queryApiario.limit(1000);
    this.serviceParse.executeQuery(this.queryApiario).done(result => {

      let list = result.map((value) => {
        let apiario: Apiario = value;
        return {
          id: apiario.id,
          valido: apiario.isValido(),
          especie: apiario.getEspecieAbelha().getNome(),
          apicultor: apiario.getApicultor().getNome(),
          propriedadea: apiario.getPropriedade().getNome(),
          status: apiario.getStatus(),
          data: this.momentService.core(apiario.createdAt).format('DD/MM/YYYY HH:mm')
        }
      });
      this.atualiza(list);
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

  acoes(param) {
    let menssagem = undefined;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['home/editar/apiario'], { queryParams: { apiario: param.element.id } });
        break;
      case 'EXCLUIR':
        menssagem = '<p> Deseja prosseguir com a exclusão do dado?</p>';
        this.dialogService.confirm('Confirmar exclusão', menssagem, null, this.viewContainerRef).subscribe((value) => {
          if (value) {
            this.serviceParse.get(param.element.id, Apiario).then(result => {
              result.setExcluded(true);
              this.serviceParse.save(result).then(result1 => {
                if (result1)
                  this.zone.run(() => {
                    this.dialogService.confirm('Sucesso', 'Exclusão realizada com sucesso', 'SUCCESS', this.viewContainerRef).subscribe(() => {
                      this.listApiario = this.listApiario.filter((value) => {
                        return result.id != value.id;
                      });
                    });
                  });
              });
            });
          }
        });
        break;
      case 'HISTORICO':
        this.route.navigate(['home/historic'], { queryParams: { apiario: param.element.id } });
        break;
      case 'VALIDAR':
        menssagem = '<p>Tem certeza que deseja validar este dado?</p>' + '<p>Este procedimento não poderá ser revertido!</p>';
        this.dialogService.confirm('Confirmar validação', menssagem, null, this.viewContainerRef).subscribe((value) => {
          if (value) {
            this.serviceParse.get(param.element.id, Apiario).then(result => {
              result.setValidadoPor(parse.User.current());
              result.setValido(true);
              result.setDataValidacao(new Date());
              this.serviceParse.save(result).then(result1 => {
                if (result1)
                  this.zone.run(() => {
                    this.dialogService.confirm('Sucesso', 'Apiario validado com sucesso!', 'SUCCESS', this.viewContainerRef).subscribe(() => {
                      if (this.controlStatus.value == 'nao_validado') {
                        this.listApiario = this.listApiario.filter((value) => { return result1.id != value.id; });
                      } else {

                        let temp = this.listApiario.find(value => { return value.id == result1.id });
                        let index = this.listApiario.indexOf(temp);
                        this.listApiario.slice(index, 1);
                        temp.valido = true;
                        this.listApiario.push(temp);
                        this.table.refresh();
                        this.sendNotification(result1.getApicultor().id);
                      }
                    });
                  });
              });
            });
          }
        });
        break;
    }
  }

  sendNotification(id) {
    let query = this.serviceParse.createQuery(Apicultor);
    query.equalTo('objectId', id);

    let pushData: parse.Push.PushData = {};
    pushData.where = query;
    pushData.alert = 'Apiario validado!';
    pushData.sound = 'default'

    this.serviceParse.sendNotification(pushData);
  }

  filterApicultor(name: string): Apicultor[] {
    return this.listApicultor.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterPropriedade(name: string): Propriedade[] {
    return this.listProriedade.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }
}
