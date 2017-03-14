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
import { UserWeb } from '../models/user-web';
import { DialogService } from './dialog.service';

@Injectable()
export class ParseService {
  core = parse;
  @Output() usuarioLogadoEvent: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() loaderEvent: EventEmitter<Boolean> = new EventEmitter();
  usuarioLogado: UserWeb;

  constructor(private loadingService: TdLoadingService, private zone: NgZone, private http: Http, private dialogService: DialogService, private route: Router) {
    //Define o banco a ser acessado
    let env = environment.getEnvironment();
    this.core.initialize(env.appid);
    this.core.serverURL = env.url;

    // Mapeia as classes que serão utilizadas no parse
    this.core.Object.registerSubclass('Apiario', Apiario);
    this.core.Object.registerSubclass('Apicultor', Apicultor);
    this.core.Object.registerSubclass('EspecieAbelha', EspecieAbelha);
    this.core.Object.registerSubclass('Cultura', Cultura);
    this.core.Object.registerSubclass('Propriedade', Propriedade);
    this.core.Object.registerSubclass('Mortandade', Mortandade);
    this.core.Object.registerSubclass('User', UserWeb);
    this.core.Object.registerSubclass('Municipio', Municipio);
  }

  /**
   * Busca todos os objetos na base de acordo com a classe passada 
   * @param Classe extende Parse.Object 
   */
  findAll<T extends parse.Object>(paramClass: { new (): T }): parse.Promise<T[]> {   
    let query = new this.core.Query(new paramClass());
    query.limit(1000);
    return query.find().done(result => {      
      return result;
    }).fail(erro => {     
      this.showErrorPopUp(erro);
    });
  }

  /**
   * Recupera um objeto de acordo com o id e classe
   * @param Classe extende Parse.Object 
   */
  get<T extends parse.Object>(id: string, paramClass: { new (): T }): parse.Promise<any> {
    this.toogleLoading(true);
    let query = new this.core.Query(new paramClass());
    return query.get(id).done((result) => {
      this.toogleLoading(false);
      return result;
    }).fail((erro) => {
      this.toogleLoading(false);
      this.showErrorPopUp(erro);
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
    this.toogleLoading(true);
    return query.find().done((result) => {
      this.toogleLoading(false);
      return result;
    }).fail(erro => {
      this.toogleLoading(false);
      this.showErrorPopUp(erro);
    });
  }

  /**
   * Realiza o login na aplicação
   * @param Usuario que extende Parse.User
   * @returns Promise<>
   */
  login(user: Parse.User) {
    this.toogleLoading(true);
    user.logIn().then(
      (res: UserWeb) => {
        this.usuarioLogado = res;
        this.route.navigate(['']);
        this.toogleLoading(false);
        this.usuarioLogadoEvent.emit(true);
      },
      (erro) => {
        this.toogleLoading(false);
        this.showErrorPopUp(erro);
      });
  }

  /**
   * Deleta um objeto
   * @param Objeto
   * @returns Promise<>
   */
  destroy(object: Parse.Object) {
    this.toogleLoading(true);
    return object.destroy().fail((erro) => {
      this.toogleLoading(false);
      this.showErrorPopUp(erro);
    });
  }

  loadPhoto(url: string): Observable<Response> {
    return this.http.get('', { responseType: ResponseContentType.ArrayBuffer });

  }

  private toogleLoading(param) {
    this.zone.run(() => {
      this.loaderEvent.emit(param);
    });
  }

  private showErrorPopUp(erro: any) {
    let message = '<p>Não foi possivel processar solicitação!</p>' + '<p>' + erro.message + '</p>'
    this.dialogService.confirm('Erro', message, 'ERRO', null);
    console.log(erro);
  }

  forceCloseLoading() {
     this.zone.run(() => {
    this.toogleLoading(false);
     });
  }
}
