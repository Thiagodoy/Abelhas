import { Routes } from '@angular/router';

import { ListApiaryComponent } from '../list-apiary/list-apiary.component';
import { EditApiaryComponent } from '../edit-apiary/edit-apiary.component';

import { EditMultipleApiaryComponent } from '../edit-multiple-apiary/edit-multiple-apiary.component';
import { ListUserComponent } from '../list-user/list-user.component';
import { EditAssociationComponent} from '../edit-association/edit-association.component';
import { ListAssociationComponent } from '../list-association/list-association.component';
import { EditPropertyComponent } from '../edit-property/edit-property.component';
import {  ListPropertyComponent } from '../list-property/list-property.component';
import {  DataDeactivationComponent } from '../data-deactivation/data-deactivation.component'

import { EditUserComponent } from '../edit-user/edit-user.component';



export const route: Routes = [
    { path: '', component: ListApiaryComponent },
    { path: 'editar/apiario', component: EditApiaryComponent},
    { path: 'edicao/multipla', component: EditMultipleApiaryComponent},
    { path: 'usuarios', component: ListUserComponent},
    { path: 'editar/associação', component: EditAssociationComponent},
    { path: 'associações', component: ListAssociationComponent},
    { path: 'editar/propriedade', component: EditPropertyComponent},
    { path: 'propriedades', component: ListPropertyComponent},
    { path: 'dados/desativação', component: DataDeactivationComponent},
    { path: 'editar/usuario', component: EditUserComponent}

]    
