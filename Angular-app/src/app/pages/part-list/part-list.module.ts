import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/matrerial.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PartListComponent } from './part-list.component';
@NgModule({
  declarations: [PartListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule
  ],
  exports:[PartListComponent]
})
export class PartListModule { }