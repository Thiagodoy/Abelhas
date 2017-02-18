import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  public  message:string;
  public  title:string;
  public type:string ='MESSAGE';


   private data: any[] = [
      {especie:'Melaponinae',apicultor:'apicultor F'},
      {especie:'Melaponinae',apicultor:'apicultor Y'},
      {especie:'Melaponinae',apicultor:'apicultor I'},
      {especie:'Melaponinae',apicultor:'apicultor '},
      {especie:'Melaponinae',apicultor:'apicultor B'},
      {especie:'Melaponinae',apicultor:'apicultor '}   

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'especie',  label: 'Especie' },
    { name: 'apicultor', label: 'Apicultor' },
  
    
    ];

  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) { }
  ngOnInit() {
  }

}
