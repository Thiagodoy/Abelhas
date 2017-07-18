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
  dataTermoCompromisso: Date = undefined;
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];;
  telefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  celular = ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskTelefone: Function = null;
  cep = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  showTermo: boolean = false;



  constructor(private route: Router, private zone: NgZone, private view: ViewContainerRef, private routerA: ActivatedRoute, private parseService: ParseService, private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit() {


    // Verifica se o usuario logado é do perfil Gestor para exibir o Termo
    this.showTermo = constantes.GESTOR == parse.User.current().attributes.tipo;

    //Customizando o plugin para identificar quando é celular ou telefone
    this.maskTelefone = (val) => {
      let tamanho = val.replace(/[\(\)\s\D-_]/gi, '').length;
      return tamanho <= 10 ? this.telefone : this.celular;
    }

    this.createForm(null);
    this.routerA.queryParams.subscribe(res => {

      let promiseEstado = this.parseService.findAll(Estado);
      let promiseMunicipio = this.parseService.findAll(Municipio);
      let promiseAllUser = this.parseService.runCloud('listUsers', { noInclude: true });
      
      parse.Promise.when([promiseEstado, promiseMunicipio, promiseAllUser]).then(response => {
        

        this.listEstados = response[0];
        this.listMunicipio = response[1];
        this.parseService.listUser = response[2];

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
    this.formAssociacao.get('acordoCooperacaoAbelha').setValue(this.associacao.getAcordoCooperacaoAbelha());

    if (this.associacao.getDataTermoCompromisso())
      this.dataTermoCompromisso = this.associacao.getDataTermoCompromisso();

    // this.formAssociacao.get('qtdCaixasFixas').setValue(associacao.getQtdCaixas());
    // this.formAssociacao.get('quantidadePontos').setValue(this.associacao.getQtdPontos());

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
    // associacao.setQtdCaixas(parseInt(this.formAssociacao.get('qtdCaixasFixas').value));
    // associacao.setQtdPontos(parseInt(this.formAssociacao.get('quantidadePontos').value));
    associacao.setTipoRegistro(1);
    associacao.setDataTermoCompromisso(this.dataTermoCompromisso);
    associacao.setAcordoCooperacaoAbelha(this.formAssociacao.get('acordoCooperacaoAbelha').value);

    return associacao;

  }

  salvar() {

    if (this.formAssociacao.valid) {
      let associacao = this.populateAssociacao();
      let user: UserWeb = undefined;
      let cnpj: string = this.formAssociacao.get('cpf').value;

      if (!this.associacao) {
        cnpj = cnpj.replace(/[^0-9]/gi, '');
        user = new UserWeb();
        user.setUsername(cnpj);
        user.setPassword(this.formAssociacao.get('senha').value);
        user.setEmail(this.formAssociacao.get('email').value, {});

        if (!!this.userCadastrado(user.getUsername())) {
          this.dialogService.confirm('Erro', ' Usuário já cadastrado!', 'ERRO', this.view);
          return false;
        }

        this.parseService.save(associacao).then(result => {
          if (!result)
            return false;

          user.set('associacao', associacao);
          user.set('tipo', 'ASSOCIACAO');
          user.set('excluded', false);
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
        let result = this.userHasUpdate();
        if (result.hasUpdate) {
          delete result.hasUpdate;
          promise.push(this.parseService.runCloud('updateUser', result));
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

  userCadastrado(username) {

    let temp = this.parseService.listUser.find((o) => {
      if (o.getUsername().indexOf(username) >= 0)
        return o;
    });

    return temp != null;
  }

  userHasUpdate(): any {

    if (!this.user)
      return null;

    let cnpj: string = this.formAssociacao.get('cpf').value;
    cnpj = cnpj.replace(/[^0-9]/gi, '');

    let cnpjOld: string = this.user.getUsername();

    let change: any = { hasUpdate: false, objectId: this.user.id };
    let password: string = this.formAssociacao.get('senha').value;

    if (!(cnpjOld.indexOf(cnpj) > -1)) {
      change['username'] = cnpj
      change['hasUpdate'] = true;
    }

    if (password && password.length > 0) {
      change['password'] = password
      change['hasUpdate'] = true;
    }
    let emailOld = this.associacao.getEmail();
    let email = this.formAssociacao.get('email').value;

    if (email !== emailOld) {
      change['email'] = email;
      change['hasUpdate'] = true;
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
      acordoCooperacaoAbelha: [false],
      confirmar_senha: ['', ValidaCustom.validateCustomSenhaConf(type)],
      senha: ['', ValidaCustom.validateCustomSenha(type)],
      cpf: [null, ValidaCustom.validateCustomCpfOrCnpj()],
      tipo: ['ASSOCIACAO'],
      // quantidadePontos: [null, ValidaCustom.validateCustomqtdPonto()],
      // qtdCaixasFixas: [null, ValidaCustom.validateCustomqtdCaixasFixas()]
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

  select(dateSelected) {
    this.dataTermoCompromisso = dateSelected;
  }
}
