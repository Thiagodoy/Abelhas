import { Apicultor } from './../models/apicultor';
import { LeafletColorMarker } from '../leaflet-color-marker';
import { UserWeb } from './../models/user-web';
import { DialogService } from './../service/dialog.service';
import { Apiario } from './../models/apiario';
import { Location } from './../models/location';
import { EspecieAbelha } from './../models/especie-abelha';
import { Cultura } from './../models/cultura';
import { Propriedade } from './../models/propriedade';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
import { Component, OnInit, EventEmitter, OnDestroy, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, } from '@angular/platform-browser';
import { ParseService } from '../service/parse.service';
import { Observable,Subscription } from 'rxjs/Rx';

import { Mortandade } from '../models/mortandade';
import * as parse from 'parse';
import { error } from 'util';
import { Validators } from '@angular/forms';
let jquery = require('jquery');



@Component({
  selector: 'app-edit-apiary',

  templateUrl: './edit-apiary.component.html',
  styleUrls: ['./edit-apiary.component.scss'],

})
export class EditApiaryComponent implements OnInit, OnDestroy {

  apiario: Apiario = undefined;
  listMortandade: Mortandade[] = [];
  listCulturas: Mortandade[] = [];
  listPropriedades: Propriedade[] = [];
  listEspecieAbelha: EspecieAbelha[] = [];
  listApicultor: Apicultor[] = [];
  motivosMortandade: any = {};
  culturas: any = {};
  motivosHistoricoMortandade: any = {};
  locations: Location[] = [];
  static pop: EventEmitter<Object> = new EventEmitter();
  filteredOptionsApicultor: Observable<Apicultor[]>;
  filteredOptionsPropriedade: Observable<Propriedade[]>;

  formError: any = {apicultor:null,propriedade:null};  

  apicultor: FormControl = new FormControl('', Validators.required);
  propriedade: FormControl = new FormControl('', Validators.required);

  formApiario: FormGroup;
  cultura: FormGroup;
  motivoHistoricoMortandade: FormGroup;
  motivoMortandade: FormGroup;

  subscriptionForm: Subscription;

  constructor(private routeR: Router, private route: ActivatedRoute, private parseService: ParseService, private sanitizer: DomSanitizer, private dialog: DialogService, private fb: FormBuilder) { }

  ngOnInit() {

    this.createForm(null);
    this.route.queryParams.subscribe((res) => {

      let promiseMortandade = this.parseService.findAll(Mortandade);
      let promisePropriedade = this.parseService.findAll(Propriedade);
      let promiseCuLtura = this.parseService.findAll(Cultura);
      let promiseEspecieAbelha = this.parseService.findAll(EspecieAbelha);
      let promiseApicultor = this.parseService.findAll(Apicultor);

      let query = this.parseService.createQuery(Apiario);
      query.equalTo('objectId', res['apiario']);
      query.include('apicultor');
      query.include('culturas');
      query.include('especieAbelha');
      query.include('atividadeApicula');
      query.include('propriedade');
      let proomiseApiario = this.parseService.executeQuery(query);

      parse.Promise.when([promiseMortandade, promisePropriedade, promiseCuLtura, proomiseApiario, promiseEspecieAbelha, promiseApicultor]).then((result: any[]) => {

        
        this.listPropriedades = result[1];
        this.listEspecieAbelha = result[4];
        this.apiario = result[3][0];
        this.listApicultor = result[5];
        
        for (let cultur of result[2]) 
          this.cultura.addControl(cultur.id, new FormControl());

        for (let motivo of result[0])
          this.motivoHistoricoMortandade.addControl(motivo.id, new FormControl());

        for (let motivo of result[0])
          this.motivoMortandade.addControl(motivo.id, new FormControl());

        this.listMortandade = result[0];
        this.listCulturas = result[2];
        
        this.formApiario.addControl('propriedade', this.propriedade);
        this.formApiario.addControl('apicultor', this.apicultor);
        this.formApiario.addControl('culturas', this.cultura);
        this.formApiario.addControl('motivoMortandade', this.motivoMortandade);
        this.formApiario.addControl('motivoHistoricoMortandade', this.motivoHistoricoMortandade);

        this.populateForm();
        this.showLocation();
        this.showPhoto();

      });
    });


    // Detecta mudancas no Formulario
    this.subscriptionForm = this.formApiario.valueChanges.subscribe(values => {
      this.changeForm(values);
    });

    //Auto Complete Apicultor
    this.filteredOptionsApicultor = this.apicultor.valueChanges
    .startWith(null)
    .map<string, string>(nome => nome ? nome : '')
    .map((nome => nome ? this.filterApicultor(nome) : this.listApicultor.slice()));

    this.filteredOptionsPropriedade = this.propriedade.valueChanges
    .startWith(null)
    .map<string, string>(nome => nome ? nome : '')
    .map((nome => nome ? this.filterPropriedade(nome) : this.listPropriedades.slice()));
  }

