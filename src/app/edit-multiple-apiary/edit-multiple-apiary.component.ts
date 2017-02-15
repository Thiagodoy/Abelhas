import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-multiple-apiary',
  templateUrl: './edit-multiple-apiary.component.html',
  styleUrls: ['./edit-multiple-apiary.component.sass']
})
export class EditMultipleApiaryComponent implements OnInit {


  perfil:string = undefined;
  constructor() { }

  ngOnInit() {
    this.perfil = 'Apicultor';
  }

}
