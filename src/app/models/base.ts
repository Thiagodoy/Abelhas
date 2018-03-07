import { Object } from 'parse';
import * as UUID from "uuidjs" 
export class Base extends Object{
    constructor(name:string){
        super(name);
    }
    generateUuid(){
        let uuid = UUID.generate();
        this.set('uuid',uuid);
    }
}
