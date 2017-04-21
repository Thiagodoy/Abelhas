import { ITdDataTableColumn } from '@covalent/core';
import { DialogService } from './../service/dialog.service';
import { Associacao } from './../models/associacao';
import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { Apicultor } from './../models/apicultor';
import { ParseService } from './../service/parse.service';
import * as parse from 'parse';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserWeb } from './../models/user-web';
import { Subscription, Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, NgZone, ViewContainerRef } from '@angular/core';
import ValidatorCustom from './validator/validator-custom';
import constantes from '../constantes';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {


  perfis: any[] = [{ nome: 'Apicultor', value: 'APICULTOR' }, { nome: 'Associação', value: 'ASSOCIACAO' }, { nome: 'Gestor', value: 'GESTOR' }];
  listEstados: Estado[] = [];
  listMunicipios: Municipio[] = [];
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
  listEstadosFiltered: Observable<Estado[]>;
  listMunicipioFiltered: Observable<Municipio[]>;
  perfilUsuarioLogado: string;
  listAssociacoesSelecteds: any[] = [];
  dataTermoCompromisso: Date = undefined;


  maskTelefone = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /\d/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  cpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,];



  constructor(private route: ActivatedRoute, private routeN: Router, private builder: FormBuilder, private parseService: ParseService, private zone: NgZone, private dialog: DialogService, private view: ViewContainerRef) { }

  ngOnInit() {

    this.perfilUsuarioLogado = parse.User.current().attributes.tipo;
    this.subscriptionRouter = this.route.queryParams.subscribe(value => {


      let userId = value['user'];
      let type = value['type'];
      let email = value['email'];
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

          if (email)
            this.userCurrent.setEmail(email, {});

          this.mountForm(this.userCurrent);
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionRouter.unsubscribe();
    this.subscriptionForm.unsubscribe();
  }

  select(dateSelected) {
    this.dataTermoCompromisso = dateSelected;
  }

  search(event: Event) {

    event.preventDefault();
    this.formUser.get('controlItensSelecionados').setValue('Nenhum item selecionado.');

    let columns: ITdDataTableColumn[] = [
      { name: 'nome', label: 'Nome' },
      { name: 'sigla', label: 'Sigla' },
      { name: 'email', label: 'Email' },
      { name: 'telefone', label: 'Telefone' },
    ];

    let asso = this.listAssociacao.map(value => {
      return {
        id: value.id,
        nome: value.getNome(),
        sigla: value.getSigla(),
        email: value.getEmail(),
        telefone: value.getTelefone()
      }
    });

    let apicultor: Apicultor = undefined;
    let assoApicultor = this.listAssociacoesSelecteds;

    if (this.userCurrent) {
      apicultor = this.userCurrent.attributes.apicultor;
      if (apicultor.getAssociacoes())
        assoApicultor = apicultor.getAssociacoes().map(value => {
          return {
            uniqueId: value.id,
            id: value.id,
            nome: value.getNome(),
            sigla: value.getSigla(),
            email: value.getEmail(),
            telefone: value.getTelefone()
          }
        });
    }

    //Ordena para exibir asa associacoes selecionadas nas primeiras posicoes
    asso = asso.sort((a, b) => {return assoApicultor.find(value => { return value.id == a.id }) ? -1 : 1;});

    this.dialog.confirm('Escolha as associações', '', 'TABLE', this.view, asso, columns, assoApicultor, true).subscribe((value) => {

      if (value.length > 0) {
        this.listAssociacoesSelecteds = value;
        this.formUser.get('controlItensSelecionados').setValue('' + value.length + ' itens selecionados');
      } else {
        this.listAssociacoesSelecteds = [];
      }
    });
  }

  createForm(paran: string) {

    this.formUser = this.builder.group(

      {
        nome: [null, ValidatorCustom.validateCustomNome()],
        tipo: [this.selectedValue, Validators.required],
        controlItensSelecionados: [{ value: 'Nenhum item selecionado', disabled: true }],
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
        registroSif: [false],
        qtdCaixasMigratorias: [null, ValidatorCustom.validateCustomqtdCaixasMigratorias()],
        compartilhaDado: [false],
        termoParticipacaoProjeto: [false],
        acordoCooperacaoAbelha: [false]
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

    this.listEstadosFiltered = this.formUser.get('estado').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map(nome => nome ? this.filterEstado(nome) : this.listEstados.slice());

    this.listMunicipioFiltered = this.formUser.get('municipio').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map(nome => nome ? this.filterMunicipio(nome) : this.listMunicipios.slice());
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

      let registroSif = apicultor.getRegistroSif();
      if (registroSif == undefined || registroSif == null)
        this.formUser.get('registroSif').setValue(false);

      let compartilhaDado = apicultor.isCompartilhaDado();
      if (compartilhaDado == undefined || compartilhaDado == null)
        this.formUser.get('compartilhaDado').setValue(false);

      let termoParticipacaoProjeto = apicultor.isTermoParticipacaoProjeto();
      if (termoParticipacaoProjeto == undefined || termoParticipacaoProjeto == null)
        this.formUser.get('termoParticipacaoProjeto').setValue(false);

      if (user.attributes.apicultor.attributes.associacoes) {

        this.listAssociacoesSelecteds = user.attributes.apicultor.attributes.associacoes
          .filter((value) => {
            return value != null
          })
          .map((value: Associacao) => {
            return {
              uniqueId: value.id,
              id: value.id,
              nome: value.getNome(),
              sigla: value.getSigla(),
              email: value.getEmail(),
              telefone: value.getTelefone()
            }
          });

        this.formUser.get('controlItensSelecionados').setValue('' + this.listAssociacoesSelecteds.length + ' itens selecionados.')
      } else {
        this.listAssociacoesSelecteds = [];
        this.formUser.get('controlItensSelecionados').setValue('Nenhum item selecionada.')
      }
      //let associacao: Associacao = apicultor.attributes.associacao;
      //this.formUser.get('associacao').setValue(this.listAssociacao.filter(value => { if (value.id == associacao.id) return value.id; })[0]);

      let municipio = apicultor.getMunicipio();
      this.formUser.get('municipio').setValue(this.listMunicipios.filter(value => { return value.id == municipio.id })[0]);

      let estado = municipio.getEstado();
      this.formUser.get('estado').setValue(this.listEstados.filter(value => { return value.id == estado.id })[0]);

      if (apicultor.getDataTermoCompromisso())
        this.dataTermoCompromisso = apicultor.getDataTermoCompromisso()

    } else if (user.attributes.tipo == 'ASSOCIACAO') {
      let associacao: Associacao = user.attributes.associacao;
      Object.keys(associacao.attributes).forEach(name => {
        if (this.formUser.contains(name))
          this.formUser.get(name).setValue(associacao.attributes[name]);
      });

      let municipio = associacao.getMunicipio();
      this.formUser.get('municipio').setValue(this.listMunicipios.filter(value => { return value.id == municipio.id })[0]);
      this.formUser.get('acordoCooperacaoAbelha').setValue(associacao.getAcordoCooperacaoAbelha());

      if (associacao.getDataTermoCompromisso())
        this.dataTermoCompromisso = associacao.getDataTermoCompromisso()

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
      this.dialog.confirm('Erro', 'Campos obrigatórios não foram preenchidos!', 'ERRO', this.view);
    }
  }

  private salvarAssociacao() {

    let user = this.formUser.value;
    let associacao: Associacao = this.userCurrent ? this.userCurrent.attributes.associacao : new Associacao();
    associacao.setNome(user['nome'])
    associacao.setSigla(user['sigla']);
    associacao.setBairro(user['bairro']);
    associacao.setEndereco(user['endereco']);
    associacao.setTelefone(user['telefone']);
    associacao.setContatoPresidenteTelefone(user['contatoPresidenteTelefone']);
    associacao.setMunicipio(user['municipio']);
    associacao.setEmail(user['email']);
    associacao.setAcordoCooperacaoAbelha(user['acordoCooperacaoAbelha']);
    associacao.setDataTermoCompromisso(this.dataTermoCompromisso);
    associacao.setQtdCaixas(parseInt(user['qtdCaixasFixas']));    
    associacao.setQtdPontos(parseInt(user['quantidadePontos']));

    if (!this.userCurrent) {

      this.parseService.save(associacao).then(result => {

        if (!result) return false;

        let userNew = this.createUser();
        userNew.set('associacao', result);

        let session = parse.User.current().getSessionToken();
        this.parseService.signUp(userNew).then(result => {
          this.dialog.confirm('Sucesso', 'Associação Criada com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
            this.routeN.navigate(['home/lista/usuarios']);
          });
          this.parseService.become(session);
        });
      });

    } else {

      let promises = [];
      promises.push(this.parseService.save(associacao));
      let result = this.hasUpdateUser();
      if (result.hasUpdate) {
        delete result.hasUpdate;
        promises.push(this.parseService.runCloud('updateUserPass', result));
      }
      parse.Promise.when(promises).then(result => {
        if (result)
          this.dialog.confirm('Sucesso', 'Associação atualizada com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
            this.routeN.navigate(['home/lista/usuarios']);
          });
      });
    }
  }

  private salvarApicultor() {

    let user = this.formUser.value;
    let apicultor: Apicultor = this.userCurrent ? this.userCurrent.attributes.apicultor : new Apicultor();

    if (this.listAssociacoesSelecteds.length == 0) {
      this.dialog.confirm('Erro', 'Nenhuma associacao foi selecionada!', 'ERRO', this.view)
      return false;
    }

    let temp = [];
    for (let a of this.listAssociacoesSelecteds) {
      let value = this.listAssociacao.find((value) => { return value.id == a.id })
      if (value)
        temp.push(value)
    }

    apicultor.setNome(user['nome']);
    apicultor.setAssociacoes(temp);
    apicultor.setCelular(user['celular']);
    apicultor.setCelular2(user['celular2']);
    apicultor.setCpf(user['cpf']);
    apicultor.setEmail(user['email']);
    apicultor.setEndereco(user['endereco']);
    apicultor.setMunicipio(user['municipio']);
    //apicultor.setQtdCaixasFixas(parseInt(user['qtdCaixasFixas']));
    apicultor.setQtdCaixasMigratorias(parseInt(user['qtdCaixasMigratorias']));
    //apicultor.setQtdPontos(parseInt(user['quantidadePontos']));
    apicultor.setRegistroSif(user['registroSif']);
    apicultor.setTelefone(user['telefone']);
    apicultor.setDataTermoCompromisso(this.dataTermoCompromisso);

    apicultor.setTermoParticipacaoProjeto(this.perfilUsuarioLogado == constantes.ASSOCIACAO ? false : user['termoParticipacaoProjeto']);
    apicultor.setCompartilhaDado(user['compartilhaDado'])


    if (!this.userCurrent) {

      this.parseService.save(apicultor).then(result => {

        if (!result) return false;

        let newUser = this.createUser();
        newUser.set('apicultor', result);
        let session = parse.User.current().getSessionToken();
        this.parseService.signUp(newUser).then(result => {

          if (result) {
            this.dialog.confirm('Sucesso', 'Apicultor criado com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
              this.routeN.navigate(['home/lista/usuarios']);
            });
            this.parseService.become(session);
          }
        });
      });
    } else {

      let promises = [];
      promises.push(this.parseService.save(apicultor));
      let result = this.hasUpdateUser();
      if (result.hasUpdate) {
        delete result.hasUpdate;
        promises.push(this.parseService.runCloud('updateUserPass', result));
      }
      parse.Promise.when(promises).then(result => {
        if (result)
          this.dialog.confirm('Sucesso', 'Apicultor atualizado com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
            this.routeN.navigate(['home/lista/usuarios']);
          });
      });
    }
  }

  private salvarGestor() {

    if (!this.userCurrent) {
      let user = this.formUser.value;
      let userWeb = new UserWeb();
      userWeb.setPassword(user['senha']);
      let cpf = user['cpf'].replace(/[^0-9]/gi, '');
      userWeb.setUsername(cpf);
      userWeb.set('nomeGestor', user['nome']);
      userWeb.set('tipo', user['tipo']);
      userWeb.set('email', user['email']);
      let session = parse.User.current().getSessionToken();
      this.parseService.signUp(userWeb).then(resul => {
        this.dialog.confirm('Sucesso', 'Gestor criado com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
          this.routeN.navigate(['home/lista/usuarios']);
        });
        this.parseService.become(session);
      });
    } else {

      let result = this.hasUpdateUser()
      if (result.hasUpdate) {
        delete result.hasUpdate;
        this.parseService.runCloud('updateUserPass', result).then(result => {
          if (result) {
            this.dialog.confirm('Sucesso', 'Gestor atualizado com sucesso!', 'SUCCESS', this.view).subscribe(resul => {
              this.routeN.navigate(['home/lista/usuarios']);
            });
          }
        });
      } else {
        this.dialog.confirm('Erro', 'Nenhum dado foi alterado!', 'ERRO', this.view);
      }
    }
  }

  createUser(): UserWeb {
    let user = this.formUser.value;
    let newUser = new UserWeb();
    let cpf: string = user['cpf'];
    cpf = cpf.replace(/[^0-9]/gi, '');
    newUser.setUsername(cpf);
    newUser.setPassword(user['senha']);
    newUser.set('tipo', user['tipo']);
    newUser.setEmail(user['email'], {});
    return newUser;
  }

  hasUpdateUser(): any {
    let user = this.formUser.value;
    let ret: any = { hasUpdate: false, objectId: this.userCurrent.id };
    let cpf: string = user['cpf'].replace(/[^0-9]/gi, '');
    if (!(cpf.indexOf(this.userCurrent.getUsername()) >= 0)) {
      this.userCurrent.setUsername(cpf);
      ret['username'] = cpf;
      ret['hasUpdate'] = true;
    }

    let senha: string = user['senha'];
    if (senha && senha.length > 0) {
      this.userCurrent.setPassword(senha);
      ret['password'] = senha;
      ret['hasUpdate'] = true;
    }

    let email: string = user['email'];
    let emailOld: string = this.userCurrent.getEmail();
    if (email != emailOld) {
      this.userCurrent.setEmail(email, {});
      ret['email'] = email;
      ret['hasUpdate'] = true;
    }
    return ret;

  }

  filterEstado(name: string): Estado[] {
    return this.listEstados.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterMunicipio(name: string): Municipio[] {
    return this.listMunicipios.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
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


