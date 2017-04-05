import { DialogService } from './../service/dialog.service';
import { UserWeb } from './../models/user-web';
import { Observable, Subscription } from 'rxjs/Rx';
import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ParseService } from './../service/parse.service';
import { Associacao } from './../models/associacao';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewContainerRef, NgZone } from '@angular/core';
import * as parse from 'parse';
import ValidaCustom from '../edit-user/validator/validator-custom';
import constantes from '../constantes'

@Component({
  selector: 'app-edit-association',
  templateUrl: './edit-association.component.html',
  styleUrls: ['./edit-association.component.scss']
})
export class EditAssociationComponent implements OnInit, OnDestroy {


  associacao: Associacao;
  user: UserWeb;
  formAssociacao: FormGroup;
  listEstados: Estado[] = [];
  listMunicipio: Municipio[] = [];
  listEstadosFiltered: Observable<Estado[]>;
  listMunicipioFiltered: Observable<Municipio[]>;
  subscriptionForm: Subscription;
  formError: any = {};
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];;
  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cep = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  constructor(private route: Router, private zone: NgZone, private view: ViewContainerRef, private routerA: ActivatedRoute, private parseService: ParseService, private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit() {

    this.createForm(null);
    this.routerA.queryParams.subscribe(res => {

      let promiseEstado = this.parseService.findAll(Estado);
      let promiseMunicipio = this.parseService.findAll(Municipio);

      parse.Promise.when([promiseEstado, promiseMunicipio]).then(response => {
        this.listEstados = response[0];
        this.listMunicipio = response[1];
        if (res.associacao) {
          let query = this.parseService.createQuery(Associacao);
          query.equalTo('objectId', res.associacao);

          let queryUser = this.parseService.createQuery(UserWeb);
          queryUser.matchesQuery('associacao', query);
          queryUser.include('associacao');
          this.parseService.executeQuery(queryUser).then((result: UserWeb[]) => {
            this.zone.run(() => {

              if (!result || result.length == 0) {
                this.dialogService.confirm('Erro', 'Associacao sem usuario cadastrado!', 'ERRO', this.view);
                return false;
              }

              this.user = result[0];
              this.associacao = this.user.attributes.associacao;
              this.createForm(this.user ? constantes.CHANGE : constantes.CREATE);
              if (this.user && this.associacao)
                this.populateForm();

            });

          });
        } else {
          this.createForm(constantes.CREATE);
        }
      });
    });

  }

  ngOnDestroy() {
    this.subscriptionForm.unsubscribe();
  }

  filterEstado(name: string): Estado[] {
    return this.listEstados.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterMunicipio(name: string): Municipio[] {
    return this.listMunicipio.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }

  populateForm() {

    let associacao = this.associacao;
    this.formAssociacao.get('nome').setValue(associacao.getNome());
    this.formAssociacao.get('sigla').setValue(associacao.getSigla());
    this.formAssociacao.get('bairro').setValue(associacao.getBairro());
    this.formAssociacao.get('tipoRegistro').setValue(associacao.getTipoRegistro());
    this.formAssociacao.get('contatoPresidenteNome').setValue(associacao.getContatoPresidenteNome());
    this.formAssociacao.get('endereco').setValue(associacao.getEndereco());
    this.formAssociacao.get('telefone').setValue(associacao.getTelefone());
    this.formAssociacao.get('municipio').setValue(this.listMunicipio.filter(municipio => { return municipio.id == associacao.getMunicipio().id })[0]);
    this.formAssociacao.get('estado').setValue(this.listEstados.filter(estado => { return estado.id == associacao.getMunicipio().getEstado().id })[0]);
    this.formAssociacao.get('cep').setValue(associacao.getCep());
    this.formAssociacao.get('registro').setValue(associacao.getRegistro());
    this.formAssociacao.get('numeroSif').setValue(associacao.getNumeroSif());
    this.formAssociacao.get('contatoPresidenteTelefone').setValue(associacao.getContatoPresidenteTelefone());
    this.formAssociacao.get('email').setValue(associacao.getEmail());
    this.formAssociacao.get('cpf').setValue(this.user.getUsername());

  }
  populateAssociacao(): Associacao {

    let associacao = this.associacao ? this.associacao : new Associacao();

    associacao.setNome(this.formAssociacao.get('nome').value);
    associacao.setSigla(this.formAssociacao.get('sigla').value);
    associacao.setBairro(this.formAssociacao.get('bairro').value);
    associacao.setTipoRegistro(this.formAssociacao.get('tipoRegistro').value);
    associacao.setContatoPresidenteNome(this.formAssociacao.get('contatoPresidenteNome').value);
    associacao.setEndereco(this.formAssociacao.get('endereco').value);
    associacao.setTelefone(this.formAssociacao.get('telefone').value);
    associacao.setMunicipio(this.formAssociacao.get('municipio').value);
    associacao.setCep(this.formAssociacao.get('cep').value);
    associacao.setRegistro(this.formAssociacao.get('registro').value);
    associacao.setNumeroSif(this.formAssociacao.get('numeroSif').value);
    associacao.setContatoPresidenteTelefone(this.formAssociacao.get('contatoPresidenteTelefone').value);
    associacao.setEmail(this.formAssociacao.get('email').value);

    associacao.setTipoRegistro(1);

    return associacao;

  }

  salvar() {

    if (this.formAssociacao.valid) {
      let associacao = this.populateAssociacao();
      let user = undefined;
      let cnpj: string = this.formAssociacao.get('cpf').value;

      if (!this.associacao) {
        cnpj = cnpj.replace(/[^0-9]/gi, '');
        user = new UserWeb();
        user.setUsername(cnpj);
        user.setPassword(this.formAssociacao.get('senha').value);

        this.parseService.save(associacao).then(result => {
          if (!result)
            return false;

          user.set('associacao', associacao);
          let session = parse.User.current().attributes.sessionToken;
          this.parseService.signUp(user).then(result => {
            if (result) {
              this.dialogService.confirm('Sucesso', 'Associacao criada com sucesso!', 'SUCCESS', this.view).subscribe(() => {
                this.route.navigate(['home/associações']);
              });
              // Restaura o usuario que estava logado
              this.parseService.become(session)
            }
          });
        });
      } else {


        let promise = []
        if (this.userHasUpdate()) {
          let request = {
            objectId: this.user.id,
            password: this.formAssociacao.get('senha').value,
            username: this.user.getUsername()
          }
          promise.push(this.parseService.runCloud('updateUserPass', request));
        }

        promise.push(this.parseService.save(associacao));

        parse.Promise.when(promise).then(result => {
          if (result)
            this.dialogService.confirm('Sucesso', 'Associacao atualizada  com sucesso!', 'SUCCESS', this.view).subscribe(() => {
              this.route.navigate(['home/associações']);
            });;
        });
      }
    }
  }

  userHasUpdate(): boolean {

    if (!this.user)
      return null;

    let cnpj: string = this.formAssociacao.get('cpf').value;
    cnpj = cnpj.replace(/[^0-9]/gi, '');
    let cnpjOld: string = this.user.getUsername();
    let change: boolean = false;
    let password: string = this.formAssociacao.get('senha').value;

    if (!(cnpjOld.indexOf(cnpj) > -1)) {
      this.user.setUsername(cnpj);
      change = true;
    }

    if (password && password.length > 0) {
      change = true;
    }

    return change;
  }

  changeForm(data: any) {
    if (!this.formAssociacao) { return; }
    const form = this.formAssociacao;

    for (const field of Object.keys(form.controls)) {
      this.formError[field] = null;
      const control = form.get(field);
      if (control && !control.valid) {
        this.formError[field] = control.errors;
      }
  }
    
  }
  createForm(type: string) {


    this.formAssociacao = this.fb.group({
      nome: [null, ValidaCustom.validateCustomNome()],
      sigla: [null],
      bairro: [null],
      tipoRegistro: [null],
      contatoPresidenteNome: [null, ValidaCustom.validateCustomContatoPresidente()],
      endereco: [null, ValidaCustom.validateCustomEndereco()],
      telefone: [null, ValidaCustom.validateCustomTelefone()],
      municipio: [],
      estado: [],
      cep: [],
      registro: [],
      numeroSif: [],
      contatoPresidenteTelefone: [null,],
      email: [],
      confirmar_senha: ['', ValidaCustom.validateCustomSenhaConf(type)],
      senha: ['', ValidaCustom.validateCustomSenha(type)],
      cpf: [null, ValidaCustom.validateCustomCpfOrCnpj()],
      tipo: ['ASSOCIACAO']
    });

    this.listEstadosFiltered = this.formAssociacao.get('estado').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map(nome => nome ? this.filterEstado(nome) : this.listEstados.slice());

    this.listMunicipioFiltered = this.formAssociacao.get('municipio').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map(nome => nome ? this.filterMunicipio(nome) : this.listMunicipio.slice());

    // Detecta mudancas no Formulario
    this.subscriptionForm = this.formAssociacao.valueChanges.subscribe(values => {
      this.changeForm(values);
    });

  }
}
