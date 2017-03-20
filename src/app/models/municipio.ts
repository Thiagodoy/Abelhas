import { Estado } from './estado';
import{ Object } from 'parse';
export class Municipio extends Object {
    constructor(){
        super('Municipio');
    }
    getId():string{
        return this.id;
    }
    getNome(){
        return this.get('nome');
    }

    getEstado():Estado{
        return this.get('estado');
    }
}
