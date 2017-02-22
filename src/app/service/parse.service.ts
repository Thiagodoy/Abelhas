import { Injectable } from '@angular/core';
import * as parse from 'parse';
import { environment } from '../../environments/environment.prod'

@Injectable()
export class ParseService {
 core = parse;
  //showToolbar: EventEmitter<boolean> = new EventEmitter<boolean>()
  //static loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  //usuarioLogado: Login;  
  
  constructor() {

    this.core.initialize("myAppDebug");
    this.core.serverURL = "http://localhost:1337/parse";
    // Mapeia as classes que serão utilizadas no parse
    //this.core.Object.registerSubclass("GameScore", GameScore);
    //this.core.Object.registerSubclass("User", Login);

  }

  findAll<T extends parse.Object>(paramClass: { new (): T }): parse.Promise<T[]> {
    let query = new this.core.Query(new paramClass());
    return query.find();
  }

  login(user: Parse.User) {
    user.logIn().then(res => {
      debugger;
      console.log(res);
      //this.router.navigate(["home"]);
     // this.showToolbar.emit(true);
    });


  }

}
