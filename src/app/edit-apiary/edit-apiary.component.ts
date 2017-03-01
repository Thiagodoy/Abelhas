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

  apiario: Apiario = undefined;
  locations: any[] = [];
  static pop: EventEmitter<Object> = new EventEmitter();

  constructor(private route: ActivatedRoute, private parseService: ParseService, private zone: NgZone) { }

  ngOnInit() {
    // implementar com resolver
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
        this.setApiario(result[0]);
        //this.loadPhoto(result[0].attributes.fotos[0]._url);
      });
    });
  }

  setApiario(tem: Apiario) {
    this.apiario = tem;    
    if (tem.attributes.location)
      this.locations = new Array({ latitude: tem.attributes.location.latitude, longitude: tem.attributes.location.longitude })
  }

  loadPhoto(url) {
    this.parseService.loadPhoto(url);
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
