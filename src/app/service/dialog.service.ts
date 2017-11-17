import { ApicultorAssociacao } from './../models/apicultor-associacao';
import { ITdDataTableColumn } from '@covalent/core';
import { Injectable, ViewContainerRef } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirm(title: string, message: string, type: string, viewContainerRef: ViewContainerRef, data?: any, columns?: any, itensSelecteds?: any[], multiple?: boolean): Observable<any> {

    let dialogRef: MatDialogRef<MessageDialogComponent>;
    let config = new MatDialogConfig();

    config.viewContainerRef = viewContainerRef;
    config.disableClose = true;

    if(type == 'TABLE')
      config.width = '800px';

    dialogRef = this.dialog.open(MessageDialogComponent, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.columns = columns;
    dialogRef.componentInstance.itensSelected = itensSelecteds;
    dialogRef.componentInstance.type = !type ? 'MESSAGE' : type;
    dialogRef.componentInstance.multiple = multiple;

    return dialogRef.afterClosed();

  }

  editApicultorAssociacao(data: ApicultorAssociacao, viewContainerRef: ViewContainerRef):Observable<any> {
    let dialogRef: MatDialogRef<MessageDialogComponent>;
    let config = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;
    config.disableClose = true;

    dialogRef = this.dialog.open(MessageDialogComponent, config);
    dialogRef.componentInstance.type = 'EDITAR_ASC';
    dialogRef.componentInstance.editApicultorAssociacao(data);
    return dialogRef.afterClosed();
  }

}