  ngOnDestroy() {
    jquery('#myImg').off('click');
    jquery('#closeModal').off('click');
  }

  private changeForm(data: any) {            
    
        if (!this.formApiario) return; 


        const form = this.formApiario;
        for (const field in this.formError) {
          this.formError[field] = null;
          const control = form.get(field);
          if (control && !control.valid) {
            this.formError[field] = control.errors;
          }
        }       
      }

  showPhoto() {
    let fotos = this.apiario.getFotos();
    if (fotos && fotos.length > 0) {
      this.loadPhoto(fotos[0]._url)
    }
  }

  showLocation() {
    
        if (this.apiario && this.apiario.getLocation()) {
    
          let query = this.parseService.createQuery(Apiario);
          let locationApiario: parse.GeoPoint = this.apiario.attributes.location;
          query.withinKilometers('location', locationApiario, 5);
          let l = [];
          let lt = undefined;
          this.parseService.executeQuery(query).then((result: Apiario[]) => {
    
    
            result.forEach((apiario)=>{
                  let location = apiario.getLocation();
                  let apicultorNome = apiario.getApicultor().getNome();
                  let propriedade = apiario.getPropriedade().getNome();
                  let especieAbelha = apiario.getEspecieAbelha().getNome()          
                  location.setPopUp(apicultorNome, propriedade, especieAbelha);
    
                  if (location.key.indexOf(this.apiario.getLocation().key) >= 0) {
                    location.setIcon(LeafletColorMarker.greenIcon);
                    lt = location;            
                  }
                  else{
                    location.setIcon(LeafletColorMarker.blueIcon);
                  }
                l.push(location);  
            });
    
            l.push(lt);
            this.locations = l;
          });
        }
      }

  populateForm() {
    this.formApiario.get('apicultor').setValue(this.apiario.getApicultor());
    this.formApiario.get('propriedade').setValue(this.listPropriedades.filter(value => { return value.id == this.apiario.getPropriedade().id })[0]);
    this.formApiario.get('especieAbelha').setValue(this.listEspecieAbelha.filter(value => { return value.id == this.apiario.getEspecieAbelha().id })[0]);

    this.apiario.getCulturas().forEach((cultura) => { this.formApiario.get('culturas').get(cultura.id).setValue(true); });

    if (this.apiario.getMotivoMortandade())
      this.apiario.getMotivoMortandade().forEach((motivo) => { this.formApiario.get('motivoMortandade').get(motivo.id).setValue(true); });

    if (this.apiario.getMotivoHistoricoMortandade())
      this.apiario.getMotivoHistoricoMortandade().forEach((motivo) => { this.formApiario.get('motivoHistoricoMortandade').get(motivo.id).setValue(true); });

    this.formApiario.get('observacao').setValue(this.apiario.getObservacao());

    let qtdCaixas = (!!this.apiario.getQtdCaixas()) ? 0 : this.apiario.getQtdCaixas();
    this.formApiario.get('qtdCaixas').setValue(this.apiario.getQtdCaixas());

    let distanciaDeslocamento = (!!this.apiario.getDistanciaDeslocamentoCaixas()) ? 0 : this.apiario.getDistanciaDeslocamentoCaixas();
    this.formApiario.get('distanciaDeslocamentoCaixas').setValue(distanciaDeslocamento);

    
    this.formApiario.get('migratorio').setValue(!!this.apiario.isMigratorio());    
    this.formApiario.get('existenciaMortalidadeAbelha').setValue(!!this.apiario.getExistenciaMortalidadeAbelha());    
    this.formApiario.get('comprovadoPorAnalise').setValue(!!this.apiario.getComprovadoPorAnalise());    
    this.formApiario.get('historicoMortandade').setValue(!!this.apiario.isHistroricoMortandade());    
    this.formApiario.get('historicoComprovadoPorAnalise').setValue(!!this.apiario.isHistoricoComprovadoPorAnalise());   
    this.formApiario.get('dialogoVizinhos').setValue(!!this.apiario.isDialogoVizinhos());

  }

