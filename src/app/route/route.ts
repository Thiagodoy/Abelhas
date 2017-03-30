import { ListPropertyComponent } from './../list-property/list-property.component';
import { LoginComponent } from './../login/login.component';
import { HistoricComponent } from './../historic/historic.component';
import { UserResolver } from './../guards/user.resolver';
import { ListAssociacaoResolver } from './../guards/list-associacao.resolver';
import { ListEstadoResolver } from './../guards/list-estado.resover';
import { EditUserResolver } from './../guards/edit-user.resolver';

import { ListMunicipioResolver } from './../guards/list-municipio.resolver';

import { ListPropriedadeResolver } from './../guards/list-propriedade.resolver';
import { Routes } from '@angular/router';

import { ListApiaryComponent } from '../list-apiary/list-apiary.component';
import { EditApiaryComponent } from '../edit-apiary/edit-apiary.component';

import { EditMultipleApiaryComponent } from '../edit-multiple-apiary/edit-multiple-apiary.component';
import { ListUserComponent } from '../list-user/list-user.component';
import { EditAssociationComponent } from '../edit-association/edit-association.component';
import { ListAssociationComponent } from '../list-association/list-association.component';
import { EditPropertyComponent } from '../edit-property/edit-property.component';

import { DataDeactivationComponent } from '../data-deactivation/data-deactivation.component'

import { EditUserComponent } from '../edit-user/edit-user.component';
import { ApiaryDetailResolver } from '../guards/apiary-detail.resolver';
import { ListMortandadeResolver } from '../guards/list-mortandade.resolve';
import { ListCulturasResolver } from '../guards/list-cultura.resolver';
import { ListApicultorResolver } from '../guards/list-apicultor.resolver';
import { ListEspecieAbelhaResolver } from '../guards/list-especie-abelha.resolver';
import { EditMultipleResolver } from '../guards/edit-multiple.resolver';




export const route: Routes = [
    { path: 'lista/apiarios', component: ListApiaryComponent },
    { path: 'editar/apiario', component: EditApiaryComponent },
    { path: 'edicao/multipla', component: EditMultipleApiaryComponent},
    { path: 'lista/usuarios', component: ListUserComponent },
    { path: '', component: LoginComponent },
    { path: 'editar/associação', component: EditAssociationComponent },
    { path: 'associações', component: ListAssociationComponent },
    { path: 'lista/propriedade', component: ListPropertyComponent },
    { path: 'editar/propriedade', component: EditPropertyComponent },
    { path: 'propriedades', component: ListPropertyComponent },
    { path: 'dados/desativação', component: DataDeactivationComponent },
    { path: 'editar/usuario', component: EditUserComponent },
    { path: 'historic', component: HistoricComponent }

]