import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LeafletService } from '../service/leaflet.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit,OnDestroy {

  @Input() locations: any = [];
  @Input() width: string = '100';
  @Input() heigth: string = '100';
  @Input() currentPosition: boolean = false;
  map:L.Map = undefined;

  constructor(private leafletService: LeafletService) { }

  ngOnInit() {

    this.map = this.leafletService.buildMap('map');

    if (this.currentPosition) {
      this.leafletService.putCurrentLocation();
    }

    if (this.locations.length > 0) {
      this.leafletService.putLocations(this.locations);
    }
  }

  ngOnDestroy(){
    debugger;
    this.map.off();
    this.map.remove();
  }
  

}
