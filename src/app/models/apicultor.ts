import { Municipio } from './municipio';
import { Associacao } from './associacao';
import { Object } from 'parse';
export class Apicultor extends Object {
    constructor() {
        super('Apicultor');
    }
    getId(): string {
        return this.id;
    }
    getNome(): string {
        return this.get('nome');
    }
    setNome(param: string) {
        this.set('nome', param);
    }
    setCelular2(param: string) {
        this.set('celular2', param);
    }
    setAssociacoes(associacao: Associacao[]) {
        this.set('associacoes', associacao)
    }
    getAssociacoes(): Associacao[] {
        return this.get('associacoes');
    }
    setQtdCaixasFixas(caixas: number) {
        this.set('qtdCaixasFixas', caixas);
    }
    setEndereco(endereco: string) {
        this.set('endereco', endereco);
    }
    setTelefone(telefone: string) {
        this.set('telefone', telefone);
    }
    setQtdPontos(ponto: number) {
        this.set('quantidadePontos', ponto);
    }
    setMunicipio(municipio: Municipio) {
        this.set('municipio', municipio);
    }
    getMunicipio(): Municipio {
        return this.get('municipio');
    }
    setCelular(param: string) {
        this.set('celular', param);
    }
    setCpf(cpf: string) {
        this.set('cpf', cpf);
    }
    setEmail(email: string) {
        this.set('email', email);
    }
    getEmail(): string {
        return this.get('email');
    }
    setRegistroSif(registro: string) {
        this.set('registroSif', registro);
    }
    setQtdCaixasMigratorias(caixa: Number) {
        this.set('qtdCaixasMigratorias', caixa);
    }
    getRegistroSif(): boolean {
        return this.get('registroSif');
    }
    setDataTermoCompromisso(param: Date) {
        this.set('dataTermoCompromisso', param);
    }
    getDataTermoCompromisso(): Date {
        return this.get('dataTermoCompromisso');
    }
    isCompartilhaDado(): boolean {
        return this.get('compartilhaDado');
    }
    setCompartilhaDado(paran: boolean) {
        this.set('compartilhaDado', paran);
    }
    isTermoParticipacaoProjeto(): boolean {
        return this.get('termoParticipacaoProjeto');
    }
    setTermoParticipacaoProjeto(param: boolean) {
        this.set('termoParticipacaoProjeto', param);
    }

}
