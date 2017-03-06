import { Object } from 'parse';
export class Apicultor extends Object {
    constructor() {
        super('Apicultor');
    }

    getNome(): string {
        return this.get('nome');
    }

    setNome(param: string) {
        this.set('nome', param);
    }
}
