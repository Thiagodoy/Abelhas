import { Routes } from '@angular/router';

import { ListApiaryComponent } from '../list-apiary/list-apiary.component';
import { EditApiaryComponent } from '../edit-apiary/edit-apiary.component';
import { EditMultipleApiaryComponent } from '../edit-multiple-apiary/edit-multiple-apiary.component';


export const route: Routes = [
    { path: '', component: ListApiaryComponent },
    { path: 'edit', component: EditApiaryComponent},
    { path: 'multiple', component: EditMultipleApiaryComponent}

]    
