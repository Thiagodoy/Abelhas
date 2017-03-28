import { Observable } from 'rxjs/Rx';
import { Municipio } from './../models/municipio';
import { Estado } from './../models/estado';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ParseService } from './../service/parse.service';
import { Associacao } from './../models/associacao';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as parse from 'parse';

@Component({
  selector: 'app-edit-association',
  templateUrl: './edit-association.component.html',
  styleUrls: ['./edit-association.component.scss']
})
export class EditAssociationComponent implements OnInit, OnDestroy {


  associacao: Associacao;
  formAssociacao: FormGroup;
  listEstados: Estado[]=[];
  listMunicipio: Municipio[]=[];
  listEstadosFiltered: Observable<Estado[]>;
  listMunicipioFiltered: Observable<Municipio[]>;
  constructor(private routerA: ActivatedRoute, private parseService: ParseService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();

    this.routerA.queryParams.subscribe(res => {

      if (res.associacao) {
        let query = this.parseService.createQuery(Associacao);
        query.equalTo('objectId', res.associacao);
        this.parseService.executeQuery(query).then((response: Associacao[]) => {
          this.associacao = response[0];
          this.populateForm();
        });
      }

    });

    let promiseEstado = this.parseService.findAll(Estado);
    let promiseMunicipio = this.parseService.findAll(Municipio);

    parse.Promise.when([promiseEstado, promiseMunicipio]).then(response => {
      this.listEstados = response[0];
      this.listMunicipio = response[1];
    });

    this.listEstadosFiltered = this.formAssociacao.get('estado').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map<string, Estado[]>(nome => nome ? this.filterEstado(nome) : this.listEstados.slice());

    this.listMunicipioFiltered = this.formAssociacao.get('municipio').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map<string, Estado[]>(nome => nome ? this.filterMunicipio(nome) : this.listEstados.slice());

  }

  ngOnDestroy() { }

  filterEstado(name: string): Estado[] {
    return this.listEstados.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }

  filterMunicipio(name: string): Municipio[] {
    return this.listMunicipio.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }

  populateForm() {

    this.formAssociacao.get('nome').setValue(this.associacao.getNome());
    this.formAssociacao.get('sigla').setValue(this.associacao.getSigla());
    this.formAssociacao.get('bairro').setValue(this.associacao.getBairro());
    this.formAssociacao.get('tipoRegistro').setValue(this.associacao.getTipoRegistro());
    this.formAssociacao.get('contatoPresidenteNome').setValue(this.associacao.getContatoPresidenteNome());
    this.formAssociacao.get('endereco').setValue(this.associacao.getEndereco());
    this.formAssociacao.get('telefone').setValue(this.associacao.getTelefone());
    this.formAssociacao.get('municipio').setValue(this.associacao.getMunicipio());
    this.formAssociacao.get('cep').setValue(this.associacao.getCep());
    this.formAssociacao.get('registro').setValue(this.associacao.getRegistro());
    this.formAssociacao.get('numeroSif').setValue(this.associacao.getNumeroSif());
    this.formAssociacao.get('contatoPresidenteTelefone').setValue(this.associacao.getContatoPresidenteTelefone());
    this.formAssociacao.get('email').setValue(this.associacao.getEmail());

  }

  createForm() {
    this.formAssociacao = this.fb.group({
      nome: [],
      sigla: [],
      bairro: [],
      tipoRegistro: [],
      contatoPresidenteNome: [],
      endereco: [],
      telefone: [],
      municipio: [],
      estado: [],
      cep: [],
      registro: [],
      numeroSif: [],
      contatoPresidenteTelefone: [],
      email: []
    });

  }

}
