import { UserResolver } from './guards/user.resolver';
import { ListAssociacaoResolver } from './guards/list-associacao.resolver';
import { ListEstadoResolver } from './guards/list-estado.resover';
import { EditUserResolver } from './guards/edit-user.resolver';
import { EditMultipleResolver } from './guards/edit-multiple.resolver';
import { ListMunicipioResolver } from './guards/list-municipio.resolver';
import { ListEspecieAbelhaResolver } from './guards/list-especie-abelha.resolver';
import { ListPropriedadeResolver } from './guards/list-propriedade.resolver';
import { ListApicultorResolver } from './guards/list-apicultor.resolver';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'

//Bibliotecas de terceiros
import { CovalentCoreModule } from '@covalent/core';
import { LayoutModule } from 'ng2-flex-layout';

import { AppComponent } from './app.component';
import { ListApiaryComponent } from './list-apiary/list-apiary.component';
import { LoginComponent } from './login/login.component';

import { EditMultipleApiaryComponent } from './edit-multiple-apiary/edit-multiple-apiary.component';

import { TableComponent } from './table/table.component';

import { route } from './route/route';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

import { DialogService } from './service/dialog.service';
import { LeafletService } from './service/leaflet.service';
import { ParseService } from './service/parse.service';
import { GeocodingService } from './service/geocode.service';
import { MomentService } from './service/moment.service';

import { DataPickerCustomComponent } from './data-picker-custom/data-picker-custom.component';

import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
import { MapaComponent } from './mapa/mapa.component';

import { ListUserComponent } from './list-user/list-user.component';
import { EditAssociationComponent } from './edit-association/edit-association.component';
import { ListAssociationComponent } from './list-association/list-association.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { ListPropertyComponent } from './list-property/list-property.component';
import { DataDeactivationComponent } from './data-deactivation/data-deactivation.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ApiaryDetailResolver } from './guards/apiary-detail.resolver';
import { ListMortandadeResolver } from './guards/list-mortandade.resolve';
import { ListCulturasResolver } from './guards/list-cultura.resolver';
import { MaskDirective } from './directive/mask.directive';
import { HistoricComponent } from './historic/historic.component';
import { TextMaskModule } from 'angular2-text-mask';




@NgModule({
  declarations: [
    AppComponent,
    ListApiaryComponent, LoginComponent, EditMultipleApiaryComponent,
    ListApiaryComponent,
    LoginComponent,
    TableComponent,
    MessageDialogComponent,
    DataPickerCustomComponent,
    TablePaginationComponent,
    EditApiaryComponent,
    MapaComponent,
    ListUserComponent,
    EditAssociationComponent,
    ListAssociationComponent,
    EditPropertyComponent,
    ListPropertyComponent,
    DataDeactivationComponent,
    EditUserComponent,
    MaskDirective,
    HistoricComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(route),
    CovalentCoreModule.forRoot(),
    ReactiveFormsModule,
    TextMaskModule

  ],
  providers: [DialogService,
   ParseService, LeafletService, GeocodingService, MomentService, ApiaryDetailResolver, ListMortandadeResolver, 
   ListCulturasResolver, ListApicultorResolver, ListPropriedadeResolver, ListEspecieAbelhaResolver, ListMunicipioResolver,
    EditUserResolver,ListEstadoResolver,ListAssociacaoResolver,UserResolver],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialogComponent]
})
export class AppModule { }
