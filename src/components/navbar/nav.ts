import {Component} from 'angular2/angular2';

@Component({
  selector: 'navbar',
  template: `
    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Angular Investment Manager</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
        </div><!--/.nav-collapse -->
      </div>
    </nav>
  `
})
export class Navbar {}