import { AtividadeApicula } from './../models/atividade-apicula';
import { MomentService } from './moment.service';
import { DadosDesativacaoApiario } from './../models/dados-desativacao-apiario';
import { MotivoDesativacaoApiario } from './../models/motivo-desativacao-apiario';
import { UserWeb } from './../models/user-web';
import { Associacao } from './../models/associacao';
import { Estado } from './../models/estado';
import { Municipio } from './../models/municipio';
import { Injectable, EventEmitter, Output, NgZone, } from '@angular/core';
import { Router } from '@angular/router';
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
  @Output() usuarioLogadoEvent: EventEmitter<any> = new EventEmitter<any>()
  @Output() loaderEvent: EventEmitter<Boolean> = new EventEmitter();
  usuarioLogado: UserWeb;
  private instance: ParseService = undefined;

  constructor(private momentService: MomentService, private zone: NgZone, private dialogService: DialogService, private route: Router) {
    //Define o banco a ser acessado
    let env = environment.getEnvironment();
    this.core.initialize(env.appid);
    this.core.serverURL = env.url;
    this.core.masterKey = env.masterKey || '';


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
    this.core.Object.registerSubclass('MotivoDesativacaoApiario', MotivoDesativacaoApiario);
    this.core.Object.registerSubclass('DadosDesativacaoApiario', DadosDesativacaoApiario);
    this.core.Object.registerSubclass('AtividadeApicula', AtividadeApicula);

  }

  /**
   * Busca todos os objetos na base de acordo com a classe passada 
   * @param Classe extende Parse.Object 
   */
  findAll<T extends parse.Object>(paramClass: { new (): T }, options?: any, include?: string[]): parse.Promise<T[]> {
    let query = new this.core.Query(new paramClass());
    query.limit(1000);
    let i = this;
    i.toogleLoading(true);

    if (include) {
      for (let j of include) {
        query.include(j);
      }
    }


    return query.find(options).done(result => {

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
  get<T extends parse.Object>(id: string, paramClass: { new (): T }, include?: string[]): parse.Promise<T> {

    this.toogleLoading(true);
    let i = this;
    let query = new this.core.Query(new paramClass());

    if (include) {
      for (let i of include) {
        query.include(i);
      }
    }

    return query.get(id).done((result) => {
      i.toogleLoading(false);
      return result;
    }).fail((erro) => {
      i.toogleLoading(false);
      i.showErrorPopUp(erro);
    });
  }

  sendNotification(id: string, msg: string) {
    let i = this;
    this.findAll(parse.Session, { useMasterKey: true }).then((result) => {

      if (result && result.length > 0) {
        for (let session of result) {
          let userId = session.attributes.user.id;
          if (id == userId) {
            let queryInstallation = this.createQuery(parse.Installation);
            queryInstallation.equalTo('installationId', session.attributes.installationId);

            let pushData: parse.Push.PushData = {};
            pushData.where = queryInstallation;
            pushData.data = {
              alert: msg,
              badge: 1,
              sound: 'default'
            }

            parse.Push.send(pushData, { useMasterKey: true }).fail(erro => {
              i.showErrorPopUp(erro);
            }).then(result => {
              console.log('Notification sent');
              console.log(result);
            });

          }
        }
      } else {
        this.showErrorPopUp(new parse.Error(parse.ErrorCode.OTHER_CAUSE, 'Não foi possivel enviar a notificação'));
      }
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

  logout() {
    this.toogleLoading(true);
    let i = this;
    parse.User.logOut().then(reult => {
      this.route.navigate(['']);
      this.usuarioLogadoEvent.emit({
        isLogado: false
      });
      i.toogleLoading(false);
      location.reload();
    })
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
            let nome = ''
            if (res.attributes.tipo == 'GESTOR') {
              nome = res.attributes.nomeGestor;
              this.usuarioLogadoEvent.emit({
                isLogado: true,
                perfil: res.attributes.tipo,
                nome: nome
              });
            }
            if (res.attributes.tipo == 'APICULTOR') {
              instance.toogleLoading(false);
              this.dialogService.confirm('Erro', 'Acesso não permitido, usuário com perfil Apicultor', 'ERRO', null).subscribe(value => {
                instance.logout();
              });
              return false;
            }
            if (res.attributes.tipo == 'ASSOCIACAO') {
              this.get(res.id, UserWeb, ['associacao']).then(result => {
                let associacao: Associacao = result.attributes.associacao;
                nome = associacao.getNome();
                this.usuarioLogadoEvent.emit({
                  isLogado: true,
                  perfil: res.attributes.tipo,
                  nome: nome
                });

              });
            }

            this.usuarioLogadoEvent.emit({
              isLogado: true,
              perfil: res.attributes.tipo,
              nome: nome
            });

            localStorage.setItem('session', '' + this.momentService.now());
            this.route.navigate(['home/lista/apiarios']);

            instance.toogleLoading(false);
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
        instance.showErrorPopUp(error);
      }
    }).fail(fails => {
      instance.showErrorPopUp(fails);
    });
  }

  become(session: string): parse.Promise<any> {
    this.toogleLoading(true);
    let i = this;
    return parse.User.become(session).fail(erro => {
      i.toogleLoading(false)
      i.showErrorPopUp(erro);
    }).done(done => {
      i.toogleLoading(false)
    });
  }

  runCloud(script: string, paran?: any) {
    this.toogleLoading(true);
    let i = this;
    return parse.Cloud.run(script, paran).fail(erro => {
      i.showErrorPopUp(erro);
      i.toogleLoading(false);
    }).done(done => {
      i.toogleLoading(false);
      return done;
    })
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
