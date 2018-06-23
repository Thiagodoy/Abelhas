import { Municipio } from './municipio';
import { Base } from './base';
export class Associacao extends Base {
    constructor() {
        super('Associacao'); 
        this.setExcluded(false);              
    }  

    getId(){
        return this.id;
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
    setContatoPresidenteNome(param: string) {
        this.set('contatoPresidenteNome', param);
    }
    setContatoPresidenteTelefone(param: string) {
        this.set('contatoPresidenteTelefone', param);
    }
    getEndereco(): string {
        return this.get('endereco');
    }
    getCep(): string {
        return this.get('cep');
    }
    setCep(param: string) {
        this.set('cep', param);
    }
    getRegistro(): string {
        return this.get('registro');
    }
    getNumeroSif(): string {
        return this.get('numeroSif');
    }
    setNumeroSif(paran: string) {
        this.set('numeroSif', paran);
    }
    setTipoRegistro(paran: number) {
        this.set('tipoRegistro', paran);
    }
    setRegistro(param: string) {
        this.set('registro', param);
    }
    setExcluded(param: boolean) {
        this.set('excluded', param);
    }
    setQtdPontos(paran: number) {
        this.set('quantidadePontos', paran)
    }
    getQtdPontos(): number {
        return this.get('quantidadePontos');
    }
    getQtdCaixas(): number {
        return this.get('qtdCaixasFixas');
    }
    setQtdCaixas(param: number) {
        return this.set('qtdCaixasFixas', param);
    }
    setAcordoCooperacaoAbelha(paran:boolean){
        this.set('acordoCooperacaoAbelha',paran);
    }
    getAcordoCooperacaoAbelha():boolean{
        return this.get('acordoCooperacaoAbelha');
    }
     setDataTermoCompromisso(param: Date) {
        this.set('dataTermoCompromisso', param);
    }
    getDataTermoCompromisso(): Date {
        return this.get('dataTermoCompromisso');
    }    
    getExcluded():boolean{
        return this.get('excluded');
    }
}
