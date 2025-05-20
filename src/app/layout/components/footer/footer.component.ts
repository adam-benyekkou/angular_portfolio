import { Component } from '@angular/core';
import {FooterDisplayComponent} from '../../../features/footer-display/footer-display.component';

@Component({
  selector: 'app-footer',
  imports: [FooterDisplayComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
