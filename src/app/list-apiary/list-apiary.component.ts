import { Component, OnInit,ElementRef } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'app-list-apiary',
  templateUrl: './list-apiary.component.html',
  styleUrls: ['./list-apiary.component.sass']
})
export class ListApiaryComponent implements OnInit {
 

  // MOCK
  private data: any[] = [
    { validado:'Sim', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor',data:'12/122015', },
    { validado:'Não', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor',data:'12/122015', },
    { validado:'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor',data:'12/122015', },
    { validado:'Sim', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor',data:'12/122015', },
    { validado:'Erro', especie: 'Meliponinae', apicultor: 'Marcelo de Souza', status: 'Modificado pelo gestor',data:'12/122015', },
    
  ];
  private columns: ITdDataTableColumn[] = [
    { name: null, label: 'Validado'},
    { name: 'especie', label: 'Espécie'},
    { name: 'apicultor', label: 'Apicultor'},
    { name: 'status', label: 'Status'},
    { name: 'data', label: 'Data'},
    { name: 'acoes', label: 'Ações'  },

  ];
  selectable: boolean = false;
  multiple: boolean = false;
  sortable: boolean = false;
  sortBy: boolean = false;
  sortOrder: string = 'sku';

  constructor() { }

  ngOnInit() {
  }

}
