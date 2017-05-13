import { CanActivateUser } from './guards/can-active-user';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'

//Bibliotecas de terceiros
import { CovalentCoreModule } from '@covalent/core';
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
import { GeocodeService } from './service/geocode.service';
import { MomentService } from './service/moment.service';

import { DataPickerCustomComponent } from './data-picker-custom/data-picker-custom.component';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
import { MapaComponent } from './mapa/mapa.component';

import { ListUserComponent } from './list-user/list-user.component';
import { EditAssociationComponent } from './edit-association/edit-association.component';
import { ListAssociationComponent } from './list-association/list-association.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { ListPropertyComponent } from './list-property/list-property.component';
import { DataDeactivationComponent } from './data-deactivation/data-deactivation.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HistoricComponent } from './historic/historic.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OnlyReadComponent } from './only-read/only-read.component';




@NgModule({
  declarations: [
    AppComponent,
    ListApiaryComponent, LoginComponent, EditMultipleApiaryComponent,
    ListApiaryComponent,
    LoginComponent,
    TableComponent,
    MessageDialogComponent,
    DataPickerCustomComponent,    
    EditApiaryComponent,
    MapaComponent,
    ListUserComponent,
    EditAssociationComponent,
    ListAssociationComponent,
    EditPropertyComponent,
    ListPropertyComponent,
    DataDeactivationComponent,
    EditUserComponent,    
    HistoricComponent,
    OnlyReadComponent
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
   ParseService, LeafletService, GeocodeService, MomentService, CanActivateUser],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialogComponent]
})
export class AppModule { }
