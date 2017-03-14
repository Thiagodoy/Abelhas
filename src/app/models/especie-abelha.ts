import { Object } from 'parse';
export class EspecieAbelha extends Object {
    constructor() {
        super('EspecieAbelha');
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
