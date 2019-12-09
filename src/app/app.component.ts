import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-cognito-test';

  loginClick(event: Event) {
    console.log('Click!', event)
  }

  limparClick(event: Event) {
    console.log('Click!', event)
  }
}


