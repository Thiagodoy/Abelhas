import { ITdDataTableColumn } from '@covalent/core';
import { DataPickerCustomComponent } from './../data-picker-custom/data-picker-custom.component';
import { DadosDesativacaoApiario } from './../models/dados-desativacao-apiario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotivoDesativacaoApiario } from './../models/motivo-desativacao-apiario';
import { MomentService } from './../service/moment.service';
import { Apiario } from './../models/apiario';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { DialogService } from '../service/dialog.service';
import * as parse from 'parse';

@Component({
  selector: 'app-data-deactivation',
  templateUrl: './data-deactivation.component.html',
  styleUrls: ['./data-deactivation.component.scss']
})
export class DataDeactivationComponent implements OnInit {

  data: any[];
  listDesativacao: MotivoDesativacaoApiario[];
  listApiariosSelecteds: any[];
  dataSelecionada: Date;
  formDesativacao: FormGroup;
  font: string = 'Roboto,"Helvetica Neue",sans-serif';
  @ViewChild('data') dataCustom: DataPickerCustomComponent;

  constructor(private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,    
    private parseService: ParseService,
    private momentService: MomentService,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.createForm();
    let query = this.parseService.createQuery(Apiario);
    query.include('especieAbelha');
    query.include('apicultor');
    query.notEqualTo('excluded', true);
    query.notEqualTo('ativo', false);
    query.limit(1000);

    let promiseDesativacao = this.parseService.findAll(MotivoDesativacaoApiario);

    parse.Promise.when([promiseDesativacao, this.parseService.executeQuery(query)]).then(result => {
      this.data = result[1].map(value => {
        return {
          id: value.id,
          especie: value.getEspecieAbelha().getNome(),
          data: this.momentService.core(value.createdAt).format('DD/MM/YYYY HH:mm'),
          apicultor: value.getApicultor().getNome()
        };
      });
      this.listDesativacao = result[0];
    });
  }

  search() {
    this.listApiariosSelecteds = [];
    this.formDesativacao.get('controlItensSelecionados').setValue('Nenhum item selecionado.');

    let columns: ITdDataTableColumn[] = [
      { name: 'especie', label: 'Especie' },
      { name: 'apicultor', label: 'Apicultor' },
      { name: 'data', label: 'Data' },
    ];


    this.dialogService.confirm('Escolha', '', 'TABLE', this.viewContainerRef, this.data, columns,[],false).subscribe((value) => {

      if (value.length > 0) {
        this.listApiariosSelecteds = value;
        this.formDesativacao.get('controlItensSelecionados').setValue('' + value.length + ' itens selecionados');
      }
    });
  }

  selectDate(event) {
    this.dataSelecionada = event;
  }

  createForm() {
    this.formDesativacao = this.fb.group({
      controlItensSelecionados: [{ value: 'Nenhum item selecionado.', disabled: true }, Validators.required],
      controlDesativacao: [null, Validators.required],
      observacao: ['']
    })
  }
  clearForm() {
    this.formDesativacao.get('controlItensSelecionados').setValue('Nenhum item selecionado.')
    this.formDesativacao.get('controlDesativacao').setValue(null);
    this.formDesativacao.get('observacao').setValue('');
    this.listApiariosSelecteds = [];
    this.dataCustom.clearDate();
  }

  salvar() {
    this.parseService.get(this.listApiariosSelecteds[0].id, Apiario).then(result => {
      result.setAtivo(false);
      this.parseService.save(result).then(result1 => {
        let desativacao = new DadosDesativacaoApiario();
        desativacao.setApiario(result1);
        desativacao.setDataDesativacao(this.dataSelecionada);
        desativacao.setObservacao(this.formDesativacao.get('observacao').value);
        desativacao.setMotivoDesativacaoApiario(this.formDesativacao.get('controlDesativacao').value);
        this.parseService.save(desativacao).then(result2 => {
          if (result2)
            this.dialogService.confirm('Sucesso', 'Apiario desativado com sucesso', 'SUCCESS', this.viewContainerRef).subscribe(value => {
              this.clearForm();
            });
        });
      });
    });
  }

}
