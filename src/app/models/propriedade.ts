import { Object } from 'parse';
export class Propriedade extends Object {
    constructor() {
        super('Propriedade');
    }
    getId():string{
        return this.id;
    }
    getNome(): string {
        return this.get('nome');
    }

    setNome(param: string) {
        this.set('nome', param);
    }
}
