import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainLayoutComponent} from './layout/components/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Adam Benyekkou Portfolio';
}
