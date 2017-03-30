import { DialogService } from './../service/dialog.service';
import { UserWeb } from './../models/user-web';
import { Observable, Subscription } from 'rxjs/Rx';
import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ParseService } from './../service/parse.service';
import { Associacao } from './../models/associacao';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as parse from 'parse';
import ValidaCustom from '../edit-user/validator/validator-custom';

@Component({
  selector: 'app-edit-association',
  templateUrl: './edit-association.component.html',
  styleUrls: ['./edit-association.component.scss']
})
export class EditAssociationComponent implements OnInit, OnDestroy {


  associacao: Associacao;
  formAssociacao: FormGroup;
  listEstados: Estado[] = [];
  listMunicipio: Municipio[] = [];
  listEstadosFiltered: Observable<Estado[]>;
  listMunicipioFiltered: Observable<Municipio[]>;
  subscriptionForm: Subscription;
  formError: any = {};
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];;
  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cep = [ /\d/, /\d/,'.', /\d/, /\d/,/\d/, '-', /\d/, /\d/, /\d/];
  constructor(private routerA: ActivatedRoute, private parseService: ParseService, private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit() {
    this.createForm();

    this.routerA.queryParams.subscribe(res => {

      if (res.associacao) {
        let query = this.parseService.createQuery(Associacao);
        query.equalTo('objectId', res.associacao);


        this.parseService.executeQuery(query).then((response: Associacao[]) => {
          this.associacao = response[0];
          this.populateForm();
        });
      }

    });

    let promiseEstado = this.parseService.findAll(Estado);
    let promiseMunicipio = this.parseService.findAll(Municipio);

    parse.Promise.when([promiseEstado, promiseMunicipio]).then(response => {
      this.listEstados = response[0];
      this.listMunicipio = response[1];
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
    this.formAssociacao.get('municipio').setValue(this.listMunicipio.filter(municipio=>{return municipio.id == associacao.getMunicipio().id})[0]);
    this.formAssociacao.get('estado').setValue(this.listEstados.filter(estado=>{return estado.id == associacao.getMunicipio().getEstado().id})[0]);
    this.formAssociacao.get('cep').setValue(associacao.getCep());
    this.formAssociacao.get('registro').setValue(associacao.getRegistro());
    this.formAssociacao.get('numeroSif').setValue(associacao.getNumeroSif());
    this.formAssociacao.get('contatoPresidenteTelefone').setValue(associacao.getContatoPresidenteTelefone());
    this.formAssociacao.get('email').setValue(associacao.getEmail());

    // if (this.user)
    //   this.formAssociacao.get('cpf').reset({ value: this.user.getUsername(), disabled: true });
    // else
    //   this.formAssociacao.get('cpf').setValue(this.user.getUsername());


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

    return associacao;

  }

  salvar() {

    if (this.formAssociacao.valid) {
      let associacao = this.populateAssociacao();
      let user = undefined;
      let password: string = this.formAssociacao.get('cpf').value;

      if (!this.associacao) {
        password = password.replace(/[^0-9]/gi, '');
        user = new UserWeb();
        user.setPassword(password);
        user.setUsername(password);

        this.parseService.save(associacao).then(result => {
          if (!result)
            return false;

          user.set('associacao', associacao);
          this.parseService.signUp(user).then(result => {
            if (result)
              this.dialogService.confirm('Sucesso', 'Associacao criada com sucesso!', 'SUCCESS', null);
          });
        });
      } else {


        this.parseService.save(associacao).then(result => {
          if (result)
            this.dialogService.confirm('Sucesso', 'Associacao atualizada  com sucesso!', 'SUCCESS', null);
        });
      }
    }
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
  createForm() {
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
      cpf: [null, ValidaCustom.validateCustomCpfOrCnpj()],
      tipo: ['ASSOCIACAO']
    });

  }




}
