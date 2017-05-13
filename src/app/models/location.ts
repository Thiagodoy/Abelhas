import {LatLngBounds,Icon} from 'leaflet';
import * as L  from 'leaflet';

export class Location {
    latitude: number;
    longitude: number;
    address: string;
    key:string;
    viewBounds: LatLngBounds;
    popUp:string = undefined;
    icon:Icon = undefined;

    setPopUp(apicultor:string, propriedade:string, especie:string){
        this.popUp = `<h4>Apicultor: ${apicultor}</h4><p>propriedade: ${propriedade}</p><p>espécie: ${especie}</p>`; 	        
    }
    getPopUp(){
        return this.popUp;
    }

    getLatitude():number{
        return this.latitude;
    }
    getLongitude():number{
        return this.longitude;
    }
    getKey(){
        return this.key;
    }
    setIcon(icon:L.Icon){
        this.icon = icon;
    }
    getIcon():L.Icon{
        return this.icon;
    }
}
