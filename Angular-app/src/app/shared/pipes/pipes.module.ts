import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { SentencePipe } from './sentence.pipe';
@NgModule({
  declarations: [SafePipe,SentencePipe],
  exports: [
    SafePipe,
    SentencePipe
  ]
})
export class PipesModule { }