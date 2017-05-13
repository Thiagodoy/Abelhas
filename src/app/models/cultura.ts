import{ Object } from 'parse';
export class Cultura extends Object{
    constructor(){
        super('Cultura');
    }

    getNome():string{
        return this.get('nome');
    }
}
