import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/matrerial.module';

@NgModule({
  declarations: [ LoginComponent ],
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CommonModule
  ],
  exports: [LoginComponent]
})
export class LoginModule { }