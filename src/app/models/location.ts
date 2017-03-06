import {LatLngBounds} from "leaflet";

export class Location {
    latitude: number;
    longitude: number;
    address: string;
    viewBounds: LatLngBounds;
    popUp:string = undefined

    setPopUp(apicultor:string, propriedade:string, especie:string){
        this.popUp = `<h4>Apicultor: ${apicultor}</h4><p>propriedade: ${propriedade}</p><p>espécie: ${especie}</p>`; 	        
    }
    getPopUp(){
        return this.popUp;
    }
}
