import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule  } from '@angular/material';
import { RouterModule  } from '@angular/router';
import { CovalentCoreModule } from '@covalent/core';
import { LayoutModule } from 'ng2-flex-layout';

import { AppComponent } from './app.component';
import { ListApiaryComponent } from './list-apiary/list-apiary.component';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';

import{ route } from './route/route';



@NgModule({
  declarations: [
    AppComponent,    
    ListApiaryComponent, 
    LoginComponent, 
    TableComponent    
    
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
