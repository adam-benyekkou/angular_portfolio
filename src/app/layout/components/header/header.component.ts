import { Component } from '@angular/core';
import { HeaderNavLinksComponent } from '../../../features/header-display/header-nav-links/header-nav-links.component';
import { HeaderLogoComponent } from '../../../features/header-display/header-logo/header-logo.component';
import { HeaderContactLinksComponent } from '../../../features/header-display/header-contact-links/header-contact-links.component';
import { HeaderTextAnimateSectionComponent } from '../../../features/header-display/header-text-animate-section/header-text-animate-section.component';

@Component({
  selector: 'app-header',
  imports: [
    HeaderNavLinksComponent,
    HeaderLogoComponent,
    HeaderContactLinksComponent,
    HeaderTextAnimateSectionComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
