import { UserWeb } from './../models/user-web';
import { LeafletColorMarker } from './../leaflet-color-marker';
import { DialogService } from './../service/dialog.service';
import { Location } from './../models/location';
import { LeafletService } from './../service/leaflet.service';
import { MomentService } from './../service/moment.service';
import { Apiario } from './../models/apiario';
import { Municipio } from './../models/municipio';
import { EspecieAbelha } from './../models/especie-abelha';
import { Propriedade } from './../models/propriedade';
import { Apicultor } from './../models/apicultor';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, NgZone, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ITdDataTableColumn } from '@covalent/core';
import Constante from '../constantes';
import * as parse from 'parse';
import { Associacao } from 'app/models/associacao';


@Component({
  selector: 'app-edit-multiple-apiary',
  templateUrl: './edit-multiple-apiary.component.html',
  styleUrls: ['./edit-multiple-apiary.component.sass']
})
export class EditMultipleApiaryComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'attributes.propriedade.attributes.nome', label: 'ProPriedade' },
    { name: 'attributes.apicultor.attributes.nome', label: 'Apicultor' },
    { name: 'createdAt', label: 'Data', format: (value) => { return this.momentService.core(value).format('DD/MM/YYYY HH:mm') } },
  ];

  listApicultor: Apicultor[] = [];
  listApicultor2: Apicultor[] = [];
  listAssociacao:Associacao[] = [];
  listAssociacao2:Associacao[] = [];
  listPropriedade: Propriedade[] = [];
  listPropriedade2: Propriedade[] = [];
  listEspecieAbelha: EspecieAbelha[] = [];
  listMunicipio: Municipio[] = [];
  listApiarios: Apiario[] = []
  listApiarioSelected: Apiario[] = [];
  listColetadoPor: any[] = [];
  locations: Location[] = [];

  controlMunicipio: FormControl = new FormControl('', [Validators.required]);
  controlAbelha: FormControl = new FormControl('', Validators.required);
  controlPropriedade: FormControl = new FormControl('', Validators.required);
  controlPropriedade2: FormControl = new FormControl('', Validators.required);
  controlAssociacao: FormControl = new FormControl('', Validators.required);
  controlAssociacao2: FormControl = new FormControl('', Validators.required);
  controlApicultor: FormControl = new FormControl('', Validators.required);
  controlApicultor2: FormControl = new FormControl('', Validators.required);
  controlColetadoPor: FormControl = new FormControl('', Validators.required);

  filteredOptionsMunicipio: Observable<Municipio[]>;
  filteredOptionsEspecieAbelha: Observable<EspecieAbelha[]>;
  filteredOptionsPropriedade: Observable<Propriedade[]>;
  filteredOptionsApicultor: Observable<Apicultor[]>;
  filteredOptionsPropriedade2: Observable<Propriedade[]>;
  filteredOptionsApicultor2: Observable<Apicultor[]>;
  filteredOptionsColetadorPor: Observable<any[]>;
  filteredOptionsAssociacao: Observable<Associacao[]>;
  filteredOptionsAssociacao2: Observable<Associacao[]>;

  filtroColetadoPor = false;

  error: any = {};

  constructor(private view: ViewContainerRef, private dialogService: DialogService, private parseService: ParseService, private momentService: MomentService, private zone: NgZone, private leaflet: LeafletService) { }

  ngOnInit() {

    this.parseService.findAll(Municipio).then(resul => {
      this.zone.run(() => {
        this.listMunicipio = resul;
      })
    });

    let promise_1 = this.parseService.findAll(Propriedade);
    let promise_2 = this.parseService.findAll(Apicultor)
    let promise_3 = this.parseService.findAll(EspecieAbelha);
    let promise_4 = this.parseService.findAll(Municipio);
    let promise_5 = this.parseService.findAll(Associacao);

    let query = this.parseService.createQuery(Apiario);
    let queryUser = this.parseService.createQuery(UserWeb);

    query.matchesQuery('coletadoPor', queryUser);

    this.parseService.executeQuery(query).then(result => {
      if (result) {
        let filter = result.map(v => { return v.id });


        this.parseService.runCloud('listUsers').then((r: UserWeb[]) => {
          if (r) {

            this.listColetadoPor = r.map(value => {
              let obj = { id: null, nome: null }
              obj.id = value.id;

              switch (value.attributes.tipo) {
                case Constante.GESTOR:
                  obj.nome = value.attributes.nomeGestor;
                  break;

                case Constante.APICULTOR:
                  obj.nome = value.attributes.apicultor.attributes.nome;
                  break;

                case Constante.ASSOCIACAO:
                  obj.nome = value.attributes.associacao.attributes.nome;
                  break;
              }
              return obj;
            });
          }
        });
      }
    });

    parse.Promise.when(promise_1, promise_2, promise_3, promise_4,promise_5).then((res_1, res_2, res_3, res_4,res_5) => {
      this.zone.run(() => {

        this.listPropriedade = res_1;
        this.listPropriedade2 = res_1;
        this.listApicultor = res_2;
        this.listEspecieAbelha = res_3;
        this.listMunicipio = res_4
        this.listApicultor2 = res_2;
        this.listAssociacao = res_5;
        this.listAssociacao2 = res_5;

        this.todos();
      });
    });

    this.filteredOptionsMunicipio = this.controlMunicipio.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterMunicipio(nome) : this.listMunicipio.slice()));

    this.filteredOptionsApicultor = this.controlApicultor.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterApicultor(nome) : this.listApicultor.slice()));

    this.filteredOptionsApicultor2 = this.controlApicultor2.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map<string, Apicultor[]>((nome => nome ? this.filterApicultor2(nome) : this.listApicultor2.slice()));

    this.filteredOptionsEspecieAbelha = this.controlAbelha.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterAbelha(nome) : this.listEspecieAbelha.slice()));

    this.filteredOptionsPropriedade = this.controlPropriedade.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterPropriedade(nome) : this.listPropriedade.slice()));

    this.filteredOptionsPropriedade2 = this.controlPropriedade2.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterPropriedade2(nome) : this.listPropriedade2.slice()));


    this.filteredOptionsColetadorPor = this.controlColetadoPor.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterColetado(nome) : this.listColetadoPor.slice()));

    this.filteredOptionsAssociacao = this.controlAssociacao.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterAssociacao(nome) : this.listAssociacao.slice()));

    this.filteredOptionsAssociacao2 = this.controlAssociacao2.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterAssociacao2(nome) : this.listAssociacao2.slice()));
  }


  todos() {

    let propriedade = new Propriedade();
    propriedade.setNome('Todos');
    this.listPropriedade.push(propriedade);

    let apicultor = new Apicultor();
    apicultor.setNome('Todos');
    this.listApicultor.push(apicultor);

    let especiAbelha = new EspecieAbelha();
    especiAbelha.setNome('Todos');
    this.listEspecieAbelha.push(especiAbelha);

    let municipio = new Municipio();
    municipio.setNome('Todos')
    this.listMunicipio.push(municipio);
   
    let propriedade2 = new Propriedade();
    propriedade2.setNome('Manter');
    this.listPropriedade2.push(propriedade2)
    this.listPropriedade2 =  this.listPropriedade2.filter(t=>t.getNome().indexOf('Todos') < 0);


    let associacao2 = new Associacao();
    associacao2.setNome('Manter');
    this.listAssociacao2.push(associacao2);
    this.listAssociacao2 =  this.listAssociacao2.filter(t=>t.getNome().indexOf('Todos') < 0);

    let associacao = new Associacao();
    associacao.setNome('Todos');
    this.listAssociacao.push(associacao);

  }

  itensSelected(paran:any) {

    if (paran.selected) {
      if (paran.row) {
        this.listApiarioSelected.push(paran.row);
        let apiario: Apiario = paran.row;
        let location = apiario.getLocation();
        this.leaflet.removeLocation(location);
        location.setIcon(LeafletColorMarker.greenIcon);
        this.leaflet.putLocation(location);
      } else {
        this.listApiarioSelected = this.listApiarioSelected.concat(paran.rows);

        for (let apiario of paran.rows) {
          let location = apiario.getLocation();
          this.leaflet.removeLocation(location);
          location.setIcon(LeafletColorMarker.greenIcon);
          this.leaflet.putLocation(location);
        }
      }
    } else {

      if (paran.rows) {
        this.listApiarioSelected = [];
        this.locations = this.locations.filter(value => {
          value.setIcon(LeafletColorMarker.blueIcon);
          return value;
        });
      } else  {
        let apiario: Apiario = paran.row;
        this.leaflet.removeLocation(apiario.getLocation());
        apiario.getLocation().setIcon(LeafletColorMarker.blueIcon);
        this.leaflet.putLocation(apiario.getLocation());
        this.listApiarioSelected = this.listApiarioSelected.filter((value, index) => { return value.getId() != apiario.getId() });
      }
    }
  }

  validar(type): boolean {

    let controlAb: Map<string, AbstractControl> = new Map();
    let isvalid = true;

    if (type == 'BUSCAR') {
      controlAb.set('municipio', this.controlMunicipio);
      controlAb.set('abelha', this.controlAbelha);
      if (!this.filtroColetadoPor)
        controlAb.set('apicultor', this.controlApicultor);
      else
        controlAb.set('coletado', this.controlColetadoPor)

      controlAb.set('propriedade', this.controlPropriedade);
      controlAb.set('associacao', this.controlAssociacao);

    } else {
      controlAb.set('propriedade2', this.controlPropriedade2);
      controlAb.set('apicultor2', this.controlApicultor2);
      controlAb.set('associacao2', this.controlAssociacao2);
    }

    let option = ['municipio', 'abelha', 'apicultor', 'propriedade', 'apicultor2', 'propriedade2', 'coletado','associacao','associacao2'];

    for (let key of option) {

      if (!controlAb.get(key))
        continue;

      if (controlAb.get(key).status == 'INVALID' || typeof controlAb.get(key).value != 'object') {

        controlAb.get(key).setValue('');
        this.error[key] = true;
        isvalid = false;

      } else {
        this.error[key] = false;
      }
    }
    return isvalid;
  }

  change(event) {
    this.filtroColetadoPor = event.checked;
  }

  mover() {
    if (this.validar('')) {

      if (this.listApiarioSelected.length == 0) {
        let message = '<p>Não existe nenhum apiário selecionado</p>'
        this.dialogService.confirm('Erro', message, 'ERRO', this.view);
        return false;
      }

      let apicultor: Apicultor = this.controlApicultor2.value
      let propriedade: Propriedade = this.controlPropriedade2.value;
      let associacao: Associacao = this.controlAssociacao2.value;

      parse.Promise.as<any>(() => { }).then(() => {

        let promises: parse.Promise<any>[] = []
        for (let apiario of this.listApiarioSelected) {
          apiario.setApicultor(apicultor);

          if(!(propriedade.getNome().indexOf('Manter') >= 0))
            apiario.setPropriedade(propriedade);
          if(!(associacao.getNome().indexOf('Manter') >= 0))
            apiario.setAssociacao(associacao);  

          let promise = this.parseService.save(apiario)
          promises.push(promise);
        }
        return parse.Promise.when(promises).fail(() => false).then((erro) => erro);

      }).then(resul => {
        if (resul) {
          this.dialogService.confirm('Sucesso', '<p>Movimentação realizada com sucesso!</p>', 'SUCCESS', this.view);
          this.clear();
        } else {
          this.dialogService.confirm('Erro', resul.message, 'ERRO', this.view);
        }
      });
    } else {
      let message = '<p>Campos obrigatórios não foram preenchidos!</p>'
      this.dialogService.confirm('Erro', message, 'ERRO', this.view);
    }
  }

  clear() {
    this.controlMunicipio.reset('');
    this.controlApicultor.reset('');
    this.controlAbelha.reset('');
    this.controlPropriedade.reset('');
    this.controlApicultor2.reset('');
    this.controlPropriedade2.reset('');
    this.controlAssociacao.reset('');
    this.controlAssociacao2.reset('');
    this.listApiarios = [];
    this.listApiarioSelected = [];
    this.leaflet.removeAll();
  }

  pesquisar() {

    if (this.validar('BUSCAR')) {
      let queryApiario = this.parseService.createQuery(Apiario);

      let queryApicultor = this.parseService.createQuery(Apicultor);
      let apicultor: Apicultor = this.controlApicultor.value;

      let queryAssociacao = this.parseService.createQuery(Associacao);
      let associacao:Associacao = this.controlAssociacao.value;

      queryAssociacao.equalTo('objectId',associacao.getId());

      if (!this.filtroColetadoPor)
        queryApicultor.equalTo('objectId', apicultor.getId());


      let queryAbelha = this.parseService.createQuery(EspecieAbelha);
      let especieAbelha: EspecieAbelha = this.controlAbelha.value;
      queryAbelha.equalTo('objectId', especieAbelha.getId());

      let queryMunicipio = this.parseService.createQuery(Municipio);
      let municipio: Municipio = this.controlMunicipio.value;
      queryMunicipio.equalTo('objectId', municipio.getId())

      let queryPropriedade = this.parseService.createQuery(Propriedade);
      let propriedade: Propriedade = this.controlPropriedade.value;
      queryPropriedade.equalTo('objectId', propriedade.getId())

      if (this.filtroColetadoPor) {
        let queryUser = this.parseService.createQuery(UserWeb);
        queryUser.equalTo('objectId', this.controlColetadoPor.value.id);
        queryApiario.matchesQuery('coletadoPor', queryUser);
      }
      else if(apicultor.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('apicultor', queryApicultor);

      if(associacao.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('associacao',queryAssociacao);  
      if (especieAbelha.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('especieAbelha', queryAbelha);
      if (propriedade.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('propriedade', queryPropriedade);
      if (municipio.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('municipio', queryMunicipio);

      queryApiario.limit(2000);

      this.parseService.executeQuery(queryApiario).then((result: Apiario[]) => {
        this.zone.run(() => {
          this.listApiarios = result;
          let tempLocation = [];
          result.forEach(value => {
            let location = value.getLocation();
            tempLocation.push(location);
          });
          this.locations = tempLocation;
        })
      });
    } else {
      let message = '<p>Campos obrigatórios não foram preenchidos!</p>'
      this.dialogService.confirm('Erro', message, 'ERRO', this.view);
    }


  }

  filterMunicipio(name: string): Municipio[] {
    return this.listMunicipio.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterAssociacao(name: string): Associacao[] {
    return this.listAssociacao.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterAssociacao2(name: string): Associacao[] {
    return this.listAssociacao2.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterAbelha(name: string): EspecieAbelha[] {
    //this.validar('abelha',this.controlAbelha.status);
    return this.listEspecieAbelha.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterPropriedade(name: string): Propriedade[] {
    // this.validar('propriedade',this.controlPropriedade.status);
    return this.listPropriedade.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterPropriedade2(name: string): Propriedade[] {
    // this.validar('propriedade',this.controlPropriedade.status);
    return this.listPropriedade2.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterApicultor(name: string): Apicultor[] {
    //  this.validar('apicultor',this.controlApicultor.status);
    return this.listApicultor.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterApicultor2(name: string): Apicultor[] {
    return this.listApicultor2.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterColetado(name: string): any[] {
    // this.validar('propriedade',this.controlPropriedade.status);
    return this.listColetadoPor.filter(option => {
      return new RegExp(name, 'gi').test(option.nome)
    });
  }

  displayFn2(object: any): string {
    return object ? object.nome : '';
  }
  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }
}
