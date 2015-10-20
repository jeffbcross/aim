import {Component} from 'angular2/angular2';

@Component({
  selector: 'navbar',
  inputs: ['status'],
  template: `
    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Angular Investment Manager</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">
          <li><p [class]="'navbar-text ' + status">{{status}}</p></li>
        </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
  `
})
export class Navbar {}