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
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor F'},
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor Y'},
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor I'},
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor '},
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor B'},
      {especie:'Melaponinae',data:'12/12/2017',apicultor:'apicultor '}   

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'especie',  label: 'Especie' },
    { name: 'apicultor', label: 'Apicultor' },
    { name: 'data', label: 'Data' },
  
    
    ];

  constructor(public dialogRef: MdDialogRef<MessageDialogComponent>) { }
  ngOnInit() {
  }

}
