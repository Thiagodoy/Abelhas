import { Object } from 'parse';
export class Propriedade extends Object {
    constructor() {
        super('Propriedade');
    }
    getNome(): string {
        return this.get('nome');
    }

    setNome(param: string) {
        this.set('nome', param);
    }
}
