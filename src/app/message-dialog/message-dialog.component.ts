import { MomentService } from './../service/moment.service';
import { Apiario } from './../models/apiario';

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


  data: any[] = [];

  columns: ITdDataTableColumn[] = [
    { name: 'especie', label: 'Especie' },
    { name: 'apicultor', label: 'Apicultor' },
    { name: 'data', label: 'Data' },
  ];

  constructor( public dialogRef: MdDialogRef<MessageDialogComponent>) { }
  ngOnInit() {
   
  }

  itensSelecionados(itens){
    
  }

}
