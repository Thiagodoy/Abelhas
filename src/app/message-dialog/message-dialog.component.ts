import { ApicultorAssociacao } from './../models/apicultor-associacao';
import { FormControl, FormGroup } from '@angular/forms';
import { TableComponent } from './../table/table.component';

import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  public message: string;
  public title: string;
  public type: string = 'MESSAGE';
  listItensSelected: any[] = [];
  itensSelected: any[] = [];
  data: any[] = [];
  columns: ITdDataTableColumn[] = [];
  uniqueId: string = 'id'
  multiple: boolean;

  
  qtdPonto:FormControl  = new FormControl();
  qtdCaixa:FormControl = new FormControl();
  name:FormControl = new FormControl({value:'',disabled:true}); 
  myGroup:FormGroup = new FormGroup({});
  apicultorAssociacao:ApicultorAssociacao;


  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) { }

  ngOnInit() { 
    
    this.myGroup.addControl('name',this.name);
    this.myGroup.addControl('qtdCaixa',this.qtdCaixa);
    this.myGroup.addControl('qtdPonto',this.qtdPonto);

  }

  itensSelecionados(paran) {

    if (paran.selected) {
      if (paran.row) {
        if (!this.multiple)
          this.listItensSelected.pop();
        this.listItensSelected.push(paran.row);
      } else {
        this.listItensSelected.concat(paran.rows);
      }
    } else {

      if (paran.rows && paran.rows.length == 0) {
        this.listItensSelected = [];
      } else {
        this.listItensSelected = this.listItensSelected.filter((value, index) => { return value.id != paran.row.id });
      }
    }

    console.log(this.listItensSelected.length);
  }

  closeTable(action: string) {

    if (action == 'CANCELAR' && !this.multiple) {
      this.dialogRef.close([]);
    }

    this.dialogRef.close(this.listItensSelected);
  }

  editApicultorAssociacao(data:ApicultorAssociacao){
        this.apicultorAssociacao = data;
        this.name.setValue(data.getAssociacao().getNome());
        this.qtdCaixa.setValue(data.getQtdCaixas());
        this.qtdPonto.setValue(data.getQtdPontos());
  }
  alterar(){
    this.apicultorAssociacao.setQtdCaixas(this.qtdCaixa.value);
    this.apicultorAssociacao.setQtdPontos(this.qtdPonto.value);
    this.dialogRef.close(this.apicultorAssociacao);
  }

}
