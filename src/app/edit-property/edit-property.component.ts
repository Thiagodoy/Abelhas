import { DialogService } from './../service/dialog.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Municipio } from './../models/municipio';
import { Propriedade } from './../models/propriedade';
import { ParseService } from './../service/parse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as parse from 'parse';


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],

})
export class EditPropertyComponent implements OnInit {

  constructor(private router: ActivatedRoute, private parseService: ParseService, private fb: FormBuilder, private dialogService: DialogService, private route:Router, private view:ViewContainerRef) { }
  propriedade: Propriedade;
  listMunicipios: Municipio[] = [];
  ListfilteredMunicipio: Observable<Municipio[]>;
  formPropriedade: FormGroup;

  ngOnInit() {

    this.createForm();
    this.router.queryParams.subscribe(res => {
      let promisePropriedade = undefined;
      let promises = [];
      let promiseMunicipio = this.parseService.findAll(Municipio);
      promises.push(promiseMunicipio);

      if (res.propriedade) {
        let query = this.parseService.createQuery(Propriedade);
        query.equalTo('objectId', res.propriedade);
        promisePropriedade = this.parseService.executeQuery(query);
        promises.push(promisePropriedade);
      }

      parse.Promise.when(promises).then((resul) => {
        
        this.listMunicipios = resul[0]
        if (resul.length == 2) {
          this.propriedade = resul[1][0];
          this.populateForm();
        }

      });
    });

    this.ListfilteredMunicipio = this.formPropriedade.get('municipio').valueChanges
      .startWith(null)
      .map<string, string>(nome => nome ? nome : '')
      .map(nome => nome ? this.filterMunicipio(nome) : this.listMunicipios.slice());
  }

  createForm() {
    this.formPropriedade = this.fb.group({
      rotaAcesso: [null],
      nome: [null],
      municipio: [null],
    });
  }

  populateForm() {
    this.formPropriedade.get('rotaAcesso').setValue(this.propriedade.getRotaAcesso());
    this.formPropriedade.get('nome').setValue(this.propriedade.getNome());
    this.formPropriedade.get('municipio').setValue(this.listMunicipios.filter(m => { return m.id == this.propriedade.getMunicipio().id })[0]);
  }

  createPropriedade() {
    let propriedade = this.propriedade ? this.propriedade : new Propriedade();
    propriedade.setRotaAcesso(this.formPropriedade.get('rotaAcesso').value)
    propriedade.setNome(this.formPropriedade.get('nome').value);
    propriedade.setMunicipio(this.formPropriedade.get('municipio').value);
    return propriedade;
  }

  salvar() {

    let pro = this.createPropriedade();

    this.parseService.save(pro).then(result => {
      if (result && !this.propriedade)
        this.dialogService.confirm('Sucesso', 'Propriedade criada com sucesso!', 'SUCCESS', this.view);
      else
        this.dialogService.confirm('Sucesso', 'Propriedade atualizada com sucesso!', 'SUCCESS', this.view);
      
      this.route.navigate(['home/lista/propriedade']);
    });

  }


  filterMunicipio(name: string): Municipio[] {
    return this.listMunicipios.filter(option => {
      return new RegExp(name, 'gi').test(option.getNome())
    });
  }
  displayFn(object: parse.Object): string {
    return object ? object.attributes.nome : '';
  }

}
