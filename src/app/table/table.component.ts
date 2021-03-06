import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, AfterViewChecked } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent, TdDataTableService, TdDataTableComponent, TdDataTableSortingOrder, ITdDataTableSortChangeEvent } from '@covalent/core';

import { ParseService } from '../service/parse.service';
import { TdPagingBarComponent } from '@covalent/core/paging/paging-bar.component';

let Jquery = require('jquery');

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[] = [];
  @Input() columns: ITdDataTableColumn[];
  @Input() uniqueId: string;
  @Input() selectable: boolean;
  @Input() multiple: boolean;
  @Input() sortable: boolean;
  @Input() sortBy: string;
  @Input() showPagination: boolean;
  @Input() showSelectionJquery: boolean = true;
  @Input() showDisableapiary:boolean = false;
  @Input() itensSelecteds: any[] = []
  @ViewChild('table') table: TdDataTableComponent;
  @ViewChild('pagingBar') pagingBar:TdPagingBarComponent
  @Input() paginaTotal: number = 10;

  @Output('itemSelected2') itemSelected2 = new EventEmitter<Object>();
  @Output('itemSelected3') itemSelected3 = new EventEmitter<Object>();
  @Output('itemSelectedAll') itemSelectedAll = new EventEmitter<Object>();

  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  filteredData: any[] = this.data;
  totalRecords: number = this.data.length;
  filteredTotal: number = this.data.length;
  paginaInicial: number = 1;
  paginaAtual: number = 1;
  pageSize:number = 10 ;
  pagingEvent: IPageChangeEvent;
  selectedRows: any[] = [];

  itemCurrent: any;
  searchTerm: string;
  perfil: string;

  constructor(private _dataTableService: TdDataTableService, private parseService: ParseService) {
    this.perfil = this.parseService.core.User.current().attributes.tipo;
  }

  ngAfterViewInit() {
    // Aplica a uma class para seleção de linha 
    if (this.showSelectionJquery) {
      Jquery('#table').on('click', 'tr', function (el) {
        Jquery(el.currentTarget).closest('tbody').find('.td-data-table-row').removeClass('td-data-table-clicked');
        Jquery(el.currentTarget).addClass('td-data-table-clicked');
      });
    }
   

  }
  
 
  ngOnChanges(changes: SimpleChanges) {    

    this.filteredData = this.data;
    this.selectedRows = [];

    if (!this.data) {
      return;
    }

    if (changes['data']) {
      let tem: any[] = this.data;
      this.paginaInicial = 1;
      this.paginaAtual = 1;
      this.filteredTotal = this.data.length;
      tem = this._dataTableService.pageData(tem, this.paginaInicial , this.paginaAtual  * this.paginaTotal);
      this.filteredData = tem;
      this.totalRecords = this.data.length;
    }    

    // Seleciona itens na tabela
    if (changes['itensSelecteds']) {
      
      this.table.selectable = true;
      let array = changes['itensSelecteds']['currentValue'];      
      this.data.forEach(v=>{      
        array.forEach(element => {      
          if(v.id == element.id)
            this.selectedRows.push(v);
        });
      });     
    }
    if (this.table)
      this.table.refresh();
  }

  ngOnInit() {
    if (!this.data) {
      return;
    }
    let tem: any[] = this.data;
    tem = this._dataTableService.pageData(tem, this.paginaInicial, this.paginaAtual * this.paginaTotal);
    this.filteredData = tem;
  }

  refresh() {
    this.table.refresh();
  }
  sortTable(event) { }

  itemSelected(event) {
    this.itemCurrent = event;
    // this.itemSelected3.emit(event);   
    this.itemSelected3.emit(event);    
  }

  itemAllSelected(event) {
    this.itemSelectedAll.emit(event);
  }

 openMenu(event:Event){   
   event.preventDefault();
   event.stopImmediatePropagation();
 }
  acoes( param, object) {    
    this.itemSelected2.emit({ acao: param, element: object || this.itemCurrent });
  }

  page(event: IPageChangeEvent): void {
    
    this.pagingEvent = event;

    // this.paginaInicial = pagingEvent.fromRow;
    // this.paginaAtual = pagingEvent.page;
    // this.paginaTotal = pagingEvent.pageSize;
    this.filter();
  }
  search(searchTerm: string): void {
    if(searchTerm.length > 0){
      this.searchTerm = searchTerm;    
      let newData = this._dataTableService.filterData(this.data, this.searchTerm, true);
      this.filteredData = newData;  
      this.showPagination = false;

    }else{
      this.searchTerm = undefined;
      this.showPagination = true;
      this.pagingEvent = {fromRow:1,page:1,maxPage:this.data.length/10,pageSize:10,toRow:10,total:this.data.length};
      this.filter();
    }
    
  }
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.data;
    //newData = this._dataTableService.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.pagingEvent.fromRow, this.pagingEvent.page * this.pagingEvent.pageSize);
    this.filteredData = newData;   
  }
}
