import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'sentence' })

export class SentencePipe implements PipeTransform {
  constructor() { }
  transform(camelCase) {
    return camelCase
    // inject space before the upper case letters
    .replace(/([A-Z])/g, (match) => { return " " + match})
    // replace first char with upper case
    .replace(/^./, (match) => {return match.toUpperCase()});
  }
}