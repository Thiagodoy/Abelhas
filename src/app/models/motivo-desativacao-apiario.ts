import{ Object } from 'parse';
export class MotivoDesativacaoApiario extends Object {
    constructor(){
        super('MotivoDesativacaoApiario');
    }
    getNome():string{
        return this.get('nome');
    }
}
