import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/matrerial.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    FormsModule
  ],
  exports:[StockComponent]
})
export class StockModule { }