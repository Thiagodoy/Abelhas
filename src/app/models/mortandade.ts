import{ Object } from 'parse';
export class Mortandade extends Object {
    constructor(){
        super('Mortandade');
    }

    getNome():string{
        return this.get('nome');
    }
}
