import { ApicultorAssociacao } from './../models/apicultor-associacao';
import { FormControl, FormGroup } from '@angular/forms';
import { TableComponent } from './../table/table.component';

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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
  mapItemSelecionados: Map<any,any> = new Map();
  itensSelected: any[] = [];
  data: any[] = [];
  columns: ITdDataTableColumn[] = [];
  uniqueId: string = 'id'
  multiple: boolean;
  selectedRows:any[] = [];

  
  qtdPonto:FormControl  = new FormControl();
  qtdCaixa:FormControl = new FormControl();
  name:FormControl = new FormControl({value:'',disabled:true}); 
  myGroup:FormGroup = new FormGroup({});
  apicultorAssociacao:ApicultorAssociacao;


  constructor(public dialogRef: MatDialogRef<MessageDialogComponent>) { }

  ngOnInit() { 
    
    this.myGroup.addControl('name',this.name);
    this.myGroup.addControl('qtdCaixa',this.qtdCaixa);
    this.myGroup.addControl('qtdPonto',this.qtdPonto);

  }

  itensSelecionados(paran) {

    if(!this.mapItemSelecionados.has(paran.row.id) && paran.selected)
      this.mapItemSelecionados.set(paran.row.id,paran.row);
    else if(this.mapItemSelecionados.has(paran.row.id) && !paran.selected)
      this.mapItemSelecionados.delete(paran.row.id);   

   }

  closeTable(action: string) {

    if (action == 'CANCELAR' && !this.multiple) {
      this.dialogRef.close({selected:false});
      return false;
    }
    
    let array = [];
    this.mapItemSelecionados.forEach((value)=>array.push(value));

    this.dialogRef.close({rows:array, selected: array.length > 0});
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
