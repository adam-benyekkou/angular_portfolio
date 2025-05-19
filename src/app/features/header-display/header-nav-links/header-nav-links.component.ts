import { Component } from '@angular/core';


import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-nav-links',
  imports: [ButtonModule],
  templateUrl: './header-nav-links.component.html',
  styleUrl: './header-nav-links.component.css'
})
export class HeaderNavLinksComponent {
  onClick(){
    console.log('click');
  }
}
