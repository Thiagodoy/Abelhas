import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ITdDataTableColumn, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder,TdDataTableComponent } from '@covalent/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DialogService } from '../service/dialog.service';



@Component({
  selector: 'app-list-apiary',
  templateUrl: './list-apiary.component.html',
  styleUrls: ['./list-apiary.component.scss']
})
export class ListApiaryComponent implements OnInit {


  // MOCK
  private data: any[] = [
    { id:1,validado: 'Sim', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:2,validado: 'Sim', especie: 'Meliponinae', apicultor: 'Rodrigo', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:3,validado: 'Sim', especie: 'Meliponinae', apicultor: 'Marcos', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:4,validado: 'Sim', especie: 'Meliponinae', apicultor: 'Thiago', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:5,validado: 'Sim', especie: 'Meliponinae', apicultor: 'Diego', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:6,validado: 'Sim', especie: 'Apis Mellifera', apicultor: 'Delmas Mattos', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:7,validado: 'Não', especie: 'Apis Mellifera', apicultor: 'Felipe Auguusto', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:8,validado: 'Não', especie: 'Apis Mellifera', apicultor: 'Cristiano da Silva', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:9,validado: 'Não', especie: 'Apis Mellifera', apicultor: 'Anderson Merchan', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:10,validado: 'Não', especie: 'Apis Mellifera', apicultor: 'Iuian', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:11,validado: 'Não', especie: 'Apis Mellifera', apicultor: 'Daise', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:12,validado: 'Não', especie: 'Meliponinae', apicultor: 'Bruno', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:13,validado: 'Erro', especie: 'Apis Mellifera', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:14,validado: 'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:15,validado: 'Erro', especie: 'Apis Mellifera', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:20,validado: 'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:16,validado: 'Erro', especie: 'Apis Mellifera', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:17,validado: 'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:18,validado: 'Erro', especie: 'Apis Mellifera', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },
    { id:19,validado: 'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor', data: '12/12/2015', },

  ];

  columns: ITdDataTableColumn[] = [
    { name: 'validado',  label: 'Validado' },
    { name: 'especie', label: 'Espécie' },
    { name: 'apicultor', label: 'Apicultor'},
    { name: 'status', label: 'Status'},
    { name: 'data', label: 'Data'},
    { name: 'acoes', label: 'Ações'},  ];

  

  
  
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  
  dateFormat: string = 'DD-MM-YYYY';
  font: string = 'Roboto,"Helvetica Neue",sans-serif';

  constructor(private dialogService: DialogService, private viewContainerRef: ViewContainerRef, private _dataTableService: TdDataTableService) { 

  }

  ngOnInit() {  
   
  }

 
  itemSelected(event){
   console.log(event);
  }


  
}
