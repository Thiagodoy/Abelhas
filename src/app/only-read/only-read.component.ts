import { ITdDataTableColumn } from '@covalent/core';
import { Mortandade } from './../models/mortandade';
import { Cultura } from './../models/cultura';
import { MotivoDesativacaoApiario } from './../models/motivo-desativacao-apiario';
import { EspecieAbelha } from './../models/especie-abelha';
import { AtividadeApicula } from './../models/atividade-apicula';
import { ParseService } from './../service/parse.service';
import { Component, OnInit } from '@angular/core';
import * as parse from 'parse';

@Component({
  selector: 'app-only-read',
  templateUrl: './only-read.component.html',
  styleUrls: ['./only-read.component.scss']
})
export class OnlyReadComponent implements OnInit {


  listAtividade: any[] = [];
  listEspecieAbelha: any[] = [];
  listMotivoDesativacao: any[] = [];
  listCultura: any[] = [];
  listMortande: any[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'nome', label: 'Nome' }
  ];
  constructor(private parseServise: ParseService) { }


  ngOnInit() {

    let promise = []
    promise.push(this.parseServise.findAll(AtividadeApicula));
    promise.push(this.parseServise.findAll(EspecieAbelha));
    promise.push(this.parseServise.findAll(MotivoDesativacaoApiario));
    promise.push(this.parseServise.findAll(Cultura));
    promise.push(this.parseServise.findAll(Mortandade));

    parse.Promise.when(promise).then(result => {
      this.listAtividade = result[0].map((value: AtividadeApicula) => { return { nome: value.getNome() } });
      this.listEspecieAbelha = result[1].map((value: EspecieAbelha) => { return { nome: value.getNome() } });
      this.listMotivoDesativacao = result[2].map((value: MotivoDesativacaoApiario) => { return { nome: value.getNome() } });
      this.listCultura = result[3].map((value: Cultura) => { return { nome: value.getNome() } });;
      this.listMortande = result[4].map((value: Mortandade) => { return { nome: value.getNome() } });
    });
  }

}
