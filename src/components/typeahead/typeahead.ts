import {Component, Control, EventEmitter, ControlGroup, FORM_DIRECTIVES, NgControl} from 'angular2/angular2';
@Component({
  selector: 'typeahead',
  template: `
    TEMP VALUE: {{ticker.value}} <br>
    <form [ng-form-model]="form">
      <input #symbol ng-control="ticker" type="text" placeholder="ticker symbol">
    </form>
  `,
  directives: [FORM_DIRECTIVES]
})
export class TypeAhead {
  ticker = new Control();
  value:string;
  form:ControlGroup = new ControlGroup({
    ticker: this.ticker
  });
  constructor() {
    (<EventEmitter>this.ticker.valueChanges).toRx().subscribe(value => {
      this.value = value;
    });
  }
}
