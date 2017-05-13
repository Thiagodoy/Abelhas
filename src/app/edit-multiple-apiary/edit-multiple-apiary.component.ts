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
import { Component, OnInit,  NgZone, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ITdDataTableColumn } from '@covalent/core';
import * as parse from 'parse';


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
  listPropriedade: Propriedade[] = [];
  listEspecieAbelha: EspecieAbelha[] = [];
  listMunicipio: Municipio[] = [];
  listApiarios: Apiario[] = []
  listApiarioSelected: Apiario[] = [];
  locations: Location[] = [];

  controlMunicipio: FormControl = new FormControl('', [Validators.required]);
  controlAbelha: FormControl = new FormControl('', Validators.required);
  controlPropriedade: FormControl = new FormControl('', Validators.required);
  controlPropriedade2: FormControl = new FormControl('', Validators.required);
  controlApicultor: FormControl = new FormControl('', Validators.required);
  controlApicultor2: FormControl = new FormControl('', Validators.required);

  filteredOptionsMunicipio: Observable<Municipio[]>;
  filteredOptionsEspecieAbelha: Observable<EspecieAbelha[]>;
  filteredOptionsPropriedade: Observable<Propriedade[]>;
  filteredOptionsApicultor: Observable<Apicultor[]>;
  filteredOptionsPropriedade2: Observable<Propriedade[]>;
  filteredOptionsApicultor2: Observable<Apicultor[]>;

  error: any = {};

  constructor(private view:ViewContainerRef,private dialogService: DialogService, private parseService: ParseService, private momentService: MomentService, private zone: NgZone, private leaflet: LeafletService) { }

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

    parse.Promise.when(promise_1, promise_2, promise_3, promise_4).then((res_1, res_2, res_3, res_4) => {
      this.zone.run(() => {
        this.listPropriedade = res_1;
        this.listApicultor = res_2;
        this.listEspecieAbelha = res_3;
        this.listMunicipio = res_4
        this.listApicultor2 = res_2;
        this.todos()
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

    this.filteredOptionsPropriedade2 = this.controlPropriedade.valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map((nome => nome ? this.filterPropriedade(nome) : this.listPropriedade.slice()));
  }


  todos() {
 
    let propriedade = new Propriedade();
    propriedade.setNome('Todos');
    this.listPropriedade.push(propriedade);

    let apicultor = new Apicultor();
    apicultor.setNome('Todos');
    this.listApicultor.push(apicultor)  ;  

    let especiAbelha = new EspecieAbelha();
    especiAbelha.setNome('Todos');
    this.listEspecieAbelha.push(especiAbelha);

    let municipio = new Municipio();
    municipio.setNome('Todos')
    this.listMunicipio.push(municipio);


  }

  itensSelected(paran) {

    if (paran.selected) {
      if (paran.row) {
        this.listApiarioSelected.push(paran.row);
        let apiario: Apiario = paran.row;
        let location = apiario.getLocation();
        this.leaflet.removeLocation(location);
        location.setIcon(LeafletColorMarker.orangeIcon);        
        this.leaflet.putLocation(location);
      } else {
        this.listApiarioSelected.concat(paran.rows);

        for (let apiario of paran.rows) {        
          let location = apiario.getLocation();
          this.leaflet.removeLocation(location);
          location.setIcon(LeafletColorMarker.orangeIcon);
          this.leaflet.putLocation(location);          
        }
      }      
    } else {

      if (paran.rows && paran.rows.length == 0) {
        this.listApiarioSelected = [];
        this.locations = this.locations.filter(value => {
          value.setIcon(LeafletColorMarker.blueIcon);
          return value;
        });        
      } else {
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
      controlAb.set('apicultor', this.controlApicultor);
      controlAb.set('propriedade', this.controlPropriedade);
    } else {
      controlAb.set('propriedade2', this.controlPropriedade2);
      controlAb.set('apicultor2', this.controlApicultor2);
    }

    let option = ['municipio', 'abelha', 'apicultor', 'propriedade', 'apicultor2', 'propriedade2'];

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

  mover() {
    if (this.validar('')) {
      
      if (this.listApiarioSelected.length == 0) {
        let message = '<p>Não existe nenhum apiário selecionado</p>'
        this.dialogService.confirm('Erro', message, 'ERRO', this.view);
        return false;
      }

      let apicultor: Apicultor = this.controlApicultor2.value
      let propriedade: Propriedade = this.controlPropriedade2.value;

      parse.Promise.as<any>(() => { }).then(() => {

        let promises: parse.Promise<any>[] = []
        for (let apiario of this.listApiarioSelected) {
          apiario.setApicultor(apicultor);
          apiario.setPropriedade(propriedade);

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
    this.listApiarios = [];
    this.listApiarioSelected = [];
  }

  pesquisar() {

    if (this.validar('BUSCAR')) {
      let queryApiario = this.parseService.createQuery(Apiario);

      let queryApicultor = this.parseService.createQuery(Apicultor);
      let apicultor: Apicultor = this.controlApicultor.value;
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

      if (apicultor.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('apicultor', queryApicultor);
      if (especieAbelha.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('especieAbelha', queryAbelha);
      if (propriedade.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('propriedade', queryPropriedade);
      if (municipio.getNome().indexOf('Todos') < 0)
        queryApiario.matchesQuery('municipio', queryMunicipio);

      queryApiario.limit(1000);

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
    return this.listPropriedade.filter(option => {
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

  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }
}