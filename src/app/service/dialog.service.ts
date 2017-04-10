import { ITdDataTableColumn } from '@covalent/core';
import { Injectable, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) { }

  confirm(title: string, message: string, type: string , viewContainerRef: ViewContainerRef,data?:any,columns?:any,itensSelecteds?:any[],multiple?:boolean): Observable<any> {

    let dialogRef: MdDialogRef<MessageDialogComponent>;
    let config = new MdDialogConfig();

    config.viewContainerRef = viewContainerRef;
    config.disableClose = true;

    dialogRef = this.dialog.open(MessageDialogComponent, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.columns = columns;
    dialogRef.componentInstance.itensSelected = itensSelecteds;
    dialogRef.componentInstance.type = !type ? 'MESSAGE': type;
    dialogRef.componentInstance.multiple = multiple;
    
    
    

    return dialogRef.afterClosed();

  }

}
