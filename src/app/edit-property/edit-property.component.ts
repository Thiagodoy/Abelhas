import { ITdDataTableColumn } from '@covalent/core';
import { Associacao } from './../models/associacao';
import { Apicultor } from './../models/apicultor';
import { DialogService } from './../service/dialog.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Municipio } from './../models/municipio';
import { Propriedade } from './../models/propriedade';
import { ParseService } from './../service/parse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewContainerRef, NgZone } from '@angular/core';
import constantes from '../constantes';
import * as parse from 'parse';


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss'],

})
export class EditPropertyComponent implements OnInit {

  constructor(private zone: NgZone, private router: ActivatedRoute, private dialog: DialogService, private parseService: ParseService, private fb: FormBuilder, private dialogService: DialogService, private route: Router, private view: ViewContainerRef) { }
  propriedade: Propriedade;
  listMunicipios: Municipio[] = [];
  ListfilteredMunicipio: Observable<Municipio[]>;
  formPropriedade: FormGroup;
  listApicultor: Apicultor[];
  listApicultoresSelected: any[];

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

      let user = parse.User.current();

      if (user.attributes.tipo == constantes.ASSOCIACAO) {
        let queryApicultor = this.parseService.createQuery(Apicultor);
        let queryAssociacao = this.parseService.createQuery(Associacao);
        let associacao: Associacao = user.attributes.associacao;
        queryAssociacao.equalTo('objectId', associacao.id);
        queryApicultor.matchesQuery('associacao', queryAssociacao);
        promises.push(this.parseService.executeQuery(queryApicultor));
      } else {
        promises.push(this.parseService.findAll(Apicultor, null, ['nome', 'cpf', 'municipio', 'email']));
      }




      parse.Promise.when(promises).then((resul) => {

        this.listMunicipios = resul[0]
        this.listApicultor = resul[resul.length == 3 ? 2 : 1];

        if (resul.length == 3) {
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
      controlItensSelecionados: [{ value: 'Nenhum item selecionado', disabled: true }]
    });
  }

  populateForm() {
    
    this.formPropriedade.get('rotaAcesso').setValue(this.propriedade.getRotaAcesso());
    this.formPropriedade.get('nome').setValue(this.propriedade.getNome());
    this.formPropriedade.get('municipio').setValue(this.listMunicipios.filter(m => { return m.id == this.propriedade.getMunicipio().id })[0]);
    this.listApicultoresSelected = this.propriedade.getApicultores().map(value => {
      return {
        uniqueId: value.id,
        id: value.id
      }
    });    
    this.formPropriedade.get('controlItensSelecionados').setValue('' + this.propriedade.getApicultores().length + ' itens selecionados');
  }

  createPropriedade() {
    let propriedade = this.propriedade ? this.propriedade : new Propriedade();
    propriedade.setRotaAcesso(this.formPropriedade.get('rotaAcesso').value)
    propriedade.setNome(this.formPropriedade.get('nome').value);
    propriedade.setMunicipio(this.formPropriedade.get('municipio').value);

    if(!this.propriedade){
      propriedade.generateUuid();
    }
    
    let temp = [];

    this.listApicultoresSelected =  this.listApicultoresSelected || [];

    this.listApicultoresSelected.forEach(a=> {
      let value = this.listApicultor.find((value) => { return value.id == a.id })
      if (value)
        temp.push(value)
    });

    propriedade.setApicultores(temp);
    return propriedade;
  }

  search(event: Event) {

    event.preventDefault();
    this.formPropriedade.get('controlItensSelecionados').setValue('Nenhum item selecionado.');

    let columns: ITdDataTableColumn[] = [
      { name: 'nome', label: 'Nome' },
      { name: 'cpf', label: 'Cpf' },  
      { name: 'municipio', label: 'Municipio' },
    ];

    let api = this.listApicultor.map(value => {
      try {
        return {
          id: value.id,
          nome: value.getNome(),
          cpf: value.getCpf() ? value.getCpf().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gi, '$1.$2.$3-$4') : '',
          email: value.getEmail(),
          municipio: value.getMunicipio().getNome()
        }
      } catch (error) {
        console.error(error);
        console.error('Erro ao criar o objecto',value.id);
        return {
          uniqueId: -1,
          id: -1
        }
      }

    }).filter(e=>e.id != -1);

    let api2 = [];
    if (this.propriedade) {
      if (this.propriedade.getApicultores() && this.propriedade.getApicultores().length > 0)
        api2 = this.propriedade.getApicultores().map(value => {
          try {
            return {
              uniqueId: value.id,
              id: value.id
            }
          } catch (error) {
            console.error(error);
            console.error(value.id);
            return {
              uniqueId: -1,
              id: -1
            }
          }
        });
    }

    //Ordena para exibir asa associacoes selecionadas nas primeiras posicoes
    api = api.sort((a, b) => { return api2.find(value => { return value.id == a.id }) ? -1 : 1; });

    this.dialog.confirm('Escolha os Apicultores', '', 'TABLE', this.view, api, columns, api2, true).subscribe((value) => {
      
      if (value.rows.length > 0) {
        this.listApicultoresSelected = value.rows;
        this.formPropriedade.get('controlItensSelecionados').setValue('' + value.rows.length + ' itens selecionados');
      } else {
        this.listApicultoresSelected = [];
        this.formPropriedade.get('controlItensSelecionados').setValue('Nenhum item selecionado.');
      }
    });
  }

  salvar() {

    let pro = this.createPropriedade();

    this.parseService.save(pro).then(result => {

      this.zone.run(() => {
        if (result && !this.propriedade)
          this.dialogService.confirm('Sucesso', 'Propriedade criada com sucesso!', 'SUCCESS', this.view).subscribe(result => {
            this.route.navigate(['home/lista/propriedade']);
          });
        else
          this.dialogService.confirm('Sucesso', 'Propriedade atualizada com sucesso!', 'SUCCESS', this.view).subscribe(result => {
            this.route.navigate(['home/lista/propriedade']);
          });
      });

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
