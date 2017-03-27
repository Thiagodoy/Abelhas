import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { Apicultor } from './../models/apicultor';
import { ParseService } from './../service/parse.service';
import * as parse from 'parse';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserWeb } from './../models/user-web';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import ValidatorCustom from './validator/validator-custom';
import constantes from '../constantes';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {


  perfis: any[] = [{ nome: 'Apicultor', value: 'APICULTOR' }, { nome: 'Associação', value: 'ASSOCIACAO' }, { nome: 'Gestor', value: 'GESTOR' }];
  listEstados: Estado[];
  listMunicipios: Municipio[];
  listAssociacao: Associacao[];
  selectedValue: string = undefined;
  subscription: Subscription;
  subscriptionRouter: Subscription;
  subscriptionForm: Subscription;
  user: any = {};
  formUser: FormGroup;
  submit: boolean = false;
  userCurrent: UserWeb;
  typeAction: string = undefined;
  tele: any;

  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];



  constructor(private route: ActivatedRoute, private routeN: Router, private builder: FormBuilder, private parseService: ParseService, private zone: NgZone, private dialog: DialogService) { }

  ngOnInit() {

    this.subscriptionRouter = this.route.queryParams.subscribe(value => {


      let userId = value['user'];
      let type = value['type'];
      let query = undefined;
      let promiseUser = undefined;
      let promises = [];
      let t = (!userId && !type) ? constantes.CREATE : constantes.CHANGE;
      this.typeAction = t;
      this.createForm(t);

      let promiseAssociacao = this.parseService.findAll(Associacao);
      let promisseEstado = this.parseService.findAll(Estado);
      let promiseMunicipio = this.parseService.findAll(Municipio);
      promises.push(promiseAssociacao);
      promises.push(promisseEstado);
      promises.push(promiseMunicipio);


      if (userId) {
        query = this.parseService.createQuery(UserWeb);
        query.select(['associacao', 'apicultor', 'nomeGestor', 'tipo', 'username', 'email'])
        query.equalTo('objectId', userId);
        query.include('associacao');
        query.include('apicultor');

        promiseUser = this.parseService.executeQuery(query);
        promises.push(promiseUser);
      }

      parse.Promise.when(promises).then((result: any[]) => {
        this.listAssociacao = result[0];
        this.listEstados = result[1];
        this.listMunicipios = result[2];
        if (result.length > 3) {
          this.userCurrent = result[3][0];
          this.mountForm(result[3][0]);
        }
      });

    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionRouter.unsubscribe();
    this.subscriptionForm.unsubscribe();
  }

  createForm(paran: string) {

    this.formUser = this.builder.group(

      {
        nome: [null, ValidatorCustom.validateCustomNome()],
        tipo: [this.selectedValue, Validators.required],
        associacao: [null, ValidatorCustom.validateCustomAssociacao()],
        qtdCaixasFixas: [null, ValidatorCustom.validateCustomqtdCaixasFixas()],
        endereco: [null, ValidatorCustom.validateCustomEndereco()],
        sigla: [null, ValidatorCustom.validateCustomSigla()],
        bairro: [null],
        celular: [null],
        celular2: [null],
        telefone: [null, ValidatorCustom.validateCustomTelefone()],
        contatoPresidenteTelefone: [null, ValidatorCustom.validateCustomContatoPresidente()],
        quantidadePontos: [null, ValidatorCustom.validateCustomqtdPonto()],
        estado: [null],
        municipio: [null],
        cpf: [null, ValidatorCustom.validateCustomCpfOrCnpj()],
        email: [null],
        senha: [null, ValidatorCustom.validateCustomSenha(paran)],
        confirmar_senha: [null, ValidatorCustom.validateCustomSenhaConf(paran)],
        registroSif: [null],
        qtdCaixasMigratorias: [null, ValidatorCustom.validateCustomqtdCaixasMigratorias()]
      }
    );

    // Detecta mudancas no Formulario
    this.subscriptionForm = this.formUser.valueChanges.subscribe(values => {
      this.changeForm(values);
    });
    // Detecta mudanca na alteração do perfil
    this.subscription = this.formUser.get('tipo').valueChanges.subscribe(value => {
      this.selectedValue = value;
    });

  }

  private changeForm(data: any) {

    this.submit = this.formUser.valid;
    if (!this.formUser) { return; }
    const form = this.formUser;
    for (const field in this.formError) {
      this.formError[field] = null;
      const control = form.get(field);
      if (control && !control.valid) {
        this.formError[field] = control.errors;
      }
    }
  }

  private mountForm(user: UserWeb) {


    if (user.attributes.tipo == 'APICULTOR') {

      let apicultor: Apicultor = user.attributes.apicultor;
      console.log(Object.keys(apicultor.attributes));
      Object.keys(apicultor.attributes).forEach(name => {
        if (this.formUser.contains(name))
          this.formUser.get(name).setValue(apicultor.attributes[name]);
      });

      let associacao: Associacao = apicultor.attributes.associacao;
      this.formUser.get('associacao').setValue(this.listAssociacao.filter(value => { if (value.id == associacao.id) return value.id; })[0]);

      let municipio = apicultor.getMunicipio();
      this.formUser.get('municipio').setValue(this.listMunicipios.filter(value => { return value.id == municipio.id })[0]);

      let estado = municipio.getEstado();
      this.formUser.get('estado').setValue(this.listEstados.filter(value => { return value.id == estado.id })[0]);

    } else if (user.attributes.tipo == 'ASSOCIACAO') {
      let associacao: Associacao = user.attributes.associacao;
      console.log(Object.keys(associacao.attributes));
      Object.keys(associacao.attributes).forEach(name => {
        if (this.formUser.contains(name))
          this.formUser.get(name).setValue(associacao.attributes[name]);
      });

      let municipio = associacao.getMunicipio();
      this.formUser.get('municipio').setValue(this.listMunicipios.filter(value => { return value.id == municipio.id })[0]);
    }   

    // atributos da user comum a todos    
    Object.keys(user.attributes).forEach(name => {          
      if (this.formUser.contains(name))
        this.formUser.get(name).setValue(user.attributes[name]);
    });

    if (user.attributes.tipo == 'GESTOR')
      this.formUser.get('nome').setValue(user.attributes.nomeGestor);          

    this.formUser.get('cpf').setValue(user.getUsername());
  }

  salvar() {

    if (this.formUser.valid) {
      switch (this.selectedValue) {
        case constantes.APICULTOR:
          this.salvarApicultor()
          break;
        case constantes.ASSOCIACAO:
          this.salvarAssociacao();
          break;
        case constantes.GESTOR:
          this.salvarGestor();
          break;
      }
    } else {
      this.dialog.confirm('Erro', 'Campos obrigatórios não foram preenchidos!', 'ERRO', null);
    }
  }

  private salvarAssociacao() {

    let user = this.formUser.value;
    let associacao = this.userCurrent ? this.userCurrent.attributes.associacao : new Associacao();
    associacao.setNome(user['nome'])
    associacao.setSigla(user['sigla']);
    associacao.setBairro(user['bairro']);
    associacao.setEndereco(user['endereco']);
    associacao.setTelefone(user['telefone']);
    associacao.setContatoPresidente(user['contatoPresidenteTelefone']);
    associacao.setMunicipio(user['municipio']);
    associacao.setEmail(user['email']);


    if (!this.userCurrent) {

      this.parseService.save(associacao).then(result => {

        if (!result) return false;

        let userNew = this.createUser();
        userNew.set('associacao', result);

        this.parseService.signUp(userNew).then(result => {
          this.dialog.confirm('Sucesso', 'Associação Criada com sucesso!', 'SUCCESS', null).subscribe(resul => {
            this.routeN.navigate(['/lista/usuarios']);
          });
        });
      });

    } else {

      let promises = [];
      promises.push(this.parseService.save(associacao));

      if (this.hasUpdateUser())
        promises.push(this.parseService.save(this.userCurrent));

      parse.Promise.when(promises).then(result => {
        if (result)
          this.dialog.confirm('Sucesso', 'Associação atualizada com sucesso!', 'SUCCESS', null).subscribe(resul => {
            this.routeN.navigate(['/lista/usuarios']);
          });
      });
    }
  }

  private salvarApicultor() {

    let user = this.formUser.value;
    let apicultor = this.userCurrent ? this.userCurrent.attributes.apicultor : new Apicultor();

    apicultor.setNome(user['nome']);
    apicultor.setAssociacao(user['associacao']);
    apicultor.setCelular(user['celular']);
    apicultor.setCelular2(user['celular2']);
    apicultor.setCpf(user['cpf']);
    apicultor.setEmail(user['email']);
    apicultor.setEndereco(user['endereco']);
    apicultor.setMunicipio(user['municipio']);
    apicultor.setQtdCaixasFixas(parseInt(user['qtdCaixasFixas']));
    apicultor.setQtdCaixasMigratorias(parseInt(user['qtdCaixasMigratorias']));
    apicultor.setQtdPontos(parseInt(user['quantidadePontos']));
    apicultor.setRegistroSif(user['registroSif']);
    apicultor.setTelefone(user['telefone']);

    if (!this.userCurrent) {

      this.parseService.save(apicultor).then(result => {

        if (!result) return false;

        let newUser = this.createUser();
        newUser.set('apicultor', result);

        this.parseService.signUp(newUser).then(result => {

          if (result) {
            this.dialog.confirm('Sucesso', 'Apicultor criado com sucesso!', 'SUCCESS', null).subscribe(resul => {
              this.routeN.navigate(['/lista/usuarios']);
            });
          }
        });
      });
    } else {

      let promises = [];
      promises.push(this.parseService.save(apicultor));

      if (this.hasUpdateUser())
        promises.push(this.parseService.save(this.userCurrent));

      parse.Promise.when(promises).then(result => {
        if (result)
          this.dialog.confirm('Sucesso', 'Apicultor atualizado com sucesso!', 'SUCCESS', null).subscribe(resul => {
            this.routeN.navigate(['/lista/usuarios']);
          });
      });
    }
  }

  private salvarGestor() {
    let user = this.formUser.value;
    let userWeb = this.userCurrent || new UserWeb();
    userWeb.setPassword(user['senha']);
    userWeb.setUsername(user['cpf']);
    userWeb.set('nomeGestor', user['nome']);
    userWeb.set('tipo', user['tipo']);
    userWeb.set('email', user['email']);

    if (!this.userCurrent) {
      this.parseService.signUp(userWeb).then(resul => {
        this.dialog.confirm('Sucesso', 'Gestor criado com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['/lista/usuarios']);
        });
      });
    } else {
      this.hasUpdateUser();
      this.parseService.save(userWeb).then(result => {
        this.dialog.confirm('Sucesso', 'Gestor atualizada com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['/lista/usuarios']);
        });
      });
    }
  }

  createUser(): UserWeb {
    let user = this.formUser.value;
    let newUser = new UserWeb();
    newUser.setUsername(user['cpf']);
    newUser.setPassword(user['senha']);
    newUser.set('tipo', user['tipo']);
    return newUser;
  }

  hasUpdateUser(): boolean {
    let user = this.formUser.value;
    let ret: boolean = false;
    if (user['cpf'] != this.userCurrent.getUsername()) {
      this.userCurrent.setUsername(user['cpf']);
      ret = true;
    }

    let senha: string = user['senha'];
    if (senha && senha.length > 0) {
      this.userCurrent.setPassword(senha);
      ret = true;
    }
    return ret;

  }



  formError: any = {
    nome: null,
    tipo: null,
    associacao: null,
    qtdCaixasFixas: null,
    endereco: null,
    sigla: null,
    bairro: null,
    celular: null, //ok
    celular2: null,//ok
    telefone: null, //ok
    contatoPresidenteTelefone: null,
    quantidadePontos: null,
    estado: null,
    municipio: null,
    cpf: null, //ok
    email: null, //ok 
    senha: null,
    confirmar_senha: null, //USER //implementar validacao customuzada
    registroSif: null,//ok
    qtdCaixasMigratorias: null//ok
  }
}


