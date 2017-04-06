import { MotivoDesativacaoApiario } from './../models/motivo-desativacao-apiario';
import { MomentService } from './../service/moment.service';
import { Apiario } from './../models/apiario';
import { ParseService } from './../service/parse.service';
import { Component, OnInit, ViewContainerRef, ElementRef } from '@angular/core';
import { DialogService } from '../service/dialog.service';
import * as parse from 'parse';

@Component({
  selector: 'app-data-deactivation',
  templateUrl: './data-deactivation.component.html',
  styleUrls: ['./data-deactivation.component.scss']
})
export class DataDeactivationComponent implements OnInit {

  data: any[];
  listDesativacao:MotivoDesativacaoApiario[];

  constructor(private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private parseService: ParseService,
    private momentService: MomentService) { }

  ngOnInit() {
    let query = this.parseService.createQuery(Apiario);
    query.include('especieAbelha');
    query.include('apicultor');
    query.notEqualTo('excluded', true);
    query.limit(1000);

    let promiseDesativacao = this.parseService.findAll(MotivoDesativacaoApiario);

    parse.Promise.when([promiseDesativacao, this.parseService.executeQuery(query)]).then(result => {
      this.data = result[1].map(value => {
        return {
          id: value.id,
          especie: value.getEspecieAbelha().getNome(),
          data: this.momentService.core(value.createdAt).format('DD/MM/YYYY HH:mm'),
          apicultor: value.getApicultor().getNome()
        };
      });

      this.listDesativacao = result[0];

    });

    this.parseService.executeQuery(query).then((result: Apiario[]) => {

    });
  }

  search() {

    this.dialogService.confirm('Escolha', '', 'TABLE', this.viewContainerRef, this.data).subscribe((value) => {
      //  TODO - IMPLEMENTAR A LOGICA QUE VALIDA OU NAO O APIARIO
    });
  }

}
