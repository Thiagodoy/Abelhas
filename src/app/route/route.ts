import { Routes } from '@angular/router';

import { ListApiaryComponent } from '../list-apiary/list-apiary.component';
import { EditApiaryComponent } from '../edit-apiary/edit-apiary.component';


export const route: Routes = [
    { path: '', component: ListApiaryComponent },
    { path: 'edit', component: EditApiaryComponent}

]    
