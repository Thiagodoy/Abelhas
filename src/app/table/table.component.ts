import { Component, OnInit,Input } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {

@Input() data:any[];
@Input() columns:ITdDataTableColumn[];
@Input() selectable:boolean;
@Input() multiple:boolean;
@Input() sortable:boolean;
@Input() sortBy:boolean;
@Input() sortOrder:string;

  constructor() { }

  ngOnInit() {
    
  }

  sortTable(event){

  }

  itemSelected(event){

  }

}
