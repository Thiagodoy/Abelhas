import { Municipio } from './municipio';
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
    getRotaAcesso():string{
        return this.get('rotaAcesso');
    }
    setRotaAcesso(param:string){
        this.set('rotaAcesso',param);
    }
    getMunicipio():Municipio{
        return this.get('municipio');
    }
    setMunicipio(param:Municipio){
        this.set('municipio',param);
    }
    setExclude(paran:boolean){
        this.set('excluded',paran);
    }
}
