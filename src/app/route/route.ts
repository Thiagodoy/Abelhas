import { Routes } from '@angular/router';

import { ListApiaryComponent } from '../list-apiary/list-apiary.component';
import { EditApiaryComponent } from '../edit-apiary/edit-apiary.component';
import { EditMultipleApiaryComponent } from '../edit-multiple-apiary/edit-multiple-apiary.component';
import { ListUserComponent } from '../list-user/list-user.component';
import { EditAssociationComponent} from '../edit-association/edit-association.component';
import { ListAssociationComponent } from '../list-association/list-association.component';


export const route: Routes = [
    { path: '', component: ListApiaryComponent },
    { path: 'edit', component: EditApiaryComponent},
    { path: 'multiple', component: EditMultipleApiaryComponent},
    { path: 'list', component: ListUserComponent},
    { path: 'edit/association', component: EditAssociationComponent},
    { path: 'list/association', component: ListAssociationComponent}

]    
