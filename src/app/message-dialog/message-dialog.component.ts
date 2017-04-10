import { TableComponent } from './../table/table.component';
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
  listItensSelected: any[] = [];
  itensSelected: any[] = [];
  data: any[] = [];
  columns: ITdDataTableColumn[] = [];
  uniqueId: string = 'id'
  multiple: boolean;


  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) { }

  ngOnInit() { }

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

}