  createForm(apiario: Apiario) {

    this.cultura = this.fb.group({});
    this.motivoHistoricoMortandade = this.fb.group({});
    this.motivoMortandade = this.fb.group({});
    this.formApiario = this.fb.group({
      // apicultor: [''],
      // propriedadepropriedade: [''],
      migratorio: [false],
      qtdCaixas: [''],
      distanciaDeslocamentoCaixas: [''],
      especieAbelha: [''],
      existenciaMortalidadeAbelha: [false],
      comprovadoPorAnalise: [false],
      historicoMortandade: [false],
      historicoComprovadoPorAnalise: [false],
      observacao: [''],
      dialogoVizinhos: [false]

    });
  }

  validar() {

    this.apiario.setValido(true)
    this.apiario.setValidadoPor(parse.User.current());
    this.apiario.setDataValidacao(new Date());
    this.parseService.save(this.apiario).then(res => {
      if (res) {
        this.dialog.confirm('Sucesso', 'Apiário validado com sucesso', 'SUCCESS', null).subscribe(value => {
          if (res) {
            let queryUser = this.parseService.createQuery(UserWeb);
            let queryApicultor = this.parseService.createQuery(Apicultor);
            queryApicultor.equalTo('objectId', this.apiario.getApicultor().id);
            queryUser.matchesQuery('apicultor', queryApicultor);
            this.parseService.executeQuery(queryUser).then(result => {
              if (result && result.length > 0) {
                this.parseService.sendNotification(result[0].id, 'Apiário validado!');
              }
            });
          }
          this.routeR.navigate(['home/lista/apiarios']);
        });
      }
    });
  }

  excluir() {
    this.apiario.setAtivo(false);
    this.parseService.save(this.apiario).then(res => {
      if (res) {
        this.dialog.confirm('Sucesso', 'Apiário excluido com sucesso!', 'SUCCESS', null).subscribe(value => {
          this.routeR.navigate(['home/lista/apiarios']);
        });
      }
    });
  }

  salvar() {
    this.mountApiario();
    this.parseService.save(this.apiario).then(res => {
      if (res) {
        this.dialog.confirm('Sucesso', 'Apiário salvo com sucesso!', 'SUCCESS', null);
      }
    });
  }

  mountApiario() {

    this.apiario.setPropriedade(this.formApiario.get('propriedade').value);
    this.apiario.setEspecieAbelha(this.formApiario.get('especieAbelha').value);
    this.apiario.setQtdCaixas(this.formApiario.get('qtdCaixas').value);
    this.apiario.setDistanciaDeslocamentoCaixas(this.formApiario.get('distanciaDeslocamentoCaixas').value);
    this.apiario.setCulturas(this.listCulturas.filter(value => { return this.cultura.get(value.id).value }));
    this.apiario.setMotivoMortandade(this.listMortandade.filter(value => { return this.motivoMortandade.get(value.id).value }));
    this.apiario.setMotivoHistoricoMortandade(this.listMortandade.filter(value => { return this.motivoHistoricoMortandade.get(value.id).value }));
    this.apiario.setHistroricoMortandade(this.formApiario.get('historicoMortandade').value);
    this.apiario.setObservacao(this.formApiario.get('observacao').value)
    this.apiario.setMigratorio(!!this.formApiario.get('migratorio').value);
    this.apiario.setExistenciaMortalidadeAbelha(this.formApiario.get('existenciaMortalidadeAbelha').value);
    this.apiario.setComprovadoPorAnalise(!!this.formApiario.get('comprovadoPorAnalise').value);
    this.apiario.setHistoricoComprovadoPorAnalise(!!this.formApiario.get('historicoComprovadoPorAnalise').value);
    this.apiario.setDialogoVizinhos(!!this.formApiario.get('dialogoVizinhos').value);


  }

  loadPhoto(url) {
    jquery('#myImg').attr('src', this.sanitizer.sanitize(SecurityContext.URL, url));
    jquery('#myImg').on('load', this.bindEventLoadImage);
    jquery('#myImg').on('error', this.bindEventLoadImage);
  }

  bindEventLoadImage(event) {

    if (!event)
      return false;
    event.preventDefault();

    if (event.type == 'load') {
      EditApiaryComponent.activePopUp();
    }

    if (event.type == 'error') {
      jquery('#myImg').attr('src', 'assets/no_image.jpg');
    }
  }

  private static activePopUp() {

    jquery('#myImg').click((event) => {
      let src = jquery(event.currentTarget).attr('src');
      EditApiaryComponent.pop.emit({ src: src });
    });
    jquery('#closeModal').click(function () {
      jquery('#myModal').hide();
    });
  }
  filterApicultor(name: string): Apicultor[] {
     return this.listApicultor.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  filterPropriedade(name: string): Propriedade[] {
    return this.listPropriedades.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }
}

