
import { Associacao } from './../../models/associacao';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import constantes from '../../constantes'

function validateCustomNome(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {


        if (!control.parent)
            return null;

        let nome: string = control.value;
        let p = control.parent.get('tipo');

        if (p.value === constantes.APICULTOR || p.value === constantes.ASSOCIACAO || p.value === constantes.GESTOR)
            if (!nome || (nome && nome.length == 0))
                return { 'nome': { required: 'Nome obrigatorio!' } };

        return null;
    };
}

function validateCustomEndereco(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent || !control.parent.get('endereco'))
            return null;

        let p = control.parent.get('tipo');
        let end = control.value;

        if (p.value === constantes.ASSOCIACAO || p.value === constantes.APICULTOR) {
            return end && end.length > 5 ? null : { 'validateCustomEndereco': { endereco: 'invalido' } };
        } else {
            return null;
        }
    };
}

function validateCustomTelefone(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let telefone: string = control.value;

        if (p.value === constantes.ASSOCIACAO)
            if (!telefone || telefone.length == 0)
                return { 'telefone': { require: 'Campo obrigatório' } }

        return null;
    };
}

function validateCustomAssociacao(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent || !control.parent.get('associacao'))
            return null;

        let p = control.parent.get('tipo');
        let ass: Associacao = control.value;

        if (p.value === constantes.APICULTOR) {
            return !ass ? { 'validateCustomAssociacao': { associacao: 'invalido' } } : null;
        } else {
            return null;
        }
    };
}

function validateCustomSigla(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let sigla: string = control.value;

        if (p.value === constantes.ASSOCIACAO)
            if (!sigla || sigla.length == 0)
                return { 'sigla': { require: 'Campo obrigatório' } }

        return null;

    };
}

function validateCustomqtdCaixasFixas(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let value = control.value;

        if (p.value === constantes.APICULTOR)
            if (isNaN(value) || value == '' || value == null || value == 0)
                return { 'qtdCaixasFixas': { require: 'Insira um valor válido' } };

        return null;
    };
}

function validateCustomContatoPresidente(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let value: string = control.value;

        if (p.value === constantes.ASSOCIACAO)
            if (!value || value.length == 0)
                return { 'contatoPresidente': { required: 'Campo obrigatório' } };

        return null;
    };
}

function validateCustomqtdPonto(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let value = control.value;

        if (p.value === constantes.APICULTOR)
            if (isNaN(value) || value == '' || value == null || value == 0)
                return { 'quantidadePontos': { require: 'Insira um valor válido' } };

        return null;
    };
}

function validateCustomCpfOrCnpj(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent || !control.parent.get('cpf'))
            return null;

        let p = control.parent.get('tipo');
        let value: string = control.value;

        if (p.value === constantes.APICULTOR || p.value === constantes.ASSOCIACAO) {
            return value && value.length >= 0 ? null : { 'validateCustomCpfOrCnpj': { qtdCaixasFixas: 'invalido' } };
        } else {
            return null;
        }
    };
}

function validateCustomqtdCaixasMigratorias() {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let p = control.parent.get('tipo');
        let value = control.value;
       
        if (p.value === constantes.APICULTOR)
            if (isNaN(value) || value == '' || value == null || value == 0){                
                return { 'qtdCaixasMigratorias': { require: 'Insira um valor válido' } };
            }

        return null;
    };

}
function validateCustomSenha(param: string) {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let controlSenha = control.parent.get('senha');
        let controlSenhaConf = control.parent.get('confirmar_senha');
        let value = control.value;



        if (param === constantes.CREATE) {
            if (!controlSenha.value || (controlSenha.value && controlSenha.value.length == 0))
                return { 'senha': { require: 'Insira uma senha valida' } };           
        }

        return null;
    };
}

function validateCustomSenhaConf(param: string) {
    return (control: AbstractControl): { [key: string]: any } => {

        if (!control.parent)
            return null;

        let controlSenha = control.parent.get('senha');
        let controlSenhaConf = control.parent.get('confirmar_senha');
        let value = control.value;

        if (param === constantes.CREATE) {
            if (!controlSenhaConf.value || (controlSenhaConf.value && controlSenhaConf.value.length == 0))
                return { 'confirmar_senha': { require: 'Insira uma senha valida' } };

            if (controlSenhaConf.value != controlSenha.value)
                return { 'confirmar_senha': { no_match: '*Senha não confere!' } };
        }

        return null;
    };

}

export default {
    validateCustomNome(): ValidatorFn {
        return validateCustomNome();
    },
    validateCustomEndereco(): ValidatorFn {
        return validateCustomEndereco();
    },
    validateCustomTelefone(): ValidatorFn {
        return validateCustomTelefone();
    },
    validateCustomAssociacao(): ValidatorFn {
        return validateCustomAssociacao();
    },
    validateCustomSigla(): ValidatorFn {
        return validateCustomSigla();
    },
    validateCustomqtdCaixasFixas(): ValidatorFn {
        return validateCustomqtdCaixasFixas();
    },
    validateCustomContatoPresidente(): ValidatorFn {
        return validateCustomContatoPresidente();
    },
    validateCustomqtdPonto(): ValidatorFn {
        return validateCustomqtdPonto();
    },
    validateCustomCpfOrCnpj(): ValidatorFn {
        return validateCustomCpfOrCnpj();
    },
    validateCustomqtdCaixasMigratorias(): ValidatorFn {
        return validateCustomqtdCaixasMigratorias();
    },
    validateCustomSenha(param: string): ValidatorFn {
        return validateCustomSenha(param);
    },
    validateCustomSenhaConf(param: string): ValidatorFn {
        return validateCustomSenhaConf(param);
    }




}