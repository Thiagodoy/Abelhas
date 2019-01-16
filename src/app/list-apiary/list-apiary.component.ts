import { Associacao } from './../models/associacao';
import { ApicultorAssociacao } from './../models/apicultor-associacao';
import { UserWeb } from './../models/user-web';
import { TableComponent } from './../table/table.component';
import { Apiario } from './../models/apiario';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Propriedade } from './../models/propriedade';
import { Apicultor } from './../models/apicultor';
import { Component, OnInit, ViewChild, ContentChild, NgZone, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router'
import { ITdDataTableColumn } from '@covalent/core';
import { ParseService } from '../service/parse.service';
import { MomentService } from '../service/moment.service';
import { DialogService } from '../service/dialog.service';
import Constante from '../constantes';
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
  listApicultorAssociacao: ApicultorAssociacao[] = []

  controlApicultor: FormControl = new FormControl();
  controlPropriedade: FormControl = new FormControl();
  controlStatus: FormControl = new FormControl();

  filteredOptionsApicultor: Observable<Apicultor[]>;
  filteredOptionsPropriedade: Observable<Propriedade[]>;

  user: UserWeb;

  @ViewChild('table') table: TableComponent;


  columns: ITdDataTableColumn[] = [
    { name: 'valido', label: 'Validado', width: 70},
    { name: 'ativo', label: 'Ativo', format:(value)=> value ? 'Ativo': 'Desativado' },
    { name: 'especie', label: 'Espécie' },
    { name: 'apicultor', label: 'Apicultor' },
    { name: 'propriedadea', label: 'Propriedade' },
    { name: 'municipio', label: 'Municipio' },
    { name: 'qtdCaixas', label: 'Caixas' },
    { name: 'status', label: 'Status' },
    { name: 'coletadoPor', label: 'Coletado Por' },
    { name: 'data', label: 'Data', format: (value) => { return this.momentService.core(new Date(value)).format('DD/MM/YYYY HH:mm') } },
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
    let promiseApicultoAssociacao = this.serviceParse.findAll(ApicultorAssociacao);
    parse.Promise.when([promiseApicultor, promisePropriedade, promiseApicultoAssociacao]).then((res: any[]) => {
      this.listApicultor = res[0];
      this.listProriedade = res[1];
      this.listApicultorAssociacao = res[2];
    });


    this.serviceParse.get(parse.User.current().id, UserWeb).then(result => {
      if (result)
        this.user = result;
    })

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

    let promises = []

    this.queryApiario = this.serviceParse.createQuery(Apiario);
    this.queryApiario.include('apicultor');
    this.queryApiario.include('especieAbelha');
    this.queryApiario.include('propriedade');
    this.queryApiario.include('municipio');
    this.queryApiario.notEqualTo('excluded', true);
    this.queryApiario.descending('dataColetaCreate');

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
      this.queryApiario.greaterThanOrEqualTo('dataColetaCreate', this.filter.startDate);

    if (this.filter.endDate) {
      let datetemp: Date = this.filter.endDate;
      datetemp.setHours(23);
      datetemp.setMinutes(59);
      datetemp.setSeconds(59);

      this.queryApiario.lessThanOrEqualTo('dataColetaCreate', datetemp);
    }

    if (this.controlStatus.value != 'todos') {
      if (this.controlStatus.value == 'validados')
        this.queryApiario.equalTo('valido', true);
      else if(this.controlStatus.value == 'desativado')
         this.queryApiario.equalTo('excluded', true);
      else
        this.queryApiario.notEqualTo('valido', true);
    }

    this.queryApiario.limit(1000);

    this.serviceParse.executeQuery(this.queryApiario, true).done((result: Apiario[]) => {

      // Quando o usuario for do tipo associação so carrega o apiarios cujo o apicultor esteja vinculado
      if (this.user.attributes.tipo == 'ASSOCIACAO') {
        let associacao: Associacao = this.user.attributes.associacao;
        result = result.filter(value => {
          return value.getApicultor().getApiculorAssociacao().find(v => { return v.getAssociacao().id == associacao.id });
        });
      }

      let list = result.filter(value => { return value.getApicultor().getApiculorAssociacao().length <= 1 }).map((value) => {
        let apiario: Apiario = value;
        let apicultor: Apicultor = apiario.getApicultor();
        let apicultorAssociacao = apicultor.getApiculorAssociacao()[0];

        let obj;
        let pontos = apicultorAssociacao ? this.listApicultorAssociacao.find(value => { return value.id == apicultorAssociacao.id }).getQtdPontos() : 0;
        let caixas = apicultorAssociacao ? this.listApicultorAssociacao.find(value => { return value.id == apicultorAssociacao.id }).getQtdCaixas() : 0;
        try {
          let dt = apiario.getDataColetaCreate() ? apiario.getDataColetaCreate().getTime() : apiario.createdAt.getTime();
          obj = {
            id: apiario.id,
            ativo: apiario.isAtivo(),
            valido: apiario.isValido(),
            especie: apiario.getEspecieAbelha().getNome(),
            apicultor: apiario.getApicultor().getNome(),
            propriedadea: apiario.getPropriedade().getNome(),
            municipio: apiario.getMunicipio() ? apiario.getMunicipio().getNome() : 'Nenhum Municipio',
            qtdCaixas: apiario.getQtdCaixas() == undefined || apiario.getQtdCaixas() == null ? 0 : apiario.getQtdCaixas(),
            coletadoPor: apiario.getColetadoPor(),
            status: apiario.getStatus(),
            excluded: apiario.isExcluded(),
            data: dt ,
            dataString: this.momentService.core(new Date(dt)).format('DD/MM/YYYY HH:mm')//para buscar data formatada
          }
        } catch (e) {
          console.error('Erro ao montar lista Apiario');
          console.error('Apiario ' + apiario.id);
          console.error(e);
        }
        return obj;
      });


      let list2 = result.filter(value => { return value.getApicultor().getApiculorAssociacao().length > 1 })
      let list3 = [];

      for (let ap of list2) {
        for (let ass of ap.getApicultor().getApiculorAssociacao()) {
          try {
            let pontos = ass ? this.listApicultorAssociacao.find(value => { return value.id == ass.id }).getQtdPontos() : 0;
            let caixas = ass ? this.listApicultorAssociacao.find(value => { return value.id == ass.id }).getQtdCaixas() : 0;
            let dt = ap.getDataColetaCreate() ? ap.getDataColetaCreate().getTime() : ap.createdAt.getTime();
            let obj = {
              id: ap.id,
              ativo: ap.isAtivo(),
              valido: ap.isValido(),
              especie: ap.getEspecieAbelha().getNome(),
              apicultor: ap.getApicultor().getNome(),
              propriedadea: ap.getPropriedade().getNome(),
              municipio: ap.getMunicipio() ? ap.getMunicipio().getNome() : 'Nenhum Municipio',
              qtdCaixas: ap.getQtdCaixas() == undefined || ap.getQtdCaixas() == null ? 0 : ap.getQtdCaixas(),
              coletadoPor: ap.getColetadoPor(),
              status: ap.getStatus(),
              excluded: ap.isExcluded(),
              data: dt,
              dataString: this.momentService.core(new Date(dt)).format('DD/MM/YYYY HH:mm')//para buscar data formatada

            }
            list3.push(obj);
          } catch (e) {
            console.error('Erro ao montar lista Apiario');
            console.error('Apiario ' + ap.id);
            console.error(e);
          }
        }
      }

      list = list.concat(list3);
      this.getValidadoPor(list);      

    });

  }

  getStatus(){
    return '';
  }

  getValidadoPor(list) {

    let filterArray = list.filter((value) => { return value.coletadoPor });


    this.serviceParse.runCloud('listUsers').then((result: UserWeb[]) => {

      if (result) {
        list.forEach(value => {

          if (value.coletadoPor) {
            let coletadoPor = result.find(f => { return f.id == value.coletadoPor.id });
            switch (coletadoPor.attributes.tipo) {
              case Constante.GESTOR:
                value.coletadoPor = coletadoPor.attributes.nomeGestor;
                break;

              case Constante.APICULTOR:
                value.coletadoPor = coletadoPor.attributes.apicultor.attributes.nome;
                break;

              case Constante.ASSOCIACAO:
                value.coletadoPor = coletadoPor.attributes.associacao.attributes.nome;
                break;
            }
          } else {
            value.coletadoPor = 'Nenhuma referência';
          }
        });
        this.zone.run(() => {
          this.atualiza(list);
        });
      }
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
    this.table.refresh();
  }

  acoes(param) {
    let menssagem = undefined;
    switch (param.acao) {
      case 'EDITAR':
        this.route.navigate(['home/editar/apiario'], { queryParams: { apiario: param.element.id } });
        break;
      case 'EXCLUIR':
        menssagem = '<p> Deseja prosseguir com a exclusão do dado?</p>';
        this.dialogService.confirm('Confirmar exclusão', menssagem, null, this.viewContainerRef).subscribe((val) => {
          if (val) {
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
      case 'ATIVAR':
        this.serviceParse.get(param.element.id,Apiario).then(response=>{
           if(response){
             response.setExcluded(false);
             this.serviceParse.save(response).then(response1=>{
              if(response1){
                this.zone.run(()=>{
                   this.dialogService.confirm('Sucesso', 'Apiario reativado com sucesso!', 'SUCCESS', this.viewContainerRef);
                    this.listApiario = this.listApiario.filter((value) => {
                        return param.element.id != value.id;
                      });
                });
              }
             })
           }
        });
      break;
      case 'VALIDAR':
        menssagem = '<p>Tem certeza que deseja validar este dado?</p>' + '<p>Este procedimento não poderá ser revertido!</p>';
        this.dialogService.confirm('Confirmar validação', menssagem, null, this.viewContainerRef).subscribe((value) => {
          if (value) {
            this.serviceParse.get(param.element.id, Apiario, ['apicultor']).then(result => {
              result.setValidadoPor(parse.User.current());
              result.setValido(true);
              result.setDataValidacao(new Date());
              let apicultor: Apicultor = result.getApicultor();
              let queryApicultor = this.serviceParse.createQuery(Apicultor);
              queryApicultor.equalTo('objectId', apicultor.id);
              let queryUser = this.serviceParse.createQuery(UserWeb);
              queryUser.matchesQuery('apicultor', queryApicultor);

              this.serviceParse.save(result).then(result1 => {
                if (result1) {
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
                        this.serviceParse.executeQuery(queryUser).then(result2 => {
                          this.sendNotification(result2[0].id);
                        });
                      }
                    });
                  });
                }
              });
            });
          }
        });

        break;
    }
  }

  sendNotification(id) {
    this.serviceParse.sendNotification(id, 'Caro seu apiário foi validado!');
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
