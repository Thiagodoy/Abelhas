import { MotivoDesativacaoApiario } from './motivo-desativacao-apiario';
import { Apiario } from './apiario';
import{ Object } from 'parse';
export class DadosDesativacaoApiario extends Object {


    constructor(){
        super('DadosDesativacaoApiario');
    }

    setApiario(apiario:Apiario){
        this.set('apiario',apiario);
    }

    setDataDesativacao(data:Date){
        this.set('dataDesativacao',data);
    }

    setObservacao(param:string){
        this.set('observacao',param);
    }

    setMotivoDesativacaoApiario(param:MotivoDesativacaoApiario){
        this.set('motivoDesativacaoApiario',param);
    }
}
