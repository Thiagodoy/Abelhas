import { Component, OnInit, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParseService } from '../service/parse.service';
import { Apiario } from '../models/apiario';
let Jquery = require('jquery');


@Component({
  selector: 'app-edit-apiary',

  templateUrl: './edit-apiary.component.html',
  styleUrls: ['./edit-apiary.component.scss'],

})
export class EditApiaryComponent implements OnInit, OnDestroy {

  // MOCK
  apicultores: any[] = [{ nome: 'Valdir Correa Nogueira', value: 1 }];
  propriedades: any[] = [{ nome: 'Sítio do Catelan - sto augustinho', value: 1 }];
  culturas: any[] = [{ nome: 'Soja' }, { nome: 'Pinus' }, { nome: 'Pasto' }, { nome: 'Milho' }, { nome: 'Melão' }, { nome: 'Maracujá' }, { nome: 'Melão' }, { nome: 'Maracujá' },
  { nome: 'Soja' }, { nome: 'Pinus' }, { nome: 'Pasto' }, { nome: 'Milho' }, { nome: 'Melão' }, { nome: 'Maracujá' }];
  especies: any[] = [{ name: 'Melipona' }, { name: 'Mandaçaia ' }, { name: 'Tetragonisca angustul' }];
  motivoMortandade: any[] = [{ name: 'Agroquimicos' }];


  apiario: Apiario = undefined;
  static pop: EventEmitter<Object> = new EventEmitter();

  constructor(private route: ActivatedRoute, private parseService: ParseService, private zone: NgZone) { }

  ngOnInit() {


    this.route.queryParams.subscribe((res: any) => {
     this.loadApiario(res.apiario);
    });
    this.activeJquery();

  }

  ngOnDestroy() {
    Jquery('#myImg').off('click');
    Jquery('#closeModal').off('click');
  }

  loadApiario(id) {
    let query = this.parseService.createQuery(Apiario);
    query.equalTo('objectId', id);
    query.include('apicultor');
    query.include('culturas');
    query.include('especieAbelha');
    query.include('atividadeApicula');
    query.include('propriedade');

    this.parseService.executeQuery(query).then((result) => {
      this.zone.run(() => {
         debugger;
         this.setApiario(result[0]);
      });

    });
  }

  setApiario(tem: Apiario) {
    this.apiario = tem;
  }

  activeJquery() {
    Jquery('#myImg').click((event) => {
      let src = Jquery(event.currentTarget).attr('src');
      EditApiaryComponent.pop.emit({ src: src });
    });
    Jquery('#closeModal').click(function () {
      Jquery('#myModal').hide();
    });
  }

}
