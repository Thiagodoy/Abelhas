import { Injectable, ViewContainerRef } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Injectable()
export class DialogService {

  constructor(private dialog: MdDialog) { }

  confirm(title: string, message: string, type: string , viewContainerRef: ViewContainerRef,data?:any): Observable<boolean> {

    let dialogRef: MdDialogRef<MessageDialogComponent>;
    let config = new MdDialogConfig();

    config.viewContainerRef = viewContainerRef;
    config.disableClose = true;

    dialogRef = this.dialog.open(MessageDialogComponent, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.type = !type ? 'MESSAGE': type;

    return dialogRef.afterClosed();

  }

}
