import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ListApiaryComponent } from './list-apiary/list-apiary.component';
import { LoginComponent } from './login/login.component';
import { EditMultipleApiaryComponent } from './edit-multiple-apiary/edit-multiple-apiary.component';


@NgModule({
  declarations: [
    AppComponent,    
    ListApiaryComponent, LoginComponent, EditMultipleApiaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
