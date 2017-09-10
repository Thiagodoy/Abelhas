import {Http, Headers, Response} from "@angular/http";
import { Location } from "../models/location";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import * as L from 'leaflet'

@Injectable()
export class GeocodeService {
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    geocode(address: string) {
        return this.http
            .get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address))
            .map(response => response.json())
            .map(result => {
                if (result.status !== "OK") { throw new Error("Erro ao buscar o endereço"); }

                let location = new Location();
                location.address = result.results[0].formatted_address;
                location.latitude = result.results[0].geometry.location.lat;
                location.longitude = result.results[0].geometry.location.lng;

                let viewPort = result.results[0].geometry.viewport;
                location.viewBounds = L.latLngBounds(
                  {
                    lat: viewPort.southwest.lat,
                    lng: viewPort.southwest.lng},
                  {
                    lat: viewPort.northeast.lat,
                    lng: viewPort.northeast.lng
                  });

                return location;
            });
    }

    getCurrentLocation() {
        return this.http
            .get("http://ipv4.myexternalip.com/json")
            .map(res => res.json().ip)
            .flatMap(ip => this.http.get("http://freegeoip.net/json/" + ip))
            .map((res: Response) => res.json())
            .map(result => {
                let location = new Location();

                location.address = result.city + ", " + result.region_code + " " + result.zip_code + ", " + result.country_code;
                location.latitude = result.latitude;
                location.longitude = result.longitude;

                return location;
            });
    }
}
