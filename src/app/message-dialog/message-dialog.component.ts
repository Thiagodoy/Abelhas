import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  public  message:string;
  public  title:string;

  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) { }
  ngOnInit() {
  }

}
