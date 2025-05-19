import { Component } from '@angular/core';
import {FooterComponent} from '../footer/footer.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    FooterComponent,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
