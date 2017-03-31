import { UserWeb } from './../models/user-web';
import { Associacao } from './../models/associacao';
import { Estado } from './../models/estado';
import { Municipio } from './../models/municipio';
import { Injectable, EventEmitter, Output, NgZone, } from '@angular/core';
import { Router } from '@angular/router';
import { Http, RequestOptionsArgs, ResponseContentType, Response } from '@angular/http';
import { Observable, } from 'rxjs/Rx'
import { TdLoadingService } from '@covalent/core';
import * as parse from 'parse';
import { environment } from '../../environments/environment';
import { Apiario } from '../models/apiario';
import { Apicultor } from '../models/apicultor';
import { EspecieAbelha } from '../models/especie-abelha';
import { Cultura } from '../models/cultura';
import { Propriedade } from '../models/propriedade';
import { Mortandade } from '../models/mortandade';
import { DialogService } from './dialog.service';
import Message from '../message-map';


@Injectable()
export class ParseService {
  core = parse;
  @Output() usuarioLogadoEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() loaderEvent: EventEmitter<Boolean> = new EventEmitter();
  usuarioLogado: UserWeb;
  private instance: ParseService = undefined;

  constructor(private loadingService: TdLoadingService, private zone: NgZone, private http: Http, private dialogService: DialogService, private route: Router) {
    //Define o banco a ser acessado
    let env = environment.getEnvironment();
    this.core.initialize(env.appid);
    this.core.serverURL = env.url;
    this.core.masterKey = env.masterKey;


    // Mapeia as classes que serão utilizadas no parse
    this.core.Object.registerSubclass('Apiario', Apiario);
    this.core.Object.registerSubclass('Apicultor', Apicultor);
    this.core.Object.registerSubclass('EspecieAbelha', EspecieAbelha);
    this.core.Object.registerSubclass('Cultura', Cultura);
    this.core.Object.registerSubclass('Propriedade', Propriedade);
    this.core.Object.registerSubclass('Mortandade', Mortandade);
    this.core.Object.registerSubclass('User', UserWeb);
    this.core.Object.registerSubclass('Municipio', Municipio);
    this.core.Object.registerSubclass('Estado', Estado);
    this.core.Object.registerSubclass('Associacao', Associacao);
  }

  /**
   * Busca todos os objetos na base de acordo com a classe passada 
   * @param Classe extende Parse.Object 
   */
  findAll<T extends parse.Object>(paramClass: { new (): T }): parse.Promise<T[]> {
    let query = new this.core.Query(new paramClass());
    query.limit(1000);
    let i = this;
    i.toogleLoading(true);

    return query.find().done(result => {

      i.toogleLoading(false);
      return result;

    }).fail(erro => {
      i.showErrorPopUp(erro);
      i.toogleLoading(false);
    });
  }

  /**
   * Recupera um objeto de acordo com o id e classe
   * @param Classe extende Parse.Object 
   */
  get<T extends parse.Object>(id: string, paramClass: { new (): T }): parse.Promise<any> {
    this.instance.toogleLoading(true);
    let query = new this.core.Query(new paramClass());

    return query.get(id).done((result) => {
      this.instance.toogleLoading(false);
      return result;
    }).fail((erro) => {
      this.instance.toogleLoading(false);
      this.instance.showErrorPopUp(erro);
    });
  }

  /**
   * Cria a query para reaizar consultas customizadas
   * @param Classe do objeto
   * @returns Parse.Query
   */
  createQuery<T extends parse.Object>(paramClass: { new (): T }): parse.Query {
    return new this.core.Query(new paramClass());
  }

  /**
   * Cria a query para reaizar consultas customizadas
   * @param Classe do objeto
   * @returns Parse.Query
   */
  or<T extends parse.Object>(...paran: parse.Query[]): parse.Query {
    return this.core.Query.or(paran[0], paran[1]);
  }
  /**
   * Cria a query para reaizar consultas customizadas
   * @param Classe do Objeto
   */
  executeQuery(query: parse.Query) {
    let i = this;
    i.toogleLoading(true);
    return query.find().done((result) => {
      i.toogleLoading(false);
      return result;
    }).fail(erro => {
      i.toogleLoading(false);
      i.showErrorPopUp(erro);
    });
  }

  /**
   * Realiza o login na aplicação
   * @param Usuario que extende Parse.User
   * @returns Promise<>
   */
  login(user: Parse.User) {
    let instance = this;
    instance.toogleLoading(true);
    this.zone.runOutsideAngular(() => {
      user.logIn().then(
        (res: UserWeb) => {
          this.zone.run(() => {
            this.usuarioLogado = res;
            this.usuarioLogadoEvent.emit(true);
            this.route.navigate(['/lista/apiarios']);
            instance.toogleLoading(false)
          });
        },
        (erro) => {
          this.zone.run(() => {
            instance.toogleLoading(false);
            this.showErrorPopUp(erro);
          })
        });
    });

  }
  /**
      * Cadastra um novo usuario
      * @param Objeto extend Parse.User
      * @returns void
      */
  signUp<T extends parse.User>(user: T): parse.Promise<T> {
    let instance = this;
    instance.toogleLoading(true);
    return user.signUp<T>(null, {
      success: function (success) {
        instance.toogleLoading(false);
      },
      error: function (error) {
        instance.toogleLoading(false);
      }
    }).fail(result => {
      instance.showErrorPopUp(result);
    });
  }

  /**
     * Salva o objeto no banco
     * @param Objeto extend Parse.Object
     * @returns Promise<any>
     */
  save<T extends parse.Object>(object: T): parse.Promise<T> {
    let instance = this;
    instance.toogleLoading(true);

    return object.save(null, {
      success: function (s) {
        instance.toogleLoading(false);
        return s;
      },
      error: function (e) {
        instance.toogleLoading(false);
      }
    }).fail(resul => {
      instance.showErrorPopUp(resul);
    });
  }

  /**
   * Deleta um objeto
   * @param Objeto
   * @returns Promise<>
   */
  destroy(object: Parse.Object) {
    let instance = this;
    instance.toogleLoading(true);
    return object.destroy().fail((erro) => {
      instance.toogleLoading(false);
      instance.showErrorPopUp(erro);
    });
  }

  getUsuarioLogado(): UserWeb {
    return this.usuarioLogado;
  }

  public toogleLoading(param) {
    this.zone.run(() => {
      this.loaderEvent.emit(param);
    });
  }

  private showErrorPopUp(erro: parse.Error) {
    let s: string = '';
    
    if (Message.has(erro.code))
      s = Message.get(erro.code)
    else
      s = erro.message;

    let message = '<p>Não foi possivel processar solicitação!</p>' + '<p> descrição : ' + s + '</p><p>Code: <strong>' + erro.code + '</strong></p>'
    this.dialogService.confirm('Erro', message, 'ERRO', null);
    console.log(erro);
  }

  forceCloseLoading() {
    this.zone.run(() => {
      this.instance.toogleLoading(false);
    });
  }
}
