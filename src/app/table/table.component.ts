import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ITdDataTableColumn, TdDataTableSortingOrder, IPageChangeEvent, TdDataTableService } from '@covalent/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DialogService } from '../service/dialog.service';

let Jquery = require('jquery');

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() data: any[] = [];
  @Input() columns: ITdDataTableColumn[];
  @Input() selectable: boolean;
  @Input() multiple: boolean;
  @Input() sortable: boolean;
  @Input() sortBy: boolean;
  @Input() sortOrder: string;
  @Input() showPagination: boolean;
  @Input() showSelectionJquery: boolean=true;

  @Output('itemSelected2') itemSelected2 = new EventEmitter<Object>();

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  paginaInicial: number = 1;
  paginaAtual: number = 1;
  paginaTotal: number = 5;

  //sortOrderR: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending

  constructor(
    private _dataTableService: TdDataTableService,
    private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    // Aplica a uma class para seleção de linha 
    if (this.showSelectionJquery) {
      Jquery('#table').find('tbody').on('click', 'tr', function (el) {
        Jquery(el.currentTarget).closest('tbody').find('.td-data-table-row').removeClass('td-data-table-clicked');
        Jquery(el.currentTarget).addClass('td-data-table-clicked');
      });
    }
  }

  ngOnInit() {
    let tem: any[] = this.data;
    tem = this._dataTableService.pageData(tem, this.paginaInicial, this.paginaAtual * this.paginaTotal);
    this.filteredData = tem;
  }

  sortTable(event) { }

  itemSelected(event) {
    this.itemSelected2.emit(event);
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.paginaInicial = pagingEvent.fromRow;
    this.paginaAtual = pagingEvent.page;
    this.paginaTotal = pagingEvent.pageSize;
    let temp: any[] = this.data;
    temp = this._dataTableService.pageData(temp, this.paginaInicial, this.paginaAtual * this.paginaTotal);
    this.filteredData = temp;
  }

  confirmarValidacao() {

    let menssagem = '<p>Tem certeza que deseja validar este dado?</p>' +
      '<p>Este procedimento não poderáser revertido!</p>';

    this.dialogService.confirm('Confirmar validação', menssagem, null, this.viewContainerRef).subscribe((value) => {
      //  TODO - IMPLEMENTAR A LOGICA QUE VALIDA OU NAO O APIARIO
    });
  }

}
