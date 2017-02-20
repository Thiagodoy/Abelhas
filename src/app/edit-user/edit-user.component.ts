import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {


perfis:any[] = [{nome:'Apicultor',value:'Apicultor'},{nome:'Associação',value:'Associação'},{nome:'Gestor',value:'Gestor'}];

selectedValue:string = 'Apicultor';

  constructor() { }

  ngOnInit() {
  }

  perfilSelecionado(event){
    console.log(event);
  }

}
