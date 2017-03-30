import { Municipio } from './municipio';
import { Object } from 'parse';
export class Associacao extends Object {
    constructor() {
        super('Associacao');
    }

    getMunicipio(): Municipio {
        return this.get('municipio');
    }

    setNome(nome: string) {
        this.set('nome', nome);
    }

    setSigla(sigla: string) {
        this.set('sigla', sigla);
    }
    getSigla(): string {
        return this.get('sigla');
    }

    setBairro(bairro: string) {
        this.set('bairro', bairro);
    }

    setEndereco(endereco: string) {
        this.set('endereco', endereco);
    }

    setTelefone(telefone: string) {
        this.set('telefone', telefone);
    }
    getTelefone(): string {
        return this.get('telefone');
    } 

    setMunicipio(municipio: Municipio) {
        this.set('municipio', municipio);
    }

    setEmail(email: string) {
        this.set('email', email);
    }
    getEmail(): string {
        return this.get('email');
    }
    getNome(): string {
        return this.get('nome');
    }

    getBairro(): string {
        return this.get('bairro');
    }
    getTipoRegistro(): string {
        return this.get('tipoRegistro');
    }
    getContatoPresidenteNome(): string {
        return this.get('contatoPresidenteNome');
    }
    getContatoPresidenteTelefone(): string {
        return this.get('contatoPresidenteTelefone');
    }
    setContatoPresidenteNome(param:string){
        this.set('contatoPresidenteNome',param);
    }
    setContatoPresidenteTelefone(param:string){
        this.set('contatoPresidenteTelefone',param);
    }
    getEndereco(): string {
        return this.get('endereco');
    }
    getCep(): string {
        return this.get('cep');
    }
    setCep(param:string) {
        this.set('cep',param);
    }
    getRegistro(): string {
        return this.get('registro');
    }
    getNumeroSif(): string {
        return this.get('numeroSif');
    }
    setNumeroSif(paran: string) {
        this.set('numeroSif',paran);
    }
    setTipoRegistro(paran:number){
        this.set('tipoRegistro',paran);
    }
    setRegistro(param:string){
        this.set('registro',param);
    }

    
}
