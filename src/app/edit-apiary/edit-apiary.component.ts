import { Component, OnInit, EventEmitter, OnDestroy, NgZone, SecurityContext, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, } from '@angular/platform-browser';
import { TdLoadingService } from '@covalent/core';
import { ParseService } from '../service/parse.service';
import { Apiario } from '../models/apiario';
import { Location } from '../models/location';
import { Mortandade } from '../models/mortandade';
let jquery = require('jquery');



@Component({
  selector: 'app-edit-apiary',

  templateUrl: './edit-apiary.component.html',
  styleUrls: ['./edit-apiary.component.scss'],

})
export class EditApiaryComponent implements OnInit, OnDestroy, AfterViewInit {

  apiario: Apiario = undefined;
  listMortandade: Mortandade[] = [];
  listCulturas: Mortandade[] = [];
  motivosMortandade: any = {};
  culturas: any = {};
  motivosHistoricoMortandade: any = {};
  locations: Location[] = [];
  static pop: EventEmitter<Object> = new EventEmitter();



  constructor(private route: ActivatedRoute, private parseService: ParseService, private zone: NgZone, private sanitizer: DomSanitizer, private loadingService: TdLoadingService) { }

  ngOnInit() {
    this.route.data.subscribe((res) => {
      debugger;
      this.apiario = res.apiario;
      this.listMortandade = res.listMortandade;
      this.listCulturas = res.listCulturas;
      this.selectCulturas();
      this.selectMotivoMortandade();
      this.selectMotivoHistoricoMortandade();
      //workaround 
      this.parseService.forceCloseLoading();

      let fotos = this.apiario.getFotos();

      if (fotos && fotos.length > 0) {
        this.loadPhoto(fotos[0]._url)
      }
    })

  }

  ngOnDestroy() {
    jquery('#myImg').off('click');
    jquery('#closeModal').off('click');
  }

  ngAfterViewInit() {
    if (this.apiario.getLocation()) {
      
      let location = this.apiario.getLocation();
      let apicultorNome = this.apiario.getApicultor().getNome();
      let propriedade = this.apiario.getPropriedade().getNome();
      let especieAbelha = this.apiario.getEspecieAbelha().getNome()
      location.setPopUp(apicultorNome, propriedade, especieAbelha);
      this.locations = new Array(location);
    }
  }

  selectCulturas() {
    let tempCultura = this.apiario.getCulturas();

    if (!tempCultura)
      return;

    for (let cultura of tempCultura) {
      this.culturas[cultura.getNome()] = true;
    }
  }
  selectMotivoMortandade() {
    let tempMotivoMortandade = this.apiario.getMotivoMortandade();

    if (!tempMotivoMortandade)
      return;

    for (let motivo of tempMotivoMortandade) {
      this.motivosMortandade[motivo.getNome()] = true;
    }
  }
  selectMotivoHistoricoMortandade() {
    let tempMotivoHistoricoMortandade = this.apiario.getMotivoHistoricoMortandade()

    if (!tempMotivoHistoricoMortandade)
      return;

    for (let motivo of tempMotivoHistoricoMortandade) {
      this.motivosHistoricoMortandade[motivo.getNome()] = true;
    }
  }
  loadPhoto(url) {
    jquery('#myImg').attr('src', this.sanitizer.sanitize(SecurityContext.URL, url));
    jquery('#myImg').on('load', this.bindEventLoadImage);
    jquery('#myImg').on('error', this.bindEventLoadImage);
  }

  bindEventLoadImage(event) {

    if (!event)
      return false;
    event.preventDefault();
    var img = jquery(event.currentTarget);
    if (event.type == 'load') {
      EditApiaryComponent.activePopUp();
    }

    if (event.type == 'error') {
      jquery('#myImg').attr('src', 'assets/no_image.jpg');
    }
  }

  private static activePopUp() {

    jquery('#myImg').click((event) => {
      let src = jquery(event.currentTarget).attr('src');
      EditApiaryComponent.pop.emit({ src: src });
    });
    jquery('#closeModal').click(function () {
      jquery('#myModal').hide();
    });
  }

}

