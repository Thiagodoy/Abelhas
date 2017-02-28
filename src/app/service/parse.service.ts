import { Injectable, EventEmitter, Output, NgZone } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import * as parse from 'parse';
import { environment } from '../../environments/environment';
import { Apiario } from '../models/apiario';
import { Apicultor } from '../models/apicultor';
import { EspecieAbelha } from '../models/especie-abelha';
import { Cultura } from '../models/cultura';

@Injectable()
export class ParseService {
  core = parse;
  //showToolbar: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Output() loaderEvent: EventEmitter<Boolean> = new EventEmitter();
  //usuarioLogado: Login;  

  constructor(private loadingService: TdLoadingService, private zone: NgZone) {
    let env = environment.getEnvironment();
    this.core.initialize(env.appid);
    this.core.serverURL = env.url;

    // Mapeia as classes que serão utilizadas no parse
    this.core.Object.registerSubclass('Apiario', Apiario);
    this.core.Object.registerSubclass('Apicultor', Apicultor);
    this.core.Object.registerSubclass('EspecieAbelha', EspecieAbelha);
    this.core.Object.registerSubclass('Cultura', Cultura);
  }

  /**
   * Busca todos os objetos na base de acordo com a classe passada 
   * @param Classe extende Parse.Object 
   */
  findAll<T extends parse.Object>(paramClass: { new (): T }): parse.Promise<T[]> {
    let query = new this.core.Query(new paramClass());
    return query.find();
  }
  
  /**
   * Recupera um objeto de acordo com o id e classe
   * @param Classe extende Parse.Object 
   */
  get<T extends parse.Object>(id: string, paramClass: { new (): T }): parse.Promise<any> {
    this.toogleLoading(true);
    let query = new this.core.Query(new paramClass());
    return query.get(id).done((result)=>{
      this.toogleLoading(false);
      return result;
    }).fail((error)=>{
      this.toogleLoading(false);
      return error;
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
      return erro;
    });
  }

  /**
   * Realiza o login na aplicação
   * @param Usuario que extende Parse.User
   * @returns Promise<>
   */
  login(user: Parse.User) {
    user.logIn().then(res => {    
      
    });
  }

  /**
   * Deleta um objeto
   * @param Objeto
   *  @returns Promise<>
   */
  destroy(object: Parse.Object) {
    return object.destroy();
  }

  private toogleLoading(param) {
    this.zone.run(() => {
      this.loaderEvent.emit(param);
    });

  }
}
