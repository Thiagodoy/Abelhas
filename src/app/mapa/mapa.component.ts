import { Component, OnInit, Input } from '@angular/core';
import { LeafletService } from '../service/leaflet.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  @Input() locations: any = [];
  @Input() width: string = '100';
  @Input() heigth: string = '100';
  @Input() currentPosition: boolean = false;

  constructor(private leafletService: LeafletService) { }

  ngOnInit() {

    this.leafletService.buildMap('map');

    if (this.currentPosition) {
      this.leafletService.putCurrentLocation();
    }

    if (this.locations.length > 0) {
      this.leafletService.putLocations(this.locations);
    }
  }
  

}
