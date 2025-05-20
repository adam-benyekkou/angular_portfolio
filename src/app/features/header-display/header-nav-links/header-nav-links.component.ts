import { Component } from '@angular/core';

import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-header-nav-links',
  imports: [ButtonComponent],
  templateUrl: './header-nav-links.component.html',
  styleUrl: './header-nav-links.component.css',
})
export class HeaderNavLinksComponent {
  onClick() {
    console.log('click');
  }
}
