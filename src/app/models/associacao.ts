import { Municipio } from './municipio';
import{ Object } from 'parse';
export class Associacao extends Object{
    constructor(){
        super('Associacao');
    }

    getMunicipio():Municipio{
        return this.get('municipio');
    }

    setNome(nome:string){
        this.set('nome',nome);
    }
    
    setSigla(sigla:string){
        this.set('sigla',sigla);
    }

    setBairro(bairro:string){
        this.set('bairro',bairro);
    }
    
    setEndereco(endereco:string){
        this.set('endereco',endereco);
    }

    setTelefone(telefone:string){
        this.set('telefone',telefone);
    }

    setContatoPresidente(contato:string){
        this.set('contatoPresidente',contato)
    }

    setMunicipio(municipio:Municipio){
        this.set('municipio',municipio);
    }

    setEmail(email:string){
        this.set('email',email);
    }
    getEmail():string{
        return this.get('email');
    }
    getNome():string{
        return this.get('email');
    }
    
}
