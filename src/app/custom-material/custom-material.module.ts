import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule,MatToolbarModule,MatButtonModule,MatCardModule,MatDialogModule,MatInputModule,MatSelectModule,MatOptionModule,MatMenuModule,MatIconModule,MatSlideToggleModule,MatRadioModule,MatAutocompleteModule,MatChipsModule,MatCheckboxModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,MatCardModule,MatSelectModule,MatDialogModule,MatInputModule,MatOptionModule,MatMenuModule,MatIconModule,MatSlideToggleModule,MatRadioModule,MatAutocompleteModule,MatChipsModule,MatCheckboxModule,MatToolbarModule,
    MatSidenavModule
  ],
  declarations: [],
  exports:[MatButtonModule,MatCardModule,MatSelectModule,MatDialogModule,MatInputModule,MatOptionModule,MatMenuModule,MatIconModule,MatSlideToggleModule,MatRadioModule,MatAutocompleteModule,MatChipsModule,MatCheckboxModule,MatToolbarModule,
    MatSidenavModule]
})
export class CustomMaterialModule { }
