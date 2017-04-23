import{ Object } from 'parse';
export class AtividadeApicula extends Object {
    constructor(){
        super('AtividadeApicula')
    }

    getNome():string{
        return this.get('nome');
    }
}
