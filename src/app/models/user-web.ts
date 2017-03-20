import { Associacao } from './associacao';
import { Apicultor } from './apicultor';
import{ User } from 'parse';
export class UserWeb extends User {
    constructor(){
        super('User');
    }

    getApicultor():Apicultor{
        return this.get('apicultor');
    }   
    getAssociacao():Associacao{
        return this.get('associacao');
    }
    getTipo():string{
        return this.get('tipo');
    }

    setAssociacao(ass:Associacao){
        this.set('associacao',ass);
    }
}
