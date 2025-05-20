import { Component } from '@angular/core';
import {AboutDisplayComponent} from '../../../features/about-display/about-display.component';

@Component({
  selector: 'app-about',
  imports: [AboutDisplayComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {}
