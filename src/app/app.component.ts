import { Component } from '@angular/core';
import { DropdownCustomComponent } from './components/dropdown-custom/dropdown-custom.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DropdownCustomComponent],
  template: `
    <h2>Приложение Custom Dropdown</h2>
    <app-dropdown-custom></app-dropdown-custom>
  `,
  styles: [
    `
      h1 {
        text-align: center;
        margin-top: 20px;
        color: #333;
      }
    `,
  ],
})
export class AppComponent {}