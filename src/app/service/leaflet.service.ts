import { DomSanitizer } from '@angular/platform-browser';
import { Location } from './../models/location';

import { Injectable } from '@angular/core';
import * as L from 'leaflet'
import { GeocodeService } from './geocode.service';


@Injectable()
export class LeafletService {


  core = L;
  baseMaps: any = null;
  map: L.Map = undefined;
  markers: Map<string, L.Marker> = new Map();
  group: L.LayerGroup;
  control:L.Control.Layers


  constructor(private geocode: GeocodeService, sanitizer: DomSanitizer) {

    this.baseMaps = {
      Exemplo_1: L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: ''
      }),
      Exemplo_2: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: ''
      }),
      Exemplo_3: L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        attribution: ''
      })
    };
  }

  buildMap(map: string) {

    this.map = this.core.map(map, {
      zoomControl: false,
      center: L.latLng(40.731253, -73.996139),
      zoom: 8,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.baseMaps.Exemplo_1]
    }).setView([51.505, -0.09], 13);

    this.core.control.zoom({ position: "topright" }).addTo(this.map);
    this.core.control.scale().addTo(this.map);

    return this.map;
  }

  putLocations(locations: Location[]) {

    this.removeAll()
    for (let location of locations) {

      this.map.panTo([location.latitude, location.longitude]);
      let marker = this.core.marker([location.latitude, location.longitude], { icon: location.getIcon() }).bindPopup(location.getPopUp()).addTo(this.map).openPopup();
      this.markers.set(location.getKey(), marker);
    }
  }

  putLocation(location: Location) {
    this.map.panTo([location.latitude, location.longitude]);
    this.map.panTo([location.latitude, location.longitude]);
    let marker = this.core.marker([location.latitude, location.longitude], { icon: location.getIcon() }).bindPopup(location.getPopUp()).addTo(this.map).openPopup();
    this.markers.set(location.getKey(), marker);
  }

  removeLocation(location: Location) {

    let marker = this.markers.get(location.getKey());
    if (marker) {
      this.map.removeLayer(marker);
      this.markers.delete(location.getKey());
    }
  }

  removeAll() {

    this.markers.forEach((value, key) => {
      this.map.removeLayer(value);
    }, this.markers);

    this.markers.clear();
  }

  putCurrentLocation() {

    this.geocode.getCurrentLocation()
      .subscribe(
      location => {
        this.map.panTo([location.latitude, location.longitude])
        this.core.marker([location.latitude, location.longitude]).addTo(this.map);
      },
      err => console.error(err)
      );
  }

  putGroupLOcation(l: Location[]) {

    if (l.length == 0)
      return false;

    if (this.group){
      this.map.removeLayer(this.group);
      this.map.removeControl(this.control);      
    }
      

    let m = []
    for (let location of l) {
      let marker = this.core.marker([location.latitude, location.longitude], { icon: location.getIcon() }).bindPopup(location.getPopUp());
      m.push(marker);
      this.markers.set(location.key, marker);
    }
    this.group = this.core.layerGroup(m);


    var overlayMaps = { "Apiarios": this.group };
    let location = l[0];
    let LatLng = new L.LatLng(location.getLatitude(), location.getLongitude());
    this.map.setView(LatLng, 10);
    this.control = this.core.control.layers(overlayMaps).addTo(this.map);
    this.group.addTo(this.map);

  }


}


