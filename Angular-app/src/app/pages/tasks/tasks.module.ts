import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/matrerial.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    FormsModule
  ],
  exports:[TasksComponent]
})
export class TaskModule { }