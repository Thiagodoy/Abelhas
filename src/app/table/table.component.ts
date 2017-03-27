import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ElementRef, AfterViewInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ITdDataTableColumn, IPageChangeEvent, TdDataTableService, TdDataTableComponent } from '@covalent/core';

import { ParseService } from '../service/parse.service';

let Jquery = require('jquery');

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() data: any[] = [];
  @Input() columns: ITdDataTableColumn[];
  @Input() selectable: boolean;
  @Input() multiple: boolean;
  @Input() sortable: boolean;
  @Input() sortBy: boolean;
  @Input() sortOrder: string;
  @Input() showPagination: boolean;
  @Input() showSelectionJquery: boolean = true;
  @ViewChild('table') table: TdDataTableComponent

  @Output('itemSelected2') itemSelected2 = new EventEmitter<Object>();
  @Output('itemSelected3') itemSelected3 = new EventEmitter<Object>();
  @Output('itemSelectedAll') itemSelectedAll = new EventEmitter<Object>();

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  paginaInicial: number = 1;
  paginaAtual: number = 1;
  paginaTotal: number = 5;
  itemCurrent: any;

  constructor(
    private _dataTableService: TdDataTableService,


    private elementRef: ElementRef,
    private parseService: ParseService) {
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
    if (!this.data) {
      return;
    }
    let tem: any[] = this.data;
    tem = this._dataTableService.pageData(tem, this.paginaInicial, this.paginaAtual * this.paginaTotal);
    this.filteredData = tem;
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

  sortTable(event) { }

  itemSelected(event) {
    this.itemCurrent = event;
    this.itemSelected3.emit(event);
  }

  itemAllSelected(event) {
    this.itemSelectedAll.emit(event);
  }

  acoes(param, object) {
    this.itemSelected2.emit({ acao: param, element: object || this.itemCurrent });
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.paginaInicial = pagingEvent.fromRow;
    this.paginaAtual = pagingEvent.page;
    this.paginaTotal = pagingEvent.pageSize;
    let temp: any[] = this.data;
    temp = this._dataTableService.pageData(temp, this.paginaInicial, this.paginaAtual * this.paginaTotal);
    this.filteredData = temp;
  }
}
