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
          this.normalizeData(result[3][0]);
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
        contatoPresidente: [null, ValidatorCustom.validateCustomContatoPresidente()],
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
    console.log(this.formError);
  }

  private normalizeData(user: UserWeb) {


    if (user.attributes.tipo == 'APICULTOR') {

      let apicultor: Apicultor = user.attributes.apicultor;
      console.log(Object.keys(apicultor.attributes));
      Object.keys(apicultor.attributes).forEach(name => {
        if (this.formUser.contains(name))
          this.formUser.get(name).setValue(apicultor.attributes[name]);
      });

      let associacao: Associacao = apicultor.attributes.associacao;
      this.formUser.get('associacao').setValue(this.listAssociacao.filter(value => { if (value.id == associacao.id) return value.id; })[0]);

      let municipio = associacao.getMunicipio();
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
    }

    this.formUser.get('tipo').setValue(user.attributes.tipo);

    // atributos da user comum a todos
    Object.keys(user.attributes).filter((value) => { value != 'username' }).forEach(name => {
      if (this.formUser.contains(name))
        this.formUser.get(name).setValue(user.attributes[name]);
    });

    if (user.attributes.tipo == 'GESTOR') {
      this.formUser.get('nome').setValue(user.getUsername());
    }

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
    let associacao = new Associacao();

    associacao.setNome(user['nome']);
    associacao.setSigla(user['sigla']);
    associacao.setBairro(user['bairro']);
    associacao.setEndereco(user['endereco']);
    associacao.setTelefone(user['telefone']);
    associacao.setContatoPresidente(user['contatoPresidente']);
    associacao.setMunicipio(user['municipio']);
    associacao.setEmail(user['email']);

    if (!this.userCurrent) {

      this.parseService.save(associacao).then(result => {

        console.log('associacao salva')
        console.log(result);
        let userNew = new UserWeb();
        userNew.setPassword(user['senha']);
        userNew.setUsername(user['cpf']);
        userNew.set('associacao', result);
        if (!result)
          return false
        this.parseService.signUp(userNew).then(result => {
          this.dialog.confirm('Sucesso', 'Associação atualizada com sucesso!', 'SUCCESS', null).subscribe(resul => {
            this.routeN.navigate(['']);
          });
        });
      });
    } else {
      associacao.id = this.userCurrent.attributes.associacao.id;
      this.parseService.save(associacao).then(result => {
        this.dialog.confirm('Sucesso', 'Associação atualizada com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['']);
        });
      });
    }
  }

  private salvarApicultor() {

    let user = this.formUser.value;
    let apicultor = new Apicultor();

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
        console.log('criado un apicultor')
        console.log(result);
        let newUser = new UserWeb();
        newUser.setUsername(user['cpf']);
        newUser.setPassword(user['senha']);
        newUser.set('apicultor', result)

        if (!result)
          return false;

        this.parseService.signUp(newUser).then(result => {

          if (result) {
            this.dialog.confirm('Sucesso', 'Apicultor criado com sucesso!', 'SUCCESS', null).subscribe(resul => {
              this.routeN.navigate(['']);
            });
          }
        });
      });
    } else {
      this.parseService.save(apicultor).then(result => {
        this.dialog.confirm('Sucesso', 'Apicultor atualizado com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['']);
        });
      });
    }
  }

  private salvarGestor() {
    let user = this.formUser.value;
    let userWeb = new UserWeb();
    userWeb.setPassword(user['senha']);
    userWeb.setUsername(user['nome']);
    userWeb.set('tipo', user['tipo']);
    userWeb.set('email', user['email']);

    if (!this.userCurrent) {
      this.parseService.signUp(userWeb).then(resul => {
        this.dialog.confirm('Sucesso', 'Gestor criado com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['']);
        });
      });
    } else {
      this.parseService.save(userWeb).then(result => {
        this.dialog.confirm('Sucesso', 'Gestor atualizada com sucesso!', 'SUCCESS', null).subscribe(resul => {
          this.routeN.navigate(['']);
        });
      });
    }
  }

  loginTeste() {
    let user = new UserWeb();
    user.setPassword('thiago');
    user.setUsername('thiago');
    this.parseService.login(user);
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
    contatoPresidente: null,
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


