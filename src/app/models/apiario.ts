import { Object } from 'parse';
import { Cultura } from './cultura';
import { Propriedade } from './propriedade';
import { Municipio } from './municipio';
import { Mortandade } from './mortandade';
import { Apicultor } from './apicultor';
import { EspecieAbelha } from './especie-abelha';
import { Location } from './location';

export class Apiario extends Object {
    constructor() {
        super('Apiario');
    }
    getObjectId(): string {
        return this.get('objectId');
    }
    getQtdCaixas(): number {
        return this.get('qtdCaixas');
    }
    setQtdCaixas(param: number) {
        return this.set('qtdCaixas', param);
    }
    getNomesArquivos(): string[] {
        return this.get('nomesArquivos');
    }
    setNomesArquivos(param: string[]) {
        this.set('nomesArquivos', param);
    }
    isHistoricoComprovadoPorAnalise(): boolean {
        return this.get('historicoComprovadoPorAnalise');
    }
    setHistoricoComprovadoPorAnalise(param: boolean) {
        this.set('historicoComprovadoPorAnalise', param);
    }
    isMigratorio(): boolean {
        return this.get('migratorio');
    }
    setMigratorio(param: boolean) {
        this.set('migratorio', param);
    }
    getDataColetaUpdate(): Date {
        return this.get('dataColetaUpdate');
    }
    setDataColetaUpdate(param: Date) {
        this.set('dataColetaUpdate', param);
    }
    setDistanciaDeslocamentoCaixa(parm: number) {
        this.set('distanciaDeslocamentoCaixa', parm)
    }
    getDistanciaDeslocamentoCaixa(): number {
        return this.get('distanciaDeslocamentoCaixa');
    }
    isDialogoVizinhos(): boolean {
        return this.get('dialogoVizinhos');
    }
    setDialogoVizinhos(param: boolean) {
        this.set('dialogoVizinhos', param);
    }
    setElevacao(param: number) {
        this.set('elevacao', param);
    }
    getElevacao(): number {
        return this.get('elevacao');
    }
    getCulturas(): Cultura[] {
        return this.get('culturas');
    }
    setCulturas(culturas: Cultura[]) {
        return this.set('culturas', culturas);
    }
    getPropriedade(): Propriedade {
        return this.get('propriedade');
    }
    setPropriedade(param: Propriedade) {
        this.set('propriedade', param);
    }
    getMunicipio(): Municipio {
        return this.get('municipio');
    }
    setMunicipio(param: Municipio) {
        this.set('municipio', param);
    }
    getMortandade(): Mortandade {
        return this.get('mortandade');
    }
    setMortandade(param: Mortandade) {
        this.set('mortandade', param);
    }
    isAtivo(): boolean {
        return this.get('ativo');
    }
    setAtivo(param: boolean) {
        this.set('ativo', param);
    }
    getFotos(): any[] {
        return this.get('fotos');
    }
    setFotos(param: any[]) {
        this.set('fotos', param);
    }
    setComprovadoPorAnalise(param: boolean) {
        this.set('comprovadoPorAnalise', param);
    }
    getComprovadoPorAnalise(): boolean {
        return this.get('comprovadoPorAnalise');
    }
    setMotivoMortandade(param: Mortandade) {
        this.set('motivoMortandade', param);
    }
    getMotivoMortandade(): Mortandade[] {
        return this.get('motivoMortandade');
    }
    setMotivoHistoricoMortandade(param: Mortandade) {
        this.set('motivoHistoricoMortandade', param);
    }
    getMotivoHistoricoMortandade(): Mortandade[] {
        return this.get('motivoHistoricoMortandade');
    }
    getApicultor(): Apicultor {
        return this.get('apicultor');
    }
    setApicultor(param: Apicultor) {
        this.set('apicultor', param);
    }
    getEspecieAbelha(): EspecieAbelha {
        return this.get('especieAbelha');
    }
    getLocation():Location{
        let location = new Location();
        let locationParse = this.get('location');
        location.latitude = locationParse.latitude;
        location.longitude = locationParse.longitude;
        return location;
    }
}
