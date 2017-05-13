import{ Object } from 'parse';
export class Estado extends Object {
    constructor(){
        super('Estado');
    }

    getNome():string{
        return this.get('nome');
    }
}
