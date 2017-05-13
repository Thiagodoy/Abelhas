import { Associacao } from './associacao';
import { Object } from 'parse'
export class ApicultorAssociacao extends Object {
    constructor() {
        super('ApicultorAssociacao');
        this.set('qtdPontos', 0);
        this.set('qtdCaixas', 0);
    }
    setAssociacao(paran: Associacao) {
        this.set('associacao', paran);
    }
    getAssociacao(): Associacao {
        return this.get('associacao');
    }
    setQtdPontos(paran: number) {
        this.set('qtdPontos', paran);
    }
    getQtdPontos(): number {
        return this.get('qtdPontos');
    }
    setQtdCaixas(paran: number) {
        this.set('qtdCaixas', paran);
    }
    getQtdCaixas():number {
        return this.get('qtdCaixas');
    }
}
