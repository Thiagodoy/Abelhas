import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';

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

import { DataPickerCustomComponent } from './data-picker-custom/data-picker-custom.component';

import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { EditApiaryComponent } from './edit-apiary/edit-apiary.component';
import { MapaComponent } from './mapa/mapa.component';
import { ListUserComponent } from './list-user/list-user.component';
import { EditAssociationComponent } from './edit-association/edit-association.component';
import { ListAssociationComponent } from './list-association/list-association.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { ListPropertyComponent } from './list-property/list-property.component';


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
    ListPropertyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(route),
    CovalentCoreModule.forRoot(),
    LayoutModule

  ],
  providers: [DialogService, ParseService, LeafletService, GeocodingService],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialogComponent]
})
export class AppModule { }
